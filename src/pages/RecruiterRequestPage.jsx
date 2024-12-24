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
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecruiterRegisterService from "../services/recruiterRegister.service";

const RecruiterRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Fetch recruiter registration requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await RecruiterRegisterService.recruiterRequestList();
        setRequests(response.data); // Assumes API returns the list of requests
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Box
      sx={{
        margin: "2rem auto",
        padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        maxWidth: "90%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h6"
        textAlign="center"
        sx={{
          fontWeight: "bold",
          marginBottom: "1.5rem",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Unreviewed Recruiter Registration Requests
      </Typography>

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
      ) : isSmallScreen ? (
        // Card-based layout for small screens
        requests.map((request) => (
          <Card
            key={request.recruiterRegistrationRequestId}
            sx={{
              marginBottom: "1rem",
              padding: "1rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Name : {request.firstName} {request.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email : {request.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone : {request.phoneNumber}
              </Typography>
              <Box mt={2}>
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
                      `/recruiter-request/${request.recruiterRegistrationRequestId}`
                    )
                  }
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        // Table layout for larger screens
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
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  First Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Last Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Phone Number
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.recruiterRegistrationRequestId}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell>{request.firstName}</TableCell>
                  <TableCell>{request.lastName}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phoneNumber}</TableCell>
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
                          `/recruiter-request/${request.recruiterRegistrationRequestId}`
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

export default RecruiterRequestPage;
