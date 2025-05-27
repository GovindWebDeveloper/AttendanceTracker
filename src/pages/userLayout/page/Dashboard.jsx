import "@ant-design/v5-patch-for-react-19";
import { useEffect, useState } from "react";
import { PlayCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Typography,
  Divider,
  Space,
  message,
  Popconfirm,
  Spin,
} from "antd";
import moment from "moment";
import {
  postAttendanceAction,
  getMyAttendance,
} from "../../../services/attendanceService";
import { useNavigate } from "react-router-dom";
import PersistentTimer from "./Timer";

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState({
    punchIn: null,
    punchOut: null,
    signOut: null,
  });
  const [totalWorkHours, setTotalWorkHours] = useState("0:00");
  const [totalBreakHours, setTotalBreakHours] = useState("0:00");
  const [totalExtraHours, setTotalExtraHours] = useState("0:00");
  const [actualBreakHours, setActualBreakHours] = useState("0:00");
  const [firstPunchIn, setFirstPunchIn] = useState(null);
  const [lastPunchOut, setLastPunchOut] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));

  const fetchAttendanceData = async () => {
    try {
      const res = await getMyAttendance();
      const todayDate = moment().format("YYYY-MM-DD");
      const today = res.data.find((entry) => entry.date === todayDate);

      if (today) {
        const punches = Array.isArray(today.punches) ? today.punches : [];
        const lastPunch =
          punches.length > 0 ? punches[punches.length - 1] : null;
        const isCurrentlyWorking = lastPunch && !lastPunch.punchOut;

        const signs = Array.isArray(today.signs) ? today.signs : [];
        const lastSigns = signs.length > 0 ? signs[signs.length - 1] : null;

        setStatus({
          punchIn: lastPunch?.punchIn || null,
          punchOut: lastPunch?.punchOut || null,
          signOut: lastSigns?.signOut || null,
          signIn: lastSigns?.signIn || null,
        });

        setIsWorking(isCurrentlyWorking);

        const firstPunch = punches.find((p) => p.punchIn);
        const lastOut = [...punches].reverse().find((p) => p.punchOut);

        setFirstPunchIn(firstPunch?.punchIn || null);
        setLastPunchOut(lastOut?.punchOut || null);
        setTotalBreakHours(today.breakHours);
        setTotalExtraHours(today.extraHoursToSkip);

        const formatDuration = (ms) => {
          const duration = moment.duration(ms);
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();
          const seconds = duration.seconds();
          return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
        };
        const actualBreakHour = today.breakHours - today.extraHoursToSkip;
        setTotalWorkHours(formatDuration(today.workHours || 0));
        setActualBreakHours(formatDuration(actualBreakHour || 0));
      } else {
        setStatus({
          punchIn: null,
          punchOut: null,
          signOut: null,
          signIn: null,
        });
        setFirstPunchIn(null);
        setLastPunchOut(null);
        setIsWorking(false);
        setTotalWorkHours("0:00");
        setTotalBreakHours("0:00");
        setTotalExtraHours("0:00");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      message.error("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const nowDate = moment().format("YYYY-MM-DD");
      if (nowDate !== currentDate) {
        await handleAction("punchOut", true);
        setTimeout(async () => {
          await postAttendanceAction("punchIn");
          setStatus((prev) => ({
            ...prev,
            punchIn: new Date().toLocaleTimeString(),
            punchOut: null,
          }));
          setIsWorking(true);
          setCurrentDate(nowDate);
          await fetchAttendanceData();
        }, 1000);
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const handleAction = async (type, silent = false) => {
    if (actionLoading) return;
    setActionLoading(true);

    try {
      if (type === "punchIn" && status.punchIn && !status.punchOut && !silent) {
        message.warning("Already Signed In.");
        setActionLoading(false);
        return;
      }

      if (type === "punchOut" && status.punchOut && !silent) {
        message.warning("Already Signed Out.");
        setActionLoading(false);
        return;
      }

      if (type === "signOut") {
        await postAttendanceAction("signOut");
        await fetchAttendanceData();
        message.success("Punched Out successfully");
        setActionLoading(false);
        return;
      }

      await postAttendanceAction(type);

      if (type === "punchIn") {
        setStatus((prev) => ({
          ...prev,
          punchIn: new Date().toLocaleTimeString(),
          punchOut: null,
        }));
        setIsWorking(true);
        if (!silent) message.success("SignIn Success.");
      } else if (type === "punchOut") {
        setIsWorking(false);
        if (!silent) message.success("SignOut Success.");
      }

      await fetchAttendanceData();
    } catch (err) {
      console.error("Action error:", err);
      if (!silent) message.error("Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <Spin tip="Loading Dashboard..." size="large" />
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    console.log("Logged Out");
  };

  return (
    <div style={{ padding: 16 }}>
      <Title level={4}>Attendance Dashboard</Title>
      <Text type="secondary">Track your workday in real time.</Text>
      <Divider />

      <Card bordered>
        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center" }}
          size="large"
        >
          {!status.punchOut ? (
            <>
              {!status.punchIn ? (
                <>
                  <p>SignIn to start tracking your working hour.</p>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleAction("punchIn")}
                    loading={actionLoading}
                  >
                    SignIn
                  </Button>
                </>
              ) : (
                <>
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                      <Statistic
                        title="SignIn(Time)"
                        value={firstPunchIn || "N/A"}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <PersistentTimer isRunning={isWorking} />
                    </Col>
                  </Row>

                  <Popconfirm
                    title="Confirm SignOut"
                    onConfirm={() => handleAction("punchOut")}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger loading={actionLoading}>
                      SignOut
                    </Button>
                  </Popconfirm>
                </>
              )}
            </>
          ) : (
            <>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="SignIn(Time)"
                    value={firstPunchIn || "N/A"}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="SignOut(Time)" value={status.punchOut} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Total Work" value={totalWorkHours} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Total Break" value={actualBreakHours} />
                </Col>
              </Row>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleAction("punchIn")}
                loading={actionLoading}
              >
                SignIn Again
              </Button>
              <Button onClick={() => navigate("/user/attendance")}>
                View Report
              </Button>
              <Button
                color="danger"
                variant="solid"
                onClick={async () => {
                  try {
                    await handleAction("signOut");
                    handleLogout();
                  } catch (error) {
                    console.error("SignOut and logged out failed");
                  }
                }}
              >
                PunchOut
              </Button>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
