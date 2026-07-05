import { useRef } from "react";
import StatusBanner from "./StatusBanner";
import SignalPath from "./SignalPath";
import ResultsTable from "./ResultsTable";
import ChartPrVsDistance from "./ChartPrVsDistance";
import ChartFsplVsFrequency from "./ChartFsplVsFrequency";
import PdfExportButton from "./PdfExportButton";

export default function ResultsPage({ data, onNewSimulation }) {
  const resultsRef = useRef(null);
  const { input, results, charts, created_at } = data;

  return (
    <div className="container" style={{ maxWidth: "900px" }}>
      <div className="results-header">
        <h2 className="results-title">Résultats de la simulation</h2>
        <button className="btn btn-secondary" onClick={onNewSimulation}>
          Nouvelle simulation
        </button>
      </div>

      <div ref={resultsRef} id="results-container">
        <StatusBanner
          classification={results?.classification}
          interpretation={results?.interpretation}
        />

        <SignalPath input={input} results={results} classification={results?.classification} />

        <ResultsTable input={input} results={results} />

        <div className="charts-grid">
          <ChartPrVsDistance
            data={charts?.pr_vs_distance || []}
            currentDistance={input?.distance_km}
            currentPr={results?.received_power_dbm}
          />
          <ChartFsplVsFrequency
            data={charts?.fspl_vs_frequency || []}
            currentFrequency={input?.frequency_mhz}
            currentFspl={results?.fspl_db}
          />
        </div>
      </div>

      <PdfExportButton resultsContainerRef={resultsRef} />

      {created_at && (
        <p className="results-date">
          Simulation du {new Date(created_at).toLocaleDateString("fr-FR")} à{" "}
          {new Date(created_at).toLocaleTimeString("fr-FR")}
        </p>
      )}
    </div>
  );
}
