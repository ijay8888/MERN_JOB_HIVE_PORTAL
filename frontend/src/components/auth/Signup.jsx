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

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "seeker",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const res = await axios.post("http://localhost:3000/api/user/register", input);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch(setUser(res.data.user));

        setSnackbar({
          open: true,
          message: "Signup successful! Redirecting...",
          severity: "success",
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setSnackbar({
          open: true,
          message: res.data.message || "Signup failed!",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Something went wrong!",
        severity: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#F9FAFB",
          minHeight: "100vh",
          paddingTop: "72px",
          paddingX: 2,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            padding: 3,
            width: "100%",
            maxWidth: 400,
            borderRadius: 1,
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight="600"
            gutterBottom
            sx={{ color: "#1F2937" }}
          >
            Create an Account
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "#6B7280", mb: 3 }}
          >
            Join JobHive and unlock your future.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Full Name"
              name="fullName"
              required
              fullWidth
              size="small"
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              size="small"
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              size="small"
              onChange={handleChange}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              required
              fullWidth
              size="small"
              onChange={handleChange}
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
              <MenuItem value="seeker">Job Seeker</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.3,
                fontWeight: "bold",
                borderRadius: "10px",
                background: "linear-gradient(to right, #3B82F6, #EF4444)",
                "&:hover": {
                  background: "linear-gradient(to right, #2563EB, #DC2626)",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
