import AxiosInstance from "./api";

const getDocument = async (params) => {
    const res = await AxiosInstance.api.get('/api/ApplicationJob/documents', params);
    return res;
  };

const ApplicationJobService = {
  getDocument,
};

export default ApplicationJobService;