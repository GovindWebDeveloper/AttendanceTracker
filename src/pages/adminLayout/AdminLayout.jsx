import React from "react";
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
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      // Handle logout logic
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
            background: "rgba(255,255,255,0.3)",
            color: "#fff",
            textAlign: "center",
            lineHeight: "64px",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "ET" : "EmpTrack"}
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
              <span>Admin</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{ margin: "24px", padding: 24, background: colorBgContainer }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
