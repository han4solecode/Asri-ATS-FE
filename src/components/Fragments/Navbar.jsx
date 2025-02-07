import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Avatar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const theme = useTheme();
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    // Open drawer automatically on larger screens
    setIsDrawerOpen(isMediumOrLarger);
  }, [isMediumOrLarger]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev); // Toggle for all screens
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard/administrator",
      visibleForRoles: ["Administrator"],
    },
    {
      label: "Dashboard",
      path: "/dashboard/recruiter",
      visibleForRoles: ["Recruiter"],
    },
    {
      label: "Dashboard",
      path: "/dashboard/applicant",
      visibleForRoles: ["Applicant"],
    },
    {
      label: "Dashboard",
      path: "/dashboard/HRManager",
      visibleForRoles: ["HR Manager"],
    },
    { label: "Job Search", path: "/", visibleForAll: true },
    {
      label: "Company Registration Request",
      path: "/requests/company-registration",
      visibleForRoles: ["Administrator"],
    },
    {
      label: "Recruiter Request",
      path: "/recruiter-request",
      visibleForRoles: ["HR Manager"],
    },
    {
      label: "Job Post Request",
      path: "/job-post-request",
      visibleForRoles: ["Recruiter", "HR Manager"],
    },
    {
      label: "Job Post Template Request",
      path: "/job-post-template-request",
      visibleForRoles: ["Recruiter", "HR Manager"],
    },
    {
      label: "Application",
      path: "/application-job",
      visibleForRoles: ["Recruiter", "HR Manager", "Applicant"],
    },
    {
      label: "Interview",
      path: "/interview-schedule",
      visibleForRoles: ["Recruiter", "HR Manager", "Applicant"],
    },
    { label: "Document", path: "/document", visibleForRoles: ["Applicant"] },
    {
      label: "Report",
      path: "/report/administrator",
      visibleForRoles: ["Administrator"],
    },
    {
      label: "Report",
      path: "/report/HR_Manager",
      visibleForRoles: ["HR Manager"],
    }
  ];

  const isMenuVisible = (item) => {
    if (item.visibleForAll) return true;
    if (!currentUser) return false;
    if (item.visibleForRoles && currentUser?.roles) {
      return item.visibleForRoles.some((role) =>
        currentUser.roles.includes(role)
      );
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  return (
    <>
      {/* AppBar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#1f2937",
          padding: "0.5rem 1rem",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo or Drawer Toggle */}
          <Box
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#ffffff",
              cursor: "pointer",
              "&:hover": { color: "#e5e7eb" },
            }}
            onClick={handleDrawerToggle} // Always toggle the drawer
          >
            <img
              src="../../../public/assets/Logo.webp"
              alt="Logo"
              style={{ height: "80px", cursor: "pointer" }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => !isMediumOrLarger && setIsDrawerOpen(false)}
        variant={isMediumOrLarger ? "persistent" : "temporary"}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#1f2937",
            color: "#ffffff",
            width: "250px",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            component="img"
            src="../../../public/assets/Logo.webp"
            alt="Logo"
            sx={{
              height: 150,
              cursor: "pointer",
            }}
            onClick={handleDrawerToggle} // Jika perlu aksi klik
          />
          <Divider sx={{ backgroundColor: "#374151" }} />

          {/* Profile Section */}
          {currentUser && (
            <Button
              onClick={() => navigate("/profile")}
              sx={{
                color: "#ffffff",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                "&:hover": {
                  backgroundColor: "#374151",
                },
              }}
            >
              <Avatar
                src="https://via.placeholder.com/32"
                alt="Profile"
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography variant="body2">Welcome,</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentUser.username}
                </Typography>
              </Box>
            </Button>
          )}
          <Divider sx={{ backgroundColor: "#374151" }} />

          {/* Navigation Links */}
          <List>
            {menuItems.filter(isMenuVisible).map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (!isMediumOrLarger) setIsDrawerOpen(false);
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#374151",
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ backgroundColor: "#374151" }} />

          {/* Authentication Buttons */}
          <Box
            sx={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {!currentUser ? (
              <>
                <Button
                  onClick={() => navigate("/register-company")}
                  sx={{
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#059669",
                    },
                  }}
                >
                  Register Company
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    backgroundColor: "#374151",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#4b5563",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    backgroundColor: "#374151",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#4b5563",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "#374151",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#4b5563",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
