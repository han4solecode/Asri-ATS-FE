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
import JobPostTemplateRequestService from "../services/jobPostTemplateRequestService";
import JobPostTemplateService from "../services/jobPostTemplateService";

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

const JobPostTemplateDetailPage = () => {
    const { id: encryptedId } = useParams();
    const id = decodeId(encryptedId);
    const navigate = useNavigate();
    const [requestDetails, setRequestDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // Fetch job post request details
    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                setLoading(true);
                const response = await JobPostTemplateService.details(id);
                setRequestDetails(response.data); // Set request details from API
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [id]);

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
                                        <strong>Salary:</strong> {requestDetails.minSalary} - {requestDetails.maxSalary}
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
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between", // Ensure buttons are at opposite ends
                    alignItems: "center", // Align buttons vertically
                    gap: "1rem",
                    mt: 2, // Optional: Add some margin-top for spacing
                }}

            >
                <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>Back</Button>
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
                        navigate("/job-post-request/new", { state: { formData: requestDetails } });
                    }}
                >
                    Set Template to Form
                </Button>
            </Box>

        </Box>
    );
};

export default JobPostTemplateDetailPage;
