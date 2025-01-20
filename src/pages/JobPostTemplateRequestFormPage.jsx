import React, { useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import JobPostTemplateRequestService from "../services/jobPostTemplateRequestService";
import { useForm } from "react-hook-form";

const JobPostTemplateRequestFormPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset
    } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form submission
    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await JobPostTemplateRequestService.jobPostTemplateRequest(data);
            if (response.data.status === "Success") {
                alert("Job post template request created successful!");
                reset();
            } else {
                alert("Job post template request created failed!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred during job post creation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Typography variant="h6"
                sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    textAlign: 'center',
                    marginTop: 8
                }}>
                Job Post Request Template Form
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

export default JobPostTemplateRequestFormPage;
