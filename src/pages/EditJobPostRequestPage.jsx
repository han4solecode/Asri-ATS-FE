import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import JobPostRequestService from "../services/jobPostRequestService";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

const EditJobPostRequestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);
    const [requestDetails, setRequestDetails] = useState(null);
    const [isError, setIsError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue,
    } = useForm();

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

    // Fetch job post request details
    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                setisLoading(true);
                const response = await JobPostRequestService.details(id);
                setRequestDetails(response.data); // Set request details from API
            } catch (error) {
                console.error("Error fetching request details:", error);
                setIsError(true);
            } finally {
                setisLoading(false);
            }
        };

        fetchRequestDetails();
    }, [id]);

    useEffect(() => {
        if (requestDetails) {
            Object.keys(requestDetails).forEach((key) => {
                if (key === "comments") {
                    setValue("comments", "");
                } else {
                    setValue(key, requestDetails[key]); // Atur nilai lainnya
                }
            });
        }
    }, [requestDetails, setValue]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form submission
    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            let editedJobPostRequest = { ...data, processId: +id }
            const response = await JobPostRequestService.updateJobPostRequest(editedJobPostRequest);
            if (response.data.status === "Success") {
                toast.success("Job post edited successful!");
                reset();
                const encodedId = encodeProcessId(data.processId);
                if (encodedId) {
                    navigate(`/job-post-request/${encodedId}`);
                } else {
                    console.error("Failed to encode process ID, navigation aborted.");
                }
            } else {
                toast.error("Job post edited failed!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            console.log(error)
            toast.error("An error occurred during job post editing.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <CircularProgress />
            </div>
        );
    }

    if (isError) {
        return <div className="text-center py-10">Error loading job post request data.</div>;
    }

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
                </Box>
            </div>
        </>
    );
};

export default EditJobPostRequestPage;
