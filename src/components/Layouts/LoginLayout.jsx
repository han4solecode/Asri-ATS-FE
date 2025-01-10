import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Fragments/Navbar";
import Footer from "../Fragments/Footer";

function LoginLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false); // Default to closed for better UX

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar isDrawerOpen={drawerOpen} setIsDrawerOpen={setDrawerOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-grow ${
          drawerOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="container mx-auto max-w-7xl py-3">
          <div className="flex flex-col items-center justify-center mx-2 md:mx-0">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LoginLayout;
