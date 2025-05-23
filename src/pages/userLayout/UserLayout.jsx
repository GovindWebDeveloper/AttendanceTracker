import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Dropdown,
  Space,
  Grid,
  Drawer,
  Button,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const UserLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  const screens = useBreakpoint();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      console.log("Logged out");
    }
  };

  const User = JSON.parse(localStorage.getItem("user"));

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );
  const selectedKey = location.pathname.startsWith("/user/attendance")
    ? "attendance"
    : location.pathname.startsWith("/user/profile")
    ? "profile"
    : "dashboard";

  const menuItems = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={() => setDrawerVisible(false)}
    >
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <NavLink to="/user"> Dashboard</NavLink>
      </Menu.Item>
      <Menu.Item key="attendance" icon={<ClockCircleOutlined />}>
        <NavLink to="/user/attendance"> Attendance</NavLink>
      </Menu.Item>
      {/* <Menu.Item key="profile" icon={<UserOutlined />}>
        <NavLink to="/user/profile"> My Profile</NavLink>
      </Menu.Item> */}
    </Menu>
  );

  // Current date and time

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const date = now.getDate();
      const months = now.getMonth() + 1;
      const month = months.toString().padStart(2, "0");
      const year = now.getFullYear();

      const hour = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hour >= 12 ? "PM" : "AM";
      const hoursIn12 = hour % 12 || 12;
      const hours = hoursIn12.toString().padStart(2, "0");

      const todayDate = `${date}:${month}:${year}`;
      const currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDateTime({ date: todayDate, time: currentTime });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider */}
      {!screens.xs && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            backgroundColor: "#001529",
          }}
        >
          <div
            style={{
              height: 64,
              margin: 16,
              color: "#fff",
              textAlign: "center",
              lineHeight: "64px",
              fontWeight: "bold",
              fontSize: "1.3em",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {collapsed ? "AT" : "AttendanceTracker"}
          </div>
          {menuItems}
        </Sider>
      )}

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            {screens.xs ? (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
              />
            ) : (
              React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  onClick: () => setCollapsed(!collapsed),
                  style: { fontSize: 18, cursor: "pointer" },
                }
              )
            )}
            <span style={{ margin: 0 }}>{currentDateTime.date}</span>
            <span style={{ margin: 0 }}>{currentDateTime.time}</span>
          </Space>

          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
              <span>{User.username}</span>
            </Space>
          </Dropdown>
        </Header>

        {/* Drawer for mobile nav */}
        <Drawer
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          {menuItems}
        </Drawer>

        <Content
          style={{
            // margin: "24px",
            padding: 10,
            background: "#fff",
            minHeight: "80vh",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
