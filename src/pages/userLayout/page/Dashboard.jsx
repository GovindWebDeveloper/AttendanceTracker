import "@ant-design/v5-patch-for-react-19";
import { useEffect, useState } from "react";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Space,
  Divider,
  Typography,
  message,
} from "antd";
import moment from "moment";

import { formatTime, calculateTotalHours } from "../../../utils/timeUtils";
import {
  postAttendanceAction,
  getMyAttendance,
} from "../../../services/attendanceService";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [status, setStatus] = useState({
    punchIn: null,
    breakIn: null,
    breakOut: null,
    punchOut: null,
  });

  const [totalHours, setTotalHours] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);

  useEffect(() => {
    let workInterval, breakInterval;
    if (isWorking) {
      workInterval = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    }

    if (isOnBreak) {
      breakInterval = setInterval(() => {
        setBreakSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(workInterval);
      clearInterval(breakInterval);
    };
  }, [isWorking, isOnBreak]);

  const handleAction = async (type) => {
    try {
      // Prevent duplicate Punch In
      if (type === "punchIn" && status.punchIn && !status.punchOut) {
        message.warning("You have already punched in.");
        return;
      }

      // Prevent duplicate Punch Out
      if (type === "punchOut" && status.punchOut) {
        message.warning("You have already punched out.");
        return;
      }

      const payload = {};

      if (type === "punchOut") {
        payload.workSeconds = workSeconds;
        payload.breakSeconds = breakSeconds;
      }

      await postAttendanceAction(type, payload);

      const time = new Date().toLocaleTimeString();
      setStatus((prev) => ({ ...prev, [type]: time }));

      // Timer logic
      if (type === "punchIn") {
        setIsWorking(true);
        localStorage.setItem("punchInStartTime", new Date().toISOString());
        message.success("You have punched in successfully.");
      }

      if (type === "breakIn") {
        setIsOnBreak(true);
        localStorage.setItem("breakInStartTime", new Date().toISOString());
        message.success("You are now on a break.");
      }

      if (type === "breakOut") {
        setIsOnBreak(false);
        localStorage.removeItem("breakInStartTime");
        message.success("Break ended. You're back to work.");
      }

      if (type === "punchOut") {
        setIsWorking(false);
        setIsOnBreak(false);
        fetchAttendanceData();
        localStorage.removeItem("punchInStartTime");
        localStorage.removeItem("breakInStartTime");
        message.success("You have punched out successfully.");
      }
    } catch (error) {
      console.error("handleAction error:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const res = await getMyAttendance();
      const todayDate = moment().format("DD-MM-YYYY");
      const todayAttendance = res.data.find(
        (record) => record.date === todayDate
      );

      if (todayAttendance) {
        const latestBreak = todayAttendance.breaks?.slice(-1)[0] || {};

        setStatus({
          punchIn: todayAttendance.punchIn || null,
          breakIn: latestBreak.breakIn || null,
          breakOut: latestBreak.breakOut || null,
          punchOut: todayAttendance.punchOut || null,
        });

        setWorkSeconds(todayAttendance.workSeconds || 0);
        setBreakSeconds(todayAttendance.breakSeconds || 0);

        if (todayAttendance.punchIn && !todayAttendance.punchOut) {
          setIsWorking(true);
        }
        if (latestBreak.breakIn && !latestBreak.breakOut) {
          setIsOnBreak(true);
        }

        const total = calculateTotalHours(
          todayAttendance.punchIn,
          todayAttendance.punchOut,
          todayAttendance.breaks
        );
        setTotalHours(total);
      }
    } catch (error) {
      console.log("Failed to get the data from the API", error);
    }
  };

  useEffect(() => {
    const initializeTimerState = async () => {
      await fetchAttendanceData();

      const punchInStartTime = localStorage.getItem("punchInStartTime");
      const breakInStartTime = localStorage.getItem("breakInStartTime");

      if (punchInStartTime && !status.punchOut) {
        const elapsed = Math.floor(
          (Date.now() - new Date(punchInStartTime).getTime()) / 1000
        );
        setWorkSeconds((prev) => prev + elapsed);
        setIsWorking(true);
      }

      if (breakInStartTime && !status.breakOut) {
        const elapsed = Math.floor(
          (Date.now() - new Date(breakInStartTime).getTime()) / 1000
        );
        setBreakSeconds((prev) => prev + elapsed);
        setIsOnBreak(true);
      }
    };

    initializeTimerState();
  }, []);

  const actionCards = [
    {
      type: "punchIn",
      label: "Punch In",
      icon: <PlayCircleOutlined />,
      color: "green",
    },
    {
      type: "breakIn",
      label: "Start Break",
      icon: <PauseCircleOutlined />,
      color: "orange",
    },
    {
      type: "breakOut",
      label: "End Break",
      icon: <PauseCircleOutlined />,
      color: "blue",
    },
    {
      type: "punchOut",
      label: "Punch Out",
      icon: <StopOutlined />,
      color: "red",
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Title level={2}>Employee Attendance Dashboard</Title>
      <Text type="secondary">
        Monitor your work and break times in real-time.
      </Text>

      <Divider orientation="left" orientationMargin="0">
        Attendance Actions
      </Divider>

      <Row gutter={[16, 16]}>
        {actionCards.map(({ type, label, icon, color }) => (
          <Col xs={24} sm={12} md={6} key={type}>
            <Card
              title={label}
              bordered
              style={{
                textAlign: "center",
                borderTop: `3px solid ${color}`,
                height: "100%",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  danger={type === "punchOut"}
                  icon={icon}
                  onClick={() => handleAction(type)}
                  block
                >
                  {label}
                </Button>
                <Statistic
                  title="Time"
                  prefix={<ClockCircleOutlined />}
                  value={status[type] || "--"}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="left" orientationMargin="0">
        Real-Time Timers
      </Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card title="Work Duration" bordered>
            <Statistic
              prefix={<HourglassOutlined />}
              value={formatTime(workSeconds)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Break Duration" bordered>
            <Statistic
              prefix={<HourglassOutlined />}
              value={formatTime(breakSeconds)}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left" orientationMargin="0">
        Summary
      </Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Total Working Hours">
            <Statistic
              title="After Punch Out"
              prefix={<CalendarOutlined />}
              value={totalHours || "--"}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
