import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobList from "./components/utils/JobList";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import CustomNavbar from "./components/shared/navbar";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Dashboard from "./components/dashboard";
import Home from "./components/utils/Home";
import { setUser } from "./redux/features/authSlice";
import JobDetails from "./components/utils/JobDetails";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import AdminDashboard from "./admin/pages/AdminDashboard";
import { AdminProtectedRoute } from "./admin/routes/AdminProtectedRoutes";
import AdminNavbar from "./admin/components/AdminNavbar";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageJobs from "./admin/pages/ManageJobs";
import Applications from "./admin/pages/Applications";

const safeParseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn("Invalid JSON in localStorage, clearing...");
    localStorage.removeItem("user");
    return null;
  }
};

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const showAdminNavbar = user?.role === "admin" && location.pathname.startsWith("/admin");

  useEffect(() => {
    const savedUser = safeParseJSON(localStorage.getItem("user"));
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, [dispatch]);

  return (
    <>
      {showAdminNavbar ? <AdminNavbar /> : <CustomNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <AdminProtectedRoute>
              <ManageJobs />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <AdminProtectedRoute>
              <Applications />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
