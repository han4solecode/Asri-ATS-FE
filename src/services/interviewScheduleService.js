import AxiosInstance from "./api";

const setInterviewScheduleTime = async (userData) => {
    const res = await AxiosInstance.api.post("/api/InterviewingSchedule/SetInterviewSchedule", userData);
    return res;
}

const confirmInterviewScheduleTime = async (userData) => {
    const res = await AxiosInstance.api.post("/api/InterviewingSchedule/confirm", userData);
    return res;
}

const markInterviewAsComplete = async (userData) => {
    const res = await AxiosInstance.api.post("/api/InterviewingSchedule/mark-complete", userData);
    return res;
}

const reviewInterviewResult = async (reviewData) => {
    const res = await AxiosInstance.api.post("/api/InterviewingSchedule/review-result", reviewData);
    return res;
}

const InterviewScheduleService = {
    setInterviewScheduleTime,
    confirmInterviewScheduleTime,
    markInterviewAsComplete,
    reviewInterviewResult
};

export default InterviewScheduleService;