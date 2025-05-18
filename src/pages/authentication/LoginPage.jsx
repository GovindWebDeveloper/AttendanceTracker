import { Form, Input, Button, message } from "antd";
import { images } from "../../assets";
import { FaUser } from "react-icons/fa";
import API from "../../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await API.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      const { token, user } = response.data;

      //Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        console.log("Welcome to Admin Dashborad");
        navigate("/admin");
      } else if (user.role === "user") {
        console.log("Welcome to User Dashboard");
        navigate("/user");
      }
    } catch (err) {
      console.log(err.response?.data?.msg || "Login Failed");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Please fill all required fields!", errorInfo);
  };
  return (
    <div
      style={{
        backgroundImage: `url(${images.loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 1,
        height: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Form
        style={{
          maxWidth: "450px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "auto",
          marginTop: "200px",
          backgroundColor: "white",
          padding: "2em",
          border: "2px solid grey",
          borderRadius: "10px",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <FaUser style={{ fontSize: "3.5em", margin: "auto" }} />
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>Login</h1>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item label={null} style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <div>
          <p style={{ textAlign: "center" }}>
            Don't have an account?
            <Button
              onClick={() => navigate("/register")}
              color="blue"
              variant="link"
            >
              {" "}
              Register
            </Button>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
