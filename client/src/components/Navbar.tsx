// src/components/Navbar.tsx
import React, { useState } from "react";
import { NavLink, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { resetAuth } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.Auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    dispatch(resetAuth());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Classrooms", path: "/classrooms" },
  ];

  //   const menuItems = [
  //     { text: "Dashboard", path: "/dashboard" },
  //     ...(role === "Principal"
  //       ? [
  //           { text: "Manage Users", path: "/manage-users" },
  //           { text: "Manage Classrooms", path: "/manage-classrooms" },
  //         ]
  //       : []),
  //     ...(role === "Teacher"
  //       ? [
  //           { text: "My Classroom", path: "/my-classroom" },
  //           { text: "Timetable", path: "/timetable" },
  //         ]
  //       : []),
  //     ...(role === "Student"
  //       ? [
  //           { text: "My Classes", path: "/my-classes" },
  //           { text: "Timetable", path: "/timetable" },
  //         ]
  //       : []),
  //   ];

  const renderMenu = () => (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          component={RouterLink}
          to={item.path}
          onClick={() => setDrawerOpen(false)}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && isAuthenticated && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <NavLink to={"/"}>
          Classroom App
          </NavLink>
        </Typography>
        {!isMobile && isAuthenticated && (
          <>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={RouterLink}
                to={item.path}
              >
                {item.text}
              </Button>
            ))}
          </>
        )}
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {renderMenu()}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
