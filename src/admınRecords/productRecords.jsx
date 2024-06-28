import React, { useEffect, useState } from "react";
import ProductsService from "../service/productsService";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate } from "react-router";
import AlertDialog from "../Alert/AlertDialog";
import ReactImageMagnify from "react-image-magnify";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton } from "@mui/material";


function ProductRecords() {
  const [productData, setProductData] = useState({});
  const [editedProductData, setEditedProductData] = useState({});
  const [openCreateDialog, setCreateOpenDialog] = React.useState(false);
  const [newProductData, setNewProductData] = useState({});
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const navigate = useNavigate();

  const productId = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const productData = await ProductsService.getProductById(productId);
        setProductData(productData);
        setEditedProductData({
          ...productData,
          categoryId: productData.category?.categoryId || "",
        });
        console.log(productData);
      } catch (error) {
        console.error("Veri çekerken hata oluştu: ", error);
        throw error;
      }
    };

    fetchProductsData();
  }, []);

  const handleProductsInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProductData({ ...editedProductData, [name]: value });
  };

  const handleCreateInputChange = (event) => {
    const { name, value } = event.target;
    setNewProductData({ ...newProductData, [name]: value });
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await ProductsService.updateProduct(productId, editedProductData);
      const updatedProductData = await ProductsService.getProductById(
        productId
      );
      setProductData(updatedProductData);
      enqueueSnackbar(productData.productName + " başarıyla güncellendi", {
        variant: "success",
      });
      setEditedProductData({
        ...updatedProductData,
        categoryId: updatedProductData.category?.categoryId || "",
      });
    } catch (error) {
      enqueueSnackbar(productData.productName + " güncellenemedi", {
        variant: "error",
      });
      console.error("Güncelleme sırasında hata oluştu: ", error);
    }
  };

  const handleNewProduct = () => {
    setCreateOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCreateOpenDialog(false);
  };

  const handleBackHome = () => {
    navigate("/admin-records")
  }

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      await ProductsService.saveProduct(newProductData);
      enqueueSnackbar("Yeni ürün başarıyla oluşturuldu", {
        variant: "success",
      });
      setCreateOpenDialog(false);
    } catch (error) {
      enqueueSnackbar("Yeni ürün oluşturulamadı", { variant: "error" });
      console.error("Ürün oluşturulurken hata oluştu: ", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await ProductsService.deleteProduct(productId);
      enqueueSnackbar(productData.productName + " başarıyla silindi", {
        variant: "success",
      });
      navigate("/admin-records");
    } catch (error) {
      /*enqueueSnackbar(productData.productName + " silinemedi", {
        variant: "error",
      });*/
      console.error("Silme sırasında hata oluştu: ", error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box p={3} bgcolor="white">
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: "530px", marginBottom: "20px" }}
            onClick={handleNewProduct}
          >
            Yeni Ürün
          </Button>
          

          <Typography variant="h6">Ürün Bilgileri</Typography>
          <form onSubmit={handleUpdateProduct}>
            <TextField
              name="productName"
              label="Ürün Adı"
              value={editedProductData.productName || ""}
              onChange={handleProductsInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Açıklama"
              value={editedProductData.description || ""}
              onChange={handleProductsInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="price"
              label="Fiyat"
              value={editedProductData.price || ""}
              onChange={handleProductsInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="stockQuantity"
              label="Stok Sayısı"
              value={editedProductData.stockQuantity || ""}
              onChange={handleProductsInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="productInfo"
              label="Ürün Bilgisi"
              value={editedProductData.productInfo || ""}
              onChange={handleProductsInputChange}
              fullWidth
              margin="normal"
            />{" "}
            <TextField
              name="categoryId"
              label="Kategori"
              value={editedProductData.categoryId || ""}
              onChange={handleProductsInputChange}
              fullWidth
              margin="normal"
            /><IconButton onClick={handleBackHome} sx={{marginRight:'20px'}}> <KeyboardBackspaceIcon/>Admin</IconButton>
            <Button type="submit" variant="contained" color="primary">
              Güncelle
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteAlertOpen(true)} // Sil butonuna tıklanınca alertı aç
              sx={{
                marginBottom: "20px",
                marginLeft: "15px",
                marginTop: "20px",
              }}
            >
              Ürünü Sil
            </Button>
          </form>
        </Box>
      </Grid>

      <AlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        handleAggree={handleDeleteProduct} // Evet'e tıklandığında silme işlemi gerçekleşecek
        message={`"${productData.productName}" ürününü silmek istediğinize emin misiniz?`}
      />

      <Dialog
        open={openCreateDialog}
        onClose={() => setCreateOpenDialog(false)}
      >
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent>
          <form id="create-product-form" onSubmit={handleCreateProduct}>
            <TextField
              name="productName"
              label="Ürün Adı"
              value={newProductData.productName || ""}
              onChange={handleCreateInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Açıklama"
              value={newProductData.description || ""}
              onChange={handleCreateInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="price"
              label="Fiyat"
              value={newProductData.price || ""}
              onChange={handleCreateInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="stockQuantity"
              label="Stok Sayısı"
              value={newProductData.stockQuantity || ""}
              onChange={handleCreateInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="productInfo"
              label="Ürün Bilgisi"
              value={newProductData.productInfo || ""}
              onChange={handleCreateInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="categoryId"
              label="Kategori"
              value={newProductData.categoryId || ""}
              onChange={handleCreateInputChange}
              fullWidth
              margin="normal"
            />{" "}
            <Button
              onClick={() => setCreateOpenDialog(false)}
              sx={{ marginTop: "15px", marginLeft: "400px" }}
            >
              İptal
            </Button>
            <Button
              sx={{ marginTop: "15px" }}
              type="submit"
              form="create-product-form"
              color="primary"
            >
              Kaydet
            </Button>
          </form>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <Grid item xs={12} md={6}>
        {/*<Button
          style={{ marginLeft: "630px" , marginTop:'5px'}}
          variant="contained"
          color="primary"
        >
          <a href="/admin-records">Admin </a>
            </Button>*/}

        <Box p={3} bgcolor="white" textAlign="center">
          <Typography variant="h5">{productData.productName}</Typography>

          {productData.productImages &&
            productData.productImages.map((image, index) => (
              <ReactImageMagnify
                key={index}
                {...{
                  smallImage: {
                    alt: `Ürün Görüntü ${index + 1}`,
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
  );
}

export default ProductRecords;
