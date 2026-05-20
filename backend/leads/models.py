from django.db import models


class Service(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Provider(models.Model):
    name = models.CharField(max_length=100)
    monthly_quota = models.IntegerField(default=10)
    used_quota = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    
class Lead(models.Model):
    customer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    city = models.CharField(max_length=100)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["phone", "service"],
                name="unique_phone_service",
            )
        ]

    def __str__(self):
        return f"{self.customer_name} - {self.service.name}"

class LeadAssignment(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("lead", "provider")

class AllocationState(models.Model):
    service = models.OneToOneField(Service, on_delete=models.CASCADE)
    last_index = models.IntegerField(default=0)


class WebhookEvent(models.Model):
    event_id = models.CharField(max_length=255, unique=True)
    processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
