import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress, Card, CardContent, Typography, Button, Grid, Box, Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import JobPostService from '../services/jobPost.service';
import CryptoJS from 'crypto-js';

// Material UI Icons
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const fetchJobPostDetails = async (jobPostId) => {
    const response = await JobPostService.details(jobPostId);
    return response.data;
};

const SECRET_KEY = "your-secure-key";

const decodeJobPostId = (encryptedId) => {
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

const encodeJobPostId = (id) => {
  try {
    if (!id) throw new Error("Invalid process ID");
    const encrypted = CryptoJS.AES.encrypt(String(id), SECRET_KEY).toString();
    return encodeURIComponent(encrypted); // Encode the encrypted string for URL safety
  } catch (error) {
    console.error("Error encoding process ID:", error);
    return null;
  }
};


const JobPostDetailPage = () => {
    const { jobPostId: encryptedJobPostId } = useParams();
    const jobPostId = decodeJobPostId(encryptedJobPostId);
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['jobPostDetails', jobPostId],
        queryFn: () => fetchJobPostDetails(jobPostId),
        enabled: !!jobPostId, // Fetch only if jobPostId is provided
    });

    if (isLoading) {
        return <div className="flex justify-center py-10"><CircularProgress /></div>;
    }

    if (isError) {
        return <div className="text-center py-10">Error loading job post details.</div>;
    }

    const {
        jobTitle,
        companyName,
        location,
        description,
        requirement,
        employmentType,
        minSalary,
        maxSalary,
    } = data;

    return (
        <div>
            {/* Job Post Details Card */}
            <Container sx={{ marginTop: 4, marginBottom: 6 }}>
                <Card sx={{ boxShadow: 4 }}>
                    <CardContent sx={{ padding: 4 }}>
                        {/* Job Title */}
                        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                            {jobTitle}
                        </Typography>

                        {/* Job Information */}
                        <Grid container spacing={3} sx={{ marginTop: 2, marginBottom: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <BusinessIcon color="primary" sx={{ marginRight: 1 }} />
                                    <strong>Company : </strong> {companyName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon color="primary" sx={{ marginRight: 1 }} />
                                    <strong>Location : </strong> {location}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AttachMoneyIcon color="primary" sx={{ marginRight: 1 }} />
                                    <strong>Salary : </strong>{" "}
                                    {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    }).format(minSalary)}{" "}
                                    -{" "}
                                    {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    }).format(maxSalary)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ScheduleIcon color="primary" sx={{ marginRight: 1 }} />
                                    <strong>Employment Type : </strong> {employmentType}
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Job Description */}
                        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                            <DescriptionIcon color="action" sx={{ marginRight: 1 }} />
                            Description:
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 3, lineHeight: 1.8 }}>
                            {description}
                        </Typography>

                        {/* Job Requirements */}
                        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                            <AssignmentTurnedInIcon color="action" sx={{ marginRight: 1 }} />
                            Requirements:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                            {requirement}
                        </Typography>
                    </CardContent>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 3 }}>
                        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const encodedId = encodeJobPostId(jobPostId);
                                if (encodedId) {
                                window.location.href = `/jobpost/application/${encodedId}`;
                                } else {
                                console.error("Failed to encode job post ID, navigation aborted.");
                                }
                            }}
                        >
                            Apply
                        </Button>
                    </Box>
                </Card>
            </Container>
        </div>
    );
};

export default JobPostDetailPage;
