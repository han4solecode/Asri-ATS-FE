import AxiosInstance from "./api";

const overallReport = async (params) => {
  const res = await AxiosInstance.api.get("/api/Report/generate-overall-report",  params );
  return res;
};

const demograpicOverviewReport = async (userData) => {
  const res = await AxiosInstance.api.get(`/api/Report/generate-demographic-report/${userData}`);
  return res;
};


const ReportService = {
  overallReport,
  demograpicOverviewReport,
};

export default ReportService;
