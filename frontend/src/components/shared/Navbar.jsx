import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";

export default function CustomNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(90deg, #2196f3, #0d47a1, #000000)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo / Brand */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              color: "#fff",
            }}
          >
            <FaBriefcase
              style={{
                color: "#0d6efd",
                fontSize: "1.5rem",
                marginRight: "8px",
              }}
            />
            <span>
              <span style={{ color: "#212529", fontWeight: "bold", fontFamily: "monospace", fontSize:"2rem"}}>Job</span>
              <span style={{ color: "#212529", fontWeight: "bold", fontSize:"1.9rem" }}>Hive</span>
            </span>
          </Typography>

          {/* Navigation Links */}
          <div>
            <Button
              sx={{
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { color: "#000" },
              }}
              component={Link}
              to="/"
            >
              Home
            </Button>
            <Button
              sx={{
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { color: "#000" },
              }}
              component={Link}
              to="/jobs"
            >
              Jobs
            </Button>

            {user ? (
              <>
                <Button
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": { color: "#000" },
                  }}
                  component={Link}
                  to="/dashboard"
                >
                  Dashboard
                </Button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: "inline-block", marginLeft: "16px" }}
                >
                  <Button
                    sx={{
                      background: "#EF4444",
                      "&:hover": { background: "#DC2626" },
                      color: "#fff",
                    }}
                    variant="contained"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <Button
                  sx={{
                    border: "1px solid #ffffff",
                    color: "#ffffff",
                    fontWeight: "bold",
                    px: 3,
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      color: "#000000",
                    },
                  }}
                  variant="outlined"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>

                <Button
                  sx={{
                    ml: 2,
                    // background: "linear-gradient(to right, #3B82F6, #EF4444)",
                    color: "#ffffff",
                    fontWeight: "bold",
                    px: 3,
                    borderRadius: "8px",
                    textTransform: "none",
                    background: "linear-gradient(to right, #3B82F6, #EF4444)",
                    "&:hover": {
                      background: "linear-gradient(to right, #2563EB, #DC2626)",
                    },
                  }}
                  variant="contained"
                  component={Link}
                  to="/signup"
                >
                  Signup
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
