import { Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../../services/authService";
import { calculateTotalHours } from "../../../utils/timeUtils";

const { Title } = Typography;

const Attendance = () => {
  const [data, setData] = useState([]);

  const fetchReport = async () => {
    try {
      const res = await axios.get("/attendance/my-attendance");
      const formatted = res.data.map((entry, index) => ({
        key: index,
        date: entry.date,
        punchIn: entry.punchIn || "--",
        punchOut: entry.punchOut || "--",
        breaks: entry.breaks
          ?.map((b) => `${b.breakIn} - ${b.breakOut || "--"}`)
          ?.join(", "),
        totalHours: calculateTotalHours(
          entry.punchIn,
          entry.punchOut,
          entry.breaks
        ),
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
    { title: "Punch In", dataIndex: "punchIn", key: "punchIn" },
    { title: "Punch Out", dataIndex: "punchOut", key: "punchOut" },
    { title: "Breaks", dataIndex: "breaks", key: "breaks" },
    { title: "Total Hours", dataIndex: "totalHours", key: "totalHours" },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Attendance Report
      </Title>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }} // Enable horizontal scroll on small screens
      />
    </div>
  );
};

export default Attendance;
