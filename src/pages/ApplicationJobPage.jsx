import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from "@mui/material";
import ApplicationJobService from "../services/applicationJob.service";
import { useNavigate } from "react-router-dom";

const ApplicationJobPage = () => {
  const [applicationStatuses, setApplicationStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Status color map
  const statusColors = {
    Submitted: "bg-blue-500 text-white",
    Approved: "bg-green-500 text-white",
    Rejected: "bg-red-500 text-white",
    "In Progress": "bg-yellow-500 text-black",
  };

  // Fetch data from API
  useEffect(() => {
    const fetchApplicationStatuses = async () => {
      try {
        const response = await ApplicationJobService.getStatus(); // Replace with your API endpoint
        setApplicationStatuses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch application statuses. Please try again.");
        setLoading(false);
      }
    };

    fetchApplicationStatuses();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Application Statuses</h1>
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
                  {/* Badge for status */}
                  <Chip
                    label={status.status}
                    className={"bg-teal-300 text-white"}
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
                    onClick={() => navigate(`/application-job/${status.processId}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ApplicationJobPage;
