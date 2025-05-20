import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/userLayout/page/Dashboard";
import PrivateRoute from "./PrivateRoute";
import UserLayout from "../pages/userLayout/UserLayout";
import AdminLayout from "../pages/adminLayout/AdminLayout";
import LoginPage from "../pages/authentication/Page";
import RegisterPage from "../pages/authentication/RegisterPage";
import NotFound from "../pages/NotFound";
import Attendance from "../pages/userLayout/page/Attendance";
import Profile from "../pages/userLayout/page/Profile";
import AdminDashboard from "../pages/adminLayout/AdminDashboard";

const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/user"
          element={ 
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default MainRoute;
