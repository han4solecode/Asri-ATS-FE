import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    {
      label: "Job Search",
      path: "/",
      visibleForAll: true,
    },
    {
      label: "Profile",
      path: "/profile",
      visibleForRoles: [
        "Administrator",
        "HR Manager",
        "Recruiter",
        "Applicant",
      ],
    },
    {
      label: "Recruiter Request",
      path: "/recruiter-request",
      visibleForRoles: ["HR Manager"],
    },
    {
      label: "Job Post Request",
      path: "/job-post-request",
      visibleForRoles: ["Recruiter","HR Manager"],
    },
    {
      label: "Document",
      path: "/document",
      visibleForRoles: ["Applicant"],
    },
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
    navigate("");
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
          {/* Logo and Menu Items */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {/* Logo */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                cursor: "pointer",
                "&:hover": { color: "#e5e7eb" },
              }}
              onClick={() => navigate("/")}
            >
              Logo
            </Typography>

            {/* Menu Items (Visible on larger screens) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: "1rem",
              }}
            >
              {menuItems.filter(isMenuVisible).map((item, index) => (
                <Button
                  key={index}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#374151",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Authentication Buttons (Desktop) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
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
                  onClick={() => navigate("/profile")}
                  sx={{
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#374151",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Avatar
                      src="https://via.placeholder.com/32"
                      alt="Profile"
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="body2">Welcome,</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {currentUser.username}
                      </Typography>
                    </Box>
                  </Box>
                </Button>
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

          {/* Hamburger Menu for small screens */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#1f2937",
            color: "#ffffff",
            width: "250px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Logo/Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              padding: "1rem",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              setDrawerOpen(false);
              navigate("/");
            }}
          >
            Logo
          </Typography>
          <Divider sx={{ backgroundColor: "#374151" }} />

          {/* Navigation Links */}
          <List>
            {menuItems.filter(isMenuVisible).map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(item.path);
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
          <Box sx={{ padding: "1rem" }}>
            {!currentUser ? (
              <>
                <Button
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate("/register-company");
                  }}
                  sx={{
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                    "&:hover": {
                      backgroundColor: "#059669",
                    },
                  }}
                >
                  Register Company
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate("/login");
                  }}
                  sx={{
                    backgroundColor: "#374151",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                    "&:hover": {
                      backgroundColor: "#4b5563",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate("/register");
                  }}
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
              <Button
                fullWidth
                onClick={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
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
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
