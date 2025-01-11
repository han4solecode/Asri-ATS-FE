import AxiosInstance from "./api";

const setInterviewScheduleTime = async (userData) => {
    const res = await AxiosInstance.api.post("/api/InterviewingSchedule/SetInterviewSchedule", userData);
    return res;
}

const updateInterviewScheduleTime = async (userData) => {
    const res = await AxiosInstance.api.put("/api/InterviewingSchedule/update-schedule", userData);
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

const getInterviewDetail = async (processId) => {
    const res = await AxiosInstance.api.get(`/api/InterviewingSchedule/application/${processId}`);
    return res;
}

const InterviewScheduleService = {
    setInterviewScheduleTime,
    updateInterviewScheduleTime,
    confirmInterviewScheduleTime,
    markInterviewAsComplete,
    reviewInterviewResult,
    getInterviewDetail
};

export default InterviewScheduleService;