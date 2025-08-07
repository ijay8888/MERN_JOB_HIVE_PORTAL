import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Paper, Typography, TextField, MenuItem, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip
} from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

const statuses = ["active", "inactive"];

export default function ManageJobs() {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    startDate: "",
    endDate: "",
    
  });

  const fetchJobs = async () => {
    try {
      const params = {};
      if (filters.status) params.isActive = filters.status === "active";
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.title) params.title = filters.title;

      const res = await axios.get("http://localhost:3000/api/admin/jobs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params,
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/jobs/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchJobs();
  };

 const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters((prev) => ({
    ...prev,
    [name]: value
  }));
};

  const handleApplyFilters = () => {
    setLoading(true);
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ p: 10 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 1, background: theme.palette.background.paper }}>
        <Typography 
          variant="h4" 
          fontWeight="600" 
          gutterBottom 
          sx={{ color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <WorkIcon fontSize="large" />
          Manage Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all job listings
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search by Title"
          name="title"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ minWidth: 200 }}
        />
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
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Posted On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(job._id)}>
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
