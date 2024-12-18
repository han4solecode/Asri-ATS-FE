import { Outlet, Link } from "react-router-dom";
import Navbar from "../Fragments/Navbar";
import Footer from "../Fragments/Footer";

function LoginLayout(props) {
  const {} = props;

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar></Navbar>
      <div className="container mx-auto max-w-7xl py-3">
        <div className="flex flex-col items-center justify-center mx-2 md:mx-0">
          <Outlet></Outlet>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default LoginLayout;
