import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { predefinedJobs } from "../../data/predefinedJobs";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  Paper,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as SalaryIcon,
  Search as SearchIcon,
  Schedule as TimeIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";


const jobTypeColors = {
  "Full-Time": "primary",
  "Part-Time": "secondary",
  Internship: "warning",
  Freelance: "success",
};


const categoryColors = {
  IT: "info",
  Finance: "success",
  Healthcare: "error",
  Networking: "warning",
  Other: "default",
};

export default function JobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const token = localStorage.getItem("token");

  
  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = token
        ? "http://localhost:3000/api/jobs"
        : "http://localhost:3000/api/jobs/public/search";

      if (!token) {
        const queryParams = new URLSearchParams({
          keyword: searchTerm || "",
          location: locationFilter || "",
          jobType: jobTypeFilter || "",
          category: categoryFilter || "",
        }).toString();

        url = `http://localhost:3000/api/jobs/public/search?${queryParams}`;
      }

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const fetchedJobs = res.data.jobs || [];
      const combinedJobs = [...predefinedJobs, ...fetchedJobs];

      setJobs(combinedJobs);
      setFilteredJobs(combinedJobs);
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error.response?.data || error.message);
      setJobs(predefinedJobs);
      setFilteredJobs(predefinedJobs);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchJobs();
  }, []);


  useEffect(() => {
    if (!token) {
      const delayDebounce = setTimeout(() => {
        fetchJobs();
      }, 400);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, locationFilter, jobTypeFilter, categoryFilter]);

  useEffect(() => {
    if (token) {
      let result = [...jobs];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (job) =>
            job.title?.toLowerCase().includes(term) ||
            job.company?.toLowerCase().includes(term) ||
            job.description?.toLowerCase().includes(term)
        );
      }

      if (locationFilter) {
        const loc = locationFilter.toLowerCase();
        result = result.filter((job) =>
          job.location?.toLowerCase().includes(loc)
        );
      }

      if (jobTypeFilter) {
        result = result.filter((job) => job.jobType === jobTypeFilter);
      }

      if (categoryFilter) {
        result = result.filter((job) => job.category === categoryFilter);
      }

      setFilteredJobs(result);
    }
  }, [searchTerm, locationFilter, jobTypeFilter, categoryFilter, jobs, token]);

  const applyJob = async (jobId) => {
    
    if (!token) {
      
      setSnackbar({
        open: true,
        message: "Please login to apply!",  
        severity: "warning",
      });
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3000/api/jobs/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Applied Successfully!",
        severity: "success",
      });

      fetchJobs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to apply",
        severity: "error",
      });
    }
  };


  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" />
            <Box sx={{ display: "flex", gap: 1, my: 1 }}>
              <Skeleton variant="rectangular" width={80} height={24} />
              <Skeleton variant="rectangular" width={80} height={24} />
            </Box>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={36}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", py: 6, pt: 10 }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            p: 4,
            borderRadius: 2,
            background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
            color: "white",
            boxShadow: 3,
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Find Your Dream Job
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 800, mx: "auto", mb: 3 }}>
            Browse through thousands of full-time and part-time jobs near you
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Grid container spacing={2} alignItems="center">
  <Grid item xs={12} md={3}>
    <TextField
      fullWidth
      label="Keyword"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{ height: 48, minWidth: 180 }}
    />
  </Grid>

  <Grid item xs={12} md={3}>
    <TextField
      fullWidth
      label="Location"
      variant="outlined"
      size="small"
      value={locationFilter}
      onChange={e => setLocationFilter(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{ height: 48, minWidth: 180 }}
    />
  </Grid>

  <Grid item xs={6} md={3}>
    <TextField
      select
      fullWidth
      label="Job Type"
      variant="outlined"
      size="small"
      value={jobTypeFilter}
      onChange={e => setJobTypeFilter(e.target.value)}
      sx={{ height: 48, minWidth: 180 }}
    >
      <MenuItem value="">All Types</MenuItem>
      <MenuItem value="Full-Time">Full-Time</MenuItem>
      <MenuItem value="Part-Time">Part-Time</MenuItem>
      <MenuItem value="Internship">Internship</MenuItem>
      <MenuItem value="Freelance">Freelance</MenuItem>
    </TextField>
  </Grid>

  <Grid item xs={6} md={3}>
    <TextField
      select
      fullWidth
      label="Category"
      variant="outlined"
      size="small"
      value={categoryFilter}
      onChange={e => setCategoryFilter(e.target.value)}
      sx={{ height: 48, minWidth: 180 }}
    >
      <MenuItem value="">All Categories</MenuItem>
      <MenuItem value="IT">IT</MenuItem>
      <MenuItem value="Finance">Finance</MenuItem>
      <MenuItem value="Healthcare">Healthcare</MenuItem>
      <MenuItem value="Networking">Networking</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </TextField>
  </Grid>
</Grid>

        {/* Results Count */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {loading
            ? "Loading jobs..."
            : `Showing ${filteredJobs.length} ${
                filteredJobs.length === 1 ? "job" : "jobs"
              }`}
        </Typography>

        {/* Job Cards */}
        <Grid container spacing={3}>
          {loading ? (
            renderSkeletons()
          ) : filteredJobs.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  No jobs found matching your criteria
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setJobTypeFilter("");
                    setCategoryFilter("");
                    fetchJobs();
                  }}
                >
                  Clear filters
                </Button>
              </Paper>
            </Grid>
          ) : (
            filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <motion.div whileHover={{ y: -5 }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderLeft: `4px solid ${
                        jobTypeColors[job.jobType]
                          ? (theme) =>
                              theme.palette[jobTypeColors[job.jobType]].main
                          : (theme) => theme.palette.primary.main
                      }`,
                      transition: "box-shadow 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: (theme) => theme.palette.primary.main,
                            width: 56,
                            height: 56,
                            mr: 2,
                          }}
                        >
                          {job.company
                            ? job.company.charAt(0).toUpperCase()
                            : "J"}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            <Link
                              to={`/jobs/${job._id}`}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              {job.title}
                            </Link>
                          </Typography>
                          <Typography color="text.secondary">
                            {job.company}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocationIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>

                      {job.salary && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <SalaryIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">
                            Rs. {job.salary}
                          </Typography>
                        </Box>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          mb: 2,
                        }}
                      >
                        <Chip
                          icon={<TimeIcon fontSize="small" />}
                          label={job.jobType}
                          color={jobTypeColors[job.jobType] || "default"}
                          size="small"
                        />
                        <Chip
                          icon={<CategoryIcon fontSize="small" />}
                          label={job.category}
                          color={categoryColors[job.category] || "default"}
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {job.description || "No description provided"}
                      </Typography>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => applyJob(job._id)}
                        sx={{
                          mt: "auto",
                          background:
                            "linear-gradient(90deg, #3f51b5, #2196f3)",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #303f9f, #1976d2)",
                          },
                        }}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
