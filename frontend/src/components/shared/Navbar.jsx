import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export default function CustomNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUser(null));
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerLinks = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/jobs">
          <ListItemText primary="Jobs" />
        </ListItem>
        {user ? (
          <>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemText primary="Signup" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

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
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", letterSpacing: 1, color: "#fff" }}
          >
            <FaBriefcase
              style={{
                color: "#0d6efd",
                fontSize: "1.5rem",
                marginRight: "8px",
              }}
            />
            <span>
              <span
                style={{
                  color: "#212529",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  fontSize: "2rem",
                }}
              >
                Job
              </span>
              <span
                style={{
                  color: "#212529",
                  fontWeight: "bold",
                  fontSize: "1.9rem",
                }}
              >
                Hive
              </span>
            </span>
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
                {drawerLinks}
              </Drawer>
            </>
          ) : (
            <div>
              <Button
                sx={{ color: "#fff", fontWeight: "bold", "&:hover": { color: "#D3D3D3" } }}
                component={Link}
                to="/"
              >
                Home
              </Button>
              <Button
                sx={{ color: "#fff", fontWeight: "bold", "&:hover": { color: "#D3D3D3" } }}
                component={Link}
                to="/jobs"
              >
                Jobs
              </Button>

              {user ? (
                <>
                  <Button
                    sx={{ color: "#fff", fontWeight: "bold", "&:hover": { color: "#D3D3D3" } }}
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
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
