import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
//Icons
import CommentIcon from "@mui/icons-material/Comment";
import StarRateIcon from "@mui/icons-material/StarRate";
import DiscountIcon from "@mui/icons-material/Discount";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";

const pages = ["Çok Satanlar", "Flaş Ürünler","Favorilerim"];
const settings = [
  { label: "Profil", url: "/profil" },
  { label: "Hesap", url: "/hesap" },
  { label: "Dashboard", url: "/dashboard" },
  { label: "Çıkış", url: "/giris" },
];

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (url) => {
    if (url === "/profil") {
      navigate(url);
      window.location.reload();
    } else if (url === "/giris") {
      window.localStorage.removeItem("jwtToken");
      window.localStorage.removeItem("role")
      navigate(url);
    } else {
      navigate(url);
    }

    handleCloseUserMenu();
  };

  const handleBasketUrlClick = () => {
    navigate("/sepetim");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/teknoHane"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src="http://www.teknohaneservis.com/img/teklogo.png"
              alt="TeknoHane"
              style={{ width: "130px" }}
            />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" sx={{ textTransform: "none" }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ccc",
              overflow: "hidden",
              backgroundColor: "#f9f9f9",
            }}
          >
            <TextField
              id="filter-input"
              label="Ürün, kategori veya marka ara"
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "transparent",
                width: "100%",
              }}
              InputProps={{
                endAdornment: (
                  <SearchIcon
                    sx={{ color: "#666", p: 1, width: "32px", height: "32px" }}
                  />
                ), // Burada genişliği ve yüksekliği ayarlayabilirsiniz
                style: { borderBottom: "none" },
              }}
              InputLabelProps={{
                sx: { fontSize: "16px" },
              }}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              marginRight: "470px",
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center" sx={{ textTransform: "none" }}>
                  {page}
                </Typography>
              </MenuItem>
            ))}
          </Box>
          <IconButton
            sx={{
              color: "white",
              marginRight: "15px",
              fontSize: "17px",
            }}
            onClick={handleBasketUrlClick}
          >
            <ShoppingCartIcon sx={{ width: "20px" }} />
            Sepetim
          </IconButton>{" "}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Ayarlar">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Ferhat Urper"
                  src="data:image/jpeg;base64,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"
                />
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: "Siparişlerim", link: "/hesap/siparişlerim" },
            { text: "Değerlendirmelerim", link: "/hesap/değerlendirmelerim" },
            { text: "Favorilerim", link: "/hesap/favorilerim" },
            { text: "İndirim Kuponlarım", link: "/hesap/indirim-kuponları" },
          ].map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link} // Use Link component for navigation
                to={item.link} // Specify the target URL
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index === 0 ? (
                    <Inventory2Icon sx={{ color: "#007bff" }} />
                  ) : null}
                  {index === 1 ? (
                    <CommentIcon sx={{ color: "#007bff" }} />
                  ) : null}
                  {index === 2 ? (
                    <StarRateIcon sx={{ color: "#007bff" }} />
                  ) : null}
                  {index === 3 ? (
                    <DiscountIcon sx={{ color: "#007bff" }} />
                  ) : null}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[
            {
              text: "Kullanıcı Bilgilerim",
              link: "/hesap/kullanici-bilgileri",
            },
            { text: "Adres Bilgilerim", link: "/hesap/adres-bilgileri" },
            { text: "Kayıtlı Kartlarım", link: "/hesap/kart-bilgileri" },
          ].map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link} // Use Link component for navigation
                to={item.link} // Specify the target URL
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index === 0 ? (
                    <PermIdentityIcon sx={{ color: "#007bff" }} />
                  ) : null}
                  {index === 1 ? (
                    <LocationOnIcon sx={{ color: "#007bff" }} />
                  ) : null}
                  {index === 2 ? (
                    <CreditCardIcon sx={{ color: "#007bff" }} />
                  ) : null}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
