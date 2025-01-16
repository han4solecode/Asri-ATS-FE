import AxiosInstance from "./api";

const jobPostTemplateRequest = async (userData) => {
  const res = await AxiosInstance.api.post("/api/JobPostTemplateRequest/create", userData);
  return res;
};

const jobPostTemplateRequestList = async (params) => {
  const res = await AxiosInstance.api.get("/api/JobPostTemplateRequest", {params});
  return res;
};

const details = async (jobPostTemplateRequestId) => {
  const res = await AxiosInstance.api.get(`/api/JobPostTemplateRequest/${jobPostTemplateRequestId}`);
  return res;
};

const reviewJobPostTemplateRequest = async (userData) => {
  const res = await AxiosInstance.api.post("/api/JobPostTemplateRequest/review", userData);
  return res;
};



const JobPostTemplateRequestService = {
  jobPostTemplateRequest,
  jobPostTemplateRequestList,
  details,
  reviewJobPostTemplateRequest,
};

export default JobPostTemplateRequestService;
