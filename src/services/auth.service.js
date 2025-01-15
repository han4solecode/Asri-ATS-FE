import AxiosInstance from "./api";

const registerAplicant = async (userData) => {
  const res = await AxiosInstance.api.post("/api/auth/applicant", userData);
  return res;
};

const login = async (userData) => {
  const res = await AxiosInstance.api.post("/api/auth/login", userData);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res;
};

const logout = async () => {
  const res = await AxiosInstance.api.post("/api/auth/logout");
  localStorage.removeItem("user");
  return res;
};

const refreshToken = async () => {
  const res = await AxiosInstance.api.post("/api/auth/refresh-token");
  localStorage.setItem("user", JSON.stringify(res.data));
  return res;
};

const changePassword = async (userData) => {
  const res = await AxiosInstance.api.post("/api/auth/ChangePassword", userData);
  return res;
};

const AuthService = {
  registerAplicant,
  login,
  logout,
  refreshToken,
  changePassword,
};

export default AuthService;
