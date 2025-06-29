import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import HomeAppBar from "../AppBars/homeAppBar";
import CartsService from "../service/cartService";
import ProductDetailService from "../service/products-detail";
import ProductsService from "../service/productsService";


function ProductsDetail() {
  const [productDetailById, setProductDetailById] = useState({});
  const productId = window.location.pathname.split("/").pop();

  const fetchProductDetailData = async () => {
    try {
      const productDetailData =
        await ProductDetailService.getProductDetailByProductId(productId);
      const product = await ProductsService.getProductById(productId);

      const productByProductDetail = {
        ...productDetailData,
        product: product,
      };

      setProductDetailById(productByProductDetail);
      console.log(productByProductDetail);
    } catch (error) {
      console.error("Ürün detayı getirilirken hata oluştu", error);
      enqueueSnackbar("Ürün detayı getirme sırasında bir sorun oluştu", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchProductDetailData();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const productToAdd = productDetailById.product;
        await CartsService.savetoCart(productToAdd);
        enqueueSnackbar(`${productToAdd.productName} sepete eklendi.`, {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "info" });
        console.log("Data çekerken hata: ");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "error" });
        console.log(error);
      } else {
        enqueueSnackbar("Sepete eklerken hata:", { variant: "error" });
        console.log("Sepete eklerken hata:  ", error);
      }
    }
  };

  return (
    <>
      <HomeAppBar />
      <Grid container spacing={3} p={3}>
<Grid item xs={12} md={6} sx={{ paddingLeft: { xs: 2, md: 4 } }}>
  <Typography variant="h4" gutterBottom sx={{ mb: 3, mt: 1 }}>
    {productDetailById.product && productDetailById.product.productName}
  </Typography>
<Box
  bgcolor="white"
  p={2}
  sx={{
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderRadius: 2,
    minHeight: 500,
    textAlign: "left",
    paddingLeft: 3,
    paddingRight: 2,
    display: "flex",
    flexDirection: "column",
    position: "relative", 
  }}
>
  <Box
    sx={{
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#f0f0f0",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#333",
    }}
  >
    Satıcı: {productDetailById.product?.sellerName || "-"}
  </Box>

  <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "left" }}>
    <strong>Marka:</strong> {productDetailById.brand || "-"}
  </Typography>
  <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "left" }}>
    <strong>Model:</strong> {productDetailById.model || "-"}
  </Typography>
  <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "left" }}>
    <strong>Özellikler:</strong>
  </Typography>
  <Typography
    variant="body2"
    paragraph
    sx={{ whiteSpace: "pre-line", textAlign: "left" }}
  >
    {productDetailById.features || "-"}
  </Typography>
  <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "left" }}>
    <strong>Teknik Bilgiler:</strong>
  </Typography>
  <Typography variant="body2" sx={{ whiteSpace: "pre-line", textAlign: "left" }}>
    {productDetailById.technicalDetails || "-"}
  </Typography>

<Box mt="auto" sx={{ textAlign: "right" }}>
  <Button
    variant="contained"
    onClick={handleAddToCart}
    startIcon={<AddShoppingCartOutlined />}
    sx={{
      px: 2.5,            
      py: 1,               
      fontWeight: "bold",
      fontSize: "0.875rem", 
      borderRadius: 2,
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
      transition: "background 0.3s ease",
      "&:hover": {
        background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
        boxShadow: "0 6px 10px 4px rgba(33, 203, 243, .4)",
      },
    }}
  >
    Sepete Ekle
  </Button>
</Box>
</Box>
</Grid>
    
<Grid 
  item 
  xs={12} 
  md={4} 
  sx={{ 
    mt: 9,
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    paddingLeft: { xs: 2, md: 4 }
  }}
>
  <Card 
    sx={{ 
      maxWidth: '100%', 
      maxHeight: 500, 
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      borderRadius: 2,
      bgcolor: "white",
    }}
  >
    {productDetailById.product?.productImages &&
      productDetailById.product.productImages.map((image, index) => (
        <ReactImageMagnify
          key={index}
          {...{
            smallImage: {
              alt: `Product Image ${index + 1}`,
              isFluidWidth: true,
              src: image,
            },
            largeImage: {
              src: image,
              width: 700,
              height: 1000,
            },
            enlargedImagePosition: "over",
            enlargedImageContainerDimensions: {
              width: "100%",
              height: "100%",
            },
            enlargedImageContainerStyle: { zIndex: 999 },
            enlargedImageStyle: { left: "100%" },
            isHintEnabled: true,
          }}
        />
      ))}
  </Card>
</Grid>

      </Grid>
    </>
  );
}

export default ProductsDetail;
