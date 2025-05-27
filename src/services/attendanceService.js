// attendanceService.js
import axios from "./authService";

// Generic POST action for attendance
export const postAttendanceAction = (type, payload = {}) => {
  return axios.post(`/attendance/${type}`, payload);
};

// Get current user's attendance records
export const getMyAttendance = () => {
  return axios.get("/attendance/my-attendance");
};

//Get user's working hour
