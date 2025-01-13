import AxiosInstance from "./api";

const applicantDashboard = async (params) => {
  const res = await AxiosInstance.api.get("/api/Dashboard/applicant-dashboard", { params });
  return res;
};

const recruiterDashboard = async (params) => {
  const res = await AxiosInstance.api.get("/api/Dashboard/recruiter-dashboard", { params });
  return res;
};

const DashboardService = {
  applicantDashboard,
  recruiterDashboard,
};

export default DashboardService;
