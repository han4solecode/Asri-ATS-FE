import AxiosInstance from "./api";

const details = async () => {
  const res = await AxiosInstance.api.get(`/api/User/user-info`);
  return res;
};

const updateProfile = async (userData) => {
  const res = await AxiosInstance.api.put(`/api/User/update-user`, userData);
  return res;
};


const UserService = {
  details,
  updateProfile
};

export default UserService;
