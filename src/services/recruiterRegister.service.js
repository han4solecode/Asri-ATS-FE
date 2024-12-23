import AxiosInstance from "./api";

const recruiterRequest = async (userData) => {
  const res = await AxiosInstance.api.post("/api/RecruiterRegistrationRequest/create", userData);
  return res;
};

const recruiterRequestDetails = async (id) => {
  const res = await AxiosInstance.api.get(`/api/RecruiterRegistrationRequest/${id}`);
  return res;
};

const reviewRecruiterRequest = async (id, action) => {
    const res = await AxiosInstance.api.post(`/api/RecruiterRegistrationRequest/review-request/${id}`, {action});
    return res;
};

const recruiterRequestList = async (params) => {
    const res = await AxiosInstance.api.get("/api/RecruiterRegistrationRequest/recruiter-regist-request", params);
    return res;
  };

const RecruiterRegisterService = {
  recruiterRequest,
  recruiterRequestDetails,
  reviewRecruiterRequest,
  recruiterRequestList,
};

export default RecruiterRegisterService;
