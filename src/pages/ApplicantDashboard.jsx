import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Card, CardContent, Typography } from "@mui/material";
import DashboardService from "../services/dashboard.service";

const ApplicantDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState({ applicationPipeline: [], interviewSchedule: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.applicantDashboard();
        setData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  const { applicationPipeline, interviewSchedule } = data;

  return (
    <Box className="p-4 md:p-8 lg:p-12">
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className="mb-4"
      >
        <Tab label="Application Status Tracker" />
        <Tab label="Interview Schedule" />
      </Tabs>

      <Box>
        {selectedTab === 0 && (
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {applicationPipeline.map((application) => (
              <Card key={application.applicationId} className="shadow-lg">
                <CardContent>
                  <Typography variant="h6" className="font-bold">
                    {application.jobTitle}
                  </Typography>
                  <Typography className="text-gray-600">
                    Applicant: {application.applicantName}
                  </Typography>
                  <Typography className="text-gray-600">
                    Status: {application.status}
                  </Typography>
                  <Typography className="text-gray-600">
                    Current Step: {application.currentStep}
                  </Typography>
                  <Typography className="text-gray-500 mt-2">
                    Comments: {application.comments}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewSchedule.map((interview) => (
              <Card key={interview.applicationId} className="shadow-lg">
                <CardContent>
                  <Typography variant="h6" className="font-bold">
                    {interview.jobTitle}
                  </Typography>
                  <Typography className="text-gray-600">
                    Applicant: {interview.applicantName}
                  </Typography>
                  <Typography className="text-gray-600">
                    Time: {new Date(interview.interviewTime).toLocaleString()}
                  </Typography>
                  <Typography className="text-gray-600">
                    Location: {interview.location}
                  </Typography>
                  <Typography className="text-gray-600">
                    Interviewers: {interview.interviewers.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ApplicantDashboard;
