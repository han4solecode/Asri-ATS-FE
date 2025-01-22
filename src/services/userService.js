import AxiosInstance from "./api";

const details = async () => {
  const res = await AxiosInstance.api.get(`/api/User/user-info`);
  return res;
};

const updateProfile = async (userData) => {
  const res = await AxiosInstance.api.put(`/api/User/update-user`, userData);
  return res;
};

const uploadDocument = async (formData) => {
  const res = await AxiosInstance.apiNew.post("/api/User/upload-document", { formData });
  return res;
};

const deleteDocument = async (id) => {
  const res = await AxiosInstance.api.delete(`/api/User/delete-document/${id}`);
  return res;
};

const deleteUser = async (username) => {
  const res = await AxiosInstance.api.delete(`/api/user/delete/${username}`)
  return res
}

const getUserInSameCompany = async () => {
  const res = await AxiosInstance.api.get(`/api/User/company`);
  return res;
};

const UserService = {
  details,
  updateProfile,
  uploadDocument,
  deleteDocument,
  deleteUser,
  getUserInSameCompany,
};

export default UserService;
