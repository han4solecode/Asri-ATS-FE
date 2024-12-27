import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import JobPostRequestService from "../services/jobPostRequestService";
import { useSelector } from "react-redux";

const JobPostRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  // Fetch job posts requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        let response;
        if (currentUser.roles.includes("Recruiter")) {
          response = await JobPostRequestService.jobPostRequestList();
        }
        else if (currentUser.roles.includes("HR Manager")) {
          response = await JobPostRequestService.jobPostRequestToBeReviewed();
        }
        setRequests(response.data); // Assumes API returns the list of requests
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser]);

  // Handle View Details button click
  const handleViewDetails = (id) => {
    navigate(`/recruiter-requests/${id}`); // Redirect to the details page
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    const lastDigit = day % 10;
    if (lastDigit === 1) return 'st';
    if (lastDigit === 2) return 'nd';
    if (lastDigit === 3) return 'rd';
    return 'th';
  };

  const formatDateWithOrdinal = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const ordinal = getOrdinalSuffix(day);

    return `${month} ${day}${ordinal}, ${year}   ${hour}:${minute}`;
  };

  return (
    <Box
      className="max-w-5xl mx-auto bg-white rounded-lg shadow-md"
      sx={{
        margin: "2rem auto", // Adds consistent spacing with navbar
        padding: { xs: "1rem", sm: "1.5rem", md: "2rem" }, // Responsive padding
        boxSizing: "border-box",
      }}
    >
      <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        fontSize: { xs: "1.25rem", sm: "1.5rem" },
        textAlign:'center'
      }}
    >
      Job Post Requests
    </Typography>
      <Box
    sx={{
      display: "flex",
      justifyContent: "end", // Membuat tombol di kanan
      alignItems: "center",
      marginBottom: "1.5rem",
    }}
  >
    
    <Button
      variant="contained"
      sx={{
        backgroundColor: "black",
        color: "white",
        fontWeight: "bold",
        textTransform: "none",
        padding: { xs: "0.5rem 1rem", sm: "0.75rem 1.5rem" },
        "&:hover": {
          backgroundColor: "#424242",
        },
      }}
      className="rounded-lg shadow-md"
      onClick={() => navigate('/job-post-request/new')}
    >
      Add New Job Post Request
    </Button>
  </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Typography
          variant="body1"
          textAlign="center"
          sx={{
            color: "gray",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          No unreviewed requests found.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "8px",
            overflowX: "auto", // Makes table scrollable on small screens
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Process Id</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Request Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Requester
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Job Title
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Location
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Min Salary
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Max Salary
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Employment Type
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.processId}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell>{request.processId}</TableCell>
                  <TableCell>{formatDateWithOrdinal(request.requestDate)}</TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.jobTitle}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{request.minSalary}</TableCell>
                  <TableCell>{request.maxSalary}</TableCell>
                  <TableCell>{request.employmentType}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                      }}
                      onClick={() =>
                        navigate(
                          `/job-post-request/${request.processId}`
                        )
                      }
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default JobPostRequestPage;
