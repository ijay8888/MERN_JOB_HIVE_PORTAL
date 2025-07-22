import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Avatar,
  Snackbar,
  Alert,
  Stack,
  Divider,
  Container,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Badge,
  Paper,
} from "@mui/material";
import {
  Edit,
  Delete,
  People,
  Close,
  CheckCircle,
  Work,
  AttachFile,
  CloudUpload,
  Person,
  Business,
  LocationOn,
  MonetizationOn,
  Description,
  Category,
  AccessTime,
  Download,
  Visibility,
  Add,
  Save,
  Cancel,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,
    top: 10,
    padding: '0 4px',
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    jobType: "",
    category: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [editJob, setEditJob] = useState(null);

  const [profile, setProfile] = useState(null);
  const [profileEdit, setProfileEdit] = useState({ fullName: "", phoneNumber: "" });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const token = localStorage.getItem("token");
  const recruiterId = JSON.parse(localStorage.getItem("user"))._id;
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      setProfileEdit({
        fullName: res.data.user.fullName,
        phoneNumber: res.data.user.phoneNumber || "",
      });
      dispatch(setUser(res.data.user));
    } catch (error) {
      console.error("PROFILE FETCH ERROR:", error.response?.data || error.message);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        "http://localhost:3000/api/user/profile",
        { fullName: profileEdit.fullName, phoneNumber: profileEdit.phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
      fetchProfile();
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to update profile", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!profilePhotoFile) {
      setSnackbar({ open: true, message: "Please select a photo first!", severity: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", profilePhotoFile);

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/user/upload?type=photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await axios.get("http://localhost:3000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user;
      setProfile(updatedUser);
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfilePhotoFile(null);
      setSnackbar({ open: true, message: "Photo updated successfully!", severity: "success" });
    } catch (error) {
      console.error("PHOTO UPLOAD ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to upload photo", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const myJobs = res.data.jobs.filter((job) => job.postedBy._id === recruiterId);
      setJobs(myJobs);
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to fetch jobs", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchProfile();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      setSnackbar({ open: true, message: "Please fill all required fields!", severity: "warning" });
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/jobs", newJob, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "Job posted successfully!", severity: "success" });
      setNewJob({ 
        title: "", 
        company: "", 
        location: "", 
        salary: "", 
        description: "",
        jobType: "",
        category: ""
      });
      fetchJobs();
    } catch (error) {
      console.error("POST JOB ERROR:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to post job",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewApplicants = async (job) => {
    try {
      setLoading(true);
      setSelectedJob(job);
      const res = await axios.get(`http://localhost:3000/api/jobs/${job._id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data.applicants);
    } catch (error) {
      console.error("FETCH APPLICANTS ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to fetch applicants", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this job?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "Job deleted successfully!", severity: "success" });
      fetchJobs();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to delete job", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const openEditMode = (job) => {
    setEditJob(job);
    setEditMode(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();

    if (!editJob.title || !editJob.company || !editJob.location || !editJob.description) {
      setSnackbar({ open: true, message: "Please fill all required fields!", severity: "warning" });
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:3000/api/jobs/${editJob._id}`,
        {
          title: editJob.title,
          company: editJob.company,
          location: editJob.location,
          salary: editJob.salary,
          description: editJob.description,
          jobType: editJob.jobType,
          category: editJob.category
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ open: true, message: "Job updated successfully!", severity: "success" });
      setEditMode(false);
      setEditJob(null);
      fetchJobs();
    } catch (error) {
      console.error("UPDATE JOB ERROR:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Failed to update job", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 10, md: 12 }, py: 0 }}>
      {loading && <LinearProgress color="primary"/>}
      
      <Grid container spacing={3}>
        {/* Profile Section - Left Column */}

        <Grid item xs={12} md={3}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ height: '100%', boxShadow: 2, }}>
              <CardHeader 
                title="My Profile" 
                avatar={<Person color="primary" />}
                sx={{ 
                  backgroundColor: 'info.light',
                  color: 'white',
                  '& .MuiCardHeader-title': { fontSize: '1.2rem' }
                }}
              />
              <CardContent>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={<CheckCircle fontSize="small" />}
                  >
                    <Avatar 
                      src={profile?.profilePhoto || ""} 
                      sx={{ width: 80, height: 80, border: '2px solid', borderColor: 'primary.main' }}
                    />
                  </StyledBadge>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {profile?.fullName || "Recruiter Name"}
                    </Typography>
                    <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Business fontSize="small" sx={{ mr: 0.5 }} /> {profile?.email || "Your Company"}
                    </Typography>
                    <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5 }} /> {profile?.phoneNumber || "Location"}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    value={profileEdit.fullName}
                    onChange={(e) => setProfileEdit({ ...profileEdit, fullName: e.target.value })}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: <Person color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                  <TextField
                    label="Phone Number"
                    value={profileEdit.phoneNumber}
                    onChange={(e) => setProfileEdit({ ...profileEdit, phoneNumber: e.target.value })}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: <AttachFile color="action" sx={{ mr: 1 }} />,
                    }}
                  />

                  <Button 
                    variant="contained" 
                    onClick={handleProfileUpdate}
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    Update Profile
                  </Button>

                  <Button 
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    fullWidth
                  >
                    Upload New Photo
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePhotoFile(e.target.files[0])}
                    />
                  </Button>
                  {profilePhotoFile && (
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={handlePhotoUpload}
                      startIcon={<CheckCircle />}
                      disabled={loading}
                    >
                      Confirm Upload
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Main Content - Right Column */}
        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            {/* Job Posting Card */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader 
                  title="Post New Job Opportunity" 
                  avatar={<Work color="primary" />}
                  sx={{ 
                    backgroundColor: 'info.light',
                    color: 'white',
                    '& .MuiCardHeader-title': { fontSize: '1.2rem' }
                  }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Job Title"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: <Work color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Company Name"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: <Business color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Location"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Salary"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: <MonetizationOn color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Job Type"
                        value={newJob.jobType || ""}
                        onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                        fullWidth
                        size="small"
                        SelectProps={{ native: true }}
                        InputProps={{
                          startAdornment: <AccessTime color="action" sx={{ mr: 1 }} />,
                        }}
                      >
                        <option value="">Select Job Type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Remote">Remote</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Category / Industry"
                        value={newJob.category || ""}
                        onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                        fullWidth
                        size="small"
                        SelectProps={{ native: true }}
                        InputProps={{
                          startAdornment: <Category color="action" sx={{ mr: 1 }} />,
                        }}
                      >
                        <option value="">Select category</option>
                        <option value="IT">IT / Software</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Other">Other</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Job Description"
                        multiline
                        rows={4}
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        fullWidth
                        InputProps={{
                          startAdornment: <Description color="action" sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handlePostJob}
                        startIcon={<Add />}
                        disabled={loading}
                        sx={{
                          background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
                          borderRadius: "8px",
                          fontWeight: "bold",
                          py: 1.5,
                          width: '100%',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Post Job Opportunity
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* My Jobs Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader 
                  title="My Posted Jobs" 
                  avatar={<Work color="primary" />}
                  sx={{ 
                    backgroundColor: 'info.light',
                    color: 'white',
                    '& .MuiCardHeader-title': { fontSize: '1.2rem' }
                  }}
                />
                <CardContent>
                  {jobs.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
                      <Typography variant="body1" color="text.secondary">
                        You haven't posted any jobs yet. Create your first job posting above.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        sx={{ mt: 2 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        Post a Job
                      </Button>
                    </Paper>
                  ) : (
                    <Grid container spacing={2}>
                      {jobs.map((job) => (
                        <Grid item xs={12} key={job._id}>
                          <Card variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
                            <CardContent>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={8}>
                                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {job.title}
                                  </Typography>
                                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                    <Chip 
                                      label={job.company} 
                                      size="small" 
                                      icon={<Business fontSize="small" />}
                                    />
                                    <Chip 
                                      label={job.location} 
                                      size="small" 
                                      icon={<LocationOn fontSize="small" />}
                                    />
                                    {job.jobType && (
                                      <Chip 
                                        label={job.jobType} 
                                        size="small" 
                                        color="secondary"
                                        icon={<AccessTime fontSize="small" />}
                                      />
                                    )}
                                    {job.category && (
                                      <Chip 
                                        label={job.category} 
                                        size="small" 
                                        color="primary"
                                        icon={<Category fontSize="small" />}
                                      />
                                    )}
                                  </Stack>
                                  <Typography variant="body2" color="text.secondary" paragraph>
                                    {job.description.length > 200 
                                      ? `${job.description.substring(0, 200)}...` 
                                      : job.description}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Stack spacing={1}>
                                    <Button 
                                      variant="contained" 
                                      startIcon={<People />}
                                      onClick={() => viewApplicants(job)}
                                      fullWidth
                                    >
                                      Applicants ({job.applicants?.length || 0})
                                    </Button>
                                    <Button 
                                      variant="outlined" 
                                      startIcon={<Edit />}
                                      onClick={() => openEditMode(job)}
                                      fullWidth
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="outlined" 
                                      color="error"
                                      startIcon={<Delete />}
                                      onClick={() => deleteJob(job._id)}
                                      fullWidth
                                      disabled={loading}
                                    >
                                      Delete
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Stack>
        </Grid>
      </Grid>

      {/* Edit Job Dialog */}
      <Dialog
        open={editMode}
        onClose={() => setEditMode(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Edit color="primary" sx={{ mr: 1 }} />
          Edit Job Posting
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Job Title"
                value={editJob?.title || ""}
                onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <Work color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company"
                value={editJob?.company || ""}
                onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <Business color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                value={editJob?.location || ""}
                onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Salary"
                value={editJob?.salary || ""}
                onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <MonetizationOn color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Job Type"
                value={editJob?.jobType || ""}
                onChange={(e) => setEditJob({ ...editJob, jobType: e.target.value })}
                fullWidth
                size="small"
                SelectProps={{ native: true }}
                InputProps={{
                  startAdornment: <AccessTime color="action" sx={{ mr: 1 }} />,
                }}
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
                <option value="Remote">Remote</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Category"
                value={editJob?.category || ""}
                onChange={(e) => setEditJob({ ...editJob, category: e.target.value })}
                fullWidth
                size="small"
                SelectProps={{ native: true }}
                InputProps={{
                  startAdornment: <Category color="action" sx={{ mr: 1 }} />,
                }}
              >
                <option value="">Select category</option>
                <option value="IT">IT / Software</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Description"
                multiline
                rows={6}
                value={editJob?.description || ""}
                onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Description color="action" sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }} />,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditMode(false)}
            startIcon={<Cancel />}
            color="error"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateJob}
            startIcon={<Save />}
            variant="contained"
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Applicants Dialog */}
      <Dialog
        open={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <People color="primary" sx={{ mr: 1 }} />
          Applicants for: {selectedJob?.title}
          <IconButton
            aria-label="close"
            onClick={() => setSelectedJob(null)}
            sx={{ 
              position: 'absolute', 
              right: 8, 
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {applicants.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No applicants yet for this position. Check back later!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {applicants.map((user, index) => {
                if (!user) {
                  return (
                    <Grid item xs={12} key={`missing-${index}`}>
                      <Paper sx={{ p: 2, mb: 1, backgroundColor: 'background.default' }}>
                        <Typography color="error">
                          ⚠️ Applicant data missing or corrupted
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                }

                return (
                  <Grid item xs={12} md={6} key={user._id || index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar 
                            src={user.profilePhoto || ""} 
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box>
                            <Typography fontWeight="bold">
                              {user.fullName || "Unnamed User"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email || "No Email"}
                            </Typography>
                            {user.phoneNumber && (
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachFile fontSize="small" sx={{ mr: 0.5 }} /> {user.phoneNumber}
                              </Typography>
                            )}
                          </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {user.resume ? (
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button
                              variant="outlined"
                              href={user.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={<Visibility />}
                              fullWidth
                            >
                              View Resume
                            </Button>
                            <Button
                              variant="contained"
                              href={user.resume.replace(
                                "/upload/",
                                `/upload/fl_attachment:${encodeURIComponent(
                                  (user.fullName || "Applicant") + "_Resume"
                                )}/`
                              )}
                              startIcon={<Download />}
                              fullWidth
                            >
                              Download
                            </Button>
                          </Stack>
                        ) : (
                          <Typography color="error" sx={{ mt: 2 }}>
                            No Resume Uploaded
                          </Typography>
                        )}

                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Applied On: {new Date(user.createdAt || Date.now()).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedJob(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%', boxShadow: 3 }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}