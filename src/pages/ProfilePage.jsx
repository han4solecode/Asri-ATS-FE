import React, { useState } from "react";
import { Button, CircularProgress, Divider, Typography, Modal, Box, TextField, IconButton } from "@mui/material";
import UserService from "../services/userService";
import { useQuery } from "@tanstack/react-query";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "../services/auth.service";

const ProfilePage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fetchUserProfile = async () => {
    const response = await UserService.details();
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(),
  });
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    setIsChangingPassword(true);
  
    try {
      const response = await AuthService.changePassword({ newPassword });
  
      // Check response status and handle cases where data is a plain string
      if (response.status === 200 && typeof response.data === "string" && response.data.includes("successfully")) {
        alert(response.data); // Display the success message from the API
        setOpenModal(false); // Close the modal
      } else {
        // Display API-specific failure message, if available
        alert(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error during password change:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsChangingPassword(false);
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
    return <div className="text-center py-10">Error loading profile.</div>;
  }

  const {
    userId,
    userName,
    email,
    phoneNumber,
    firstName,
    lastName,
    address,
    dob,
    sex,
    roles,
    companyName
  } = data;

  return (
    <>
      <div className="flex items-center justify-center my-6 mx-6 md:mx-0">
        <div className="w-full md:w-4/5 bg-white rounded-2xl shadow-lg border-4 border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <PersonIcon sx={{ fontSize: 96 }} className="text-gray-700" />
            <div className="ml-6">
              <Typography variant="h5" className="font-semibold text-gray-800">
                {`${firstName} ${lastName}`}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {roles[0]}
              </Typography>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => navigate("/edit/profile")} variant="contained" color="primary" size="small" className="w-full sm:w-auto">
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setOpenModal(true)}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  className="w-full sm:w-auto"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Spacer before Divider */}
          <Divider sx={{ mt: 3, mb: 2 }} />

          {/* Contact Information */}
          <div className="mb-6">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Contact Information
            </Typography>
            <div className="space-y-2">
              <Typography variant="body1" className="text-gray-700">
                Email: <span className="font-semibold">{email}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Phone: <span className="font-semibold">{phoneNumber}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Address: <span className="font-semibold">{address}</span>
              </Typography>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-6">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Personal Details
            </Typography>
            <div className="space-y-2">
              <Typography variant="body1" className="text-gray-700">
                Date of Birth: <span className="font-semibold">{dob}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Sex: <span className="font-semibold">{sex}</span>
              </Typography>
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-6">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Account Details
            </Typography>
            <div className="space-y-2">
              <Typography variant="body1" className="text-gray-700">
                Username: <span className="font-semibold">{userName}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                User ID: <span className="font-semibold">{userId}</span>
              </Typography>
            </div>
          </div>

          {/* Roles */}
          <div className="mb-6">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Roles
            </Typography>
            <ul className="list-disc list-inside text-gray-700">
              <li>{roles[0]}</li>
            </ul>
          </div>
          {/* Company Name */}
          {!currentUser.roles.includes("Applicant") &&
            <div>
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-4"
              >
                Company
              </Typography>
              <ul className="list-disc list-inside text-gray-700">
                <li>{companyName}</li>
              </ul>
            </div>
          }
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          className="bg-white p-6 rounded-lg shadow-md"
          sx={{
            width: { xs: 300, sm: 400 },
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold">
              Change Password
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
            disabled={isChangingPassword || !newPassword || !confirmPassword}
            sx={{ mt: 2 }}
          >
            {isChangingPassword ? "Changing..." : "Submit"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProfilePage;
