import AxiosInstance from "./api";

const registerCompanyRequest = async (userData) => {
  const res = await AxiosInstance.api.post("/api/company/register", userData);
  return res;
};

const CompanyService = {
  registerCompanyRequest,
};

export default CompanyService;
