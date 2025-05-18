import { Card, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const profileFields = [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Role", value: user.role },
    { label: "Phone", value: user.phone || "--" },
    { label: "Department", value: user.department || "--" },
    { label: "Joining Date", value: user.joiningDate || "--" },
    { label: "Employee ID", value: user.employeeId || "--" },
    { label: "Location", value: user.location || "--" },
    { label: "Status", value: user.status || "--" },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Card
        title={
          <Title level={4} style={{ marginBottom: 0 }}>
            My Profile
          </Title>
        }
        bordered
        style={{ maxWidth: 700, margin: "0 auto" }}
      >
        <Row gutter={[16, 12]}>
          {profileFields.map((field, index) => (
            <Col xs={24} sm={12} key={index}>
              <Text strong>{field.label}:</Text> <br />
              <Text>{field.value}</Text>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
