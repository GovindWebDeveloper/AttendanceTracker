import { Button, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../services/authService";
import { calculateTotalHours } from "../../../utils/timeUtils";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Title } = Typography;

// Utility to format milliseconds to "H M S"
const formatDuration = (ms) => {
  const duration = moment.duration(ms);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours}h ${minutes}m ${seconds}s`;
};

const Attendance = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchReport = async () => {
    try {
      const res = await axios.get("/attendance/my-attendance");
      const formatted = res.data.map((entry, index) => {
        const totalBreakMs = entry.breakHours || 0;
        const extraBreakMs = entry.extraHoursToSkip || 0;
        const actualBreakMs = totalBreakMs - extraBreakMs;
        const actualBreakFormatted = formatDuration(actualBreakMs);

        return {
          key: index,
          date: entry.date,
          punches: entry.punches
            ?.map((p) => `${p.punchIn} - ${p.punchOut || "--"}`)
            ?.join(", "),
          signs: entry.signs
            ?.map((s) => `${s.signOut} - ${s.signIn || "--"}`)
            ?.join(", "),
          totalHours: calculateTotalHours(entry.punches, entry.breaks),
          actualBreakHours: actualBreakFormatted, // New field
        };
      });
      setData(formatted);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Punch In-Out (Time)", dataIndex: "punches", key: "punches" },
    {
      title: "Total Break Hours",
      dataIndex: "actualBreakHours", // Updated to show break hours
      key: "actualBreakHours",
    },
    {
      title: "Total Working Hours",
      dataIndex: "totalHours",
      key: "totalHours",
    },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Title level={4}>Attendance Report</Title>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
      <Button onClick={() => navigate("/user")}>Go Back</Button>
    </div>
  );
};

export default Attendance;
