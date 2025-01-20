import React, { useState } from "react";
import { Tabs, Tab, Box, Button, CircularProgress, Alert,TextField } from "@mui/material";
import ReportService from "../services/report.service";

const ReportAdministrator = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPdfFile(null);
    setError(null);
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setPdfFile(null);

    try {
      let response;

      if (currentTab === 0) {
        response = await ReportService.overallReport();
      } else if (currentTab === 1) {
        response = await ReportService.demograpicOverviewReport(address);
      } else if (currentTab === 2) {
        response = await ReportService.complianceApprovalMetricsReport();
      }

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
      link.setAttribute("download", `Report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-bold mb-4">Reports</h4>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Report Tabs">
          <Tab label="Overall Recruitment Metrics" />
          <Tab label="Demographic Overview Report" />
          <Tab label="Compliance and Approval Metrics" />
        </Tabs>
      </Box>

      <div className="mt-4">
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        {currentTab === 1 && (
          <div className="mb-4">
            <TextField
              label="Enter Address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mb-4"
            />
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReport}
            disabled={isLoading || (currentTab === 1 && !address)}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Generate Report"}
          </Button>
          {pdfFile && (
            <Button variant="contained" color="success" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          )}
        </div>

        {pdfFile && (
          <div className="mt-6">
            <iframe
              src={pdfFile}
              title="Report Preview"
              width="100%"
              height="600"
              className="border rounded"
            >
              Your browser does not support viewing PDFs.
            </iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAdministrator;
