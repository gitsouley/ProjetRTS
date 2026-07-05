import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PdfExportButton({ resultsContainerRef }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!resultsContainerRef?.current) return;
    setExporting(true);

    try {
      const element = resultsContainerRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: "#0B0E14",
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(16);
      pdf.setTextColor(0, 217, 163);
      pdf.text("LinkBudget Pro - Rapport de simulation", 10, 15);

      pdf.setFontSize(10);
      pdf.setTextColor(124, 135, 158);
      pdf.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 10, 22);

      pdf.addImage(imgData, "PNG", 10, 30, imgWidth, imgHeight);
      pdf.save("rapport-bilan-liaison.pdf");
    } catch (err) {
      console.error("Erreur lors de l'export PDF:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handleExport}
      disabled={exporting}
      style={{ marginTop: "1rem" }}
    >
      {exporting ? "Génération du PDF..." : "Télécharger le rapport PDF"}
    </button>
  );
}
