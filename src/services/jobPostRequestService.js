import AxiosInstance from "./api";

const jobPostRequest = async (userData) => {
  const res = await AxiosInstance.api.post("/api/JobPostRequest/create", userData);
  return res;
};

const jobPostRequestList = async () => {
  const res = await AxiosInstance.api.get("/api/JobPostRequest/recruiter");
  return res;
};

const jobPostRequestToBeReviewed = async () => {
  const res = await AxiosInstance.api.get("/api/JobPostRequest");
  return res;
};

const details = async (processId) => {
  const res = await AxiosInstance.api.get(`/api/JobPostRequest/${processId}`);
  return res;
};

const reviewJobPostRequest = async (userData) => {
  const res = await AxiosInstance.api.post("/api/JobPostRequest/review", userData);
  return res;
};

const updateJobPostRequest = async (userData) => {
  const res = await AxiosInstance.api.put("/api/JobPostRequest/update", userData);
  return res;
};



const JobPostRequestService = {
  jobPostRequest,
  jobPostRequestToBeReviewed,
  jobPostRequestList,
  details,
  reviewJobPostRequest,
  updateJobPostRequest
};

export default JobPostRequestService;
