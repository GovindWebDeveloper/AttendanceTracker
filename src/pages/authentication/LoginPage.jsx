import { Form, Input, Button, message } from "antd";
import { images } from "../../assets";
import { FaUser } from "react-icons/fa";
import API from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await API.post("/auth/", {
        email: values.email,
        password: values.password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "user") {
        navigate("/user");
      }
    } catch (err) {
      message.error(err.response?.data?.msg || "Login Failed");
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.warning("Please fill all required fields!");
  };

  return (
    <div
      style={{
        backgroundImage: isMobile ? "none" : `url(${images.loginBg})`,
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
          backgroundColor: "white",
          padding: "2em",
          border: "1px solid #d9d9d9",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div style={{ textAlign: "center", marginBottom: "1em" }}>
          <FaUser style={{ fontSize: "3em", color: "#1890ff" }} />
          <h1 style={{ margin: "0.5em 0" }}>Login</h1>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>

        <p style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <Button type="link" onClick={() => navigate("/register")}>
            Register
          </Button>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
