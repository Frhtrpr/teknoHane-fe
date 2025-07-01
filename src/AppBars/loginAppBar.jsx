import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import teknoHaneLogo from '../image/teknoHaneLogo.png';


const settings = [
  { label: "Çıkış", url: "/giris" },
];
function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (url) => {
    navigate(url);
  };

  return (
  <AppBar position="static">
  <Toolbar
    disableGutters
    sx={{
      px: 2, 
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Box
      component="a"
      href="/teknoHane"
      sx={{
        mr: 2,
        display: { xs: 'none', md: 'flex' },
        px: 4,
        textDecoration: 'none',
        height: 64,
        overflow: 'visible', 
        position: 'relative',
      }}
    >
      <img
        src={teknoHaneLogo}
        alt="TeknoHane Logo"
        style={{
          height: 95,    
          width: 'auto',
          position: 'absolute',
          top: '55%',
          left: 0,
          transform: 'translateY(-50%)', 
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </Box>

    {/* Sağ taraf - Avatar */}
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Ayarlar">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting.label}
            onClick={() => handleMenuItemClick(setting.url)}
          >
            <Typography textAlign="center" sx={{ textTransform: "none" }}>
              {setting.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  </Toolbar>
</AppBar>

  );
}
export default ResponsiveAppBar;
