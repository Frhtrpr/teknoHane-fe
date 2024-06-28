import React, { useEffect, useState } from "react";
import HomeAppBar from "../AppBars/homeAppBar";
import ProductDetailService from "../service/products-detail";
import { enqueueSnackbar } from "notistack";
import ProductsService from "../service/productsService";
import { TextField, Typography, Grid, Box, Button, IconButton } from "@mui/material";
import ReactImageMagnify from "react-image-magnify";
import CartsService from "../service/cartService";
import { AddShoppingCartOutlined } from "@mui/icons-material";


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
        <Grid item xs={12} md={6}>
          <br />{" "}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {productDetailById.product &&
                productDetailById.product.productName}
            </Typography>
          </Grid>
          <br />
          <br />
          <Box bgcolor="white" p={3}>
            <form>
              <TextField
                name="brand"
                label="Marka"
                value={productDetailById.brand || ""}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="model"
                label="Model"
                value={productDetailById.model || ""}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="features"
                label="Özellikler"
                value={productDetailById.features || ""}
                fullWidth
                margin="normal"
                multiline
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="technicalDetails"
                label="Teknik Bilgiler"
                value={productDetailById.technicalDetails || ""}
                fullWidth
                margin="normal"
                multiline
                InputProps={{
                  readOnly: true,
                }}
              />
            </form>
            <Button variant="contained" onClick={handleAddToCart}>
              Sepete Ekle<AddShoppingCartOutlined/>
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ marginTop: "-10px" }}>
          <Box p={3} bgcolor="white" textAlign="center">
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
                      width: 1200,
                      height: 1600,
                    },
                    enlargedImagePosition: "over",
                    enlargedImageContainerDimensions: {
                      width: "200%",
                      height: "100%",
                    },
                    enlargedImageContainerStyle: { zIndex: 999 },
                    enlargedImageStyle: { left: "100%" },
                    isHintEnabled: true,
                  }}
                />
              ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductsDetail;
