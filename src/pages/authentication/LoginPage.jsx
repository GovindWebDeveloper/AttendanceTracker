import { Form, Input, Button } from "antd";
import { images } from "../../assets";
import { FaUser } from "react-icons/fa";

const LoginPage = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null} style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
