from django.contrib import admin
from .models import (
    Service,
    Provider,
    Lead,
    LeadAssignment,
    AllocationState
)

admin.site.register(Service)
admin.site.register(Provider)
admin.site.register(Lead)
admin.site.register(LeadAssignment)
admin.site.register(AllocationState)
