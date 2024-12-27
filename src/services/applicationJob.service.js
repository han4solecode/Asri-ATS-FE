import AxiosInstance from "./api";

const getDocument = async (params) => {
    const res = await AxiosInstance.api.get('/api/ApplicationJob/documents', params);
    return res;
};

const getStatus = async (params) => {
  const res = await AxiosInstance.api.get("/api/ApplicationJob/job-application",params)
  return res;
}

const getApplicationDetails = async (processId) => {
  const res = await AxiosInstance.api.get(`/api/ApplicationJob/application/${processId}`);
    return res;
}

const reviewApplication = async (userData) => {
  const res = await AxiosInstance.api.post("/api/ApplicationJob/review", userData);
    return res;
}

const ApplicationJobService = {
  getDocument,
  getStatus,
  getApplicationDetails,
  reviewApplication,
};

export default ApplicationJobService;