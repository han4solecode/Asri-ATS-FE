import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import AxiosInstance from "../services/api";
import RecruiterRegisterService from "../services/recruiterRegister.service";

const RecruiterRequestDetailPage = () => {
  const { id } = useParams(); // Get the request ID from the URL
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch recruiter request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const response = await RecruiterRegisterService.recruiterRequestDetails(id);
        setRequestDetails(response.data); // Set request details from API
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  // Handle Review Action (Approve or Reject)
  const handleReview = async (action) => {
    try {
      setProcessing(true);
  
      const response = await AxiosInstance.api.post(`/api/RecruiterRegistrationRequest/review-request/${id}`, action);
  
      if (response.data.status === "Success") {
        setOpenReviewModal(false);
        navigate("/recruiter-request"); // Navigate back to the list after successful review
      } else {
        console.error(response.data.message); // Show error message
      }
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred"); // Log API errors
    } finally {
      setProcessing(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  // Render when no details found
  if (!requestDetails) {
    return (
      <Typography variant="body1" className="text-center text-gray-500">
        No details found.
      </Typography>
    );
  }

  return (
    <Paper
      sx={{
        padding: { xs: "1rem", sm: "2rem" },
        maxWidth: "800px",
        margin: "2rem auto",
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "1.5rem",
        }}
      >
        Recruiter Request Details
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Typography>
          <strong>First Name:</strong> {requestDetails.firstName}
        </Typography>
        <Typography>
          <strong>Last Name:</strong> {requestDetails.lastName}
        </Typography>
        <Typography>
          <strong>Email:</strong> {requestDetails.email}
        </Typography>
        <Typography>
          <strong>Phone Number:</strong> {requestDetails.phoneNumber}
        </Typography>
        <Typography>
          <strong>Address:</strong> {requestDetails.address}
        </Typography>
        <Typography>
          <strong>Date of Birth:</strong> {requestDetails.dob}
        </Typography>
        <Typography>
          <strong>Sex:</strong> {requestDetails.sex}
        </Typography>
        <Typography>
          <strong>Company ID:</strong> {requestDetails.companyId}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            color: "#1976d2",
            borderColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#e3f2fd",
              borderColor: "#1976d2",
            },
          }}
          onClick={() => setOpenReviewModal(true)} // Open the review modal
        >
          Review
        </Button>
      </Box>

      {/* Review Modal */}
      <Modal
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            padding: "2rem",
            width: "90%",
            maxWidth: "400px",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#333",
            }}
          >
            Review Recruiter Request
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4caf50",
                color: "white",
                flex: 1,
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
              onClick={() => handleReview("Approved")} // Pass the action directly
              disabled={processing}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#f44336",
                color: "white",
                flex: 1,
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
              }}
              onClick={() => handleReview("Rejected")} // Pass the action directly
              disabled={processing}
            >
              Reject
            </Button>
          </Box>
          <Button
            variant="outlined"
            sx={{
              marginTop: "1rem",
              width: "100%",
              color: "gray",
              borderColor: "gray",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => setOpenReviewModal(false)}
          >
            Cancel
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default RecruiterRequestDetailPage;
