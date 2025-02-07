import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"; // For accessing processId if used in routing
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import ApplicationJobService from "../services/applicationJob.service";
import InterviewScheduleService from "../services/interviewScheduleService";
import { toast } from "react-toastify";

const SECRET_KEY = "your-secure-key";

const decodeProcessId = (encryptedId) => {
  try {
    const decoded = decodeURIComponent(encryptedId); // Decode the URL-safe string
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalId) throw new Error("Decryption failed or returned empty string");
    return originalId;
  } catch (error) {
    console.error("Error decoding process ID:", error);
    return null;
  }
};


const ApplicationDetailPage = () => {
  const { processId: encryptedProcessId } = useParams();
  const processId = decodeProcessId(encryptedProcessId);
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [action, setAction] = useState(""); // Selected action
  const [comment, setComment] = useState(""); // Comment field
  const [interviewerCommments, setInterviewerComments] = useState([""]); // Interviewer Comments field
  const [submitting, setSubmitting] = useState(false); // Submitting state
  const [modalMenu, setModalMenu] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    action: "Submit",
    interviewTime: "",
    interviewType: "",
    interviewers: [""],
    interviewerEmails: [""],
    location: "",
    comment: "",
  });
  const [errorForm, setErrorForm] = useState(null);

  // Add Interviewers 
  const handleAddInterviewers = () => {
    setFormValues({
      ...formValues,
      interviewers: [
        ...formValues.interviewers,
        ""
      ],
    });
  };

  // Remove interviewers
  const handleRemoveInterviewers = (index) => {
    const updatedInterviewers = [...formValues.interviewers];
    updatedInterviewers.splice(index, 1);
    setFormValues({ ...formValues, interviewers: updatedInterviewers });
  };

  // Handle change input data interviewers
  const handleInterviewerChange = (index, value) => {
    const updatedInterviewers = [...formValues.interviewers];
    updatedInterviewers[index] = value;
    setFormValues({ ...formValues, interviewers: updatedInterviewers });
  };

  // Add Interviewer Emails 
  const handleAddInterviewerEmails = () => {
    setFormValues({
      ...formValues,
      interviewerEmails: [
        ...formValues.interviewerEmails,
        ""
      ],
    });
  };

  // Remove interviewers
  const handleRemoveInterviewerEmails = (index) => {
    const updatedInterviewerEmails = [...formValues.interviewerEmails];
    updatedInterviewerEmails.splice(index, 1);
    setFormValues({ ...formValues, interviewerEmails: updatedInterviewerEmails });
  };

  // Handle change input data interviewerEmails
  const handleInterviewerEmailsChange = (index, value) => {
    const updatedInterviewerEmails = [...formValues.interviewerEmails];
    updatedInterviewerEmails[index] = value;
    setFormValues({ ...formValues, interviewerEmails: updatedInterviewerEmails });
  };

    // Add Interviewer Comments 
    const handleAddInterviewerComments = () => {
      setInterviewerComments([...interviewerCommments,""]);
    };
  
    // Remove interviewer comments
    const handleRemoveInterviewerComments = (index) => {
      const updatedInterviewerComments = [...interviewerCommments];
      updatedInterviewerComments.splice(index, 1);
      setInterviewerComments(updatedInterviewerComments);
    };
  
    // Handle change input data interviewer comments
    const handleInterviewerCommentsChange = (index, value) => {
      const updatedInterviewerComments = [...interviewerCommments];
      updatedInterviewerComments[index] = value;
      setInterviewerComments(updatedInterviewerComments);
    };
  // Validate inputs
  const validate = () => {
    let validationErrors = {};

    if (!formValues.interviewTime.trim()) {
      validationErrors.interviewTime = "Interview Time is required.";
    }

    if (!formValues.interviewType.trim()) {
      validationErrors.interviewType = "Interview Type is required.";
    }

    if (!formValues.interviewers.length === 0) {
      validationErrors.interviewers = "Interviewers are required.";
    }

    if (!formValues.interviewerEmails.length === 0) {
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

  // Handle interview schedule submission
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
      return;
    }

    setSubmitting(true);
    try {
      let response;
      // convert time input to utc time
      const utcDateTime = new Date(formValues.interviewTime).toISOString();
      if(modalMenu === "Update Interview Schedule") {
        const updatedInterviewData = {
          processId: processId,
          interviewTime: utcDateTime,
          comment: formValues.comment,
        };

        response = await InterviewScheduleService.updateInterviewScheduleTime(updatedInterviewData);
      }
      else if (modalMenu === "Schedule Interview") {
        formValues.applicationJobId = details.applicationJobId;
        formValues.interviewTime = utcDateTime;
        response = await InterviewScheduleService.setInterviewScheduleTime(formValues);
      }
      
      if (response.data.status === "Success") {
        toast.success("Interview Schedule Time created successful!");
        setOpenModal(false);
        setFormValues({
          interviewTime: "",
          interviewType: "",
          interviewers: [""],
          interviewerEmails: [""],
          location: "",
          comment: "",
        });
      } else {
        toast.error("Interview Schedule Time created failed!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during interview schedule time creation.");
    } finally {
      setSubmitting(false);
    }
  };
  

  const submitCompleteInterview = async () => {
    setSubmitting(true);
    try {
      const interviewCompleteRequest = {
        processId: processId,
        interviewersComments: interviewerCommments,
        comment: comment,
      };
      const response = await InterviewScheduleService.markInterviewAsComplete(
        interviewCompleteRequest
      );

      if (response.data.status === "Success") {
        toast.success("Review submitted successfully.");
        setOpenModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await ApplicationJobService.getApplicationDetails(
          processId
        );
        setDetails(response.data);

        if (response.data.currentStep === "HR Manager Updates Interview Schedule") {
          const interviewSchedule = await InterviewScheduleService.getInterviewDetail(processId);
          const dateWithTimezone = new Date(interviewSchedule.data.interviewTime);
          // Format waktu ke string dengan format 'YYYY-MM-DDTHH:mm'
          const adjustedTime = new Date(dateWithTimezone.getTime() - (dateWithTimezone.getTimezoneOffset() * 60000));
          const formattedTime = adjustedTime.toISOString().slice(0, 16);       // Ganti.slice(0, 19);
          setFormValues({
            action: "Update",
            interviewTime: formattedTime,
            interviewType: interviewSchedule.data.interviewType,
            interviewers: interviewSchedule.data.interviewers,
            interviewerEmails: interviewSchedule.data.interviewerEmails,
            location: interviewSchedule.data.location,
            comment: "",
          });
        }

        if (response.data.currentStep === "Applicant Reviews Interview Schedule") {
          const interviewSchedule = await InterviewScheduleService.getInterviewDetail(processId);
          const dateWithTimezone = new Date(interviewSchedule.data.interviewTime);
          // Format waktu ke string dengan format 'YYYY-MM-DDTHH:mm'
          const adjustedTime = new Date(dateWithTimezone.getTime() - (dateWithTimezone.getTimezoneOffset() * 60000));
          const formattedTime = adjustedTime.toISOString().slice(0, 16);       // Ganti.slice(0, 19);
          setFormValues({
            interviewTime: formattedTime,
            location: interviewSchedule.data.location,
            interviewType: interviewSchedule.data.interviewType,
          });
        }

        if (response.data.currentStep === "Interview Process") {
          const interviewSchedule = await InterviewScheduleService.getInterviewDetail(processId);
          const dateWithTimezone = new Date(interviewSchedule.data.interviewTime);
          // Format waktu ke string dengan format 'YYYY-MM-DDTHH:mm'
          const adjustedTime = new Date(dateWithTimezone.getTime() - (dateWithTimezone.getTimezoneOffset() * 60000));
          const formattedTime = adjustedTime.toISOString().slice(0, 16);       // Ganti.slice(0, 19);
          setFormValues({
            interviewers: interviewSchedule.data.interviewers,
            interviewTime: formattedTime,
            location: interviewSchedule.data.location,
            interviewType: interviewSchedule.data.interviewType,
          });
        }
        
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
        response = await InterviewScheduleService.confirmInterviewScheduleTime(
          reviewRequest
        );
      } else if (modalMenu === "Review Application") {
        response = await ApplicationJobService.reviewApplication(reviewRequest);
      } else {
        response = await InterviewScheduleService.reviewInterviewResult(
          reviewRequest
        );
      }

      if (response.data.status === "Success") {
        toast.success("Review submitted successfully.");
        setOpenModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to submit review. Please try again.");
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
                <TableCell>
                  {new Date(action.actionDate).toLocaleString()}
                </TableCell>
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
                <TableCell>
                  {new Date(doc.uploadedDate).toLocaleString()}
                </TableCell>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 3 }}>
      <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Back
      </Button>
      {/* Role-Based Buttons */}
      <Box className="flex justify-end space-x-4">
        {/* Applicant Actions */}
        {currentUser.roles.includes("Applicant") &&
          details.requiredRole === "Applicant" &&
          (details.currentStep === "Applicant Reviews Interview Schedule" ? (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setOpenModal(true);
                setModalMenu("Confirm Interview Schedule");
              }}
            >
              Interview Confirmation Schedule
            </Button>
          ) : (
            <Button
              variant="contained"
              color="warning"
              onClick={handleEditApplication}
            >
              Edit Application
            </Button>
          ))}

        {/* Recruiter Actions */}
        {currentUser.roles.includes("Recruiter") &&
          details.requiredRole === "Recruiter" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenModal(true);
                setModalMenu("Review Application");
              }}
            >
              Review Application
            </Button>
          )}

        {/* HR Manager Actions */}
        {currentUser.roles.includes("HR Manager") &&
          details.requiredRole === "HR Manager" &&
          (details.currentStep === "Interview Process" ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenModal(true);
                setModalMenu("Mark Interview Complete");
              }}
            >
              Mark Interview As Complete
            </Button>
          ) : details.currentStep === "HR Manager Set Interview Schedule"  ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenModal(true);
                setModalMenu("Schedule Interview");
              }}
            >
              Schedule Interview
            </Button>
          ) : details.currentStep === "HR Manager Updates Interview Schedule" ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenModal(true);
                setModalMenu("Update Interview Schedule");
              }}
            >
              Update Interview Schedule
            </Button>) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenModal(true);
                setModalMenu("Review Interview Result");
              }}
            >
              Review Interview Result
            </Button>
          ))}
      </Box>
      </Box>

      {/* Review Modal */}
      {/* Button shows Schedule Interview */}
      {modalMenu === "Schedule Interview" && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="sm"
        >
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
            {formValues.interviewers.map((interviewer, index) => (
              <>
                <TextField
                  key={index}
                  label="Interviewers"
                  name="interviewers"
                  value={interviewer}
                  onChange={(e) => handleInterviewerChange(index, e.target.value)}
                  // error={errorForm?.interviewers}
                  // helperText={errorForm?.interviewers}
                  fullWidth
                  className="mt-4"
                  sx={{ marginTop: 2 }}
                  InputLabelProps={{
                    shrink: true, // Memastikan label selalu berada di atas
                  }}
                  placeholder="Example: John Doe"
                />
                <Button
                  onClick={handleAddInterviewers}
                  color="secondary"
                >
                  Add Interviewer
                </Button>
                {index === 0 ? '' : <Button
                  onClick={()=>{handleRemoveInterviewers(index)}}
                  color="secondary"
                >
                  Remove Interviewer
                </Button>}
              </>
            )
            )}

            {formValues.interviewerEmails.map((interviewerEmail, index) => (
              <>
                <TextField
                  key={index}
                  label="Interviewer Emails"
                  name="interviewerEmails"
                  value={interviewerEmail}
                  onChange={(e) => handleInterviewerEmailsChange(index, e.target.value)}
                  // error={errorForm?.interviewers}
                  // helperText={errorForm?.interviewers}
                  fullWidth
                  className="mt-4"
                  sx={{ marginTop: 2 }}
                  InputLabelProps={{
                    shrink: true, // Memastikan label selalu berada di atas
                  }}
                  placeholder="Example: John Doe@gmail.com"
                />
                <Button
                  onClick={handleAddInterviewerEmails}
                  color="secondary"
                >
                  Add Interviewer Email
                </Button>
                {index === 0 ? '' : <Button
                  onClick={()=>{handleRemoveInterviewerEmails(index)}}
                  color="secondary"
                >
                  Remove Interviewer Email
                </Button>}
              </>
            )
            )}
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
            <Button
              onClick={() => {
                setOpenModal(false);
                setErrorForm(null);
              }}
              color="secondary"
            >
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
      )}

      {modalMenu === "Update Interview Schedule" && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Update Interview Schedule</DialogTitle>
          <DialogContent>
            <FormControl disabled fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Action</InputLabel>
              <Select
                value={formValues.action}
                name="action"
                onChange={handleInputChangeSetInterviewSchedule}
                required
                label="Action"
              >
                <MenuItem value="Update">Update</MenuItem>
              </Select>
            </FormControl>
            <TextField
              disabled
              label="Interview Type"
              rows={4}
              name="interviewType"
              value={formValues.interviewType}
              error={errorForm?.interviewType}
              helperText={errorForm?.interviewType}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <>
              <TextField
                disabled
                label="Interviewers"
                name="interviewers"
                value={formValues.interviewers.join(", ")}
                multiline
                rows={4}
                fullWidth
                className="mt-4"
                sx={{ marginTop: 2 }}
                InputLabelProps={{
                  shrink: true, // Memastikan label selalu berada di atas
                }}
              />
            </>

            <>
              <TextField
                disabled
                label="Interviewer Emails"
                name="interviewerEmails"
                value={formValues.interviewerEmails.join(", ")}
                multiline
                rows={4}
                fullWidth
                className="mt-4"
                sx={{
                  marginTop: 2,
                }}
                InputLabelProps={{
                  shrink: true, // Memastikan label selalu berada di atas
                }}
              />
            </>
            <TextField
              disabled
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
            <Button
              onClick={() => {
                setOpenModal(false);
                setErrorForm(null);
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={submitting}
            >
            {submitting ? "Submitting..." : "Update Set Schedule Time"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Button shows Review Application */}
      {modalMenu === "Review Application" && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="sm"
        >
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
      )}

      {/* Button shows Confirm Interview Schedule*/}
      {modalMenu === "Confirm Interview Schedule" && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Interview Schedule Confirmation</DialogTitle>
          <DialogContent>
          <TextField
              disabled
              label="Interview Time"
              type="datetime-local"
              name="interviewTime"
              value={formValues.interviewTime}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <TextField
              disabled
              label="Location"
              name="location"
              value={formValues.location}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <TextField
              disabled
              label="Interview Type"
              rows={4}
              name="interviewType"
              value={formValues.interviewType}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <FormControl variant="outlined" sx={{ mt: 2 }} fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
                label="Actio"
              >
                <MenuItem value="Confirm">Confirm</MenuItem>
                <MenuItem value="Modification">Request Reschedule</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Comments"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
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
      )}

      {/* Button shows Mark Interview Complete*/}
      {modalMenu === "Mark Interview Complete" && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Mark Interview As Complete</DialogTitle>
          <DialogContent>
          <TextField
              disabled
              label="Interview Time"
              name="interviewTime"
              value={formValues.interviewTime}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
          <TextField
              disabled
              label="Interview Type"
              name="interviewType"
              value={formValues.interviewType}
              error={errorForm?.interviewType}
              helperText={errorForm?.interviewType}
              fullWidth
              className="mt-4"
              sx={{ marginTop: 2 }}
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <>
              <TextField
                disabled
                label="Interviewers"
                name="interviewers"
                value={formValues.interviewers.join(", ")}
                multiline
                rows={4}
                fullWidth
                className="mt-4"
                sx={{ marginTop: 2 }}
                InputLabelProps={{
                  shrink: true, // Memastikan label selalu berada di atas
                }}
              />
            </>
            {interviewerCommments.map((interviewerComment, index) => (
              <>
                <TextField
                  key={index}
                  label="Interviewer Comments"
                  name="interviewerComments"
                  value={interviewerComment}
                  onChange={(e) => handleInterviewerCommentsChange(index, e.target.value)}
                  // error={errorForm?.interviewers}
                  // helperText={errorForm?.interviewers}
                  fullWidth
                  className="mt-4"
                  sx={{ marginTop: 2 }}
                  InputLabelProps={{
                    shrink: true, // Memastikan label selalu berada di atas
                  }}
                  placeholder="Example: good candidate,I approve"
                />
                <Button
                  onClick={handleAddInterviewerComments}
                  color="secondary"
                >
                  Add Interviewer Comments
                </Button>
                {index === 0 ? '' : <Button
                  onClick={()=>{handleRemoveInterviewerComments(index)}}
                  color="secondary"
                >
                  Remove Interviewer Comments
                </Button>}
              </>
            )
            )}
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
        </Dialog>
      )}

      {/* Review Interview Result Modal */}
      {modalMenu === "Review Interview Result" && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Review Interview Result</DialogTitle>
          <DialogContent>
            <FormControl fullWidth className="mt-4">
              <InputLabel>Action</InputLabel>
              <Select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
              >
                <MenuItem value="Offer">Offer</MenuItem>
                <MenuItem value="Rejected">Reject</MenuItem>
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
      )}
    </div>
  );
};

export default ApplicationDetailPage;
