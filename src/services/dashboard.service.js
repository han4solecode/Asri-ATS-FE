import AxiosInstance from "./api";

const applicantDashboard = async (params) => {
  const res = await AxiosInstance.api.get("/api/Dashboard/applicant-dashboard", { params });
  return res;
};

const recruiterDashboard = async (params) => {
  const res = await AxiosInstance.api.get("/api/Dashboard/recruiter-dashboard", { params });
  return res;
};

const HRManagerDashboard = async () => {
  const res = await AxiosInstance.api.get("/api/Dashboard/HRManager-dashboard");
  return res;
};

const DashboardService = {
  applicantDashboard,
  recruiterDashboard,
  HRManagerDashboard
};

export default DashboardService;
