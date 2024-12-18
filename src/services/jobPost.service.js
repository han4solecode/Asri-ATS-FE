import AxiosInstance from "./api";

const search = async (params) => {
  const res = await AxiosInstance.api.get("/api/JobPost/search-job", { params });
  return res;
};

const details = async (jobPostId) => {
  const res = await AxiosInstance.api.get(`/api/JobPost/search-job/${jobPostId}`);
  return res;
};


const JobPostService = {
  search,
  details,
};

export default JobPostService;
