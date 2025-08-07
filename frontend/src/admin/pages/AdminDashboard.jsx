import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    jobSeekers: 0,
    recruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "6rem" }}>
      {/* <h1>Admin Dashboard</h1> */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
        <StatCard title="Total Users" value={stats.totalUsers} bg="#1f2937" />
        <StatCard title="Job Seekers" value={stats.jobSeekers} bg="#06b6d4" />
        <StatCard title="Recruiters" value={stats.recruiters} bg="#2563eb" />
        <StatCard title="Total Jobs" value={stats.totalJobs} bg="#15803d" />
        {/* <StatCard title="Active Jobs" value={stats.activeJobs} bg="#f59e0b" /> */}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, bg }) => (
  <div style={{ flex: "1 1 200px", background: bg, padding: "1rem", borderRadius: "8px", color: "#fff" }}>
    <h2>{title}</h2>
    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
  </div>
);

export default AdminDashboard;
