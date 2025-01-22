import React, { useState } from "react";
import { Button, CircularProgress, Divider, Typography, Modal, Box, TextField, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import UserService from "../services/userService";
import { useQuery } from "@tanstack/react-query";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from 'react-router-dom';
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "../services/auth.service";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const navigate = useNavigate();
  
  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUserProfile = async () => {
    const response = await UserService.details();
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(),
  });

  // Fetch company details based on the company name
  const fetchCompanyData = async () => {
    if (data && data.companyName) {
      const response = await UserService.getUserInSameCompany()
      return response.data; // Return company-related data
    }
    return null;
  };

  const { data: companyData, isLoading: isLoadingCompany, isError: isErrorCompany } = useQuery({
    queryKey: ["companyData"],
    queryFn: () => fetchCompanyData(),
    enabled: !!data?.companyName, // Only fetch company data if companyName exists
  });
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    setIsChangingPassword(true);
  
    try {
      const response = await AuthService.changePassword({ newPassword });
  
      // Check response status and handle cases where data is a plain string
      if (response.status === 200 && typeof response.data === "string" && response.data.includes("successfully")) {
        toast.success(response.data);
        setOpenModal(false); // Close the modal
      } else {
        // Display API-specific failure message, if available
        toast.error(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error during password change:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading || isLoadingCompany) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

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
          {companyName && (
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
          )}

          {/* Company Data Table */}
          {companyName && companyData && (
            <div className="mt-4">
            <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
              Company Employees
            </Typography>
            <TableContainer component={Paper} className="shadow-lg">
              <Table className="min-w-full" aria-label="Company Employees Table">
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell className="font-bold">Name</TableCell>
                    <TableCell className="font-bold">Email</TableCell>
                    <TableCell className="font-bold">Phone Number</TableCell>
                    <TableCell className="font-bold">Roles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyData.map((employee) => (
                    <TableRow key={employee.userId} className="hover:bg-gray-50">
                      <TableCell className="break-words">{employee.firstName} {employee.lastName}</TableCell>
                      <TableCell className="break-words">{employee.email}</TableCell>
                      <TableCell className="break-words">{employee.phoneNumber}</TableCell>
                      <TableCell className="break-words">{employee.roles}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          )}
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
          {/* New Password Field */}
          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Confirm Password Field */}
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
