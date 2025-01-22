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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import JobPostTemplateRequestService from "../services/jobPostTemplateRequestService";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secure-key";

const encodeId = (id) => {
  try {
    if (!id) throw new Error("Invalid process ID");
    const encrypted = CryptoJS.AES.encrypt(String(id), SECRET_KEY).toString();
    return encodeURIComponent(encrypted); // Encode the encrypted string for URL safety
  } catch (error) {
    console.error("Error encoding process ID:", error);
    return null;
  }
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const JobPostTemplateRequestPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const pageSizes = [5, 10, 15, 20];
  const [jobPostTemplateRequestStatus, setJobPostRequestStatus] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobPostTemplateRequests', page, pageSize, searchQuery, jobPostTemplateRequestStatus, value],
    queryFn: () => fetchJobPostTemplateRequests({ page, pageSize, searchQuery, jobPostTemplateRequestStatus, value }),
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  // Fetch job post requests with search and pagination
  const fetchJobPostTemplateRequests = async ({ page, pageSize, searchQuery, jobPostTemplateRequestStatus, value }) => {

    if (currentUser.roles.includes("HR Manager")) {
      if (value === 0) {
        setJobPostRequestStatus("Review HR Manager")
      }
      else if (value === 1) {
        setJobPostRequestStatus("Accepted")
      }
      else if (value === 2) {
        setJobPostRequestStatus("Rejected")
      }
    }

    const response = await JobPostTemplateRequestService.jobPostTemplateRequestList({
      PageNumber: page,
      PageSize: pageSize,
      keywords: searchQuery,
      jobPostRequestStatus: jobPostTemplateRequestStatus
    });
    return response.data;
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(1);
    setPageSize(5);
    setSearchQuery('');
  };

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  if (isError) return <div className="text-center py-10">Error loading data.</div>;

  if (currentUser.roles.includes("HR Manager")) return (
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
        Job Post Template Requests
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end", // Membuat tombol di kanan
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        {currentUser.roles.includes("Recruiter") &&
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              padding: { xs: "0.5rem 1rem", sm: "0.75rem 1.5rem" },
              "&:hover": {
                backgroundColor: "#424242",
              },
            }}
            className="rounded-lg shadow-md"
            onClick={() => navigate('/job-post-template-request/new')}
          >
            Add New Job Post Template Request
          </Button>}

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
          <Box sx={{ width: '100%' }}>
            {/* select tab section */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs variant="scrollable" value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Job Post Template Request" {...a11yProps(0)} />
                <Tab label="Accepted Job Post Template" {...a11yProps(1)} />
                <Tab label="Rejected Job Post Template" {...a11yProps(1)} />
              </Tabs>
            </Box>
            {/* tab Job Post Request to be reviewed selected section */}
            <CustomTabPanel value={value} index={0}>
              {/* Filters Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
                <TextField
                  label="Search Jobs"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#f7f9fc',
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '& .MuiInputBase-root': {
                      fontSize: '1.2rem',
                    },
                  }}
                />
                <FormControl variant="outlined">
                  <InputLabel id="page-size-label">Items per Page</InputLabel>
                  <Select
                    label="Items per Pages"
                    labelId="page-size-label"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    {pageSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {data.data.length === 0 ? (
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
                      {data.data.map((request) => (
                        <TableRow
                          key={request.jobPostTemplateRequestId}
                          sx={{
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.jobTitle}</TableCell>
                          <TableCell>{request.location}</TableCell>
                          <TableCell>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(request.minSalary)}{" "}</TableCell>
                          <TableCell>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(request.maxSalary)}{" "}</TableCell>
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
                              onClick={() => {
                                const encodedId = encodeId(request.jobPostTemplateRequestId);
                                if (encodedId) {
                                  navigate(`/job-post-template-request/${encodedId}`);
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
                  {/* Pagination */}
                  <ReactPaginate
                    previousLabel="Previous"
                    nextLabel="Next"
                    breakLabel="..."
                    pageCount={data?.totalPages}
                    onPageChange={handlePageClick}
                    containerClassName="flex justify-center items-center space-x-3 mt-4" // Container with spacing and centering
                    activeClassName="bg-blue-500 text-white px-4 py-2 rounded-md" // Active page styling with larger text and a background color
                    pageClassName="px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200" // Page buttons styling
                    breakClassName="text-gray-600 px-2 py-2" // Styling for the break dots
                    previousClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Previous button styling
                    nextClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Next button styling
                    previousLinkClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Previous button text color
                    nextLinkClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Next button text color
                    disabledClassName="cursor-not-allowed text-gray-400" // Disabled button styling
                    selectedClassName="bg-blue-500 text-white" // Selected page button styling
                  />
                </div>
              }
            </CustomTabPanel>
            {/* tab Accepted Job Post Request selected section */}
            <CustomTabPanel value={value} index={1}>
              {/* Filters Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
                <TextField
                  label="Search Jobs"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#f7f9fc',
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '& .MuiInputBase-root': {
                      fontSize: '1.2rem',
                    },
                  }}
                />
                <FormControl variant="outlined">
                  <InputLabel id="page-size-label">Items per Page</InputLabel>
                  <Select
                    label="Items per Pages"
                    labelId="page-size-label"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    {pageSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {data.data.length === 0 ? (
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    color: "gray",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  No Accepted Job Post Template found.
                </Typography>
              ) :
                <div style={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650, }}>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                      <TableRow>
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
                      {data.data.map((request) => (
                        <TableRow
                          key={request.jobPostTemplateRequestId}
                          sx={{
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.jobTitle}</TableCell>
                          <TableCell>{request.location}</TableCell>
                          <TableCell>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(request.minSalary)}{" "}</TableCell>
                          <TableCell>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(request.maxSalary)}{" "}</TableCell>
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
                              onClick={() => {
                                const encodedId = encodeId(request.jobPostTemplateRequestId);
                                if (encodedId) {
                                  navigate(`/job-post-template-request/${encodedId}`);
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
                  {/* Pagination */}
                  <ReactPaginate
                    previousLabel="Previous"
                    nextLabel="Next"
                    breakLabel="..."
                    pageCount={data?.totalPages}
                    onPageChange={handlePageClick}
                    containerClassName="flex justify-center items-center space-x-3 mt-4" // Container with spacing and centering
                    activeClassName="bg-blue-500 text-white px-4 py-2 rounded-md" // Active page styling with larger text and a background color
                    pageClassName="px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200" // Page buttons styling
                    breakClassName="text-gray-600 px-2 py-2" // Styling for the break dots
                    previousClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Previous button styling
                    nextClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Next button styling
                    previousLinkClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Previous button text color
                    nextLinkClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Next button text color
                    disabledClassName="cursor-not-allowed text-gray-400" // Disabled button styling
                    selectedClassName="bg-blue-500 text-white" // Selected page button styling
                  />
                </div>
              }
            </CustomTabPanel>
            {/* tab Rejected Job Post Request selected section */}
            <CustomTabPanel value={value} index={2}>
              {/* Filters Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
                <TextField
                  label="Search Jobs"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#f7f9fc',
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '& .MuiInputBase-root': {
                      fontSize: '1.2rem',
                    },
                  }}
                />
                <FormControl variant="outlined">
                  <InputLabel id="page-size-label">Items per Page</InputLabel>
                  <Select
                    label="Items per Pages"
                    labelId="page-size-label"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    {pageSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {data.data.length === 0 ? (
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    color: "gray",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  No Rejected Job Post Template found.
                </Typography>
              ) :
                <div style={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650, }}>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                      <TableRow>
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
                      {data.data.map((request) => (
                        <TableRow
                          key={request.jobPostTemplateRequestId}
                          sx={{
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.jobTitle}</TableCell>
                          <TableCell>{request.location}</TableCell>
                          <TableCell>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(request.minSalary)}{" "}</TableCell>
                          <TableCell>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(request.maxSalary)}{" "}</TableCell>
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
                              onClick={() => {
                                const encodedId = encodeId(request.jobPostTemplateRequestId);
                                if (encodedId) {
                                  navigate(`/job-post-template-request/${encodedId}`);
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
                  {/* Pagination */}
                  <ReactPaginate
                    previousLabel="Previous"
                    nextLabel="Next"
                    breakLabel="..."
                    pageCount={data?.totalPages}
                    onPageChange={handlePageClick}
                    containerClassName="flex justify-center items-center space-x-3 mt-4" // Container with spacing and centering
                    activeClassName="bg-blue-500 text-white px-4 py-2 rounded-md" // Active page styling with larger text and a background color
                    pageClassName="px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200" // Page buttons styling
                    breakClassName="text-gray-600 px-2 py-2" // Styling for the break dots
                    previousClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Previous button styling
                    nextClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Next button styling
                    previousLinkClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Previous button text color
                    nextLinkClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Next button text color
                    disabledClassName="cursor-not-allowed text-gray-400" // Disabled button styling
                    selectedClassName="bg-blue-500 text-white" // Selected page button styling
                  />
                </div>
              }
            </CustomTabPanel>
          </Box>
        </TableContainer>
      )}
    </Box>
  );

  if (currentUser.roles.includes("Recruiter")) {
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
          Job Post Template Requests
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end", // Membuat tombol di kanan
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >

          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              padding: { xs: "0.5rem 1rem", sm: "0.75rem 1.5rem" },
              "&:hover": {
                backgroundColor: "#424242",
              },
            }}
            className="rounded-lg shadow-md"
            onClick={() => navigate('/job-post-template-request/new')}
          >
            Add New Job Post Template Request
          </Button>
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
            sx={{
              borderRadius: "8px",
              paddingTop: 1,
              overflowX: "auto", // Makes table scrollable on small screens
            }}
          >
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
              <TextField
                label="Search Jobs"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#f7f9fc',
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '& .MuiInputBase-root': {
                    fontSize: '1.2rem',
                  },
                }}
              />
              <FormControl variant="outlined">
                <InputLabel id="job-post-request-status-label">Job Post Request Status</InputLabel>
                <Select
                  labelId="job-post-request-status-label"
                  value={jobPostTemplateRequestStatus}
                  onChange={(e) => setJobPostRequestStatus(e.target.value)}
                  sx={{ fontSize: '0.9rem' }}
                  label="Job Post Request Statuses"
                >
                  <MenuItem value="All Types">All Types</MenuItem>
                  <MenuItem value="Review HR Manager">Submitted</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel id="page-size-label">Items per Page</InputLabel>
                <Select
                  label="Items per Pages"
                  labelId="page-size-label"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ fontSize: '0.9rem' }}
                >
                  {pageSizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {data.data.length === 0 ?
              <Typography
                variant="body1"
                textAlign="center"
                sx={{
                  color: "gray",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                No requests found.
              </Typography>
              :
              <div style={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: "#1976d2" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Id</TableCell>
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
                    {data.data.map((request) => (
                      <TableRow
                        key={request.jobPostTemplateRequestId}
                        sx={{
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TableCell>{request.requester}</TableCell>
                        <TableCell>{request.jobTitle}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>{new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(request.minSalary)}{" "}</TableCell>
                        <TableCell>{new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(request.maxSalary)}{" "}</TableCell>
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
                            onClick={() => {
                              const encodedId = encodeId(request.jobPostTemplateRequestId);
                              if (encodedId) {
                                navigate(`/job-post-template-request/${encodedId}`);
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
              </div>
            }
            {/* Pagination */}
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              pageCount={data?.totalPages}
              onPageChange={handlePageClick}
              containerClassName="flex justify-center items-center space-x-3 mt-4" // Container with spacing and centering
              activeClassName="bg-blue-500 text-white px-4 py-2 rounded-md" // Active page styling with larger text and a background color
              pageClassName="px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200" // Page buttons styling
              breakClassName="text-gray-600 px-2 py-2" // Styling for the break dots
              previousClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Previous button styling
              nextClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-200'} px-4 py-2 border border-gray-300 rounded-md transition duration-200 `} // Next button styling
              previousLinkClassName={`${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Previous button text color
              nextLinkClassName={`${page === data?.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer'} text-gray-700`} // Next button text color
              disabledClassName="cursor-not-allowed text-gray-400" // Disabled button styling
              selectedClassName="bg-blue-500 text-white" // Selected page button styling
            />
          </TableContainer>
        )}
      </Box>
    )
  };
};

export default JobPostTemplateRequestPage;
