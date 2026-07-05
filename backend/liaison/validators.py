"""Bornes de validation — Section 6 du cahier des charges.

Chaque dictionnaire contient les champs `min_value` et `max_value`
utilisables directement par les DRF Serializers.
"""

PARAM_RANGES = {
    "frequency_mhz": {"min_value": 1, "max_value": 100_000},
    "distance_km": {"min_value": 0.01, "max_value": 1_000},
    "tx_power_dbm": {"min_value": -50, "max_value": 60},
    "tx_antenna_gain_dbi": {"min_value": 0, "max_value": 60},
    "rx_antenna_gain_dbi": {"min_value": 0, "max_value": 60},
    "tx_cable_loss_db": {"min_value": 0, "max_value": 20},
    "rx_cable_loss_db": {"min_value": 0, "max_value": 20},
    "rx_sensitivity_dbm": {"min_value": -150, "max_value": -20},
    "height_tx_m": {"min_value": 1, "max_value": 200},
    "height_rx_m": {"min_value": 1, "max_value": 200},
}
