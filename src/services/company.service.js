import AxiosInstance from "./api";

const registerCompanyRequest = async (userData) => {
  const res = await AxiosInstance.api.post("/api/company/register", userData);
  return res;
};

const reviewRegisterCompanyRequest = async (reviewData) => {
  const res = await AxiosInstance.api.post(
    "/api/company/review-request",
    reviewData
  );
  return res;
};

const getAllRegisterCompanyRequests = async () => {
  const res = await AxiosInstance.api.get("/api/company/requests");
  return res;
};

const getCompany = async (params) => {
  const res = await AxiosInstance.api.get("/api/Company/company", { params });
  return res;
};

const CompanyService = {
  registerCompanyRequest,
  reviewRegisterCompanyRequest,
  getAllRegisterCompanyRequests,
  getCompany,
};

export default CompanyService;
