import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import DashboardService from "../services/dashboard.service";

const RecruiterDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState({
    applicationPipeline: {},
    analyticSnapshot: {},
    taskReminders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.recruiterDashboard(); // Adjust API call
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
    return (
      <div className="flex justify-center items-center h-full p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">Error: {error}</div>
    );
  }

  const { applicationPipeline, analyticSnapshot, taskReminders } = data;

  // Recharts PieChart Data
  const pieChartData = Object.entries(applicationPipeline.submittedApplications).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

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
        <Tab label="Analytics Overview" />
        <Tab label="Application Status Tracker" />
        <Tab label="Task Reminders" />
      </Tabs>

      <Box>
        {selectedTab === 0 && (
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card for Total Submitted Applications */}
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h6" className="font-bold">
                  Total Submitted Applications
                </Typography>
                <Typography className="text-4xl font-bold text-blue-500">
                  {analyticSnapshot.submittedApplications}
                </Typography>
              </CardContent>
            </Card>

            {/* Card for Job Offers */}
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h6" className="font-bold">
                  Total Job Offers
                </Typography>
                <Typography className="text-4xl font-bold text-green-500">
                  {analyticSnapshot.jobOffers}
                </Typography>
              </CardContent>
            </Card>

            {/* Card for Average Time to Hire */}
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h6" className="font-bold">
                  Average Time to Hire (Days)
                </Typography>
                <Typography className="text-4xl font-bold text-purple-500">
                  {analyticSnapshot.averageTimeToHire.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="col-span-1 md:col-span-2 shadow-lg">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">
                  Application Status Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(applicationPipeline.submittedApplications).map(
              ([status, count], index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent>
                    <Typography variant="h6" className="font-bold">
                      {status}
                    </Typography>
                    <Typography className="text-4xl font-bold text-gray-700">
                      {count}
                    </Typography>
                  </CardContent>
                </Card>
              )
            )}
          </Box>
        )}

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
                {taskReminders.map((task) => (
                  <TableRow key={task.applicationId}>
                    <TableCell>{task.applicationId}</TableCell>
                    <TableCell>{task.applicantName}</TableCell>
                    <TableCell>{task.jobTitle}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.currentStep}</TableCell>
                    <TableCell>{task.comments}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/application-job/${task.processId}`)}
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

export default RecruiterDashboard;
