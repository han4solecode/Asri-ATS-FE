import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    Button,
    Skeleton,
    Grid,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import "../App.css"
import JobPostService from '../services/jobPost.service';
import CryptoJS from 'crypto-js';

// Fetch job posts with filters and pagination
const fetchJobPosts = async ({ page, pageSize, searchQuery, jobTitle, location, companyName, employmentType, sortField, sortOrder }) => {
    const { data } = await JobPostService.search( {
        PageNumber: page,
        PageSize: pageSize,
        Keywords: searchQuery,
        JobTitle: jobTitle,
        Location: location,
        CompanyName: companyName,
        EmploymentType: employmentType,
        SortBy: sortField,
        SortOrder: sortOrder,
    });
    return data;
};

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

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const pageSizes = [5, 10, 15, 20];
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobPosts', page, pageSize, searchQuery, jobTitle, location, companyName, employmentType, sortField, sortOrder],
    queryFn: () => fetchJobPosts({ page, pageSize, searchQuery, jobTitle, location, companyName, employmentType, sortField, sortOrder }),
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <div className="flex justify-center py-10"><CircularProgress /></div>;
  if (isError) return <div className="text-center py-10">Error loading data.</div>;

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const pageCount = Math.ceil(data.totalRecords / pageSize);

    return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Job Portal</h2>

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
            <TextField
                label="Job Title"
                variant="outlined"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                fullWidth
                sx={{ fontSize: '0.9rem' }}
            />
            <TextField
                label="Location"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                sx={{ fontSize: '0.9rem' }}
            />
            <TextField
                label="Company"
                variant="outlined"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
                sx={{ fontSize: '0.9rem' }}
            />
            <FormControl>
                <InputLabel id="employment-type-label">Employment Type</InputLabel>
                <Select
                    labelId="employment-type-label"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    sx={{ fontSize: '0.9rem' }}
                >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Permanent">Permanent</MenuItem>
                    <MenuItem value="Intern">Intern</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="page-size-label">Items per Page</InputLabel>
                <Select
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

       {/* Job Post Cards */}
       <Grid container spacing={3}>
                {data?.data?.length
                    ? data.data.map((job) => (
                        <Grid item xs={12} sm={6} md={4} key={job.jobPostId}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardContent>
                                    <Typography variant="h6" className="font-bold mb-2">{job.jobTitle}</Typography>
                                    <Typography variant="body2" className="mb-1">
                                        <BusinessIcon fontSize="small" /> {job.companyName}
                                    </Typography>
                                    <Typography variant="body2" className="mb-1">
                                        <LocationOnIcon fontSize="small" /> {job.location}
                                    </Typography>
                                    <Typography variant="body2" className="mb-1">
                                        <AttachMoneyIcon fontSize="small" />{" "}
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(job.minSalary)}{" "}
                                        -{" "}
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(job.maxSalary)}
                                    </Typography>
                                    <Typography variant="body2" className="mb-1">
                                        <WorkIcon fontSize="small" /> {job.employmentType}
                                    </Typography>
                                    <Typography variant="body2">
                                        <CalendarTodayIcon fontSize="small" /> {new Date(job.createdDate).toDateString()}
                                    </Typography>
                                </CardContent>
                                <div className="p-2 text-right">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        const encodedId = encodeProcessId(job.jobPostId);
                                        if (encodedId) {
                                        window.location.href = `/jobpost/${encodedId}`;
                                        } else {
                                        console.error("Failed to encode job post ID, navigation aborted.");
                                        }
                                    }}
                                    >
                                    Apply Now
                                </Button>
                                </div>
                            </Card>
                        </Grid>
                    ))
                    : (
                        <Typography variant="h6" align="center">No job posts found.</Typography>
                    )}
            </Grid>

      {/* Pagination */}
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="..."
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
      />
    </div>
    );
};

export default HomePage;