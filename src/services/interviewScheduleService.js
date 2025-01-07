import AxiosInstance from "./api";

const setInterviewScheduleTime = async (userData) => {
    const res = await AxiosInstance.api.post("/api/InterviewingSchedule/SetInterviewSchedule", userData);
    return res;
}

const confirmInterviewScheduleTime = async (userData) => {
    const res = await AxiosInstance.api.post("/api/InterviewingSchedule/confirm", userData);
    return res;
}

const InterviewScheduleService = {
    setInterviewScheduleTime,
    confirmInterviewScheduleTime
};

export default InterviewScheduleService;