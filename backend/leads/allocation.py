from django.db import transaction

from .models import (
    Provider,
    LeadAssignment,
    AllocationState
)

MANDATORY_RULES = {
    1: [1],
    2: [5],
    3: [1, 4],
}

FAIR_POOLS = {
    1: [2, 3, 4],
    2: [6, 7, 8],
    3: [2, 3, 5, 6, 7, 8],
}


@transaction.atomic
def assign_providers(lead):

    service_id = lead.service.id

    mandatory_ids = MANDATORY_RULES.get(service_id, [])
    fair_pool = FAIR_POOLS.get(service_id, [])

    # Already assigned providers
    assigned_ids = list(
        LeadAssignment.objects.filter(
            lead=lead
        ).values_list(
            "provider_id",
            flat=True
        )
    )

    # ---- Mandatory Providers ----
    for provider_id in mandatory_ids:

        if provider_id in assigned_ids:
            continue

        provider = Provider.objects.select_for_update().get(
            id=provider_id
        )

        if provider.used_quota < provider.monthly_quota:

            LeadAssignment.objects.create(
                lead=lead,
                provider=provider
            )

            provider.used_quota += 1
            provider.save()

            assigned_ids.append(provider.id)

    # ---- Fair Allocation ----
    remaining_slots = 3 - len(assigned_ids)

    if remaining_slots > 0:

        state = AllocationState.objects.select_for_update().get(
            service_id=service_id
        )

        index = state.last_index
        pool_len = len(fair_pool)

        checked = 0

        while remaining_slots > 0 and checked < (pool_len * 2):

            provider_id = fair_pool[index % pool_len]

            if provider_id not in assigned_ids:

                provider = Provider.objects.select_for_update().get(
                    id=provider_id
                )

                if provider.used_quota < provider.monthly_quota:

                    LeadAssignment.objects.create(
                        lead=lead,
                        provider=provider
                    )

                    provider.used_quota += 1
                    provider.save()

                    assigned_ids.append(provider.id)
                    remaining_slots -= 1

            index += 1
            checked += 1

        state.last_index = index % pool_len
        state.save()

    return assigned_ids