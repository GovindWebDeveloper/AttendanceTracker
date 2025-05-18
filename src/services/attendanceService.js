// attendanceService.js
import axios from "./authService";

// Generic POST action for attendance
export const postAttendanceAction = (type, payload = {}) => {
  return axios.post(`/attendance/${type}`, payload);
};

// Update both work and break seconds
export const updateTimerSeconds = (workSeconds, breakSeconds) => {
  return axios.post(`/attendance/update-seconds`, {
    workSeconds,
    breakSeconds,
  });
};

// Get current user's attendance records
export const getMyAttendance = () => {
  return axios.get("/attendance/my-attendance");
};
