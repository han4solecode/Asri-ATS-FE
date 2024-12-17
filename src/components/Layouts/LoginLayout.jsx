import { Outlet, Link } from "react-router-dom";

function LoginLayout(props) {
  const {} = props;

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <nav className="bg-gray-800 p-3">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-3xl text-white">
            <Link to="/">LOGO</Link>
          </h1>
        </div>
      </nav>
      <div className="container mx-auto max-w-7xl py-3">
        <div className="flex flex-col">
          <Outlet></Outlet>
        </div>
      </div>
      <footer className="bg-gray-800 p-3 text-white mt-auto">
        <div className="mx-auto max-w-7xl flex justify-between sm:flex-col md:flex-row sm:items-start md:items-center">
          <div className="flex sm:flex-col md:flex-row sm:items-start md:gap-4 sm:gap-2 underline">
            {/* change to <Link/> later */}
            <a href="">Security and Privacy</a>
            <a href="">Terms and Condition</a>
            <a href="">Contact</a>
          </div>
          <div className="text-gray-400 sm:mt-2 md:mt-0">Copyright Text</div>
        </div>
      </footer>
    </div>
  );
}

export default LoginLayout;
