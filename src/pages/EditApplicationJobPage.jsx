import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import ApplicationJobService from "../services/applicationJob.service";
import AxiosInstance from "../services/api";
import { toast } from "react-toastify";

const EditApplicationJobPage = () => {
  const { processId, applicationJobId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    workExperience: "",
    education: "",
    skills: "",
    comments: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);

  // Fetch existing application job details
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setIsLoading(true);
        const response = await ApplicationJobService.getApplicationDetails(processId);
        const data = response.data;
        setFormValues({
          workExperience: data.workExperience || "",
          education: data.education || "",
          skills: data.skills || "",
          comments: "",
        });
        setExistingDocuments(data.supportingDocuments || []);
      } catch (error) {
        toast.error("Error fetching documents. Please try again.");
        console.error("Error fetching application details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [processId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    setSupportingDocuments([...supportingDocuments, ...e.target.files]);
  };

  // Remove file from uploads
  const handleRemoveFile = (index) => {
    setSupportingDocuments(supportingDocuments.filter((_, i) => i !== index));
  };

  // Form validation
  const validate = () => {
    const validationErrors = {};
    if (!formValues.workExperience.trim()) {
      validationErrors.workExperience = "Work experience is required.";
    }
    if (!formValues.education.trim()) {
      validationErrors.education = "Education is required.";
    }
    if (!formValues.skills.trim()) {
      validationErrors.skills = "Skills are required.";
    }
    if (!formValues.comments.trim()) {
      validationErrors.comments = "Comments are required.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("processId", processId);
    formData.append("workExperience", formValues.workExperience);
    formData.append("education", formValues.education);
    formData.append("skills", formValues.skills);
    formData.append("comments", formValues.comments);

    // Append files to FormData
    supportingDocuments.forEach((file) => {
      formData.append("supportingDocuments", file);
    });

    try {
      const response = await AxiosInstance.apiNew.put("/api/ApplicationJob/Update", formData);
      if (response.data.status === "Success") {
        toast.success(response.data.message || "Application updated successfully!");
        setSupportingDocuments([]);
      } else {
        toast.error(response?.data?.message || "An error occurred while submitting the application.");
      }
    } catch (error) {
      console.error("Error updating application job:", error);
      toast.error("An error occurred while updating the application job.");
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

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        padding: { xs: 2, sm: 4 },
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        color="primary"
      >
        Edit Job Application
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Work Experience */}
          <Grid item xs={12}>
            <TextField
              label="Work Experience"
              name="workExperience"
              value={formValues.workExperience}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              error={!!errors.workExperience}
              helperText={errors.workExperience}
            />
          </Grid>

          {/* Education */}
          <Grid item xs={12}>
            <TextField
              label="Education"
              name="education"
              value={formValues.education}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.education}
              helperText={errors.education}
            />
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <TextField
              label="Skills"
              name="skills"
              value={formValues.skills}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              error={!!errors.skills}
              helperText={errors.skills}
            />
          </Grid>

          {/* Comments */}
          <Grid item xs={12}>
            <TextField
              label="Comments"
              name="comments"
              value={formValues.comments}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              error={!!errors.comments}
              helperText={errors.comments}
            />
          </Grid>

          {/* File Upload */}
          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload New Documents
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>

          {/* Uploaded Files */}
          <Grid item xs={12}>
            {supportingDocuments.map((file, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>{file.name}</Typography>
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={() => handleRemoveFile(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Grid>

          {/* Existing Documents */}
          <Grid item xs={12}>
            {existingDocuments.length > 0 && (
              <>
                <Typography variant="h6">Existing Documents</Typography>
                <ul>
                  {existingDocuments.map((doc, index) => (
                    <li key={index}>{doc.documentName}</li>
                  ))}
                </ul>
              </>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#1f2937",
                py: 1.5,
                "&:hover": { backgroundColor: "#3b3f47" },
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Update Application"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditApplicationJobPage;
