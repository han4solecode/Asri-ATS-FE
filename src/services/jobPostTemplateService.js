import AxiosInstance from "./api";

const jobPostTemplateList = async (params) => {
  const res = await AxiosInstance.api.get("/api/JobPostTemplate/all", {params});
  return res;
};

const details = async (jobPostTemplateId) => {
  const res = await AxiosInstance.api.get(`/api/JobPostTemplate/${jobPostTemplateId}`);
  return res;
};



const JobPostTemplateService = {
  jobPostTemplateList,
  details
};

export default JobPostTemplateService;
