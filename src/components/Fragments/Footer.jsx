import { Link } from "react-router-dom";

function Footer(props) {
  const {} = props;

  let currentYear = new Date().getFullYear();
  let copyrightText = `© ${currentYear} Solecode, Inc`;

  return (
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
  );
}

export default Footer;