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
        const response = await DashboardService.recruiterDashboard();
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
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  const { applicationPipeline, analyticSnapshot, taskReminders } = data;

  const totalApplications = Object.values(applicationPipeline.submittedApplications || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  const pieChartData = Object.entries(applicationPipeline.submittedApplications || {}).map(
    ([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / totalApplications) * 100).toFixed(1),
    })
  );

  const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

  return (
    <Box className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className="mb-6 bg-white shadow rounded-lg"
      >
        <Tab label="Analytics Overview" />
        <Tab label="Application Status Tracker" />
        <Tab label="Task Reminders" />
      </Tabs>

      <Box>
        {selectedTab === 0 && (
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Snapshot Cards */}
            <Card className="shadow-lg transition-transform transform hover:scale-105">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-2 text-gray-700">
                  Total Submitted Applications
                </Typography>
                <Typography className="text-4xl font-bold text-blue-600">
                  {analyticSnapshot.submittedApplications}
                </Typography>
              </CardContent>
            </Card>

            <Card className="shadow-lg transition-transform transform hover:scale-105">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-2 text-gray-700">
                  Total Job Offers
                </Typography>
                <Typography className="text-4xl font-bold text-green-600">
                  {analyticSnapshot.jobOffers}
                </Typography>
              </CardContent>
            </Card>

            <Card className="shadow-lg transition-transform transform hover:scale-105">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-2 text-gray-700">
                  Average Time to Hire (Days)
                </Typography>
                <Typography className="text-4xl font-bold text-purple-600">
                  {analyticSnapshot.averageTimeToHire.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>

            {/* Expanded Graph Card */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4 text-gray-700">
                  Application Status Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
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
            {Object.entries(applicationPipeline.submittedApplications || {}).map(
              ([status, count], index) => (
                <Card
                  key={index}
                  className="shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-gray-50 to-gray-100"
                >
                  <CardContent>
                    <Typography variant="h6" className="font-bold text-gray-700">
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
              <TableHead className="bg-gray-50">
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
                        onClick={() => {
                          const encodedId = encodeProcessId(task.processId);
                          if (encodedId) {
                            navigate(`/application-job/${encodedId}`);
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
        )}
      </Box>
    </Box>
  );
};

export default RecruiterDashboard;
