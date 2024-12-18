import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import JobPostService from '../services/jobPost.service';

// Material UI Icons
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const fetchJobPostDetails = async (JobPostId) => {
    const response = await JobPostService.details(JobPostId);
    return response.data;
};

const JobPostDetailPage = () => {
    const { jobPostId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['jobPostDetails', jobPostId],
        queryFn: () => fetchJobPostDetails(jobPostId),
        enabled: !!jobPostId, // Fetch only if jobPostId is provided
    });
    console.log(data)

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
        <div className="p-6">
            <Card className="shadow-md max-w-3xl mx-auto">
                <CardContent>
                    <Typography variant="h4" className="font-bold mb-4 text-center">
                        <WorkIcon fontSize="large" className="m-4" />
                        {jobTitle}
                    </Typography>

                    <Grid container spacing={2} className="mb-4">
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" className="flex items-center mb-2">
                                <BusinessIcon className="mr-2" color="primary" />
                                {companyName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" className="flex items-center mb-2">
                                <LocationOnIcon className="mr-2" color="primary" />
                                {location}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" className="flex items-center mb-2">
                                <AttachMoneyIcon className="mr-2" color="primary" />
                                {minSalary} - {maxSalary}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" className="flex items-center mb-2">
                                <ScheduleIcon className="mr-2" color="primary" />
                                {employmentType}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" className="font-bold flex items-center mb-2">
                        <DescriptionIcon className="mr-2" color="action" />
                        Description:
                    </Typography>
                    <Typography variant="body2" className="text-gray-700 mb-4">
                        {description}
                    </Typography>

                    <Typography variant="h6" className="font-bold flex items-center mb-2">
                        <AssignmentTurnedInIcon className="mr-2" color="action" />
                        Requirements:
                    </Typography>
                    <Typography variant="body2" className="text-gray-700">
                        {requirement}
                    </Typography>
                </CardContent>

                <div className="p-4 text-right">
                    <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default JobPostDetailPage;