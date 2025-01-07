import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, CircularProgress, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"; // For accessing processId if used in routing
import { useSelector } from "react-redux";
import ApplicationJobService from "../services/applicationJob.service";
import InterviewScheduleService from "../services/interviewScheduleService";

const ApplicationDetailPage = () => {
  const { processId } = useParams(); // Assumes `processId` is passed via route params
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [action, setAction] = useState(""); // Selected action
  const [comment, setComment] = useState(""); // Comment field
  const [interviewerCommments, setInterviewerComments] = useState(""); // Interviewer Comments field
  const [submitting, setSubmitting] = useState(false); // Submitting state
  const [modalMenu, setModalMenu] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    action: "Submit",
    interviewTime: "",
    interviewType: "",
    interviewers: "",
    interviewerEmails: "",
    location: "",
    comment: ""
  });
  const [errorForm, setErrorForm] = useState(null);
  // Validate inputs
  const validate = () => {
    let validationErrors = {};

    if (!formValues.interviewTime.trim()) {
      validationErrors.interviewTime = "Interview Time is required.";
    }

    if (!formValues.interviewType.trim()) {
      validationErrors.interviewType = "Interview Type is required.";
    }

    if (!formValues.interviewers.trim()) {
      validationErrors.interviewers = "Interviewers are required.";
    }

    if (!formValues.interviewerEmails.trim()) {
      validationErrors.interviewerEmails = "Interviewer emails are required.";
    }

    if (!formValues.location.trim()) {
      validationErrors.location = "Location is required.";
    } else if (formValues.location.length > 200) {
      validationErrors.location = "Location cannot exceed 200 characters.";
    }

    if (!formValues.comment.trim()) {
      validationErrors.comment = "Comment is required.";
    }

    setErrorForm(validationErrors);
    return validationErrors;
  };

  const handleInputChangeSetInterviewSchedule = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const listErrors = validate(formValues);
    let formValid = true;

    for (let propName in listErrors) {
      if (listErrors[propName].length > 0) {
        formValid = false;
      }
    }

    if (!formValid) {
      return
    }

    setSubmitting(true);
    try {
      formValues.interviewerEmails = formValues.interviewerEmails.split(",");
      formValues.interviewers = formValues.interviewers.split(",");
      formValues.applicationJobId = details.applicationJobId
      const response = await InterviewScheduleService.setInterviewScheduleTime(formValues);
      if (response.data.status === "Success") {
        alert("Interview Schedule Time created successful!");
        setFormValues({
          interviewTime: "",
          interviewType: "",
          interviewers: "",
          interviewerEmails: "",
          location: "",
          comment: ""
        });
      } else {
        alert("Interview Schedule Time created failed!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during interview schedule time creation.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitCompleteInterview = async () => {
    setSubmitting(true);
    try {
      const interviewCompleteRequest = {
        processId: processId,
        interviewerCommments: interviewerCommments,
        comment: comment,
      };

      interviewCompleteRequest.interviewerCommments = interviewerCommments.split(",");
      const response = await InterviewScheduleService.markInterviewAsComplete(interviewCompleteRequest);

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

      let response;

      if (modalMenu === "Confirm Interview Schedule") {
        response = await InterviewScheduleService.confirmInterviewScheduleTime(reviewRequest);
      } else if (modalMenu === "Review Application") {
        response = await ApplicationJobService.reviewApplication(reviewRequest);
      }

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

  const handleEditApplication = () => {
    navigate(`/application-job/${processId}/edit`);
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
            <TableRow>
              <TableCell className="font-bold">Job Title</TableCell>
              <TableCell>{details.jobPostName}</TableCell>
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
          details.currentStep === "Applicant Reviews Interview Schedule" ?
            <Button variant="contained" color="warning" onClick={() => {
              setOpenModal(true)
              setModalMenu("Confirm Interview Schedule")
            }}>
              Interview Confirmation Schedule
            </Button> :
            <Button variant="contained" color="warning" onClick={handleEditApplication}>
              Edit Application
            </Button>
        )}

        {/* Recruiter Actions */}
        {currentUser.roles.includes("Recruiter") && details.requiredRole === "Recruiter" && (
          <Button variant="contained" color="primary" onClick={() => {
            setOpenModal(true)
            setModalMenu("Review Application")
          }}>
            Review Application
          </Button>
        )}

        {/* HR Manager Actions */}
        {currentUser.roles.includes("HR Manager") && details.requiredRole === "HR Manager" && (
          details.currentStep === "Interview Process" ?
            <Button variant="contained" color="secondary" onClick={() => {
              setOpenModal(true)
              setModalMenu("Mark Interview Complete")
            }}>
              Mark Interview As Complete
            </Button> :
            <Button variant="contained" color="secondary" onClick={() => {
              setOpenModal(true)
              setModalMenu("Schedule Interview")
            }}>
              Schedule Interview
            </Button>
        )}
      </Box>

      {/* Review Modal */}
      {/* Button shows Schedule Interview */}
      {modalMenu === "Schedule Interview" &&
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Set Interview Schedule</DialogTitle>
          <DialogContent>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Action</InputLabel>
              <Select
                value={formValues.action}
                name="action"
                onChange={handleInputChangeSetInterviewSchedule}
                required
                label="Action"
              >
                <MenuItem value="Submit">Submit</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Interview Time"
              type="datetime-local"
              rows={4}
              name="interviewTime"
              value={formValues.interviewTime}
              onChange={handleInputChangeSetInterviewSchedule}
              error={errorForm?.interviewTime}
              helperText={errorForm?.interviewTime}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <TextField
              label="Interview Type"
              rows={4}
              name="interviewType"
              value={formValues.interviewType}
              onChange={handleInputChangeSetInterviewSchedule}
              error={errorForm?.interviewType}
              helperText={errorForm?.interviewType}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <TextField
              label="Interviewers"
              multiline
              rows={4}
              name="interviewers"
              value={formValues.interviewers}
              onChange={handleInputChangeSetInterviewSchedule}
              error={errorForm?.interviewers}
              helperText={errorForm?.interviewers}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <TextField
              label="Interviewer Emails"
              multiline
              rows={4}
              name="interviewerEmails"
              value={formValues.interviewerEmails}
              onChange={handleInputChangeSetInterviewSchedule}
              error={errorForm?.interviewerEmails}
              helperText={errorForm?.interviewerEmails}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <TextField
              label="Location"
              rows={4}
              name="location"
              value={formValues.location}
              onChange={handleInputChangeSetInterviewSchedule}
              error={errorForm?.location}
              helperText={errorForm?.location}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              name="comment"
              value={formValues.comment}
              onChange={handleInputChangeSetInterviewSchedule}
              error={errorForm?.comment}
              helperText={errorForm?.comment}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenModal(false)
              setFormValues({
                action: "Submit",
                interviewTime: "",
                interviewType: "",
                interviewers: "",
                interviewerEmails: "",
                location: "",
                comments: ""
              })
              setErrorForm(null)
            }}
              color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Set Schedule Time"}
            </Button>
          </DialogActions>
        </Dialog>
      }

      {/* Button shows Review Application */}
      {modalMenu === "Review Application" &&
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
        </Dialog>}


      {/* Button shows Confirm Interview Schedule*/}
      {modalMenu === "Confirm Interview Schedule" &&
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Interview Schedule Confirmation</DialogTitle>
          <DialogContent>
            <FormControl fullWidth className="mt-4">
              <InputLabel>Action</InputLabel>
              <Select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
              >
                <MenuItem value="Confirm">Confirm</MenuItem>
                <MenuItem value="Request Reschedule">
                  Request Reschedule
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
        </Dialog>}


      {/* Button shows Mark Interview Complete*/}
      {modalMenu === "Mark Interview Complete" &&
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Mark Interview As Complete</DialogTitle>
          <DialogContent>
            <TextField
              label="Interviewer Comments"
              multiline
              rows={4}
              value={interviewerCommments}
              onChange={(e) => setInterviewerComments(e.target.value)}
              fullWidth
              className="mt-4"
            />
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
              onClick={submitCompleteInterview}
              variant="contained"
              color="primary"
              disabled={submitting || !interviewerCommments || !comment}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogActions>
        </Dialog>}
    </div>
  );
};

export default ApplicationDetailPage;
