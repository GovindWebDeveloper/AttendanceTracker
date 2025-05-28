import { Form, Input, Button, message } from "antd";
import { images } from "../../assets";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation based in role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    dispatch(loginUser(values))
      .unwrap()
      .catch((err) => message.error(err));
  };

  return (
    <div
      style={{
        backgroundImage: isMobile
          ? `url(${images.loginBg})`
          : `url(${images.loginBg})`,
        backgroundColor: isMobile ? "#f0f2f5" : "transparent",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1em",
      }}
    >
      <Form
        style={{
          maxWidth: 450,
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "2em",
          border: "1px solid #d9d9d9",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div style={{ textAlign: "center", marginBottom: "1em" }}>
          <FaUser style={{ fontSize: "3em", color: "#1890ff" }} />
          <h1 style={{ margin: "0.5em 0" }}>Login</h1>
        </div>

        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: "Please input your username!" },
            {
              pattern: "^[a-zA-Z][a-zA-Z0-9_]{5,19}$",
              message:
                "Username must start with a letter, can contain letters, numbers, and underscores, and must be 5 to 20 characters long",
            },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input your password!" },
            {
              pattern: "^.{6,20}$",
              message: "Password must be between 6 and 20 characters long.",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? "Logging in..." : "Submit"}
          </Button>
        </Form.Item>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </Form>
    </div>
  );
};

export default LoginPage;
