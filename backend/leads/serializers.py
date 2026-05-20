from rest_framework import serializers
from .models import Lead, Provider, LeadAssignment, Service


class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = ["id", "name"]


class LeadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lead
        fields = "__all__"

    def validate(self, data):
        phone = data.get("phone")
        service = data.get("service")

        if Lead.objects.filter(
            phone=phone,
            service=service
        ).exists():
            raise serializers.ValidationError(
                "Duplicate lead for same service"
            )

        return data
    
class ProviderDashboardSerializer(serializers.ModelSerializer):

    remaining_quota = serializers.SerializerMethodField()
    leads_received = serializers.SerializerMethodField()
    assigned_leads = serializers.SerializerMethodField()

    class Meta:
        model = Provider
        fields = [
            "id",
            "name",
            "monthly_quota",
            "used_quota",
            "remaining_quota",
            "leads_received",
            "assigned_leads",
        ]

    def get_remaining_quota(self, obj):
        return obj.monthly_quota - obj.used_quota

    def get_leads_received(self, obj):
        return LeadAssignment.objects.filter(
            provider=obj
        ).count()

    def get_assigned_leads(self, obj):

        assignments = LeadAssignment.objects.filter(
            provider=obj
        ).select_related("lead")

        return [
            {
                "lead_id": a.lead.id,
                "customer": a.lead.customer_name,
                "phone": a.lead.phone,
                "service": a.lead.service.name,
            }
            for a in assignments
        ]