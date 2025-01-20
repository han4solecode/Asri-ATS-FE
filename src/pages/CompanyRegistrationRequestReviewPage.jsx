import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompanyService from "../services/company.service";
import { CircularProgress, Button } from "@mui/material";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secure-key";

const decodeId = (encryptedId) => {
  try {
    const decoded = decodeURIComponent(encryptedId); // Decode the URL-safe string
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalId) throw new Error("Decryption failed or returned empty string");
    return originalId;
  } catch (error) {
    console.error("Error decoding process ID:", error);
    return null;
  }
};

function CompanyRegistrationRequestReviewPage(props) {
  const {} = props;
  const { id: encryptedId } = useParams();
  const id = decodeId(encryptedId);
  const navigate = useNavigate();

  const [request, setRequest] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    CompanyService.getRegisterCompanyRequestById(Number(id))
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
        setErrorMessage(
          "Error occured. Fail to load data. Please refresh or contact administrator"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  console.log(request);

  const handleReviewButtonClick = (action) => {
    if (confirm(`Confirm review company registration request (ID: ${id})?`)) {
      setProcessing(true);
      CompanyService.reviewRegisterCompanyRequest({
        companyRequestId: Number(id),
        action: action,
      })
        .then((res) => {
          alert(res.data.message);
          navigate(-1);
        })
        .catch((err) => {
          console.log(err);

          alert(err.response.data.message);
        })
        .finally(() => {
          setProcessing(false);
        });
    } else {
      return;
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto my-auto flex flex-col justify-center">
        <h2 className="text-xl text-gray-800 text-center">{errorMessage}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-6 md:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Company Registration Request Detail
      </h2>
      <div>
        {isLoading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="border rounded shadow-lg p-2">
            <div className="flex flex-col items-start gap-3">
              <span className="text-xl underline font-semibold text-gray-800">
                Company Info
              </span>
              <div className="flex flex-col gap-2 text-gray-600">
                <span>
                  Company Name: <strong>{request.companyName}</strong>
                </span>
                <span>
                  Company Address: <strong>{request.companyAddress}</strong>
                </span>
              </div>
              <span className="text-xl underline font-semibold text-gray-800">
                User Data
              </span>
              <div className="flex flex-col md:grid md:grid-cols-3 gap-2 text-gray-600 w-3/4">
                <span>
                  Requester Name:{" "}
                  <strong>
                    {request.firstName} {request.lastName}
                  </strong>
                </span>
                <span>
                  Email: <strong>{request.email}</strong>
                </span>
                <span>
                  Phone Number: <strong>{request.phoneNumber}</strong>
                </span>
                <span>
                  Address: <strong>{request.userAddress}</strong>
                </span>
                <span>
                  DOB: <strong>{new Date(request.dob).toDateString()}</strong>
                </span>
                <span>
                  Gender: <strong>{request.sex}</strong>
                </span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3 px-10 md:px-32">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  flex: 1,
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                }}
                onClick={() => handleReviewButtonClick("Approved")}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#f44336",
                  color: "white",
                  flex: 1,
                  "&:hover": {
                    backgroundColor: "#d32f2f",
                  },
                }}
                onClick={() => handleReviewButtonClick("Rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyRegistrationRequestReviewPage;
