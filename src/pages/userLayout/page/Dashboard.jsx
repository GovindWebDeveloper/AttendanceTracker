import { useEffect, useState } from "react";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Space,
  Divider,
  Progress,
} from "antd";
import moment from "moment";

import { formatTime, calculateTotalHours } from "../../../utils/timeUtils";
import {
  postAttendanceAction,
  updateTimerSeconds,
  getMyAttendance,
} from "../../../services/attendanceService";

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

  // Timer increment logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (isWorking && !isOnBreak) setWorkSeconds((prev) => prev + 1);
      if (isOnBreak) setBreakSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorking, isOnBreak]);

  // Update timer to backend every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isWorking || isOnBreak) {
        updateTimerSeconds(workSeconds, breakSeconds).catch((err) =>
          console.error("Failed to update timer:", err)
        );
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isWorking, isOnBreak, workSeconds, breakSeconds]);

  const handleAction = async (type) => {
    const time = new Date().toLocaleTimeString();
    setStatus((prev) => ({ ...prev, [type]: time }));

    if (type === "punchIn") setIsWorking(true);
    if (type === "breakIn") setIsOnBreak(true);
    if (type === "breakOut") setIsOnBreak(false);
    if (type === "punchOut") setIsWorking(false);

    try {
      const payload = type === "punchOut" ? { workSeconds, breakSeconds } : {};
      await postAttendanceAction(type, payload);

      if (type === "punchOut") {
        const totalSeconds = workSeconds - breakSeconds;
        setTotalHours(formatTime(totalSeconds));
      }
    } catch (error) {
      console.error("Action error:", error);
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

        if (todayAttendance.punchIn && !todayAttendance.punchOut)
          setIsWorking(true);
        if (latestBreak.breakIn && !latestBreak.breakOut) setIsOnBreak(true);

        const total = calculateTotalHours(
          todayAttendance.punchIn,
          todayAttendance.punchOut,
          todayAttendance.breaks
        );
        setTotalHours(total);
      }
    } catch (error) {
      console.log("Failed to get attendance data", error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return (
    <div style={{ padding: 8 }}>
      <Row gutter={[16, 16]}>
        {["punchIn", "breakIn", "breakOut", "punchOut"].map((action) => (
          <Col key={action} xs={24} sm={12} md={12} lg={6}>
            <Card title={action.replace(/([A-Z])/g, " $1")} bordered>
              <Space direction="vertical" size="middle">
                <Button
                  type={action === "punchOut" ? "default" : "primary"}
                  danger={action === "punchOut"}
                  icon={
                    action === "punchIn" ? (
                      <PlayCircleOutlined />
                    ) : action.includes("break") ? (
                      <PauseCircleOutlined />
                    ) : (
                      <StopOutlined />
                    )
                  }
                  onClick={() => handleAction(action)}
                  block
                >
                  {action.replace(/([A-Z])/g, " $1")}
                </Button>
                <Statistic title="Time" value={status[action] || "--"} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Live Timer">
            <Space
              direction="vertical"
              size="large"
              align="center"
              style={{ width: "100%" }}
            >
              <Progress
                type="circle"
                strokeColor={isOnBreak ? "#faad14" : "#52c41a"}
                percent={100}
                format={() =>
                  isOnBreak ? formatTime(breakSeconds) : formatTime(workSeconds)
                }
                width={150}
              />
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Total Working Hours">
            <Statistic
              title="Calculated After Punch Out"
              value={totalHours || "--"}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
