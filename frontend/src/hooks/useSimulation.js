import { useState, useCallback } from "react";
import { postSimulation } from "../api/liaisonApi";
import { validateField } from "../utils/validators";

const INITIAL_VALUES = {
  frequency_mhz: "",
  distance_km: "",
  tx_power_dbm: "",
  tx_antenna_gain_dbi: "",
  rx_antenna_gain_dbi: "",
  tx_cable_loss_db: "",
  rx_cable_loss_db: "",
  rx_sensitivity_dbm: "",
  height_tx_m: "",
  height_rx_m: "",
};

export default function useSimulation() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setApiError(null);
  }, []);

  const reset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setApiError(null);
  }, []);

  const submit = useCallback(async (freqUnit) => {
    const newErrors = {};
    for (const key of Object.keys(values)) {
      if (key.startsWith("height_") && (values[key] === "" || values[key] === null)) continue;
      newErrors[key] = validateField(key, values[key]);
    }
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== null);
    if (hasErrors) return null;

    setLoading(true);
    setApiError(null);

    try {
      const payload = {};
      for (const [key, val] of Object.entries(values)) {
        payload[key] = val === "" || val === null ? null : Number(val);
      }

      if (freqUnit === "GHz" && payload.frequency_mhz != null) {
        payload.frequency_mhz = payload.frequency_mhz * 1000;
      }

      const data = await postSimulation(payload);
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.[Object.keys(err.response?.data || {})[0]]?.[0] ||
        "Erreur de connexion au serveur. Vérifiez que le backend est lancé.";
      setApiError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [values]);

  return { values, errors, loading, apiError, setField, reset, submit };
}
