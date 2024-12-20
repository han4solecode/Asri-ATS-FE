import React, { useState, useEffect } from "react";
import { Button, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import UploadDocumentForm from "./UploadDocumentForm";
import UserService from "../services/userService";
import ApplicationJobService from "../services/applicationJob.service";

const UploadDocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Fetch documents from API
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await ApplicationJobService.getDocument();
      setDocuments(response.data.documents);
    } catch (error) {
      setMessage("Failed to fetch documents.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a document
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      setIsLoading(true);
      await UserService.deleteDocument(id);
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
      setMessage("Document deleted successfully.");
    } catch (error) {
      setMessage("Failed to delete document.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Document Management
      </h2>

      {/* Button to toggle Upload Document Form */}
      <div className="flex justify-center mb-6">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? "Hide Upload Form" : "Upload Document"}
        </Button>
      </div>

      {/* Upload Document Form */}
      {showUploadForm && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
          <UploadDocumentForm />
        </div>
      )}

      {/* Table for Documents */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Uploaded Documents
        </h3>
        {isLoading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper} className="rounded-lg shadow-md">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell className="font-bold">ID</TableCell>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">Uploaded Date</TableCell>
                  <TableCell className="font-bold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.documentId}>
                      <TableCell>{doc.documentId}</TableCell>
                      <TableCell>{doc.documentName}</TableCell>
                      <TableCell>{new Date(doc.uploadedDate).toLocaleString()}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(doc.documentId)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-600">
                      No documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <p className="text-center mt-6 text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default UploadDocumentPage;
