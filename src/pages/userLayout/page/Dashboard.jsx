import "@ant-design/v5-patch-for-react-19";
import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Typography,
  Space,
  message,
  Modal,
  Spin,
  Divider,
  Badge,
} from "antd";
import {
  PlayCircleOutlined,
  PoweroffOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
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

  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

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
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Loading your Dashboard..." />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "16px" }}>
        My Attendance Dashboard
      </Title>
      <Text
        type="secondary"
        style={{ display: "block", textAlign: "center", marginBottom: "24px" }}
      >
        Track your workday in real time with live updates
      </Text>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={18} lg={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {!status.punchOut ? (
                <>
                  {!status.punchIn ? (
                    <div style={{ textAlign: "center" }}>
                      <Text strong>Start your day by signing in</Text>
                      <br />
                      <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleAction("punchIn")}
                      >
                        Sign In
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Row gutter={16} justify="space-around">
                        <Col>
                          <Statistic
                            title="Sign In Time"
                            value={firstPunchIn || "N/A"}
                            prefix={<ClockCircleOutlined />}
                          />
                        </Col>
                        <Col>
                          <PersistentTimer isRunning={isWorking} />
                        </Col>
                      </Row>

                      <Button
                        danger
                        size="large"
                        onClick={() => setSignOutModalVisible(true)}
                      >
                        Sign Out
                      </Button>

                      <Modal
                        title="Confirm Sign Out"
                        visible={signOutModalVisible}
                        onOk={() => {
                          setSignOutModalVisible(false);
                          handleAction("punchOut");
                        }}
                        onCancel={() => setSignOutModalVisible(false)}
                        okText="Sign Out"
                        cancelText="Cancel"
                      >
                        <p>Are you sure you want to sign out?</p>
                      </Modal>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Row gutter={[16, 16]} justify="space-around">
                    <Col>
                      <Statistic title="Sign In Time" value={firstPunchIn} />
                    </Col>
                    <Col>
                      <Statistic title="Sign Out Time" value={lastPunchOut} />
                    </Col>
                    <Col>
                      <Statistic title="Total Work" value={totalWorkHour} />
                    </Col>
                    <Col>
                      <Statistic title="Total Break" value={actualBreakHour} />
                    </Col>
                  </Row>
                  <Divider />
                  <Space
                    wrap
                    size="middle"
                    style={{ justifyContent: "center", width: "100%" }}
                  >
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleAction("punchIn")}
                    >
                      Sign In Again
                    </Button>
                    <Button onClick={() => navigate("/user/attendance")}>
                      View Report
                    </Button>
                    <Button
                      danger
                      icon={<PoweroffOutlined />}
                      onClick={async () => {
                        try {
                          await handleAction("signOut");
                          dispatch(logout());
                          navigate("/");
                        } catch (error) {
                          console.log("Error SignOut and logout", error);
                        }
                      }}
                    >
                      Log Out
                    </Button>
                  </Space>
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
