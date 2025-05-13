import React from "react";
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

const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      joiningDate: values.joiningDate.format("YYYY-MM-DD"),
    };
    console.log("Form Submitted:", formattedValues);
    message.success("Registration successful!");
  };

  return (
    <div style={{}}>
      <Form
        form={form}
        layout="vertical"
        name="employee_register"
        onFinish={onFinish}
        autoComplete="off"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 24,
          background: "#fff",
          borderRadius: 8,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>
          Employee Registration
        </h2>

        <Row gutter={16}>
          {/* Left Column */}
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
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

          {/* Right Column */}
          <Col span={12}>
            <Form.Item
              label="Employee ID"
              name="employeeId"
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

            <Form.Item label="Profile Picture" name="profilePicture">
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
