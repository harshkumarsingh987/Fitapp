import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useAuth } from "../context/AuthContext";

const NAV_WIDTH = 248;

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardRoundedIcon /> },
  { label: "Workouts", path: "/workouts", icon: <FitnessCenterRoundedIcon /> },
  { label: "AI Coach", path: "/coach", icon: <AutoAwesomeRoundedIcon /> },
  { label: "Profile", path: "/profile", icon: <PersonRoundedIcon /> },
];

function PulseMark() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "10px",
          background: "linear-gradient(135deg, #00C896 0%, #4C6FFF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 12h4l2-7 4 14 3-9 2 4h5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Pulse
      </Typography>
    </Box>
  );
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2.5 }}>
      <Box sx={{ px: 0.5, mb: 4, mt: 1 }}>
        <PulseMark />
      </Box>
      <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2.5,
                color: active ? "#00A67D" : "text.secondary",
                bgcolor: active ? "rgba(0,200,150,0.10)" : "transparent",
                "&:hover": { bgcolor: active ? "rgba(0,200,150,0.14)" : "rgba(18,20,31,0.04)" },
              }}
            >
              <ListItemIcon sx={{ color: active ? "#00A67D" : "text.secondary", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: 14.5 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto" }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2.5, color: "text.secondary" }}>
          <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" primaryTypographyProps={{ fontWeight: 500, fontSize: 14.5 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: NAV_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: NAV_WIDTH, border: "none", bgcolor: "#FFFFFF" },
          }}
        >
          {navContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: NAV_WIDTH } }}
        >
          {navContent}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(245,246,250,0.85)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #E7E9F2",
            color: "text.primary",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {isMobile ? (
              <IconButton onClick={() => setMobileOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            ) : (
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.secondary" }}>
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ display: { xs: "none", sm: "block" }, fontWeight: 600, fontSize: 14 }}>
                Hi, {user?.name?.split(" ")[0]}
              </Typography>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
                <Avatar src={user?.avatar} sx={{ width: 36, height: 36, bgcolor: "#00C896" }}>
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, maxWidth: 1200, width: "100%", mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
