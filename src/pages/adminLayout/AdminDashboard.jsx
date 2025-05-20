import { Card, Typography, Table, Tag, Divider } from "antd";
import axios from "../../services/authService";
import { useEffect, useState } from "react";

const { Title } = Typography;

const AdminDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/attendance/all-attendance");
      setAttendanceData(response.data.attendance || []);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "userId",
      key: "name",
      render: (user) => user?.name || "N/A",
    },
    {
      title: "Email",
      dataIndex: "userId",
      key: "email",
      render: (user) => user?.email || "N/A",
    },
    {
      title: "Department",
      dataIndex: "userId",
      key: "department",
      render: (user) => user?.department || "N/A",
    },
    {
      title: "Designation",
      dataIndex: "userId",
      key: "designation",
      render: (user) => user?.designation || "N/A",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Punch In",
      dataIndex: "punchIn",
      key: "punchIn",
    },
    {
      title: "Punch Out",
      dataIndex: "punchOut",
      key: "punchOut",
    },
    {
      title: "Work Time",
      dataIndex: "workSeconds",
      key: "workSeconds",
      render: (seconds) =>
        `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`,
    },
    {
      title: "Break Time",
      dataIndex: "breakSeconds",
      key: "breakSeconds",
      render: (seconds) => `${Math.floor(seconds / 60)}m`,
    },
    {
      title: "Breaks",
      dataIndex: "breaks",
      key: "breaks",
      render: (breaks) =>
        breaks?.length > 0
          ? breaks.map((b, index) => (
              <div key={index}>
                <Tag color="blue">
                  {b.breakIn} - {b.breakOut}
                </Tag>
              </div>
            ))
          : "N/A",
    },
  ];

  return (
    <div>
      <Title level={2}>Employee Attendance Report</Title>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Card
          title="Total Attendance Records"
          style={{ width: 300, marginBottom: 20 }}
        >
          <h1>{attendanceData.length}</h1>
        </Card>
        <Card title="Total Users" style={{ width: 300, marginBottom: 20 }}>
          <h1>{attendanceData.length}</h1>
        </Card>
      </div>
      <Divider />
      <Table
        columns={columns}
        dataSource={attendanceData}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminDashboard;
