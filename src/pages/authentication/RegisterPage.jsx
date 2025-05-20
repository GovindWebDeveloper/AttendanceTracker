import API from "../../services/authService";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Option } = Select;

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFinish = async (values) => {
    try {
      const file = values.profilePicture?.[0]?.originFileObj;
      let base64File = "";

      if (file) {
        base64File = await toBase64(file);
      }

      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        department: values.department,
        password: values.password,
        userId: values.userId,
        designation: values.designation,
        joiningDate: moment(values.joiningDate).format("DD-MMM-YYYY"),
        file: base64File,
      };

      const response = await API.post("/auth/register", payload);
      message.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.msg || "Registration failed.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: isMobile ? "#f0f2f5" : "#e8f0fe",
        minHeight: "100vh",
        padding: "2em 1em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="employee_register"
        onFinish={onFinish}
        autoComplete="off"
        style={{
          width: "100%",
          maxWidth: 1000,
          background: "#fff",
          padding: "2em",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          Employee Registration
        </h2>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Department"
              name="department"
              rules={[
                { required: true, message: "Please select your department" },
              ]}
            >
              <Select placeholder="Select department">
                <Option value="HR">HR</Option>
                <Option value="IT">IT</Option>
                <Option value="Sales">Sales</Option>
                <Option value="Operations">Operations</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Employee ID"
              name="userId"
              rules={[
                { required: true, message: "Please enter your employee ID" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Designation"
              name="designation"
              rules={[
                { required: true, message: "Please enter your designation" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Joining Date"
              name="joiningDate"
              rules={[
                { required: true, message: "Please select your joining date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Profile Picture"
              name="profilePicture"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload name="file" listType="picture" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "center", marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
          <p style={{ textAlign: "center" }}>
            {" "}
            Already have an Account
            <Button type="link" onClick={() => navigate("/login")}>
              Login
            </Button>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
