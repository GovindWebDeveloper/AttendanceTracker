import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "2em",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Page not found!!!</h1>
      <Button onClick={() => navigate("/")}>Back</Button>
    </div>
  );
};

export default NotFound;
