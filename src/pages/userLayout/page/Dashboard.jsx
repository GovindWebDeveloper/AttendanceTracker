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
import { calculateTotalHours } from "../../../utils/timeUtils";
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
  });

  const [totalHours, setTotalHours] = useState("0:00");
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

        setStatus({
          punchIn: lastPunch?.punchIn || null,
          punchOut: lastPunch?.punchOut || null,
        });

        setIsWorking(isCurrentlyWorking);
        setTotalHours(calculateTotalHours(punches) || "0:00");
      } else {
        setStatus({ punchIn: null, punchOut: null });
        setIsWorking(false);
        setTotalHours("0:00");
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
                  {" "}
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
                        title="SignIn"
                        value={status.punchIn}
                        prefix={<ClockCircleOutlined />}
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
                  <Statistic title="SignIn(Time)" value={status.punchIn} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="SignOut(Time)" value={status.punchOut} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Total Hours" value={totalHours} />
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
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
