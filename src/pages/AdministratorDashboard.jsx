import { useState, useEffect } from "react";
import DashboardService from "../services/dashboard.service";
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

  //   console.log(companyRegistrations);

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

  return (
    <Box className="p-4 p-8 lg:p-12">
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className="mb-6"
      >
        <Tab label="User Info"></Tab>
        <Tab label="Company Registration Requests"></Tab>
        <Tab label="Role Change Requests"></Tab>
      </Tabs>

      <Box>
        {selectedTab === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg">Applicant</h3>
              <TableContainer component={Paper} className="shadow-lg">
                <Table stickyHeader sx={{ height: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">No</TableCell>
                      <TableCell className="font-bold">Full Name</TableCell>
                      <TableCell className="font-bold">Username</TableCell>
                      <TableCell className="font-bold">Email</TableCell>
                      <TableCell className="font-bold">Phone Number</TableCell>
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
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.userName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneNumber}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
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
              <h3 className="text-lg">Internal</h3>
              <TableContainer component={Paper} className="shadow-lg">
                <Table stickyHeader sx={{ height: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">No</TableCell>
                      <TableCell className="font-bold">Full Name</TableCell>
                      <TableCell className="font-bold">Email</TableCell>
                      <TableCell className="font-bold">Phone Number</TableCell>
                      <TableCell className="font-bold">Company</TableCell>
                      <TableCell className="font-bold">Role</TableCell>
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
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneNumber}</TableCell>
                          <TableCell>{user.company}</TableCell>
                          <TableCell>{user.roles}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
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
        )}
        {selectedTab === 1 && "Company Registration Requests"}
        {selectedTab === 2 && "Role Change Requests"}
      </Box>
    </Box>
  );
}

export default AdministratorDashboard;
