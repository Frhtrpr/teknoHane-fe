import MenuIcon from "@mui/icons-material/Menu";
import { Button, TextField } from "@mui/material";
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

import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddProductDialog from "../AppBarColumns/addProductDialog";
import teknoHaneLogo from '../image/teknoHaneLogo.png';



const pages = ["Siparişlerim", "Favorilerim"];
const settings = [
  { label: "Profil", url: "/profil" },
  { label: "Çıkış", url: "/giris" },
];

function ResponsiveAppBar({refreshProducts}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [openAddProductDialog,setOpenAddProductDialog] =React.useState(false);
  const navigate = useNavigate();
   const firstname = localStorage.getItem("firstName") || "";
  const lastname = localStorage.getItem("lastName") || "";

  const getInitials = (first, last) => {
    const f = first.charAt(0).toUpperCase();
    const l = last.charAt(0).toUpperCase();
    return f + l;
  };

  const initials = getInitials(firstname, lastname);

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
    if (url === "/profil") {
      navigate(url);
      window.location.reload();
    } else if (url === "/giris") {
      navigate(url);
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("role")
    } else {
      navigate(url);
    }
  };

  const handlePageItemClick = (page) => {
    const formattedPage = page.replace(/\s+/g, "-").toLowerCase();
    navigate(`/${formattedPage}`);
  };

  const handleBasketUrlClick = () => {
    navigate("/sepetim");
  };

  return (
    <>
    <AppBar position="static">
        <Toolbar disableGutters>
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
                <MenuItem key={page} onClick={() => handlePageItemClick(page)}>
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
    justifyContent: "flex-start",
    gap: 2, 
    ml: 3, 
  }}
>
  {/* Arama Kutusu */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: "8px",
      px: 1,
      py: 0.5,
      maxWidth: 300,
      width: "100%",
      boxShadow: 1,
    }}
  >
    <TextField
      id="filter-input"
      placeholder="Ürün, kategori veya marka ara"
      variant="standard"
      fullWidth
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <SearchIcon sx={{ color: "#888", ml: 1, fontSize: 20 }} />
        ),
        sx: {
          fontSize: "14px",
          color: "#333",
          pl: 1,
        },
      }}
      inputProps={{
        style: { fontSize: "14px" },
      }}
    />
  </Box>

  <Box
    sx={{
      display: { xs: "none", md: "flex" },
      gap: 1.5,
    }}
  >
    {pages.map((page) => (
      <Button
        key={page}
        variant="outlined"
        onClick={() => handlePageItemClick(page)}
        sx={{
          color: "#fff",
          borderColor: "#fff",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "14px",
          borderRadius: "20px",
          px: 2,
          py: 0.5,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.2)",
            borderColor: "#fff",
          },
        }}
      >
        {page}
      </Button>
    ))}
  </Box>
</Box>
<Button
  variant="outlined"
  startIcon={<AddBoxIcon />}
  onClick={() => setOpenAddProductDialog(true)}
  sx={{
    marginTop:0.5,
    textTransform: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.875rem',     
    color: 'white',
    borderColor: 'white',
    backgroundColor: '#1976d2',
    padding: '2px 8px',        
    '&:hover': {
      backgroundColor: '#115293',
      borderColor: '#115293',
      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.5)',
    },
  }}
>
  New Product
</Button>



       <IconButton
            sx={{
              color: isHovered ? "blue" : "white",
              marginRight:-2,
              fontSize: "17px",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleBasketUrlClick}
          >
            <ShoppingCartIcon sx={{ width: "20px" }} />
            Sepetim
          </IconButton>{" "}
          <Box sx={{ flexGrow: 0 ,       
                 px:3
}}>
           <Tooltip title="Ayarlar">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar sx={{ bgcolor: "#ab47bc" }}>{initials}</Avatar>
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
    <AddProductDialog
  open={openAddProductDialog}
  onClose={() => setOpenAddProductDialog(false)}
  refreshProducts={refreshProducts}
/>
    </>
  );
}
export default ResponsiveAppBar;
