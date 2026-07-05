from rest_framework import serializers

from .validators import PARAM_RANGES


class SimulationInputSerializer(serializers.Serializer):
    frequency_mhz = serializers.FloatField(**PARAM_RANGES["frequency_mhz"])
    distance_km = serializers.FloatField(**PARAM_RANGES["distance_km"])
    tx_power_dbm = serializers.FloatField(**PARAM_RANGES["tx_power_dbm"])
    tx_antenna_gain_dbi = serializers.FloatField(**PARAM_RANGES["tx_antenna_gain_dbi"])
    rx_antenna_gain_dbi = serializers.FloatField(**PARAM_RANGES["rx_antenna_gain_dbi"])
    tx_cable_loss_db = serializers.FloatField(**PARAM_RANGES["tx_cable_loss_db"])
    rx_cable_loss_db = serializers.FloatField(**PARAM_RANGES["rx_cable_loss_db"])
    rx_sensitivity_dbm = serializers.FloatField(**PARAM_RANGES["rx_sensitivity_dbm"])
    height_tx_m = serializers.FloatField(
        **PARAM_RANGES["height_tx_m"], required=False, allow_null=True
    )
    height_rx_m = serializers.FloatField(
        **PARAM_RANGES["height_rx_m"], required=False, allow_null=True
    )


class SimulationListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    created_at = serializers.DateTimeField()
    distance_km = serializers.FloatField()
    frequency_mhz = serializers.FloatField()
    link_margin_db = serializers.FloatField()
    classification_status = serializers.CharField()
