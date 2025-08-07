import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Snackbar,
  Alert,
  Card,
  CardContent,
  TextField,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  AssignmentTurnedIn,
  FavoriteBorder,
  Edit,
  Cancel,
  Check,
  Upload,
  InsertDriveFile,
  Person,
} from "@mui/icons-material";
import Slider from "react-slick";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser as setReduxUser } from "../../redux/features/authSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SeekerDashboard() {
  
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const getResumeUrl = (resume) => {
    if (!resume) return "";
    if (resume.startsWith("http://") || resume.startsWith("https://")) return resume;
    return `http://localhost:3000${resume.startsWith("/") ? "" : "/"}${resume}`;
  };

  const resumeUrl = getResumeUrl(user?.resume);


  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);


  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || "");


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user/applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(res.data.applications || []);
      } catch (err) {
        showSnackbar("Failed to load applications", "error");
        console.error("APPLICATION FETCH ERROR:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const showSnackbar = (msg, severity = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const uploadFile = async (type, file) => {
    if (!file) return showSnackbar(`Please select a ${type} first!`, "warning");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `http://localhost:3000/api/user/upload?type=${type}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const profileRes = await axios.get("http://localhost:3000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = profileRes.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch(setReduxUser(updatedUser));

      showSnackbar(
        `${
          type === "photo" ? "Profile photo" : "Resume"
        } uploaded successfully!`
      );
      setUploadProgress(0);
    } catch (err) {
      showSnackbar("Upload failed. Try again!", "error");
      setUploadProgress(0);
    }
  };

  const saveProfile = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/user/profile",
        { fullName: editName, phoneNumber: editPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const profileRes = await axios.get("http://localhost:3000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = profileRes.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch(setReduxUser(updatedUser));

      showSnackbar("Profile updated!");
      setEditMode(false);
    } catch (err) {
      showSnackbar("Failed to update profile", "error");
    }
  };

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box
      sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4, padding: "80px" }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 1,
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  src={user?.profilePhoto}
                  sx={{
                    width: 80,
                    height: 80,
                    border: "3px solid white",
                    boxShadow: 1,
                  }}
                >
                  {user?.fullName?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {user?.fullName || "User"}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {user?.email}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip
                      icon={<AssignmentTurnedIn fontSize="small" />}
                      label={`${applications.length} Applications`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<FavoriteBorder fontSize="small" />}
                      label="Saved Jobs"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent={{ md: "flex-end" }} gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  size="small"
                >
                  Edit Profile
                </Button>
                <Button variant="outlined" href="/jobs" size="small">
                  Browse Jobs
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Profile Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 1, height: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6" fontWeight={600}>
                  Profile Information
                </Typography>
                {editMode ? (
                  <Box>
                    <IconButton onClick={saveProfile} color="primary">
                      <Check />
                    </IconButton>
                    <IconButton onClick={() => setEditMode(false)}>
                      <Cancel />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton onClick={() => setEditMode(true)}>
                    <Edit />
                  </IconButton>
                )}
              </Box>

              {editMode ? (
                <Box>
                  <TextField
                    label="Full Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Phone Number"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    <strong>Name:</strong> {user?.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    <strong>Phone:</strong>{" "}
                    {user?.phoneNumber || "Not provided"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Member since:</strong>{" "}
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - File Uploads */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 1 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Documents
              </Typography>

              <Box mb={4}>
                <Typography variant="subtitle2" mb={1}>
                  Profile Photo
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Person />}
                    size="small"
                    fullWidth
                  >
                    Choose Photo
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Upload />}
                    size="small"
                    onClick={() => uploadFile("photo", profilePhoto)}
                    disabled={!profilePhoto}
                    fullWidth
                  >
                    Upload
                  </Button>
                </Box>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Resume
                </Typography>
                {user?.resume ? (
                  <Button
                    variant="outlined"
                    startIcon={<InsertDriveFile />}
                    size="small"
                    href={`https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
      target="_blank"
                    fullWidth
                    sx={{ mb: 2 }}
                  >

                    View Current Resume
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    No resume uploaded
                  </Typography>
                )}
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<InsertDriveFile />}
                    size="small"
                    fullWidth
                  >
                    Choose Resume
                    <input
                      hidden
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files[0])}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Upload />}
                    size="small"
                    onClick={() => uploadFile("resume", resume)}
                    disabled={!resume}
                    fullWidth
                  >
                    Upload
                  </Button>
                </Box>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Applications Section */}
        <Box mt={4}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Recent Applications
          </Typography>

          {loading ? (
            <LinearProgress />
          ) : applications.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ p: 4, textAlign: "center", borderRadius: 1 }}
            >
              <Typography color="text.secondary" mb={2}>
                You haven't applied to any jobs yet
              </Typography>
              <Button
                variant="contained"
                href="/jobs"
                startIcon={<AssignmentTurnedIn />}
              >
                Browse Jobs
              </Button>
            </Paper>
          ) : (
            <Slider {...sliderSettings}>
              {applications.map((app) => (
                <Box key={app._id} px={1}>
                  <Card elevation={0} sx={{ borderRadius: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {app.job?.title || "Unknown Position"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {app.job?.company || "Unknown Company"}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">
                          Applied:{" "}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={app.status || "Under Review"}
                          size="small"
                          color={
                            app.status === "Accepted"
                              ? "success"
                              : app.status === "Rejected"
                              ? "error"
                              : "warning"
                          }
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          )}
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
