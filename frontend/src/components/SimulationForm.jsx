import { useState } from "react";
import useSimulation from "../hooks/useSimulation";
import { PARAM_RANGES } from "../utils/validators";

const SECTIONS = [
  {
    title: "Paramètres radio",
    fields: [
      { name: "frequency_mhz", label: "Fréquence", hasUnitToggle: true },
      { name: "distance_km", label: "Distance" },
    ],
  },
  {
    title: "Émetteur",
    fields: [
      { name: "tx_power_dbm", label: "Puissance d'émission (Pt)" },
      { name: "tx_antenna_gain_dbi", label: "Gain antenne TX (Gt)" },
      { name: "tx_cable_loss_db", label: "Pertes câbles TX (Lc)" },
    ],
  },
  {
    title: "Récepteur",
    fields: [
      { name: "rx_sensitivity_dbm", label: "Sensibilité récepteur (Sr)" },
      { name: "rx_antenna_gain_dbi", label: "Gain antenne RX (Gr)" },
      { name: "rx_cable_loss_db", label: "Pertes câbles RX (Lc)" },
    ],
  },
];

export default function SimulationForm({ onResults }) {
  const { values, errors, loading, apiError, setField, reset, submit } = useSimulation();
  const [freqUnit, setFreqUnit] = useState("MHz");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await submit(freqUnit);
    if (data) onResults(data);
  };

  const handleReset = () => {
    reset();
    setFreqUnit("MHz");
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <h2 className="form-page-title">Nouvelle simulation</h2>

      <form onSubmit={handleSubmit}>
        {apiError && (
          <div className="card form-api-error">
            {apiError}
          </div>
        )}

        {SECTIONS.map((section) => (
          <div key={section.title} className="card form-section">
            <h3 className="form-section-title">{section.title}</h3>
            <div className="form-grid">
              {section.fields.map(({ name, label, hasUnitToggle }) => (
                <FieldInput
                  key={name}
                  name={name}
                  label={label}
                  value={values[name]}
                  error={errors[name]}
                  unit={PARAM_RANGES[name]?.unit}
                  hasUnitToggle={hasUnitToggle}
                  freqUnit={freqUnit}
                  onUnitToggle={hasUnitToggle ? setFreqUnit : undefined}
                  onChange={(v) => setField(name, v)}
                />
              ))}
            </div>
          </div>
        ))}

        <details className="card form-advanced">
          <summary className="form-advanced-summary">
            Paramètres avancés (hauteurs d'antennes)
          </summary>
          <div className="form-grid" style={{ marginTop: "1rem" }}>
            <FieldInput
              name="height_tx_m"
              label="Hauteur antenne TX"
              value={values.height_tx_m}
              error={errors.height_tx_m}
              unit="m"
              onChange={(v) => setField("height_tx_m", v)}
            />
            <FieldInput
              name="height_rx_m"
              label="Hauteur antenne RX"
              value={values.height_rx_m}
              error={errors.height_rx_m}
              unit="m"
              onChange={(v) => setField("height_rx_m", v)}
            />
          </div>
        </details>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Calcul en cours..." : "Calculer le bilan"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldInput({ name, label, value, error, unit, hasUnitToggle, freqUnit, onUnitToggle, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <div className="form-input-wrapper">
        <input
          id={name}
          className="form-input"
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${PARAM_RANGES[name]?.min} – ${PARAM_RANGES[name]?.max}`}
        />
        {hasUnitToggle ? (
          <div className="unit-toggle">
            <button
              type="button"
              className={`unit-toggle-btn ${freqUnit === "MHz" ? "active" : ""}`}
              onClick={() => onUnitToggle("MHz")}
            >
              MHz
            </button>
            <button
              type="button"
              className={`unit-toggle-btn ${freqUnit === "GHz" ? "active" : ""}`}
              onClick={() => onUnitToggle("GHz")}
            >
              GHz
            </button>
          </div>
        ) : unit ? (
          <span className="unit-suffix">{unit}</span>
        ) : null}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
