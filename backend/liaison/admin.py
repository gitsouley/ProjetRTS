from django.contrib import admin

from .models import Simulation


@admin.register(Simulation)
class SimulationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "created_at",
        "distance_km",
        "frequency_mhz",
        "link_margin_db",
        "classification_status",
    ]
    list_filter = ["classification_status"]
    search_fields = ["classification_status"]
    readonly_fields = [
        "fspl_db",
        "received_power_dbm",
        "link_margin_db",
        "classification_status",
        "created_at",
    ]
