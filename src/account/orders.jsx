import React, { useEffect, useState } from "react";
import AccountAppBar from "../AppBars/accountAppBar";
import OrdersService from "../service/orderService";
import ProductsService from "../service/productsService";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { enqueueSnackbar } from "notistack";
import AlertDialog from "../Alert/AlertDialog";

function Orders() {
  const [orderByUserIdData, setOrderByUserIdData] = useState([]);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  function formatDate(dateString) {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .replace(",", "");
  }

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const orderData = await OrdersService.getOrdersByUserId(token);
        const ordersWithProducts = await Promise.all(
          orderData.map(async (order) => {
            const products = await Promise.all(
              order.productIds.map(async (productId) => {
                const product = await ProductsService.getProductById(productId);
                return product;
              })
            );
            return { ...order, products };
          })
        );
        setOrderByUserIdData(ordersWithProducts);
      } else {
        enqueueSnackbar("Lütfen giriş yapınız.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Sipariş bilgisi çekilirken hata: " + error.message, {
        variant: "error",
      });
    }
  };

  const handleDeleteOpen = (orderId) => {
    setSelectedOrderId(orderId);
    setDeleteAlertOpen(true);
  };

  const handleDeleteOrder = async () => {
    try {
      await OrdersService.deleteOrder(selectedOrderId);
      enqueueSnackbar("Sipariş kaldırıldı", { variant: "success" });
      fetchOrderData();
      setDeleteAlertOpen(false);
    } catch (error) {
      enqueueSnackbar("Siparişi kaldırırken hata oluştu", { variant: "error" });
    }
  };

  return (
    <>
      <AlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        handleAggree={handleDeleteOrder}
        message={`Order "${
          orderByUserIdData.find((order) => order.orderId === selectedOrderId)
            ?.orderId
        }" will delete?`}
      />
      <AccountAppBar />
      {orderByUserIdData.map((order) => (
        <Card
          key={order.orderId}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1250,
            marginTop: "20px",
            marginLeft: "100px",
          }}
        >
          <CardContent>
            <Typography component="div" variant="h5">
              Sipariş Tarihi: {formatDate(order.orderDate)}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              Toplam tutar: {order.totalAmount} TL
            </Typography>
          </CardContent>
          {order.products.map((product) => (
            <Box
              key={product.productId}
              sx={{ display: "flex", marginTop: "20px" }}
            >
              <CardMedia
                component="img"
                sx={{ width: 150 }}
                image={product.productImages[0]}
                alt={product.productName}
              />
              <Box sx={{ display: "flex", flexDirection: "column" , marginTop:'70px'}}>
                <CardContent>
                  <Typography component="div" variant="h5">
                    {product.productName}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    {product.description}
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent sx={{ marginLeft: "100px" , marginTop:'80px'}}>
                  <strong>{product.price.toFixed(2)} TL</strong>
                </CardContent>
              </Box>
            </Box>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton
              sx={{ marginLeft: "auto" , marginRight:'100px' ,marginTop:'-250px'}}
              onClick={() => handleDeleteOpen(order.orderId)}
            >
              İptal
              <DeleteOutlineOutlined />
            </IconButton>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{marginTop:'-250px', marginRight:'50px'}}
            >
              {order.status === "DELIVERED" ? (
                <span style={{ color: "green" }}>Teslim Edildi</span>
              ) : order.status === "PREPARING" ? (
                <span style={{ color: "yellow" }}>Hazırlanıyor</span>
              ) : order.status === "CANCELLED" ? (
                <span style={{ color: "red" }}>İptal Edildi</span>
              ) : (
                <span style={{ color: "blue" }}>Beklemede</span>
              )}
            </Typography>
          </Box>
        </Card>
      ))}
    </>
  );
}

export default Orders;
