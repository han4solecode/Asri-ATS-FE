import { useState, useEffect } from "react";
import DashboardService from "../services/dashboard.service";
import UserService from "../services/userService";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  Button,
} from "@mui/material";

function AdministratorDashboard(props) {
  const {} = props;
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);
  const [companyRegistrations, setCompanyRegistrations] = useState([]);
  const [roleChangeRequests, setRoleChangeRequests] = useState([]);
  const [userInfos, setUserInfos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // table pagination
  const [applicantTablePage, setApplicantTablePage] = useState(0);
  const [applicantTableRowsPerPage, setApplicantTableRowsPerPage] = useState(5);
  const [internalTablePage, setInternalTablePage] = useState(0);
  const [internalTableRowsPerPage, setInternalTableRowsPerPage] = useState(5);
  const [companyRegistrationTablePage, setCompanyRegistrationTablePage] =
    useState(0);
  const [
    companyRegistrationTableRowsPerPage,
    setCompanyRegistrationTableRowsPerPage,
  ] = useState(5);

  useEffect(() => {
    if (selectedTab === 0) {
      setIsLoading(true);
      DashboardService.adminGetAllUsersInfo()
        .then((res) => {
          setUserInfos(res.data);
        })
        .catch((err) => {
          setError(err.response.message || "Failed to fetch data.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (selectedTab === 1) {
      setIsLoading(true);
      DashboardService.adminGetAllCompanyRegistrationRequest()
        .then((res) => {
          setCompanyRegistrations(res.data);
        })
        .catch((err) => {
          setError(err.response.message || "Failed to fetch data.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      DashboardService.adminGetAllRoleChangeRequest()
        .then((res) => {
          setRoleChangeRequests(res.data);
        })
        .catch((err) => {
          setError(err.response.message || "Failed to fetch data.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedTab]);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const handleApplicantTableChangePage = (e, newPage) => {
    setApplicantTablePage(newPage);
  };

  const handleApplicantTableChangeRowsPerPage = (e) => {
    setApplicantTableRowsPerPage(+e.target.value);
    setApplicantTablePage(0);
  };

  const handleInternalTableChangePage = (e, newPage) => {
    setInternalTablePage(newPage);
  };

  const handleInternalTableChangeRowsPerPage = (e) => {
    setInternalTableRowsPerPage(+e.target.value);
    setInternalTablePage(0);
  };

  const handleCompanyRegistrationTableChangePage = (e, newPage) => {
    setCompanyRegistrationTablePage(newPage);
  };

  const handleCompanyRegistrationTableChangeRowsPerPage = (e) => {
    setCompanyRegistrationTableRowsPerPage(+e.target.value);
    setCompanyRegistrationTablePage(0);
  };

  const handleDeleteUser = (userName) => {
    if (confirm(`Are you sure you want to delete this (${userName}) user? `)) {
      UserService.deleteUser(userName)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.response.data.message || "Failed to delete user.");
        })
        .finally(() => {
          navigate(0);
        });
    } else {
      return;
    }
  };

  return (
    <Box className="p-6 lg:p-10 min-h-screen bg-gray-100">
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className="mb-6 bg-white shadow rounded-lg"
      >
        <Tab label="User Info"></Tab>
        <Tab label="Company Registration Requests"></Tab>
        <Tab label="Role Change Requests"></Tab>
      </Tabs>

      <Box>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="65vh"
          >
            <CircularProgress></CircularProgress>
          </Box>
        ) : (
          selectedTab === 0 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg mb-2">Applicant</h3>
                <TableContainer component={Paper} className="shadow-lg">
                  <Table stickyHeader sx={{ height: 500 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold">Full Name</TableCell>
                        <TableCell className="font-bold">Username</TableCell>
                        <TableCell className="font-bold">Email</TableCell>
                        <TableCell className="font-bold">
                          Phone Number
                        </TableCell>
                        <TableCell className="font-bold">Address</TableCell>
                        <TableCell className="font-bold">DOB</TableCell>
                        <TableCell className="font-bold">Sex</TableCell>
                        <TableCell className="font-bold">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userInfos
                        .filter((user) => user.roles?.includes("Applicant"))
                        .slice(
                          applicantTablePage * applicantTableRowsPerPage,
                          applicantTablePage * applicantTableRowsPerPage +
                            applicantTableRowsPerPage
                        )
                        .map((user, index) => (
                          <TableRow key={user.userId}>
                            <TableCell>
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.userName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>{user.address}</TableCell>
                            <TableCell>
                              {new Date(user.dob).toDateString()}
                            </TableCell>
                            <TableCell>{user.sex}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.userName)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter
                      sx={{
                        position: "sticky",
                        top: 0,
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          count={
                            userInfos.filter((user) =>
                              user.roles?.includes("Applicant")
                            ).length
                          }
                          rowsPerPage={applicantTableRowsPerPage}
                          page={applicantTablePage}
                          onPageChange={handleApplicantTableChangePage}
                          onRowsPerPageChange={
                            handleApplicantTableChangeRowsPerPage
                          }
                        ></TablePagination>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </div>
              <div>
                <h3 className="text-lg mb-2">Internal</h3>
                <TableContainer component={Paper} className="shadow-lg">
                  <Table stickyHeader sx={{ height: 500 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold">Full Name</TableCell>
                        <TableCell className="font-bold">Email</TableCell>
                        <TableCell className="font-bold">
                          Phone Number
                        </TableCell>
                        <TableCell className="font-bold">Address</TableCell>
                        <TableCell className="font-bold">Company</TableCell>
                        <TableCell className="font-bold">Role</TableCell>
                        <TableCell className="font-bold">DOB</TableCell>
                        <TableCell className="font-bold">Sex</TableCell>
                        <TableCell className="font-bold">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userInfos
                        .filter((user) => !user.roles.includes("Applicant"))
                        .slice(
                          internalTablePage * internalTableRowsPerPage,
                          internalTablePage * internalTableRowsPerPage +
                            internalTableRowsPerPage
                        )
                        .map((user, index) => (
                          <TableRow key={user.userId}>
                            <TableCell>
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>{user.address}</TableCell>
                            <TableCell>{user.company}</TableCell>
                            <TableCell>{user.roles}</TableCell>
                            <TableCell>
                              {new Date(user.dob).toDateString()}
                            </TableCell>
                            <TableCell>{user.sex}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.userName)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          count={
                            userInfos.filter(
                              (user) => !user.roles?.includes("Applicant")
                            ).length
                          }
                          rowsPerPage={internalTableRowsPerPage}
                          page={internalTablePage}
                          onPageChange={handleInternalTableChangePage}
                          onRowsPerPageChange={
                            handleInternalTableChangeRowsPerPage
                          }
                        ></TablePagination>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </div>
            </div>
          )
        )}

        {selectedTab === 1 && (
          <TableContainer component={Paper} className="shadow-lg">
            <Table stickyHeader sx={{ maxHeight: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">ID</TableCell>
                  <TableCell className="font-bold">Requester</TableCell>
                  <TableCell className="font-bold">Email</TableCell>
                  <TableCell className="font-bold">Company Name</TableCell>
                  <TableCell className="font-bold">Company Address</TableCell>
                  <TableCell className="font-bold">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companyRegistrations.length > 0 ? (
                  companyRegistrations
                    .slice(
                      companyRegistrationTablePage *
                        companyRegistrationTableRowsPerPage,
                      companyRegistrationTablePage *
                        companyRegistrationTableRowsPerPage +
                        companyRegistrationTableRowsPerPage
                    )
                    .map((cr) => {
                      return (
                        <TableRow key={cr.companyRequestId}>
                          <TableCell>{cr.companyRequestId}</TableCell>
                          <TableCell>
                            {cr.firstName} {cr.lastName}
                          </TableCell>
                          <TableCell>{cr.email}</TableCell>
                          <TableCell>{cr.companyName}</TableCell>
                          <TableCell>{cr.companyAddress}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "#1f2937",
                                color: "white",
                              }}
                              onClick={() =>
                                navigate(
                                  `/requests/company-registration/review/${cr.companyRequestId}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-600"
                    >
                      {error ? error : "No requests found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={companyRegistrations.length}
                    rowsPerPage={companyRegistrationTableRowsPerPage}
                    page={companyRegistrationTablePage}
                    onPageChange={handleCompanyRegistrationTableChangePage}
                    onRowsPerPageChange={
                      handleCompanyRegistrationTableChangeRowsPerPage
                    }
                  ></TablePagination>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
        {selectedTab === 2 && "Role Change Requests"}
      </Box>
    </Box>
  );
}

export default AdministratorDashboard;
