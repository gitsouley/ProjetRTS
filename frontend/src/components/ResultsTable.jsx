const INPUT_LABELS = [
  { key: "frequency_mhz", label: "Fréquence", unit: "MHz" },
  { key: "distance_km", label: "Distance", unit: "km" },
  { key: "tx_power_dbm", label: "Puissance d'émission (Pt)", unit: "dBm" },
  { key: "tx_antenna_gain_dbi", label: "Gain antenne TX (Gt)", unit: "dBi" },
  { key: "rx_antenna_gain_dbi", label: "Gain antenne RX (Gr)", unit: "dBi" },
  { key: "tx_cable_loss_db", label: "Pertes câbles TX (Lc)", unit: "dB" },
  { key: "rx_cable_loss_db", label: "Pertes câbles RX (Lc)", unit: "dB" },
  { key: "rx_sensitivity_dbm", label: "Sensibilité récepteur (Sr)", unit: "dBm" },
];

const OPTIONAL_LABELS = [
  { key: "height_tx_m", label: "Hauteur antenne TX", unit: "m" },
  { key: "height_rx_m", label: "Hauteur antenne RX", unit: "m" },
];

const RESULT_ROWS = [
  { key: "fspl_db", label: "Affaiblissement FSPL", unit: "dB" },
  { key: "received_power_dbm", label: "Puissance reçue (Pr)", unit: "dBm" },
  { key: "link_margin_db", label: "Marge de liaison (M)", unit: "dB" },
];

function Table({ headers, rows }) {
  return (
    <table className="results-table">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} className="results-th">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="results-tr">
            <td className="results-td-label">{label}</td>
            <td className="results-td-value">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ResultsTable({ input, results }) {
  const inputRows = INPUT_LABELS.map(({ key, label, unit }) => [
    label,
    <>
      {Number(input[key]).toFixed(2)}{" "}
      <span className="results-unit">{unit}</span>
    </>,
  ]);

  if (input.height_tx_m != null || input.height_rx_m != null) {
    OPTIONAL_LABELS.forEach(({ key, label, unit }) => {
      if (input[key] != null) {
        inputRows.push([
          label,
          <>
            {Number(input[key]).toFixed(2)}{" "}
            <span className="results-unit">{unit}</span>
          </>,
        ]);
      }
    });
  }

  const resultRows = RESULT_ROWS.map(({ key, label, unit }) => [
    label,
    <span className="result-value">
      {results[key]}{" "}
      <span className="results-unit">{unit}</span>
    </span>,
  ]);

  return (
    <div className="card results-table-card">
      <h3 className="results-table-title">Paramètres saisis</h3>
      <Table headers={["Paramètre", "Valeur"]} rows={inputRows} />
      <div className="results-table-divider" />
      <h3 className="results-table-title">Résultats calculés</h3>
      <Table headers={["Grandeur", "Valeur"]} rows={resultRows} />
    </div>
  );
}
