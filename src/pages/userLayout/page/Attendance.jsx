import { Button, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../services/authService";
import { calculateTotalHours } from "../../../utils/timeUtils";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Attendance = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchReport = async () => {
    try {
      const res = await axios.get("/attendance/my-attendance");
      const formatted = res.data.map((entry, index) => ({
        key: index,
        date: entry.date,
        punches: entry.punches
          ?.map((p) => `${p.punchIn} - ${p.punchOut || "--"}`)
          ?.join(", "),
        breaks: entry.breaks
          ?.map((b) => `${b.breakIn} - ${b.breakOut || "--"}`)
          ?.join(", "),
        totalHours: calculateTotalHours(entry.punches, entry.breaks),
      }));
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
    { title: "Punch In-Out(Time) ", dataIndex: "punches", key: "punches" },
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
