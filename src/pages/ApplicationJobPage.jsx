import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import "../App.css";
import CryptoJS from "crypto-js";
import ApplicationJobService from "../services/applicationJob.service";

const SECRET_KEY = "your-secure-key";

const encodeProcessId = (id) => {
  try {
    if (!id) throw new Error("Invalid process ID");
    const encrypted = CryptoJS.AES.encrypt(String(id), SECRET_KEY).toString();
    return encodeURIComponent(encrypted); // Encode the encrypted string for URL safety
  } catch (error) {
    console.error("Error encoding process ID:", error);
    return null;
  }
};

const ApplicationJobPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const pageSizes = [5, 10, 15, 20]; // Options for page size
  const navigate = useNavigate();

  // Fetch application statuses
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["applicationStatuses", currentPage, pageSize],
    queryFn: () =>
      ApplicationJobService.getStatus({
        pageNumber: currentPage,
        pageSize,
      }),
    keepPreviousData: true,
  });

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1); // ReactPaginate uses 0-based indexing
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const { data: apiResponse, totalRecords } = data;
  const applicationStatuses = apiResponse?.data || [];
  const pageCount = Math.ceil(totalRecords / pageSize);

  // Map status to specific colors
  const getStatusStyles = (status) => {
    switch (status) {
      case "Offer by HR Manager":
        return { backgroundColor: "#4CAF50", color: "#FFFFFF" }; // Green
      case "Complete by HR Manager":
        return { backgroundColor: "#16C79A", color: "#FFFFFF" };
      case "Rejected by HR Manager":
        return { backgroundColor: "#F44336", color: "#FFFFFF" }; // Red
      case "Modification by Applicant":
        return { backgroundColor: "#FFEB3B", color: "#000000" }; // Yellow
      case "Update by Applicant":
        return { backgroundColor: "#FFEB3B", color: "#000000" };
      case "Interview Scheduled":
        return { backgroundColor: "#2196F3", color: "#FFFFFF" }; // Blue
      case "Confirm by Applicant":
        return { backgroundColor: "#48CFCB", color: "#000000" };
      default:
        return { backgroundColor: "#E0E0E0", color: "#000000" }; // Gray
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Application Statuses</h1>

      {/* Page size selector */}
      <FormControl variant="outlined" size="small" className="mb-4">
        <InputLabel id="page-size-label">Items per Page</InputLabel>
        <Select
          labelId="page-size-label"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          {pageSizes.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Application Status Table */}
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">Application ID</TableCell>
              <TableCell className="font-bold">Applicant Name</TableCell>
              <TableCell className="font-bold">Job Title</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold">Current Step</TableCell>
              <TableCell className="font-bold">Comments</TableCell>
              <TableCell className="font-bold">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationStatuses.map((status) => (
              <TableRow key={status.applicationId}>
                <TableCell>{status.applicationId}</TableCell>
                <TableCell>{status.applicantName}</TableCell>
                <TableCell>{status.jobTitle}</TableCell>
                <TableCell>
                  <Chip
                    label={status.status}
                    sx={getStatusStyles(status.status)} // Use the sx prop for inline styling
                    size="small"
                  />
                </TableCell>
                <TableCell>{status.currentStep}</TableCell>
                <TableCell>{status.comments || "N/A"}</TableCell>
                <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    const encodedId = encodeProcessId(status.processId);
                    if (encodedId) {
                      navigate(`/application-job/${encodedId}`);
                    } else {
                      console.error("Failed to encode process ID, navigation aborted.");
                    }
                  }}
                >
                  View Details
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default ApplicationJobPage;
