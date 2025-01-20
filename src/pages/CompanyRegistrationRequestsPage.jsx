import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyService from "../services/company.service";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secure-key";

const encodeProcessId = (id) => {
  try {
    if (!id) throw new Error("Invalid process ID");
    const encrypted = CryptoJS.AES.encrypt(String(id), SECRET_KEY).toString();
    return encodeURIComponent(encrypted); // Encode the encrypted string for URL safety
  } catch (error) {
    console.error("Error encoding process ID:", error);
    return null;
  }
};

function CompanyRegistrationRequestsPage(props) {
  const {} = props;
  const navigate = useNavigate();

  const [requests, setRequests] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    CompanyService.getAllRegisterCompanyRequests()
      .then((res) => {
        setRequests(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  console.log(requests);

  return (
    <div className="container mx-auto py-8 px-6 md:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Company Registration Requests
      </h2>
      <div>
        {isLoading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper} className="rounded-lg shadow-md">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell className="font-bold">ID</TableCell>
                  <TableCell className="font-bold">Requester</TableCell>
                  <TableCell className="font-bold">Email</TableCell>
                  <TableCell className="font-bold">Company Name</TableCell>
                  <TableCell className="font-bold">Company Address</TableCell>
                  <TableCell className="font-bold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <TableRow key={req.companyRequestId}>
                      <TableCell>{req.companyRequestId}</TableCell>
                      <TableCell>
                        {req.firstName} {req.lastName}
                      </TableCell>
                      <TableCell>{req.email}</TableCell>
                      <TableCell>{req.companyName}</TableCell>
                      <TableCell>{req.companyAddress}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#1565c0",
                            },
                          }}
                          onClick={() => {
                            const encodedId = encodeProcessId(req.companyRequestId);
                            if (encodedId) {
                              navigate(`/requests/company-registration/review/${encodedId}`);
                            } else {
                              console.error("Failed to encode process ID, navigation aborted.");
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-600"
                    >
                      No requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

export default CompanyRegistrationRequestsPage;
