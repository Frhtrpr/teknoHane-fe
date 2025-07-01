import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import CategoriesService from "../service/categoriesService";
import ProductDetailService from "../service/products-detail";
import ProductsService from "../service/productsService";


const AddProductDialog = ({ open, onClose,refreshProducts }) => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    productInfo: "",
    categoryId: "",
    productImages: [],
    brand: "",
    model: "",
    features: "",
    technicalDetails: "",
  });

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const base64 = await toBase64(file);
      setFormData(prev => ({
        ...prev,
        productImages: [base64]  
      }));
    } catch (err) {
      console.error("Dosya okunamadı", err);
    }
  }
};

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) {
      CategoriesService.getAllCtegories()
        .then((data) => {
          setCategories(data);
        })
        .catch((err) => {
          console.error("Kategori getirilemedi", err);
        });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value)
          : value,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: Number(e.target.value),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.productName || !formData.categoryId) {
        enqueueSnackbar("Alanları doldurunuz", { variant: "warning" });
      return;
    }
    try {
      const productToSave = {
        productName: formData.productName,
        description: formData.description,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        productInfo: formData.productInfo,
        categoryId: formData.categoryId,
        productImages: formData.productImages
      };

      const savedProduct = await ProductsService.saveProduct(productToSave);

      const productDetailToSave = {
        productId: savedProduct.productId, 
        brand: formData.brand,
        model: formData.model,
        features: formData.features,
        technicalDetails: formData.technicalDetails,
      };

      await ProductDetailService.saveProduct(productDetailToSave);

              enqueueSnackbar("Ürün başarıyla kaydedildi.", { variant: "success" });
      
      onClose();
      refreshProducts()

      setFormData({
        productName: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        productInfo: "",
        categoryId: "",
        productImages: [],
        brand: "",
        model: "",
        features: "",
        technicalDetails: "",
      });
    } catch (error) {
            //   enqueueSnackbar("Ürün kaydedilirken hata oluştu.", { variant: "error" });

      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Yeni Ürün Ekle</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Ürün Bilgileri */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ürün Adı"
              name="productName"
              fullWidth
              value={formData.productName}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required size="small">
              <InputLabel id="category-label">Kategori</InputLabel>
              <Select
                labelId="category-label"
                value={formData.categoryId}
                name="categoryId"
                label="Kategori"
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Açıklama"
              name="description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Fiyat (₺)"
              name="price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Stok Adedi"
              name="stockQuantity"
              type="number"
              fullWidth
              value={formData.stockQuantity}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ürün Bilgisi"
              name="productInfo"
              fullWidth
              value={formData.productInfo}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="Marka"
              name="brand"
              fullWidth
              value={formData.brand}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Model"
              name="model"
              fullWidth
              value={formData.model}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              label="Özellikler"
              name="features"
              fullWidth
              multiline
              rows={2}
              value={formData.features}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Teknik Detaylar"
              name="technicalDetails"
              fullWidth
              multiline
              rows={2}
              value={formData.technicalDetails}
              onChange={handleChange}
              size="small"
            />
          </Grid>

                  <Grid item xs={12}>
<Button
  variant="outlined"
  component="label"
  fullWidth
  sx={{
    borderRadius: "16px",
    textTransform: "none",
    fontWeight: "600",
    color: "primary.main",
    borderColor: "primary.main",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "primary.light",
      borderColor: "primary.dark",
      color: "primary.dark",
      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
    },
  }}
>
  Fotoğraf Yükle
  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
</Button>

  {formData?.productImages?.length > 0 && (
    <img
      src={formData.productImages[0]}
      alt="Ürün Fotoğrafı"
      style={{ marginTop: 8, maxHeight: 150, objectFit: "contain", width: "100%" }}
    />
  )}
</Grid>
        </Grid>
      </DialogContent>
    <DialogActions sx={{ padding: 2 }}>
  <Button
    onClick={onClose}
    variant="outlined"          
    color="error"            
    sx={{
      borderRadius: "10px",   
      textTransform: "none",  
      fontWeight: "bold",
      minWidth: 100,
      "&:hover": {
        backgroundColor: "rgba(244, 67, 54, 0.1)", 
        borderColor: "error.main",
      },
    }}
  >
    İptal
  </Button>

  <Button
    onClick={handleSubmit}
    variant="contained"         
    color="primary"            
    sx={{
      borderRadius: "10px",
      textTransform: "none",
      fontWeight: "bold",
      minWidth: 100,
      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)", 
      "&:hover": {
        backgroundColor: "primary.dark",
        boxShadow: "0 6px 15px rgba(25, 118, 210, 0.6)",
      },
    }}
  >
    Kaydet
  </Button>
</DialogActions>

    </Dialog>
  );
};

export default AddProductDialog;
