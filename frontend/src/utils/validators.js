export const PARAM_RANGES = {
  frequency_mhz: { min: 1, max: 100_000, unit: "MHz" },
  distance_km: { min: 0.01, max: 1_000, unit: "km" },
  tx_power_dbm: { min: -50, max: 60, unit: "dBm" },
  tx_antenna_gain_dbi: { min: 0, max: 60, unit: "dBi" },
  rx_antenna_gain_dbi: { min: 0, max: 60, unit: "dBi" },
  tx_cable_loss_db: { min: 0, max: 20, unit: "dB" },
  rx_cable_loss_db: { min: 0, max: 20, unit: "dB" },
  rx_sensitivity_dbm: { min: -150, max: -20, unit: "dBm" },
  height_tx_m: { min: 1, max: 200, unit: "m" },
  height_rx_m: { min: 1, max: 200, unit: "m" },
};

export function validateField(name, value) {
  const range = PARAM_RANGES[name];
  if (!range) return null;

  if (value === "" || value === null || value === undefined) {
    if (name.startsWith("height_")) return null;
    return "Champ requis";
  }

  const num = Number(value);
  if (isNaN(num)) return "Doit être un nombre";

  if (num < range.min || num > range.max) {
    return `Doit être entre ${range.min} et ${range.max} ${range.unit}`;
  }
  return null;
}

export function isFormValid(values) {
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith("height_") && (value === "" || value === null)) continue;
    if (validateField(key, value) !== null) return false;
  }
  return true;
}
