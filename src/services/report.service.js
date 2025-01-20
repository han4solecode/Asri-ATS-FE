import AxiosInstance from "./api";

const overallReport = async () => {
  const res = await AxiosInstance.api.get("/api/Report/generate-overall-report",   {
    responseType: "blob",
  });
  return res;
};

const demograpicOverviewReport = async (userData) => {
  const res = await AxiosInstance.api.get(`/api/Report/generate-demographic-report/${userData}`,  {
    responseType: "blob",
  });
  return res;
};

const complianceApprovalMetricsReport = async () => {
  const res = await AxiosInstance.api.get("/api/Report/Approval-time", {
    responseType: "blob",
  });
  return res;
};

const recruitmentfunnelReport = async () => {
  const res = await AxiosInstance.api.get("/api/Report/generate-recruitment-funnel",   {
    responseType: "blob",
  });
  return res;
};

const ReportService = {
  overallReport,
  demograpicOverviewReport,
  complianceApprovalMetricsReport,
  recruitmentfunnelReport,
};

export default ReportService;
