import React, { useEffect, useState } from "react";
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import JobPostRequestService from "../services/jobPostRequestService";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import JobPostTemplateService from "../services/jobPostTemplateService";
import ReactPaginate from "react-paginate";

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

const JobPostRequestFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state?.formData || {};
    const [formValues, setFormValues] = useState({
        jobTitle: "",
        description: "",
        requirements: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        employmentType: "",
        comments: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const pageSizes = [5, 10, 15, 20];
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['jobPostTemplates', page, pageSize, searchQuery, value],
        queryFn: () => fetchJobPostTemplates({ page, pageSize, searchQuery, value }),
        keepPreviousData: true,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (formData) {
            setFormValues((prevValues) => ({
                ...prevValues,
                ...formData,
            }));
        }
    }, [formData]);

    const fetchJobPostTemplates = async ({ page, pageSize, searchQuery, value }) => {
        if (value === 0) {
            return {
                data:[]
            };
        }
        else if (value === 1) {
            const response = await JobPostTemplateService.jobPostTemplateList({
                PageNumber: page,
                PageSize: pageSize,
                keywords: searchQuery,
            });
            return response.data;
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handlePageClick = ({ selected }) => {
        setPage(selected + 1);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    // Validate inputs
    const validate = () => {
        let validationErrors = {};

        if (!formValues.jobTitle.trim()) {
            validationErrors.jobTitle = "Job Title is required.";
        } else if (formValues.jobTitle.length > 50) {
            validationErrors.jobTitle = "Job Title cannot exceed 50 characters.";
        }

        if (!formValues.description.trim()) {
            validationErrors.description = "Description is required.";
        }

        if (!formValues.requirements.trim()) {
            validationErrors.requirements = "Requirements is required.";
        }

        if (!formValues.minSalary) {
            validationErrors.minSalary = "Min salary is required.";
        }

        if (!formValues.maxSalary) {
            validationErrors.maxSalary = "Max salary is required.";
        }

        if (+formValues.minSalary > +formValues.maxSalary) {
            validationErrors.minSalary = "Min salary should not be more than max salary"
        }

        if (!formValues.location.trim()) {
            validationErrors.location = "Location is required.";
        } else if (formValues.location.length > 200) {
            validationErrors.location = "Location cannot exceed 200 characters.";
        }

        if (!formValues.employmentType.trim()) {
            validationErrors.employmentType = "Employment type is required.";
        }

        if (!formValues.comments.trim()) {
            validationErrors.comments = "Comments is required.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const response = await JobPostRequestService.jobPostRequest(formValues);
            if (response.data.status === "Success") {
                alert("Job post created successful!");
                setFormValues({
                    jobTitle: "",
                    description: "",
                    requirements: "",
                    location: "",
                    minSalary: "",
                    maxSalary: "",
                    employmentType: "",
                    comments: ""
                });
            } else {
                alert("Job post created failed!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred during job post creation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isError) return <div className="text-center py-10">Error loading data.</div>;

    return (
        <div className="mt-10 mb-10 flex items-center justify-center">
            <Box
                component="form"
                onSubmit={handleSubmit}
                className="sm:w-3/4 md:w-3/4 mt-10 mb-10 border rounded shadow-lg p-4"
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="scrollable" value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Add Job Post Request" {...a11yProps(0)} />
                        <Tab label="Job Post Templates" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Typography variant="h5" className="mb-5 font-semibold text-gray-700">
                        Job Post Request Form
                    </Typography>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <TextField
                            label="Job Title"
                            name="jobTitle"
                            value={formValues.jobTitle}
                            onChange={handleInputChange}
                            error={!!errors.jobTitle}
                            helperText={errors.jobTitle}
                            fullWidth
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={formValues.location}
                            onChange={handleInputChange}
                            error={!!errors.location}
                            helperText={errors.location}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={formValues.description}
                            onChange={handleInputChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            fullWidth
                        />
                        <TextField
                            label="Requirements"
                            name="requirements"
                            multiline
                            rows={4}
                            value={formValues.requirements}
                            onChange={handleInputChange}
                            error={!!errors.requirements}
                            helperText={errors.requirements}
                            fullWidth
                        />
                        <TextField
                            label="Min Salary"
                            name="minSalary"
                            type="number"
                            value={formValues.minSalary}
                            onChange={handleInputChange}
                            error={!!errors.minSalary}
                            helperText={errors.minSalary}
                            fullWidth
                        />
                        <TextField
                            label="Max Salary"
                            name="maxSalary"
                            type="number"
                            value={formValues.maxSalary}
                            onChange={handleInputChange}
                            error={!!errors.maxSalary}
                            helperText={errors.maxSalary}
                            fullWidth
                        />
                        <TextField
                            label="Employment Type"
                            name="employmentType"
                            value={formValues.employmentType}
                            onChange={handleInputChange}
                            error={!!errors.employmentType}
                            helperText={errors.employmentType}
                            fullWidth
                        />
                        <TextField
                            label="Comments"
                            name="comments"
                            value={formValues.comments}
                            onChange={handleInputChange}
                            error={!!errors.comments}
                            helperText={errors.comments}
                            fullWidth
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between pt-2 w-full">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            className="mt-6"
                            sx={{ backgroundColor: "#1f2937" }} // Adjust width if necessary
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
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
                    ) : data.data.length === 0 ? (
                        <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{
                                color: "gray",
                                fontSize: { xs: "1rem", sm: "1.25rem" },
                            }}
                        >
                            No Templates found.
                        </Typography>
                    ) : (
                        <>
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
                            <Table sx={{ minWidth: 650, }}>
                                <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                    <TableRow>
                                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Id</TableCell>
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
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.data.map((request) => (
                                        <TableRow
                                            key={request.jobPostTemplateId}
                                            sx={{
                                                "&:hover": { backgroundColor: "#f5f5f5" },
                                            }}
                                        >
                                            <TableCell>{request.jobPostTemplateId}</TableCell>
                                            <TableCell>{request.jobTitle}</TableCell>
                                            <TableCell>{request.location}</TableCell>
                                            <TableCell>{request.minSalary}</TableCell>
                                            <TableCell>{request.maxSalary}</TableCell>
                                            <TableCell>{request.employmentType}</TableCell>
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
                                                            `/job-post-template/${request.jobPostTemplateId}`
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
                    )}
                </CustomTabPanel>
            </Box>
        </div>

    );
};

export default JobPostRequestFormPage;
