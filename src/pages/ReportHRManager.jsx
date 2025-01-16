import React, { useState } from "react";
import axios from "axios";
import { Tabs, Tab, Box, Button, CircularProgress, Alert, TextField } from "@mui/material";
import AxiosInstance from "../services/api";

const ReportHRManager = () => {
const [currentTab, setCurrentTab] = useState(0);
const [pdfFile, setPdfFile] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);


const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPdfFile(null); // Clear previous report on tab change
    setError(null);
};

const handleGenerateReport = async (reportType) => {
    setIsLoading(true);
    setError(null);
    setPdfFile(null);

    try {
    const endpoint =
        reportType === 0
        ? "/api/Report/generate-recruitment-funnel"
        : "/api/Report/Approval-time"; // Adjust endpoint for new report

    const response = await AxiosInstance.api.get(endpoint, {
        responseType: "blob",
    });

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
        <Tab label="Recruitment Funnel Report" />
        <Tab label="Approval Time Report" />
        </Tabs>
    </Box>

    <div className="mt-4">
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <div className="flex justify-center space-x-4">
        <Button
            variant="contained"
            color="primary"
            onClick={() => handleGenerateReport(currentTab)}
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

export default ReportHRManager;
