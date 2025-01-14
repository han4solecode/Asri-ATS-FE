import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import DashboardService from "../services/dashboard.service";
import { useNavigate } from "react-router-dom";

const ApplicantDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState({
    applicationPipeline: [],
    interviewSchedule: [],
    notification: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

  const { applicationPipeline, interviewSchedule, notification } = data;

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
        <Tab label="Notifications" />
      </Tabs>

      <Box>
        {/* Application Status Tracker */}
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

        {/* Interview Schedule */}
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

        {/* Notifications */}
        {selectedTab === 2 && (
          <TableContainer component={Paper} className="shadow-lg">
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
                {notification.map((note) => (
                  <TableRow key={note.applicationId}>
                    <TableCell>{note.applicationId}</TableCell>
                    <TableCell>{note.applicantName}</TableCell>
                    <TableCell>{note.jobTitle}</TableCell>
                    <TableCell>{note.status}</TableCell>
                    <TableCell>{note.currentStep}</TableCell>
                    <TableCell>{note.comments}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/application-job/${note.processId}`)}
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
    </Box>
  );
};

export default ApplicantDashboard;
