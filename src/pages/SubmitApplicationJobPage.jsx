import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AxiosInstance from "../services/api";
import ApplicationJobService from "../services/applicationJob.service";

const SubmitApplicationJob = () => {
  const { jobPostId } = useParams();
  const [formData, setFormData] = useState({
    workExperience: "",
    education: "",
    skills: "",
    supportingDocumentsId: "",
  });

  const [filesButton1, setFilesButton1] = useState([]);
  const [filesButton2, setFilesButton2] = useState([]);
  const [documentOptions, setDocumentOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...e.target.files]);
  };

  const handleRemoveFile = (index, setFiles) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.workExperience) newErrors.workExperience = "Work experience is required";
    if (!formData.education) newErrors.education = "Education is required";
    if (!formData.skills) newErrors.skills = "Skills are required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
  
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
  
    [...filesButton1, ...filesButton2].forEach((file) => {
      applicationData.append("SupportingDocuments", file);
    });
  
    try {
      setLoading(true); // Set loading to true
      const response = await AxiosInstance.apiNew.post(
        "/api/ApplicationJob/SubmitApplication",
        applicationData
      );
      alert(response.data.message);
      navigate(`/jobpost/${jobPostId}`); // Redirect to the job post page
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Reset loading to false
    }
  };

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
        Submit Job Application
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="supportingDocumentsId-label">
                {loadingDocuments ? "Loading Documents..." : "Use Existing Resume (Optional)"}
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

          <Grid item xs={12} sm={6}>
            <Button backgroundColor="#1f2937" variant="contained" component="label" fullWidth >
              Upload New Resume (Optional)
              <input
                type="file"
                multiple
                hidden
                onChange={(e) => handleFileChange(e, setFilesButton1)}
              />
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Additional Documents (Optional)
              <input
                type="file"
                multiple
                hidden
                onChange={(e) => handleFileChange(e, setFilesButton2)}
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            {filesButton1.map((file, index) => (
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
                  onClick={() => handleRemoveFile(index, setFilesButton1)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            {filesButton2.map((file, index) => (
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
                  onClick={() => handleRemoveFile(index, setFilesButton2)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <div className="flex flex-col gap-2 items-center justify-center">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, width: "80%", backgroundColor: "#1f2937" }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
            </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SubmitApplicationJob;
