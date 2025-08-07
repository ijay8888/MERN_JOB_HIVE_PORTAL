import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "../../redux/features/authSlice";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await axios.post("http://localhost:3000/api/user/login", input);
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
        setSnackbar({ open: true, message: "Login successful!", severity: "success" });
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (user.role === "recruiter") {
            navigate("/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 500);

      } else {
        setSnackbar({ open: true, message: res.data.message || "Login failed", severity: "error" });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Something went wrong!",
        severity: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      
      sx={{ background: "#F9FAFB",
        minHeight:"100vh",
        paddingTop:"72px",
        paddingX: 2,
       }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 4,
          width: 420,
          borderRadius: 1,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: "#1E293B" }}>
          <b>Welcome Back</b>
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#6B7280" }}>
          Login to continue
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            select
            label="Role"
            name="role"
            value={input.role}
            onChange={handleChange}
            required
            fullWidth
            size="small"
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="seeker">Job Seeker</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 1,
              width: "100%",
              borderRadius: "10px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #3B82F6, #EF4444)",
                "&:hover": {
                  background: "linear-gradient(to right, #2563EB, #DC2626)",
                },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          {/* Sign Up Link */}
          <Typography variant="body2" sx={{ mt: 2, color: "#6B7280" }}>
            Don’t have an account?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/signup")}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                background:
                  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transition: "0.3s",
                "&:hover": {
                  WebkitTextFillColor: "#000",
                  background: "transparent",
                },
              }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
