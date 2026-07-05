from django.db import models


class Simulation(models.Model):
    frequency_mhz = models.FloatField()
    distance_km = models.FloatField()
    tx_power_dbm = models.FloatField()
    tx_antenna_gain_dbi = models.FloatField()
    rx_antenna_gain_dbi = models.FloatField()
    tx_cable_loss_db = models.FloatField()
    rx_cable_loss_db = models.FloatField()
    rx_sensitivity_dbm = models.FloatField()
    height_tx_m = models.FloatField(null=True, blank=True)
    height_rx_m = models.FloatField(null=True, blank=True)

    fspl_db = models.FloatField()
    received_power_dbm = models.FloatField()
    link_margin_db = models.FloatField()
    classification_status = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Simulation"
        verbose_name_plural = "Simulations"
