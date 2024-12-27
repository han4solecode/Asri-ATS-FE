import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, CircularProgress, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box } from "@mui/material";
import { useParams } from "react-router-dom"; // For accessing processId if used in routing
import { useSelector } from "react-redux";
import ApplicationJobService from "../services/applicationJob.service";

const ApplicationDetailPage = () => {
  const { processId } = useParams(); // Assumes `processId` is passed via route params
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [action, setAction] = useState(""); // Selected action
  const [comment, setComment] = useState(""); // Comment field
  const [submitting, setSubmitting] = useState(false); // Submitting state
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await ApplicationJobService.getApplicationDetails(processId);
        setDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load application details. Please try again.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [processId]);

  const handleReviewSubmit = async () => {
    setSubmitting(true);
    try {
      const reviewRequest = {
        processId: processId,
        action: action,
        comment: comment,
      };

      const response = await ApplicationJobService.reviewApplication(reviewRequest);
      if (response.data.status === "Success") {
        alert("Review submitted successfully.");
        setOpenModal(false);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleInterview = () => {
    alert("Schedule interview functionality coming soon!");
  };

  const handleEditApplication = () => {
    alert("Redirect to Edit Application form.");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <Typography variant="h4" className="text-center font-bold">
        Application Details
      </Typography>

      {/* Personal Information Section */}
      <TableContainer component={Paper} className="shadow-md">
        <Typography variant="h6" className="font-bold p-4">
          Personal Information
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell>{details.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell>{details.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Phone Number</TableCell>
              <TableCell>{details.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Address</TableCell>
              <TableCell>{details.address}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Work and Education Section */}
      <TableContainer component={Paper} className="shadow-md">
        <Typography variant="h6" className="font-bold p-4">
          Work and Education
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">Work Experience</TableCell>
              <TableCell>{details.workExperience}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Education</TableCell>
              <TableCell>{details.education}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Skills</TableCell>
              <TableCell>{details.skills}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Workflow Actions Section */}
      <TableContainer component={Paper} className="shadow-md">
        <Typography variant="h6" className="font-bold p-4">
          Workflow Actions
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">Action Date</TableCell>
              <TableCell className="font-bold">Action By</TableCell>
              <TableCell className="font-bold">Action</TableCell>
              <TableCell className="font-bold">Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.workflowActions.map((action, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(action.actionDate).toLocaleString()}</TableCell>
                <TableCell>{action.actionBy}</TableCell>
                <TableCell>{action.action}</TableCell>
                <TableCell>{action.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Supporting Documents Section */}
      <TableContainer component={Paper} className="shadow-md">
        <Typography variant="h6" className="font-bold p-4">
          Supporting Documents
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">Document Name</TableCell>
              <TableCell className="font-bold">File Path</TableCell>
              <TableCell className="font-bold">Uploaded Date</TableCell>
              <TableCell className="font-bold">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.supportingDocuments.map((doc) => (
              <TableRow key={doc.supportingDocumentsId}>
                <TableCell>{doc.documentName}</TableCell>
                <TableCell>
                  <a
                    href={doc.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Document
                  </a>
                </TableCell>
                <TableCell>{new Date(doc.uploadedDate).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => window.open(doc.filePath, "_blank")}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Role-Based Buttons */}
      <Box className="flex justify-end space-x-4">
      {/* Applicant Actions */}
      {currentUser.roles.includes("Applicant") && details.requiredRole === "Applicant" && (
        <Button variant="contained" color="primary" onClick={handleEditApplication}>
          Edit Application
        </Button>
      )}

      {/* Recruiter Actions */}
      {currentUser.roles.includes("Recruiter") && details.requiredRole === "Recruiter" && (
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Review Application
        </Button>
      )}

      {/* HR Manager Actions */}
      {currentUser.roles.includes("HR Manager") && details.requiredRole === "HR Manager" && (
        <Button variant="contained" color="secondary" onClick={handleScheduleInterview}>
          Schedule Interview
        </Button>
      )}
    </Box>

      {/* Review Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Review Application</DialogTitle>
        <DialogContent>
          <FormControl fullWidth className="mt-4">
            <InputLabel>Action</InputLabel>
            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              required
            >
              <MenuItem value="Shortlisted">Shortlisted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Request Additional Information">
                Request Additional Information
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Comments"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            className="mt-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color="primary"
            disabled={submitting || !action || !comment}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicationDetailPage;
