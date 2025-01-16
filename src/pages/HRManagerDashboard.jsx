import React, { useState } from "react";
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
  Tooltip
} from "@mui/material";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import DashboardService from "../services/dashboard.service";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: 3, paddingBottom: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(value) {
  return {
    id: `simple-tab-${value}`,
    'aria-controls': `simple-tabpanel-${value}`,
  };
}



const HRManagerDashboardPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['HRDashboard'],
    queryFn: () => fetchHRDashboard(),
    keepPreviousData: true,
    placeholderData: keepPreviousData
  });

  // Fetch job posts with filters and pagination
  const fetchHRDashboard = async () => {
    const response = await DashboardService.HRManagerDashboard();
    return response.data;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    const lastDigit = day % 10;
    if (lastDigit === 1) return 'st';
    if (lastDigit === 2) return 'nd';
    if (lastDigit === 3) return 'rd';
    return 'th';
  };

  const formatDateWithOrdinal = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const ordinal = getOrdinalSuffix(day);

    return `${month} ${day}${ordinal}, ${year}   ${hour}:${minute}`;
  };

  const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

  if (isError) return <div className="text-center py-10">Error loading data.</div>;

  return (
    <Box
      // className="mx-auto bg-white rounded-lg shadow-md"
      sx={{
        margin: "2rem auto", // Adds consistent spacing with navbar
        padding: { xs: "1rem", sm: "1.5rem", md: "2rem" }, // Responsive padding
        boxSizing: "border-box",
        width: "100%",
        maxWidth: { xs: "100%", lg: "90%" }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          textAlign: 'center'
        }}
      >
        HR Manager Dashboard
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end", // Membuat tombol di kanan
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
      </Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "8px",
            overflowX: "auto", // Makes table scrollable on small screens
          }}
        >
          <Box sx={{ width: '100%'}}>
            {/* select tab section */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs variant="scrollable" value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Job Post Request" {...a11yProps(0)} />
                <Tab label="Recruiter Request" {...a11yProps(1)} />
                <Tab label="Recruitment Funnel" {...a11yProps(2)} />
              </Tabs>
            </Box>
            {/* tab Job Post Request to be reviewed selected section */}
            <CustomTabPanel value={value} index={0}>
              {data.jobPostRequests.data.length === 0 ? (
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    color: "gray",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  No unreviewed requests found.
                </Typography>
              ) :
                <div style={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650, }}>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Process Id</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Request Date
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Requester
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Job Title
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Location
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Min Salary
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Max Salary
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Employment Type
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.jobPostRequests.data.map((request) => (
                        <TableRow
                          key={request.processId}
                          sx={{
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          <TableCell>{request.processId}</TableCell>
                          <TableCell>{formatDateWithOrdinal(request.requestDate)}</TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.jobTitle}</TableCell>
                          <TableCell>{request.location}</TableCell>
                          <TableCell>{request.minSalary}</TableCell>
                          <TableCell>{request.maxSalary}</TableCell>
                          <TableCell>{request.employmentType}</TableCell>
                          <TableCell>{request.status}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "#1976d2",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#1565c0",
                                },
                              }}
                              onClick={() =>
                                navigate(
                                  `/job-post-request/${request.processId}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              }
            </CustomTabPanel>
            {/* tab Recruiter Request selected section */}
            <CustomTabPanel value={value} index={1}>
              {data.recruiterRequests.length === 0 ? (
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    color: "gray",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  No unreviewed requests found.
                </Typography>
              ) :
                <div style={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650, }}>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>First Name</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Last Name
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Phone
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recruiterRequests.map((request, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          <TableCell>{request.firstName}</TableCell>
                          <TableCell>{request.lastName}</TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>{request.phoneNumber}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "#1976d2",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#1565c0",
                                },
                              }}
                              onClick={() =>
                                navigate(
                                  `/recruiter-request/${request.recruiterRegistrationRequestId}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              }
            </CustomTabPanel>
            {/* tab Recruiter Request selected section */}
            <CustomTabPanel value={value} index={2}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.recruitmentFunnel}
                    dataKey="count"
                    nameKey="stageName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ stageName, count }) => `${stageName} (${count})`}
                  >
                    {data.recruitmentFunnel.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CustomTabPanel>
          </Box>
        </TableContainer>
      )}
    </Box>
  );
};

export default HRManagerDashboardPage;