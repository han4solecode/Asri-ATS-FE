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
  Tabs,
  Tab,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecruiterRegisterService from "../services/recruiterRegister.service";
import CryptoJS from "crypto-js";

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

const RecruiterRequestPage = () => {
  const [tabIndex, setTabIndex] = useState(0); // Tab index state
  const [toBeReviewed, setToBeReviewed] = useState([]);
  const [alreadyReviewed, setAlreadyReviewed] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // Fetch recruiter registration requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await RecruiterRegisterService.recruiterRequestList();
        setToBeReviewed(response.data.toBeReviewed); // Adjust based on API response
        setAlreadyReviewed(response.data.alreadyReviewed); // Adjust based on API response
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const renderRequests = (requests, title) => {
    if (loading) {
      return (
        <Box className="flex justify-center items-center h-48">
          <CircularProgress />
        </Box>
      );
    }

    if (requests.length === 0) {
      return (
        <Typography
          variant="body1"
          className="text-gray-500 text-center text-lg"
        >
          No {title.toLowerCase()} requests found.
        </Typography>
      );
    }

    return isSmallScreen ? (
      // Card layout for small screens
      requests.map((request) => (
        <Card
          key={request.recruiterRegistrationRequestId}
          className="mb-4 p-4 shadow-lg rounded-lg"
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              Name: {request.firstName} {request.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {request.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {request.phoneNumber}
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                size="small"
                className="bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => {
                  const encodedId = encodeProcessId(request.recruiterRegistrationRequestId);
                  if (encodedId) {
                    navigate(`/recruiter-request/${encodedId}`);
                  } else {
                    console.error("Failed to encode process ID, navigation aborted.");
                  }
                }}
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
        className="rounded-lg shadow-md overflow-x-auto"
      >
        <Table>
          <TableHead className="bg-blue-600">
            <TableRow>
              <TableCell className="text-white font-bold">First Name</TableCell>
              <TableCell className="text-white font-bold">Last Name</TableCell>
              <TableCell className="text-white font-bold">Email</TableCell>
              <TableCell className="text-white font-bold">Phone</TableCell>
              <TableCell className="text-white font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request.recruiterRegistrationRequestId}
                className="hover:bg-gray-100"
              >
                <TableCell>{request.firstName}</TableCell>
                <TableCell>{request.lastName}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.phoneNumber}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                    onClick={() => {
                      const encodedId = encodeProcessId(request.recruiterRegistrationRequestId);
                      if (encodedId) {
                        navigate(`/recruiter-request/${encodedId}`);
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
    );
  };

  return (
    <Box className="mx-auto my-8 p-4 max-w-5xl box-border">
      <Typography
        variant="h6"
        className="font-bold text-center mb-6 text-xl sm:text-2xl"
      >
        Recruiter Registration Requests
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        className="mb-6"
        TabIndicatorProps={{
          className: "bg-blue-600",
        }}
      >
        <Tab
          label="To Be Reviewed"
          className={tabIndex === 0 ? "text-blue-600 font-bold" : "text-gray-500"}
        />
        <Tab
          label="Already Reviewed"
          className={tabIndex === 1 ? "text-blue-600 font-bold" : "text-gray-500"}
        />
      </Tabs>

      {tabIndex === 0 && renderRequests(toBeReviewed, "To Be Reviewed")}
      {tabIndex === 1 && renderRequests(alreadyReviewed, "Already Reviewed")}
    </Box>
  );
};

export default RecruiterRequestPage;