import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Switch, Tooltip, Typography, CircularProgress,
  Box, TextField, MenuItem, Button,
} from "@mui/material";

import WorkIcon from '@mui/icons-material/Work';

import { useTheme } from '@mui/material/styles';

import GroupIcon from '@mui/icons-material/Group';

import DeleteIcon from "@mui/icons-material/Delete";

const roles = ["seeker", "recruiter", "admin"];
const statuses = ["active", "inactive"];


export default function ManageUsers() {
    const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    startDate: "",
    endDate: ""
  });

const fetchUsers = async () => {
  try {
    const params = {};
    if (filters.role) params.role = filters.role;
    if (filters.status) params.isActive = filters.status === "active";
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const res = await axios.get("http://localhost:3000/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params,
    });
    setUsers(res.data);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};


  const handleToggle = async (id, isActive) => {
    await axios.put(`http://localhost:3000/api/admin/users/${id}/status`,
      { isActive: !isActive },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchUsers();
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    setLoading(true);
    fetchUsers();
  };

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ p: 10 }}>
      <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 1,
              background: theme.palette.background.paper,
            }}>
              <Typography 
                variant="h4" 
                fontWeight="600" 
                gutterBottom
                sx={{ 
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <GroupIcon fontSize="large" />
                Manage Users
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage all users
              </Typography>
            </Paper>

      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          select
          label="Role"
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {roles.map((role) => <MenuItem key={role} value={role}>{role}</MenuItem>)}
        </TextField>

        <TextField
          select
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {statuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
        </TextField>

        <TextField
          type="date"
          name="startDate"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleFilterChange}
        />

        <TextField
          type="date"
          name="endDate"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate}
          onChange={handleFilterChange}
        />

        <Button variant="contained" onClick={handleApplyFilters}>Apply</Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.isActive}
                    onChange={() => handleToggle(user._id, user.isActive)}
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(user._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
