import React, { useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import JobPostRequestService from "../services/jobPostRequestService";

const JobPostRequestFormPage = () => {
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

        if(+formValues.minSalary > +formValues.maxSalary) {
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

    return (
        <div className="mt-10 mb-10 flex items-center justify-center">
             <Box
            component="form"
            onSubmit={handleSubmit}
            className="sm:w-3/4 md:w-3/4 mt-10 mb-10 border rounded shadow-lg p-4"
        >
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
                    label="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    fullWidth
                />
                <TextField
                    label="Requirements"
                    name="requirements"
                    value={formValues.requirements}
                    onChange={handleInputChange}
                    error={!!errors.requirements}
                    helperText={errors.requirements}
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
            <div className="flex flex-col gap-2 items-center justify-center pt-2">

                <Button
                    type="submit"
                    variant="contained"
                    className="w-full mt-6"
                    sx={{ width: "80%", backgroundColor: "#1f2937" }}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </Box>


        </div>
       
    );
};

export default JobPostRequestFormPage;
