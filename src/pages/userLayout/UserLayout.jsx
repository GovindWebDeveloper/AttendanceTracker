import React,{useState} from "react";
import { Layout, Menu, Avatar, Typography, Dropdown, Space, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Button, Statistic, message } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
// import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const UserLayout = () => {
  const [status, setStatus] = useState({
    punchIn: null,
    breakIn: null,
    breakOut: null,
    punchOut: null,
  });

  const handleAction = (type) => {
    const time = new Date().toLocaleTimeString();
    setStatus((prev) => ({ ...prev, [type]: time }));
    message.success(`${type.replace(/([A-Z])/g, " $1")} marked at ${time}`);
  };

  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      console.log("Logged out");
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            margin: 16,
            color: "#fff",
            textAlign: "center",
            lineHeight: "64px",
            fontWeight: "bold",
            fontSize: "1.3em",
          }}
        >
          {collapsed ? "AT" : "AttendanceTracker"}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="attendance" icon={<ClockCircleOutlined />}>
            Attendance
          </Menu.Item>
          <Menu.Item key="employees" icon={<TeamOutlined />}>
            Employees
          </Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            My Profile
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                onClick: () => setCollapsed(!collapsed),
                style: { fontSize: 18, cursor: "pointer" },
              }
            )}
            <Title level={4} style={{ margin: 0 }}>
              Dashboard
            </Title>
          </Space>

          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
              <span>Govind Kumar</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{ margin: "24px", padding: 24, background: colorBgContainer }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Card title="Punch In" bordered>
                <Space direction="vertical">
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleAction("punchIn")}
                  >
                    Punch In
                  </Button>
                  <Statistic title="Time" value={status.punchIn || "--"} />
                </Space>
              </Card>
            </Col>

            <Col span={6}>
              <Card title="Break In" bordered>
                <Space direction="vertical">
                  <Button
                    icon={<PauseCircleOutlined />}
                    onClick={() => handleAction("breakIn")}
                  >
                    Break In
                  </Button>
                  <Statistic title="Time" value={status.breakIn || "--"} />
                </Space>
              </Card>
            </Col>

            <Col span={6}>
              <Card title="Break Out" bordered>
                <Space direction="vertical">
                  <Button
                    icon={<PauseCircleOutlined />}
                    onClick={() => handleAction("breakOut")}
                  >
                    Break Out
                  </Button>
                  <Statistic title="Time" value={status.breakOut || "--"} />
                </Space>
              </Card>
            </Col>

            <Col span={6}>
              <Card title="Punch Out" bordered>
                <Space direction="vertical">
                  <Button
                    danger
                    icon={<StopOutlined />}
                    onClick={() => handleAction("punchOut")}
                  >
                    Punch Out
                  </Button>
                  <Statistic title="Time" value={status.punchOut || "--"} />
                </Space>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
