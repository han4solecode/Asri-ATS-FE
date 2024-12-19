import AxiosInstance from "./api";

const details = async () => {
  const res = await AxiosInstance.api.get(`/api/User/user-info`);
  return res;
};


const UserService = {
  details,
};

export default UserService;
