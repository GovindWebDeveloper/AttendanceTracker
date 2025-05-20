import React from "react";
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
const { Title } = Typography;
const { useBreakpoint } = Grid;

const UserLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const screens = useBreakpoint();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      console.log("Logged out");
    }
  };

  const User = JSON.parse(localStorage.getItem("user"));

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
  const selectedKey = location.pathname.startsWith("/user/attendance")
    ? "attendance"
    : location.pathname.startsWith("/user/profile")
    ? "profile"
    : "dashboard"; // default fallback

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
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <NavLink to="/user/profile"> My Profile</NavLink>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider */}
      {!screens.xs && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            backgroundColor: "#001529", // deep blue
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
            <Title level={4} style={{ margin: 0 }}></Title>
          </Space>

          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
              <span>{User.name}</span>
            </Space>
          </Dropdown>
        </Header>

        {/* Drawer for mobile nav */}
        <Drawer
          title="Menu"
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
            margin: "24px",
            padding: 24,
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
