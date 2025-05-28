import "@ant-design/v5-patch-for-react-19";
import { useEffect } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Typography,
  Space,
  message,
  Popconfirm,
  Spin,
  Divider,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PersistentTimer from "./Timer";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMyAttendance,
  handleAttendanceAction,
  updateCurrentDate,
} from "../../../redux/slices/attendanceSlice";
import { logout } from "../../../redux/slices/authSlice";

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    status,
    totalWorkHour,
    actualBreakHour,
    firstPunchIn,
    lastPunchOut,
    isWorking,
    loading,
    error,
    currentDate,
  } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchMyAttendance());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const nowDate = now.format("YYYY-MM-DD");
      const nowTime = now.format("HH:mm:ss");

      if (nowDate !== moment().format("YYYY-MM-DD")) {
        dispatch(updateCurrentDate(nowDate));
        dispatch(handleAttendanceAction({ type: "punchOut" }));
        dispatch(fetchMyAttendance()).then(() => {
          dispatch(handleAttendanceAction({ type: "punchIn" }));
          dispatch(fetchMyAttendance());
        });
      }
      if (now.hour() === 23 && now.minute() === 59 && now.second() === 58) {
        dispatch(handleAttendanceAction({ type: "punchOut" }));
        dispatch(fetchMyAttendance());
      }

      if (now.hour() === 0 && now.minute() === 0 && now.second() === 1) {
        dispatch(handleAttendanceAction({ type: "punchIn" }));
        dispatch(fetchMyAttendance());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleAction = async (type) => {
    try {
      await dispatch(handleAttendanceAction({ type })).unwrap();
      await dispatch(fetchMyAttendance()).unwrap();
    } catch (error) {
      console.error("Error to fetch the attendance data", message.error);
    }
  };
  if (loading) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <Spin tip="Loading Dashboard..." size="large" />
      </div>
    );
  }
  if (error) {
    return <div>Error:{error}</div>;
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
                  <p>SignIn to start tracking your working hour.</p>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleAction("punchIn")}
                    loading={loading}
                  >
                    SignIn
                  </Button>
                </>
              ) : (
                <>
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                      <Statistic title="SignIn(Time)" value={firstPunchIn} />
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
                    loading={loading}
                  >
                    <Button danger loading={loading}>
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
                  <Statistic title="SignIn(Time)" value={firstPunchIn} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="SignOut(Time)" value={lastPunchOut} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Total Work" value={totalWorkHour} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Total Break" value={actualBreakHour} />
                </Col>
              </Row>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleAction("punchIn")}
                loading={loading}
              >
                SignIn Again
              </Button>
              <Button
                onClick={() => navigate("/user/attendance")}
                loading={loading}
              >
                View Report
              </Button>
              <Button
                color="danger"
                variant="solid"
                onClick={async () => {
                  try {
                    await handleAction("signOut");
                    dispatch(logout());
                    navigate("/");
                  } catch (error) {
                    console.log("Error SignOut and logout", error);
                  }
                }}
                loading={loading}
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
