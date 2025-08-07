import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Paper,
  useTheme,
  Badge,
  Chip
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as AcceptedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  const theme = useTheme();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setSnackbar({ 
        open: true, 
        message: "Failed to load applications", 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ 
        open: true, 
        message: "Application deleted successfully", 
        severity: "success" 
      });
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbar({ 
        open: true, 
        message: "Failed to delete application", 
        severity: "error" 
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <AcceptedIcon fontSize="small" />;
      case "Rejected":
        return <RejectedIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return theme.palette.success.main;
      case "Rejected":
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 10 }, maxWidth: 1600, margin: '0 auto' }}>
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
          <WorkIcon fontSize="large" />
          Job Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all submitted job applications
        </Typography>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : applications.length === 0 ? (
        <Paper elevation={0} sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 1,
        }}>
          <Typography variant="h6" color="text.secondary">
            No applications found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {applications.map((app) => (
            <Grid item xs={12} sm={6} lg={4} key={app._id}>
              <Card elevation={2} sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Tooltip title={app.status}>
                          <Box
                            sx={{
                              backgroundColor: getStatusColor(app.status),
                              color: theme.palette.getContrastText(getStatusColor(app.status)),
                              borderRadius: '50%',
                              padding: '4px',
                              display: 'flex',
                            }}
                          >
                            {getStatusIcon(app.status)}
                          </Box>
                        </Tooltip>
                      }
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.primary.main,
                          width: 56, 
                          height: 56,
                        }}
                      >
                        {app.applicant?.fullName?.charAt(0).toUpperCase() || <PersonIcon />}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography variant="h6" fontWeight="600">
                          {app.applicant?.fullName || "Unknown Applicant"}
                        </Typography>

                        <Typography 
                          variant="subtitle2" 
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          <EmailIcon fontSize="small" />
                          {app.applicant?.email || "No email"}
                        </Typography>

                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                        >
                          📞 {app.applicant?.phoneNumber || "No phone"}
                        </Typography>

                        {app.applicant?.resume && (
                          <Typography 
                            variant="body2" 
                            component="a" 
                            href={app.applicant.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme.palette.primary.main, mt: 0.5 }}
                          >
                            📄 View Resume
                          </Typography>
                        )}

                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box mb={2}>
                    <Typography 
                      variant="body1" 
                      fontWeight="500"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                    >
                      <WorkIcon fontSize="small" color="action" />
                      {app.job?.title || "Unknown Job"}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                    >
                      <CalendarIcon fontSize="small" />
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </Typography>
                    
                    {/* <Chip
                      label={app.status}
                      icon={getStatusIcon(app.status)}
                      sx={{ 
                        backgroundColor: getStatusColor(app.status),
                        color: theme.palette.getContrastText(getStatusColor(app.status)),
                        fontWeight: '500',
                        mt: 1
                      }}
                    /> */}
                  </Box>

                  <Box display="flex" justifyContent="flex-end">
                    <Tooltip title="Delete Application">
                      <IconButton 
                        onClick={() => handleDelete(app._id)} 
                        sx={{ 
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: theme.palette.error.light,
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 1 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Applications;