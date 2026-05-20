from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Provider, Service, WebhookEvent
from .serializers import (
    LeadSerializer,
    ProviderDashboardSerializer,
    ServiceSerializer,
)
from .allocation import assign_providers


class CreateLeadView(APIView):

    def post(self, request):
        serializer = LeadSerializer(data=request.data)

        if serializer.is_valid():
            lead = serializer.save()
            assign_providers(lead)

            return Response(
                {
                    "message": "Lead created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class DashboardView(APIView):

    def get(self, request):
        providers = Provider.objects.all()
        serializer = ProviderDashboardSerializer(providers, many=True)
        return Response(serializer.data)


class ServiceListView(APIView):

    def get(self, request):
        services = Service.objects.all().order_by("id")
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class QuotaResetWebhookView(APIView):

    def post(self, request):
        event_id = request.data.get("event_id")

        if not event_id:
            return Response(
                {"error": "event_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            event, created = WebhookEvent.objects.get_or_create(
                event_id=event_id,
                defaults={"processed": False},
            )

            if event.processed:
                return Response(
                    {
                        "message": "Webhook already processed (idempotent)",
                        "event_id": event_id,
                        "already_processed": True,
                    },
                    status=status.HTTP_200_OK,
                )

            Provider.objects.update(used_quota=0, monthly_quota=10)
            event.processed = True
            event.save()

        return Response(
            {
                "message": "Provider quotas reset successfully",
                "event_id": event_id,
                "already_processed": False,
            },
            status=status.HTTP_200_OK,
        )