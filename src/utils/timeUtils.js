import moment from "moment";

// Calculate total working hours, subtracting breaks
export const calculateTotalHours = (punches, breaks) => {
  const safePunches = Array.isArray(punches) ? punches : [];
  const safeBreaks = Array.isArray(breaks) ? breaks : [];

  const totalPunchSeconds = safePunches.reduce((sum, session) => {
    if (session && session.punchIn && session.punchOut) {
      const start = moment(session.punchIn, "h:mm:ss a");
      const end = moment(session.punchOut, "h:mm:ss a");
      return sum + end.diff(start, "seconds");
    }
    return sum;
  }, 0);

  const totalBreakSeconds = safeBreaks.reduce((sum, session) => {
    if (session && session.breakIn && session.breakOut) {
      const start = moment(session.breakIn, "h:mm:ss a");
      const end = moment(session.breakOut, "h:mm:ss a");
      return sum + end.diff(start, "seconds");
    }
    return sum;
  }, 0);

  const workSeconds = Math.max(0, totalPunchSeconds - totalBreakSeconds);

  const hours = Math.floor(workSeconds / 3600);
  const minutes = Math.floor((workSeconds % 3600) / 60);
  const seconds = workSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};
