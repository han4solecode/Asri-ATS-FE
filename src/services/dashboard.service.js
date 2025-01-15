import AxiosInstance from "./api";

const applicantDashboard = async (params) => {
  const res = await AxiosInstance.api.get("/api/Dashboard/applicant-dashboard", { params });
  return res;
};

const recruiterDashboard = async (params) => {
  const res = await AxiosInstance.api.get("/api/Dashboard/recruiter-dashboard", { params });
  return res;
};

const adminGetAllCompanyRegistrationRequest = async () => {
  const res = await AxiosInstance.api.get("/api/dashboard/company-regist-request");
  return res;
}

const adminGetAllUsersInfo = async () => {
  const res = await AxiosInstance.api.get("/api/dashboard/users")
  return res;
}

const adminGetAllRoleChangeRequest = async () => {
  const res = await AxiosInstance.api.get("/api/dashboard/role-change-request");
  return res;
}

const DashboardService = {
  applicantDashboard,
  recruiterDashboard,
  adminGetAllCompanyRegistrationRequest,
  adminGetAllUsersInfo,
  adminGetAllRoleChangeRequest,
};

export default DashboardService;
