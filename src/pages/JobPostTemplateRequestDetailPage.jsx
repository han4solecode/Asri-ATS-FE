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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import CryptoJS from "crypto-js";

// Material UI Icons
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useSelector } from "react-redux";
import JobPostTemplateRequestService from "../services/jobPostTemplateRequestService";
import { toast } from "react-toastify";

const SECRET_KEY = "your-secure-key";

const decodeId = (encryptedId) => {
  try {
    const decoded = decodeURIComponent(encryptedId); // Decode the URL-safe string
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalId) throw new Error("Decryption failed or returned empty string");
    return originalId;
  } catch (error) {
    console.error("Error decoding process ID:", error);
    return null;
  }
};

const JobPostTemplateRequestDetailPage = () => {
  const { id: encryptedId } = useParams();
  const id = decodeId(encryptedId);
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState("");
  const [errors, setErrors] = useState(null);
  const { user: currentUser } = useSelector((state) => state.auth);

  // Fetch job post request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const response = await JobPostTemplateRequestService.details(id);
        setRequestDetails(response.data); // Set request details from API
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  // Handle Review Action (Approve or Reject)
  const handleReview = async () => {
    try {
      let userData = {
        Action: action,
        JobTemplateRequestId: requestDetails.jobTemplateRequestId
      }

      // validation
      let errorMessages = {};

      if (!userData.Action.trim()) {
        errorMessages.action = "Action is required";
      }

      setErrors(errorMessages);
      for (let propName in errorMessages) {
        if (errorMessages[propName].length > 0) {
          return;
        }
      }
      setProcessing(true);
      const response = await JobPostTemplateRequestService.reviewJobPostTemplateRequest(userData);

      if (response.data.status === "Success") {
        toast.success("Job post template request reviewed successful!");
        setOpenReviewModal(false);
        setAction("");
        setErrors(null);
        navigate("/job-post-template-request"); // Navigate back to the list after successful review
      } else {
        toast.error("Job post template request reviewed failed!");
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
    <Box className="w-11/12 mx-auto mt-10 mb-10 p-4 bg-white rounded-lg shadow-md border border-gray-300">
      <div>
        {/* Job Post Details Card */}
        <Container sx={{ marginTop: 4, marginBottom: 6 }}>
          <Card sx={{ boxShadow: 4 }}>
            <CardContent sx={{ padding: 4 }}>
              {/* Job Title */}
              <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                {requestDetails.jobTitle}
              </Typography>

              {/* Job Information */}
              <Grid container spacing={3} sx={{ marginTop: 2, marginBottom: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon color="primary" sx={{ marginRight: 1 }} />
                    <strong>Company:</strong> {requestDetails.companyName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon color="primary" sx={{ marginRight: 1 }} />
                    <strong>Location:</strong> {requestDetails.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon color="primary" sx={{ marginRight: 1 }} />
                    <strong>Salary:</strong> {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(requestDetails.minSalary)}{" "}
                    -{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(requestDetails.maxSalary)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon color="primary" sx={{ marginRight: 1 }} />
                    <strong>Employment Type:</strong> {requestDetails.employmentType}
                  </Typography>
                </Grid>
              </Grid>

              {/* Job Description */}
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                <DescriptionIcon color="action" sx={{ marginRight: 1 }} />
                Description:
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 3, lineHeight: 1.8 }}>
                {requestDetails.description}
              </Typography>

              {/* Job Requirements */}
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                <AssignmentTurnedInIcon color="action" sx={{ marginRight: 1 }} />
                Requirements:
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                {requestDetails.requirements}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </div>

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
            Review Job Post Template Request
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
                backgroundColor: action === "Approved" || !action ? "#4caf50" : "#e0e0e0",  // Highlight selected action
                color: "white",
                flex: 1,
                "&:hover": {
                  backgroundColor: action === "Approved" || !action ? "#45a049" : "#bdbdbd",  // Change hover effect based on selection
                },
              }}
              onClick={() => setAction("Approved")}
              disabled={processing}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: action === "Rejected" || !action ? "#f44336" : "#e0e0e0",  // Highlight selected action
                color: "white",
                flex: 1,
                "&:hover": {
                  backgroundColor: action === "Rejected" || !action ? "#d32f2f" : "#bdbdbd",  // Change hover effect based on selection
                },
              }}
              onClick={() => setAction("Rejected")}
              disabled={processing}
            >
              Reject
            </Button>
          </Box>

          {/* Display error message if no action is selected */}
          {errors?.action && (
            <Typography color="error" variant="body2" sx={{ marginTop: "1rem", textAlign: "start" }}>
              {errors?.action}
            </Typography>
          )}
          <Button
            variant="outlined"
            sx={{
              marginTop: "1rem",
              width: "100%",
              color: "white",  // Primary text color
              borderColor: "primary.main",  // Primary border color
              "&:hover": {
                backgroundColor: "primary.light",  // Lighter shade for hover
              },
              backgroundColor: 'primary.main'
            }}
            onClick={() => handleReview()}
          >
            Submit Review
          </Button>
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
            onClick={() => {
              setOpenReviewModal(false)
              setAction("")
              setComment("")
              setErrors(null)
            }}
          >
            Cancel
          </Button>
        </Paper>
      </Modal>

      {/* Add Action button to show review modal */}
      {currentUser.roles.includes("HR Manager") ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // Ensure buttons are at opposite ends
            alignItems: "center", // Align buttons vertically
            gap: "1rem",
            mt: 2, // Optional: Add some margin-top for spacing
          }}
        >
          {/* Back Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          {/* Conditional Buttons */}
          {currentUser.roles.includes("HR Manager") && requestDetails.isApproved == null ? (
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
              onClick={() => {
                setOpenReviewModal(true);
              }}
            >
              Review
            </Button>
          ) : ''}
        </Box>
      ) : <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>Back</Button>}
    </Box>
  );
};

export default JobPostTemplateRequestDetailPage;
