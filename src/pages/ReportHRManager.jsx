import React, { useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import ReportService from "../services/report.service";

const ReportHRManager = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setPdfFile(null);

    try {
      const response = await ReportService.recruitmentfunnelReport(); // Call the recruitment funnel report service
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfFile(pdfUrl);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.setAttribute("download", `Recruitment_Funnel_Report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-bold mb-4">Recruitment Funnel Report</h4>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      <div className="flex justify-center space-x-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Generate Report"}
        </Button>
        {pdfFile && (
          <Button variant="contained" color="success" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        )}
      </div>

      {/* Display PDF */}
      {pdfFile && (
        <div className="mt-6">
          <iframe
            src={pdfFile}
            title="Recruitment Funnel Report Preview"
            width="100%"
            height="600"
            className="border rounded"
          >
            Your browser does not support viewing PDFs.
          </iframe>
        </div>
      )}
    </div>
  );
};

export default ReportHRManager;
