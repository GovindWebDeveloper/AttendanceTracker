import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import actionReducer from "./slices/attendanceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: actionReducer,
  },
});

export default store;
