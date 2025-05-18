import moment from "moment";

// Format seconds into HH:mm:ss
export const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

// Calculate total working hours, subtracting breaks
export const calculateTotalHours = (punchIn, punchOut, breaks = []) => {
  if (!punchIn || !punchOut) return null;

  const toMoment = (timeStr) => moment(timeStr, "HH:mm:ss");
  const start = toMoment(punchIn);
  const end = toMoment(punchOut);

  let totalDuration = moment.duration(end.diff(start));

  breaks.forEach((br) => {
    if (br.breakIn && br.breakOut) {
      const bStart = toMoment(br.breakIn);
      const bEnd = toMoment(br.breakOut);
      totalDuration.subtract(moment.duration(bEnd.diff(bStart)));
    }
  });

  const hours = Math.floor(totalDuration.asHours());
  const minutes = Math.floor(totalDuration.asMinutes());
  const seconds = Math.floor(totalDuration.asSeconds());

  return `${hours}h ${minutes}min ${seconds}sec`;
};
