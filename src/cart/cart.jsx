import React, { useEffect } from "react";
import HomeAppBar from "../AppBars/homeAppBar";
import CartsService from "../service/cartService";
import { enqueueSnackbar } from "notistack";
import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button } from "@mui/material";
import ProductsService from "../service/productsService";
import OrdersService from "../service/orderService";
import { useNavigate } from "react-router";
import AlertDialog from "../Alert/AlertDialog";

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
        enqueueSnackbar("Data çekerken hata:", { variant: "error" });
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
            maxWidth: 1300,
            marginTop: "20px",
            marginLeft: "35px",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 150 }}
            image={cartItem.product.productImages[0]}
            alt={cartItem.product.productName}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto", marginTop: "70px" }}>
              <Typography component="div" variant="h5">
                {cartItem.product.productName}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {cartItem.product.description}
              </Typography>
            </CardContent>
          </Box>
          <Box>
            <CardContent sx={{ marginLeft: "100px", marginTop: "80px" }}>
              <IconButton
                onClick={() =>
                  handleDecreaseQuantity(cartItem.cartId, cartItem.quantity)
                }
              >
                <RemoveIcon />
              </IconButton>
              <strong>{cartItem.quantity}</strong>
              <IconButton
                onClick={() =>
                  handleIncreaseQuantity(cartItem.cartId, cartItem.quantity)
                }
              >
                <AddIcon />
              </IconButton>
            </CardContent>
          </Box>
          <Box>
            <CardContent sx={{ marginLeft: "100px", marginTop: "80px" }}>
              <strong>{cartItem.product.price.toFixed(2)} TL</strong>
            </CardContent>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton
              sx={{ marginLeft: "250px" }}
              onClick={() => handleDeleteOpen(cartItem.cartId)}
            >
              Sil
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Box>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: "20px", marginLeft: "1000px", marginTop: "30px" }}
        onClick={() => {
          const productIds = cartsByUserData.map(
            (cartItem) => cartItem.product.productId
          );
          handleAddOrderClick(productIds);
        }}
      >
        Sepeti Onayla
      </Button>

      <Typography
        variant="h6"
        sx={{ marginLeft: "1000px", marginTop: "10px", marginRight: "50px" }}
      >
        Toplam Fiyat: {totalPrice} TL
      </Typography>
      <br />
    </>
  );
}

export default Basket;
