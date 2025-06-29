import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import AlertDialog from "../Alert/AlertDialog";
import AccountAppBar from "../AppBars/homeAppBar";
import OrdersService from "../service/orderService";
import ProductsService from "../service/productsService";


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
      console.log("Sipariş bilgisi çekilirken hata: " + error.message, {
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
    <Box sx={{ p: 3 }}>
      {orderByUserIdData.length === 0 ? (
        <Box
          sx={{
            height: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <img
            src="https://img.freepik.com/vector-premium/ilustracion-vectorial-sobre-concepto-no-encuentran-articulos-o-no-encuentran-resultados_675567-6665.jpg"
            alt="Sipariş Yok"
            style={{ width: 150, marginBottom: 20, opacity: 0.5 }}
          />
          <Typography variant="h6" color="text.secondary">
            Henüz siparişiniz bulunmamaktadır.
          </Typography>
        </Box>
      ) : (
        orderByUserIdData.map((order) => (
          <Card
            key={order.orderId}
            sx={{
              display: "flex",
              flexDirection: "column",
              my: 2,
              p: 1.5,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#fafafa",
            }}
          >
            <CardContent sx={{ height: 30 }}>
              <Typography variant="body1" fontWeight={600} sx={{ marginTop: -2.5 }}>
                Sipariş Tarihi: {formatDate(order.orderDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Toplam Tutar: <strong>{order.totalAmount.toFixed(2)} TL</strong>
              </Typography>
            </CardContent>

            {order.products.map((product) => (
              <Box
                key={product.productId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  px: 2,
                  py: 1,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                  image={product.productImages[0]}
                  alt={product.productName}
                />
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product.description}
                  </Typography>
                </Box>
                <Typography fontWeight="bold" sx={{ minWidth: 100, textAlign: "right" }}>
                  {product.price.toFixed(2)} TL
                </Typography>
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {order.status === "DELIVERED" ? (
                  <span style={{ color: "green" }}>Teslim Edildi</span>
                ) : order.status === "PREPARING" ? (
                  <span style={{ color: "#ff9800" }}>Hazırlanıyor</span>
                ) : order.status === "CANCELLED" ? (
                  <span style={{ color: "red" }}>İptal Edildi</span>
                ) : (
                  <span style={{ color: "#2196F3" }}>Beklemede</span>
                )}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineOutlined />}
                onClick={() => handleDeleteOpen(order.orderId)}
                sx={{
                  fontWeight: "bold",
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  px: 2,
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.04)",
                  },
                }}
              >
                İptal Et
              </Button>
            </Box>
          </Card>
        ))
      )}
    </Box>
  </>
);

}

export default Orders;
