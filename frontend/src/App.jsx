import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import SimulationForm from "./components/SimulationForm";
import ResultsPage from "./components/ResultsPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [results, setResults] = useState(null);

  const handleNavigate = (target) => setPage(target);

  const handleResults = (data) => {
    setResults(data);
    setPage("results");
  };

  const handleNewSimulation = () => {
    setResults(null);
    setPage("simulate");
  };

  return (
    <div className="page">
      <Header onNavigate={handleNavigate} currentPage={page} />
      <div className="page-content">
        {page === "home" && (
          <HomePage onStart={handleNewSimulation} />
        )}
        {page === "simulate" && (
          <SimulationForm onResults={handleResults} />
        )}
        {page === "results" && results && (
          <ResultsPage
            data={results}
            onNewSimulation={handleNewSimulation}
          />
        )}
      </div>
    </div>
  );
}
