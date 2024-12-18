import React, { useState } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import "../App.css"
import { Link } from 'react-router-dom';

// Fetch job posts with filters and pagination
const fetchJobPosts = async ({ page, pageSize, searchQuery, jobTitle, location, companyName, employmentType, sortField, sortOrder }) => {
    try {
        const response = await axios.get('https://localhost:7080/api/JobPost/search-job', {
            params: {
                PageNumber: page,
                PageSize: pageSize,
                Keywords: searchQuery || '', // Pass empty if no search query
                JobTitle: jobTitle || '', // Job title filter
                Location: location || '', // Location filter
                CompanyName: companyName || '', // Company filter
                EmploymentType: employmentType || '', // Employment type filter
                SortBy: sortField,
                SortOrder: sortOrder,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch job posts');
    }
};

const HomePage = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [sortField, setSortField] = useState('createdDate');
    const [sortOrder, setSortOrder] = useState('desc');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['jobPosts', { page, pageSize, searchQuery, jobTitle, location, companyName, employmentType, sortField, sortOrder }],
        queryFn: () => fetchJobPosts({ page, pageSize, searchQuery, jobTitle, location, companyName, employmentType, sortField, sortOrder }),
        keepPreviousData: true,
        placeholderData: keepPreviousData,
    });

    // Show loading state
    if (isLoading) return <div className="flex justify-center py-10"><CircularProgress /></div>;

    // Handle error state
    if (isError) {
        return <div className="text-center py-10">Error loading data.</div>;
    }

    const handlePageClick = ({ selected }) => {
        setPage(selected + 1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1); // Reset to the first page on search
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1); // Reset to the first page on items per page change
    };

    const handleJobTitleChange = (event) => {
        setJobTitle(event.target.value);
        setPage(1); // Reset to the first page on filter change
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
        setPage(1); // Reset to the first page on filter change
    };

    const handleCompanyChange = (event) => {
        setCompanyName(event.target.value);
        setPage(1); // Reset to the first page on filter change
    };

    const handleEmploymentTypeChange = (event) => {
        setEmploymentType(event.target.value);
        setPage(1); // Reset to the first page on filter change
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
        if (field !== sortField) return '↕';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const pageCount = Math.ceil(data.totalRecords / pageSize);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Job Portal</h2>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Search Field */}
                <TextField
                    label="Search Jobs"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    fullWidth
                />

                {/* Job Title Filter */}
                <TextField
                    label="Job Title"
                    variant="outlined"
                    value={jobTitle}
                    onChange={handleJobTitleChange}
                    fullWidth
                />

                {/* Location Filter */}
                <TextField
                    label="Location"
                    variant="outlined"
                    value={location}
                    onChange={handleLocationChange}
                    fullWidth
                />

                {/* Company Filter */}
                <TextField
                    label="Company"
                    variant="outlined"
                    value={companyName}
                    onChange={handleCompanyChange}
                    fullWidth
                />

                {/* Employment Type Dropdown */}
                <FormControl>
                    <InputLabel id="employment-type-label">Employment Type</InputLabel>
                    <Select
                        labelId="employment-type-label"
                        value={employmentType}
                        onChange={handleEmploymentTypeChange}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        <MenuItem value="Permanent">Permanent</MenuItem>
                        <MenuItem value="Intern">Intern</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                    </Select>
                </FormControl>

                {/* Page Size Dropdown */}
                <FormControl>
                    <InputLabel id="page-size-label">Items per Page</InputLabel>
                    <Select
                        labelId="page-size-label"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        {[5, 10, 20].map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {/* Job Post Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.map((job) => (
                    <Card key={job.jobPostId} className="shadow-md">
                        <CardContent>
                            <Typography variant="h6" className="font-bold mb-2">{job.jobTitle}</Typography>
                            <Typography variant="body1" className="mb-1">Company: {job.companyName}</Typography>
                            <Typography variant="body2" className="text-gray-600 mb-1">Location: {job.location}</Typography>
                            <Typography variant="body2" className="text-gray-600 mb-1">
                                Salary: {job.minSalary.toLocaleString()} - {job.maxSalary.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600 mb-1">Type: {job.employmentType}</Typography>
                            <Typography variant="body2" className="text-gray-600">
                                Posted Date: {new Date(job.createdDate).toDateString()} 
                            </Typography>
                        </CardContent>
                        <div className="p-2 text-right">
                            <Button variant="contained" color="primary" component={Link} to={`/jobpost/${job.jobPostId}`}>
                                Apply Now
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
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