import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { AppBar, Toolbar, Button, Typography, Avatar } from "@mui/material";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  // Menu items definition
  const menuItems = [
    {
      label: "Homepage",
      path: "/",
      visibleForAll: true,
    },
    {
      label: "Profile",
      path: "/profile",
      visibleForRoles: [
        "Administrator",
        "HR Manager",
        "Department Manager",
        "Employee Supervisor",
        "Applicant",
      ],
    },
    {
      label: "Register Company",
      path: "/register-company",
      visibleForAll: true,
    },
  ];

  // Check if the menu item should be visible
  const isMenuVisible = (item) => {
    if (item.visibleForAll) return true; // Always visible
    if (!currentUser) return false; // Hide for unauthenticated users
    if (item.visibleForRoles && currentUser?.roles) {
      return item.visibleForRoles.some((role) => currentUser.roles.includes(role));
    }
    return false;
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1f2937", // Tailwind's bg-gray-800 equivalent
        padding: "0.5rem 1rem",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Logo/Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#ffffff",
            cursor: "pointer",
            "&:hover": { color: "#e5e7eb" }, // Tailwind's text-gray-300
          }}
          onClick={() => navigate("/")}
        >
          Logo
        </Typography>

        {/* Navigation Links */}
        <div style={{ display: "flex", gap: "1rem" }}>
          {menuItems.filter(isMenuVisible).map((item, index) => (
            <Button
              key={index}
              component={Link}
              to={item.path}
              sx={{
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#374151", // Tailwind's bg-gray-700
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {!currentUser ? (
            <>
              {/* Login Button */}
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  backgroundColor: "#374151", // Tailwind's bg-gray-700
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#4b5563", // Slightly darker gray
                  },
                }}
              >
                Login
              </Button>

              {/* Register Button */}
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
              {/* Profile Button */}
              <Button
                onClick={() => navigate("/profile")}
                sx={{
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#374151",
                  },
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Avatar
                    src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
                    alt="Profile"
                    sx={{ width: 32, height: 32 }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <Typography variant="body2">Welcome,</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {currentUser.user?.fname} {currentUser.user?.lname}
                    </Typography>
                  </div>
                </div>
              </Button>

              {/* Logout Button */}
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
