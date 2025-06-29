import { useTheme } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import AlertDialog from "../Alert/AlertDialog";
import HomeAppBar from "../AppBars/homeAppBar";
import CartsService from "../service/cartService";
import OrdersService from "../service/orderService";
import ProductsService from "../service/productsService";

function Basket() {
  const [cartsByUserData, setCartsByUserData] = React.useState([]);
  const theme = useTheme();
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [selectedCartId, setSelectedCartId] = React.useState(null);
  const navigate = useNavigate();

  const handleDeleteOpen = (cartId) => {
    setSelectedCartId(cartId);
    setDeleteAlertOpen(true);
  };

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const cartData = await CartsService.getCartsByUserId(token);
        const cartsProducts = await Promise.all(
          cartData.map(async (cart) => {
            const product = await ProductsService.getProductById(
              cart.productId
            );
            return {
              ...cart,
              product: product,
            };
          })
        );
        setCartsByUserData(cartsProducts);
      } else {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "info" });
        console.log("Data çekerken hata: ");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "info" });
        console.log(error);
        // throw error;
      } else {
        // enqueueSnackbar("Data çekerken hata:", { variant: "error" });
        console.log("Data çekerken hata:  ", error);
      }
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleAddOrderClick = async (productIds) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        // Save the orders
        await OrdersService.saveOrders(productIds);
        navigate("/siparişlerim")
        
        // Delete items from the cart after the order is successfully created
        await Promise.all(productIds.map(async (productId) => {
          const cartItem = cartsByUserData.find(cart => cart.product.productId === productId);
          if (cartItem) {
            await CartsService.deleteCard(cartItem.cartId);
          }
        }));
  
        enqueueSnackbar("Ürün siparişler eklendi", { variant: "success" });
  
        // Refresh cart data
        fetchCartData();
      } else {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "error" });
        console.log("Data çekerken hata: ");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "error" });
        console.log(error);
        throw error;
      } else {
        enqueueSnackbar("Sepete eklerken hata:", { variant: "error" });
        console.log("Sepete eklerken hata:  ", error);
      }
    }
  };
  

  const handleDeleteCart = async () => {
    try {
      await CartsService.deleteCard(selectedCartId);
      enqueueSnackbar("Ürün sepetten kaldırıldı", { variant: "success" });
      fetchCartData();
      setDeleteAlertOpen(false);
    } catch (error) {
      enqueueSnackbar("Ürünü sepetten kaldırırken hata oluştu", {
        variant: "error",
      });
      console.error("Sepetteki ürünü silme hatası:", error);
    }
  };

  const handleIncreaseQuantity = async (id, currentQuantity) => {
    try {
      await CartsService.updatetoCard(id, currentQuantity + 1);
      fetchCartData();
    } catch (error) {
      enqueueSnackbar("Ürün miktarını artırırken hata oluştu", {
        variant: "error",
      });
      console.error("Ürün miktarını artırma hatası:", error);
    }
  };

  const handleDecreaseQuantity = async (id, currentQuantity) => {
    if (currentQuantity > 1) {
      try {
        await CartsService.updatetoCard(id, currentQuantity - 1);
        fetchCartData();
      } catch (error) {
        enqueueSnackbar("Ürün miktarını azaltırken hata oluştu", {
          variant: "error",
        });
        console.error("Ürün miktarını azaltma hatası:", error);
      }
    }
  };

  const totalPrice = cartsByUserData
    .reduce(
      (sum, cartItem) => sum + cartItem.product.price * cartItem.quantity,
      0
    )
    .toFixed(2);

  return (
    <>
      <AlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        handleAggree={() => handleDeleteCart()}
        message={
          'Carts "' +
          cartsByUserData.find((cart) => cart.cartId === selectedCartId) +
          '" will delete?'
        }
      />
      <HomeAppBar />
   {cartsByUserData.map((cartItem) => (
<Card
  key={cartItem.cartId}
  sx={{
    display: "flex",
    maxWidth: "100%",
    marginX: { xs: 2, md: 5 },
    marginTop: 3,
    padding: 1,
    borderRadius: 2,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    alignItems: "center",  
  }}
>
  <CardMedia
    component="img"
    sx={{ width: 120, height: 130, objectFit: "cover", borderRadius: "6px" }}
    image={cartItem.product.productImages[0]}
    alt={cartItem.product.productName}
  />
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      ml: 2,
      justifyContent: "center",
      minHeight: 100,  
    }}
  >
    <Typography variant="h6" fontWeight="600" noWrap>
      {cartItem.product.productName}
    </Typography>
    <Typography variant="body2" color="text.secondary" noWrap>
      {cartItem.product.description}
    </Typography>
  </Box>

  <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
    <IconButton size="small" onClick={() => handleDecreaseQuantity(cartItem.cartId, cartItem.quantity)}>
      <RemoveIcon fontSize="small" />
    </IconButton>
    <Typography fontWeight="600" mx={1}>
      {cartItem.quantity}
    </Typography>
    <IconButton size="small" onClick={() => handleIncreaseQuantity(cartItem.cartId, cartItem.quantity)}>
      <AddIcon fontSize="small" />
    </IconButton>
  </Box>

  <Box sx={{ display: "flex", alignItems: "center", minWidth: 80, mx: 2, justifyContent: "center" }}>
    <Typography fontWeight="700" fontSize="1rem">
      {Number(cartItem.product.price).toFixed(2)} TL
    </Typography>
  </Box>

  <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
    <IconButton color="error" size="small" onClick={() => handleDeleteOpen(cartItem.cartId)} aria-label="delete">
      <DeleteOutlineOutlinedIcon />
    </IconButton>
  </Box>
</Card>
  ))}

  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 3,
      mt: 4,
      mr: { xs: 2, md: 5 },
      mb: 5,
      flexWrap: "wrap",
    }}
  >
    <Typography variant="h6" fontWeight="700">
      Toplam Tutar: {(Number(totalPrice) || 0).toFixed(2)} TL
    </Typography>

<Button
  variant="contained"
  onClick={() => {
    const productIds = cartsByUserData.map((cartItem) => cartItem.product.productId);
    handleAddOrderClick(productIds);
  }}
  sx={{
    px: 2.5,               // Yatay padding azaltıldı (3'ten 2'ye)
    py: 1,               // Dikey padding azaltıldı (1.5'tan 1'e)
    fontWeight: "bold",
    fontSize: "0.9rem",  // Yazı biraz küçüldü
    borderRadius: 3,
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    boxShadow: "0 3px 7px 2px rgba(33, 203, 243, .4)",
    transition: "background 0.3s ease",
    "&:hover": {
      background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
      boxShadow: "0 6px 15px 4px rgba(33, 203, 243, .5)",
    },
    whiteSpace: "nowrap",
  }}
>
  Sepeti Onayla
</Button>

  </Box>
      <br />
    </>
  );
}

export default Basket;
