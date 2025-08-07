import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/authSlice";
import { FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        <ListItem button onClick={() => navigate("/admin/dashboard")}> 
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate("/admin/users")}> 
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button onClick={() => navigate("/admin/jobs")}> 
          <ListItemText primary="Jobs" />
        </ListItem>
        <ListItem button onClick={() => navigate("/admin/applications")}> 
          <ListItemText primary="Applications" />
        </ListItem>
        <ListItem button onClick={handleLogout}> 
          <ListItemText primary="Logout" />
        </ListItem>
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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", letterSpacing: 1, color: "#fff" }}
        >
          <FaBriefcase style={{ color: "#0d6efd", fontSize: "1.5rem", marginRight: "8px"}} />
          <Button sx={{ color: "#050527ff", fontWeight: "bold", fontSize: "1.5rem", marginRight: "8px" }} onClick={() => navigate("/admin/dashboard")}>Admin Panel</Button>
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
              {drawerLinks}
            </Drawer>
          </>
        ) : (
          <Box>
            <Button sx={{ color: "#fff", fontWeight: "bold", mx: 1 }} onClick={() => navigate("/admin/users")}>Users</Button>
            <Button sx={{ color: "#fff", fontWeight: "bold", mx: 1 }} onClick={() => navigate("/admin/jobs")}>Jobs</Button>
            <Button sx={{ color: "#fff", fontWeight: "bold", mx: 1 }} onClick={() => navigate("/admin/applications")}>Applications</Button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: "inline-block", marginLeft: "16px" }}
            >
              <Button
                sx={{ background: "#EF4444", "&:hover": { background: "#DC2626" }, color: "#fff" }}
                variant="contained"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </motion.div>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
