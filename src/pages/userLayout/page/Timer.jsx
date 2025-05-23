import { useState, useEffect } from "react";

const PersistentTimer = ({ isRunning }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const storedStart = localStorage.getItem("startTime");
      if (!storedStart) {
        localStorage.setItem("startTime", Date.now().toString());
      }
    } else {
      localStorage.removeItem("startTime");
    }
    localStorage.setItem("isRunning", isRunning.toString());
  }, [isRunning]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        const start = parseInt(localStorage.getItem("startTime"), 10);
        const now = Date.now();
        setTimer(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return <p>Timer: {formatTime(timer)}</p>;
};

export default PersistentTimer;
