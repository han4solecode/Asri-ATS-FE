import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} Solecode, Inc`;

  return (
    <footer className="bg-gray-800 p-6 text-white mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4">
        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 lg:gap-8 text-center sm:text-left">
          {/* Replace <a> with <Link> if using React Router */}
          <a href="#" className="hover:text-gray-300 transition">
            Security and Privacy
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            Terms and Conditions
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            Contact
          </a>
        </div>

        {/* Copyright Text */}
        <div className="text-gray-400 text-sm text-center lg:text-left">
          {copyrightText}
        </div>
      </div>

      {/* Decorative Border */}
      <div className="border-t border-gray-700 mt-4 pt-4">
        <p className="text-center text-gray-500 text-xs">
          Designed with care by the Solecode team.
        </p>
      </div>
    </footer>
  );
}

export default Footer;