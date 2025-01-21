import React, { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import AxiosInstance from "../services/api";

const UploadDocumentForm = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("");
    setError(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError(true);
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);
      const response = await AxiosInstance.apiNew.post("/api/User/upload-document", formData);

      setMessage(response.data.message);
      setError(response.data.status === "Error");

      if (response.data.status !== "Error" && onUploadSuccess) {
        onUploadSuccess(); // Notify parent component to re-fetch documents
      }
    } catch (err) {
      setMessage("An error occurred while uploading the document.");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-8 bg-white shadow-md rounded-md border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Upload Document</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* File Input */}
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="file" className="text-gray-600 font-medium">
            Choose a file (PDF or DOCX)
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          startIcon={isLoading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow-md"
        >
          {isLoading ? "Uploading..." : "Upload Document"}
        </Button>

        {/* Feedback Message */}
        {message && (
          <p className={`text-sm text-center ${error ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadDocumentForm;
