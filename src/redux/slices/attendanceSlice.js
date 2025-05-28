import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postAttendanceAction,
  getMyAttendance,
} from "../../services/attendanceService";
import moment from "moment";

export const fetchMyAttendance = createAsyncThunk(
  "attendance/my-attendance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyAttendance();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Attendance Fetching failed"
      );
    }
  }
);
export const handleAttendanceAction = createAsyncThunk(
  "attendance/handleAttendanceAction",
  async ({ type }, { rejectWithValue }) => {
    try {
      await postAttendanceAction(type);
      return { type, timeStamp: new Date().toLocaleTimeString() };
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Post Action failed");
    }
  }
);

function formatDuration(ms = 0) {
  const duration = moment.duration(ms);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    status: {
      punchIn: null,
      punchOut: null,
      signOut: null,
      signIn: null,
    },
    totalWorkHour: "00:00:00",
    totalBreakHour: "00:00:00",
    totalExtraHour: "00:00:00",
    actualBreakHour: "00:00:00",
    firstPunchIn: null,
    lastPunchOut: null,
    isWorking: false,
    loading: false,
    error: null,
    currentDate: moment().format("YYYY-MM-DD"),
  },
  reducers: {
    resetAttendance: (state) => {
      state.status = {
        punchIn: null,
        punchOut: null,
        signIn: null,
        signOut: null,
      };
      state.totalWorkHour = "00:00:00";
      state.totalBreakHour = "00:00:00";
      state.totalExtraHour = "00:00:00";
      state.actualBreakHour = "00:00:00";
      state.firstPunchIn = null;
      state.lastPunchOut = null;
      state.isWorking = false;
      state.loading = false;
      state.error = null;
    },
    updateCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const today = action.payload.find(
          (entry) => entry.date === state.currentDate
        );
        if (today) {
          const punches = Array.isArray(today.punches) ? today.punches : [];
          const signs = Array.isArray(today.signs) ? today.signs : [];
          const lastPunch =
            punches.length > 0 ? punches[punches.length - 1] : null;
          const isCurrentlyWorking = lastPunch && !lastPunch.punchOut;

          state.status = {
            punchIn: lastPunch?.punchIn || null,
            punchOut: lastPunch?.punchOut || null,
            signOut: signs.length ? signs[signs.length - 1]?.signOut : null,
            signIn: signs.length ? signs[signs.length - 1]?.signIn : null,
          };
          state.isWorking = isCurrentlyWorking;

          const firstPunch = punches.find((p) => p.punchIn);
          const lastOut = [...punches].reverse().find((p) => p.punchOut);

          state.firstPunchIn = firstPunch?.punchIn || null;
          state.lastPunchOut = lastOut?.punchOut || null;
          state.totalBreakHour = formatDuration(today.breakHours);
          state.totalExtraHour = formatDuration(today.extraHoursToSkip);
          const actualBreakHour = today.breakHours - today.extraHoursToSkip;
          state.totalWorkHour = formatDuration(today.workHours);
          state.actualBreakHour = formatDuration(actualBreakHour);
        } else {
          state.status = {
            punchIn: null,
            punchOut: null,
            signIn: null,
            signOut: null,
          };
          state.firstPunchIn = null;
          state.lastPunchOut = null;
          state.totalWorkHour = "00:00:00";
          state.totalBreakHour = "00:00:00";
          state.totalExtraHour = "00:00:00";
          state.actualBreakHour = "00:00:00";
          state.isWorking = false;
        }
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleAttendanceAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAttendanceAction.fulfilled, (state, action) => {
        state.loading = false;
        const { type, timeStamp } = action.payload;
        if (type === "punchIn") {
          state.status.punchIn = timeStamp;
          state.status.punchOut = null;
          state.isWorking = true;
        } else if (type === "punchOut") {
          state.status.punchOut = timeStamp;
          state.isWorking = false;
        } else if (type === "signOut") {
          state.status.signOut = timeStamp;
          state.isWorking = false;
        } else if (type === "signIn") {
          state.status.signIn = timeStamp;
          state.isWorking = true;
        }
      })
      .addCase(handleAttendanceAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAttendance, updateCurrentDate } = attendanceSlice.actions;
export default attendanceSlice.reducer;
