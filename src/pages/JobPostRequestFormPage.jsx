import React, { useEffect, useRef, useState } from "react";
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
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";

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

const JobPostRequestFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state?.formData || {};
    const formDataSet = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setTabValue] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const pageSizes = [5, 10, 15, 20];
    const [searchQuery, setSearchQuery] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        reset
    } = useForm();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['jobPostTemplates', page, pageSize, searchQuery, value],
        queryFn: () => fetchJobPostTemplates({ page, pageSize, searchQuery, value }),
        keepPreviousData: true,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (formData && !formDataSet.current) {
            Object.keys(formData).forEach((key) => {
                // Set value for each form field
                setValue(key, formData[key]);
            });
            formDataSet.current = true; // Tandai bahwa formData sudah di-set
        }
    }, [formData, setValue]);

    const fetchJobPostTemplates = async ({ page, pageSize, searchQuery, value }) => {
        if (value === 0) {
            return {
                data: []
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
        setTabValue(newValue);
    };

    const handlePageClick = ({ selected }) => {
        setPage(selected + 1);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    // Handle form submission
    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await JobPostRequestService.jobPostRequest(data);
            if (response.data.status === "Success") {
                alert("Job post created successful!");
                reset();
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
        <>
            <Typography variant="h6"
                sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    textAlign: 'center',
                    marginTop: 8
                }}>
                Job Post Request Form
            </Typography>
            <div className="mt-5 mb-10 flex items-center justify-center">
                <Box
                    component="form"
                    onSubmit={handleSubmit((data) => {
                        handleFormSubmit(data);
                    })}
                    className="sm:w-3/4 md:w-3/4 mt-10 mb-10 border rounded shadow-lg p-4"
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs variant="scrollable" value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Add Job Post Request" {...a11yProps(0)} />
                            <Tab label="Job Post Templates" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <TextField
                                label="Job Title"
                                name="jobTitle"
                                {...register("jobTitle", {
                                    required: "Job Title is required",
                                    maxLength: {
                                        value: 50,
                                        message: "Job Title cannot exceed 50 characters"
                                    }
                                })}
                                error={!!errors.jobTitle}
                                helperText={errors.jobTitle?.message}
                                fullWidth
                            />
                            <TextField
                                label="Location"
                                name="location"
                                {...register("location", {
                                    required: "Location is required",
                                    maxLength: {
                                        value: 200,
                                        message: "Location cannot exceed 200 characters"
                                    }
                                })}
                                error={!!errors.location}
                                helperText={errors.location?.message}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                {...register("description", {
                                    required: "Description is required"
                                })}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                fullWidth
                            />
                            <TextField
                                label="Requirements"
                                name="requirements"
                                multiline
                                rows={4}
                                {...register("requirements", {
                                    required: "Requirements is required."
                                })}
                                error={!!errors.requirements}
                                helperText={errors.requirements?.message}
                                fullWidth
                            />
                            <TextField
                                label="Min Salary"
                                name="minSalary"
                                type="number"
                                {...register("minSalary", {
                                    required: "Min salary is required",
                                    validate: {
                                        isValidDate: (value) => {
                                            const minSalary = +value;
                                            const maxSalary = +getValues("maxSalary");
                                            return minSalary < maxSalary || "Min salary should not be more than max salary";
                                        }
                                    }
                                })}
                                error={!!errors.minSalary}
                                helperText={errors.minSalary?.message}
                                fullWidth
                            />
                            <TextField
                                label="Max Salary"
                                name="maxSalary"
                                type="number"
                                {...register("maxSalary", {
                                    required: "Max salary is required"
                                })}
                                error={!!errors.maxSalary}
                                helperText={errors.maxSalary?.message}
                                fullWidth
                            />
                            <TextField
                                label="Employment Type"
                                name="employmentType"
                                {...register("employmentType", {
                                    required: "Employment type is required"
                                })}
                                error={!!errors.employmentType}
                                helperText={errors.employmentType?.message}
                                fullWidth
                            />
                            <TextField
                                label="Comments"
                                name="comments"
                                {...register("comments", {
                                    required: " Comments is required"
                                })}
                                error={!!errors.comments}
                                helperText={errors.comments?.message}
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
                                                            const encodedId = encodeProcessId(request.jobPostTemplateId);
                                                            if (encodedId) {
                                                                navigate(`/job-post-template/${encodedId}`);
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

                            </>
                        )}
                    </CustomTabPanel>
                </Box>
            </div>
        </>


    );
};

export default JobPostRequestFormPage;
