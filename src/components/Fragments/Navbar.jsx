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

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const theme = useTheme();
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = useState(isMediumOrLarger);

    // Adjust the drawer state when the screen size changes
    React.useEffect(() => {
      setDrawerOpen(isMediumOrLarger);
    }, [isMediumOrLarger]);
  
    const handleDrawerToggle = () => {
      setDrawerOpen((prev) => !prev);
    };
  
  const menuItems = [
    { label: "Job Search", path: "/", visibleForAll: true },
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
      label: "Application",
      path: "/application-job",
      visibleForRoles: ["Recruiter", "HR Manager", "Applicant"],
    },
    { label: "Document", path: "/document", visibleForRoles: ["Applicant"] },
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
          {/* Logo and Menu Items */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                cursor: "pointer",
                "&:hover": { color: "#e5e7eb" },
              }}
              onClick={handleDrawerToggle}
            >
              Logo
            </Typography>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => !isMediumOrLarger && setDrawerOpen(false)}
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
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              padding: "1rem",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => setDrawerOpen(false)}
          >
            Logo
          </Typography>
          <Divider sx={{ backgroundColor: "#374151" }} />

          <List>
            {menuItems.filter(isMenuVisible).map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (!isMediumOrLarger) setDrawerOpen(false);
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
          <Box sx={{ padding: "1rem" }}>
            {!currentUser ? (
              <>
                <Button
                  fullWidth
                  onClick={() => {
                    navigate("/register-company");
                    if (!isMediumOrLarger) setDrawerOpen(false);
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
                    navigate("/login");
                    if (!isMediumOrLarger) setDrawerOpen(false);
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
                    navigate("/register");
                    if (!isMediumOrLarger) setDrawerOpen(false);
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
                  handleLogout();
                  if (!isMediumOrLarger) setDrawerOpen(false);
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
