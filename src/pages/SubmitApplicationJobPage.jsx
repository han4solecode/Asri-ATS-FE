import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  TextareaAutosize,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import AxiosInstance from "../services/api";
import ApplicationJobService from "../services/applicationJob.service";

const SubmitApplicationJob = () => {
  const {jobPostId} = useParams();
  const [formData, setFormData] = useState({
    workExperience: "",
    education: "",
    skills: "",
    supportingDocumentsId: "",
  });

  const [files, setFiles] = useState([]);
  const [documentOptions, setDocumentOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const navigate = useNavigate();

  // Fetch existing documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoadingDocuments(true);
        const response = await ApplicationJobService.getDocument();
        if (response.data && response.data.documents) {
          setDocumentOptions(response.data.documents);
        } else {
          setDocumentOptions([]);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocumentOptions([]);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.workExperience) newErrors.workExperience = "Work experience is required";
    if (!formData.education) newErrors.education = "Education is required";
    if (!formData.skills) newErrors.skills = "Skills are required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const applicationData = new FormData();
    applicationData.append("jobPostId", jobPostId);
    applicationData.append("workExperience", formData.workExperience);
    applicationData.append("education", formData.education);
    applicationData.append("skills", formData.skills);

    if (formData.supportingDocumentsId) {
      applicationData.append("supportingDocumentsId", formData.supportingDocumentsId);
    }

    files.forEach((file) => {
      applicationData.append("SupportingDocuments", file);
    });

    try {
      setLoading(true);
      const response = await AxiosInstance.apiNew.post(
        "/api/ApplicationJob/SubmitApplication",
        applicationData
      );
      alert(response.data.message);
      navigate("/jobpost/:jobPostId"); // Redirect to a specific page after submission
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Submit Job Application
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Work Experience */}
          <Grid item xs={12}>
            <TextField
              label="Work Experience"
              name="workExperience"
              value={formData.workExperience}
              onChange={handleChange}
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
              value={formData.education}
              onChange={handleChange}
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
              value={formData.skills}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              error={!!errors.skills}
              helperText={errors.skills}
            />
          </Grid>

          {/* Use Existing Document Dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="supportingDocumentsId-label">
                {loadingDocuments ? "Loading Documents..." : "Use Existing Document"}
              </InputLabel>
              <Select
                labelId="supportingDocumentsId-label"
                name="supportingDocumentsId"
                value={formData.supportingDocumentsId}
                onChange={handleChange}
                disabled={loadingDocuments}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {documentOptions.map((doc) => (
                  <MenuItem key={doc.documentId} value={doc.documentId}>
                    {doc.documentName} 
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Upload New Files */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Supporting Documents
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>

          {/* Show Uploaded Files */}
          {files.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Uploaded Documents:
              </Typography>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SubmitApplicationJob;
