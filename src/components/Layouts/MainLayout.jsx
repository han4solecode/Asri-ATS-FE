import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Fragments/Navbar";
import Footer from "../Fragments/Footer";
import { useState } from "react";

function MainLayout(props) {
  const { allowedRoles } = props;
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const hasRequiredRole = () => {
    if (!isLoading) {
      if (!allowedRoles) {
        return true;
      }

      return user?.roles?.some((role) => allowedRoles.includes(role)) || false;
    }
  };

  if (allowedRoles && !hasRequiredRole()) {
    return <Navigate to="/unauthorized"></Navigate>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"></div>;
  }

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}></Navbar>
      <div
        className={`transition-all duration-300 ${
          isDrawerOpen ? "ml-64" : "ml-0"
        }`}
      >
      <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default MainLayout;
