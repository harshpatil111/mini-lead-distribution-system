from django.urls import path
from .views import (
    CreateLeadView,
    DashboardView,
    QuotaResetWebhookView,
    ServiceListView,
)

urlpatterns = [
    path(
        "request-service/",
        CreateLeadView.as_view(),
        name="request-service",
    ),
    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard",
    ),
    path(
        "services/",
        ServiceListView.as_view(),
        name="services",
    ),
    path(
        "webhook/quota-reset/",
        QuotaResetWebhookView.as_view(),
        name="quota-reset-webhook",
    ),
]