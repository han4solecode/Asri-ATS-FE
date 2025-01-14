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
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import InterviewScheduleService from "../services/interviewScheduleService";

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



const InterviewPage = () => {
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const pageSizes = [5, 1, 15, 20];

    const { data, isLoading, isError } = useQuery({
        queryKey: ['interviewSchedules', page, pageSize, value],
        queryFn: () => fetchInterviewSchedules({ page, pageSize, value }),
        keepPreviousData: true,
        placeholderData: keepPreviousData,
    });

    // Fetch interview Schedules with filters and pagination
    const fetchInterviewSchedules = async ({ page, pageSize, value }) => {
        let response;

        if(value === 0) {
            response = await InterviewScheduleService.getInterviewSchedules({
                PageNumber: page,
                PageSize: pageSize
            }, "confirmed-interview-schedule");
        }
        else if(value === 1) {
            response = await InterviewScheduleService.getInterviewSchedules({
                PageNumber: page,
                PageSize: pageSize
            }, "unconfirmed-interview-schedule");
        }
        else if(value === 2) {
            response = await InterviewScheduleService.getInterviewSchedules({
                PageNumber: page,
                PageSize: pageSize
            },  "completed-interview");
        }
        return response.data;
    }

    const handleChange = (event, value) => {
        setValue(value);
        setPage(1);
        setPageSize(5);
    };

    const handlePageClick = ({ selected }) => {
        setPage(selected + 1);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
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
                Interview Schedules
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
                    <Box sx={{ width: '100%' }}>
                        {/* select tab section */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Confirmed Interview Schedule" {...a11yProps(0)} />
                                <Tab label="Unconfirmed Interview Schedule" {...a11yProps(1)} />
                                <Tab label="Completed Interview Schedule"  {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        {/* tab Interview Schedule Confirmed Interview section */}
                        <CustomTabPanel value={value} index={0}>
                            {/* Filters Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
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
                                    No confirmed interview schedules found.
                                </Typography>
                            ) :
                                <>
                                    <Table sx={{ minWidth: 650, }}>
                                        <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Process Id</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Applicant Name
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Job Title
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Interview Time
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Location
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Interviewers
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.data.map((interviewSchedule) => (
                                                <TableRow
                                                    key={interviewSchedule.processId}
                                                    sx={{
                                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                                    }}
                                                >
                                                    <TableCell>{interviewSchedule.processId}</TableCell>
                                                    <TableCell>{interviewSchedule.applicantName}</TableCell>
                                                    <TableCell>{interviewSchedule.jobTitle}</TableCell>
                                                    <TableCell>{formatDateWithOrdinal(interviewSchedule.interviewTime)}</TableCell>
                                                    <TableCell>{interviewSchedule.location}</TableCell>
                                                    <TableCell>{interviewSchedule.interviewers}</TableCell>
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
                                </>
                            }
                        </CustomTabPanel>
                        {/* tab Interview Schedule Unconfirmed Interview section */}
                        <CustomTabPanel value={value} index={1}>
                            {/* Filters Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
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
                                    No unconfirmed interview schedules found.
                                </Typography>
                            ) :
                                <>
                                    <Table sx={{ minWidth: 650, }}>
                                        <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Process Id</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Applicant Name
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Job Title
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Interview Time
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Location
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Interviewers
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.data.map((interviewSchedule) => (
                                                <TableRow
                                                    key={interviewSchedule.processId}
                                                    sx={{
                                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                                    }}
                                                >
                                                    <TableCell>{interviewSchedule.processId}</TableCell>
                                                    <TableCell>{interviewSchedule.applicantName}</TableCell>
                                                    <TableCell>{interviewSchedule.jobTitle}</TableCell>
                                                    <TableCell>{formatDateWithOrdinal(interviewSchedule.interviewTime)}</TableCell>
                                                    <TableCell>{interviewSchedule.location}</TableCell>
                                                    <TableCell>{interviewSchedule.interviewers}</TableCell>
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
                                </>
                            }
                        </CustomTabPanel>
                        {/* tab Interview Schedule Unconfirmed Interview section */}
                        <CustomTabPanel value={value} index={2}>
                            {/* Filters Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
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
                                    No completed interview schedules found.
                                </Typography>
                            ) :
                                <>
                                    <Table sx={{ minWidth: 650, }}>
                                        <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Process Id</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Applicant Name
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Job Title
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Interview Time
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Location
                                                </TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                                    Interviewers
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.data.map((interviewSchedule) => (
                                                <TableRow
                                                    key={interviewSchedule.processId}
                                                    sx={{
                                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                                    }}
                                                >
                                                    <TableCell>{interviewSchedule.processId}</TableCell>
                                                    <TableCell>{interviewSchedule.applicantName}</TableCell>
                                                    <TableCell>{interviewSchedule.jobTitle}</TableCell>
                                                    <TableCell>{formatDateWithOrdinal(interviewSchedule.interviewTime)}</TableCell>
                                                    <TableCell>{interviewSchedule.location}</TableCell>
                                                    <TableCell>{interviewSchedule.interviewers}</TableCell>
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
                                </>
                            }
                        </CustomTabPanel>
                    </Box>
                </TableContainer>
            )}
        </Box>
    );
};

export default InterviewPage;
