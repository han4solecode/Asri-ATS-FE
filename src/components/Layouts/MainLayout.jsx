import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Fragments/Navbar";
import Footer from "../Fragments/Footer";

function MainLayout(props) {
  const { allowedRoles } = props;
  const { user, isLoading } = useSelector((state) => state.auth);

  const hasRequiredRole = () => {
    if (!isLoading) {
      if (!allowedRoles) {
        return true;
      }

      return user?.roles?.some((role) => allowedRoles.includes(role)) || false;
    }
  };

  // if (allowedRoles && !hasRequiredRole()) {
  //   return <Navigate to="/unauthorized"></Navigate>;
  // }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
      </div>
    );
  }

  return(
        <div className="flex flex-col min-h-screen justify-between">
            <Navbar></Navbar>
                <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}

export default MainLayout;