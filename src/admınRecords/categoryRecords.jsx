import React, { useEffect, useState } from "react";
import CategoriesService from "../service/categoriesService";
import { enqueueSnackbar } from "notistack";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Icon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeAppBar from "../AppBars/homeAppBar";
import { DeleteOutline, EditTwoTone } from "@mui/icons-material";
import AlertDialog from "../Alert/AlertDialog";
import ProductsService from "../service/productsService";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
//import { Navigate } from "react-router-dom"; // Yeni eklenen kütüphane

function NewCategoryForm() {
  const [categoryData, setCategoryData] = useState([]);
  const [categorySave, setCategorySave] = useState({
    categoryName: "",
    categoryDescription: "",
  });
  const [categoryUpdate, setCategoryUpdate] = React.useState({
    categoryName: "",
    categoryDescription: "",
  });
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [productsByCategoryId, setProductsByCategoryId] = React.useState([]);
  const [userRole, setUserRole] = useState(null);

  const fetchCategoryData = async () => {
    try {
      const categoryData = await CategoriesService.getAllCtegories();
      setCategoryData(categoryData);
      console.log(categoryData);
    } catch (error) {
      console.error("Data çekerken hata: ", error);
      throw error;
    }
  };

  
  useEffect(() => {
 
    fetchCategoryData(); 
  }, []);

  console.log(localStorage.getItem("role"))
  /*if (!localStorage.getItem("role")  || localStorage.getItem("role").indexOf("ROLE_ADMIN") === -1) {
    return <Navigate to="/unauthorized" />;
  }*/

  const fetchProductBYCategoryId = async (categoryId) => {
    try {
      const productsData = await ProductsService.getProductByCategoryId(
        categoryId
      );
      setProductsByCategoryId(productsData);
      console.log(productsData);
    } catch (error) {
      console.error("Products data çekerken hata:", error);
      throw error;
    }
  };

  const handleDeleteOpen = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDeleteAlertOpen(true);
  };

  const handleCloseUpdatePopup = () => {
    setUpdateDialogOpen(false);
  };

  const handleCloseCreatePopup = () => {
    setCreateDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (updatingCategoryId) {
        await CategoriesService.updateCategories(
          updatingCategoryId,
          categoryUpdate
        );
        enqueueSnackbar(
          `${categorySave.categoryName} adlı kategori başarıyla güncellendi.`,
          {
            variant: "success",
          }
        );
        setUpdatingCategoryId(null);
        fetchCategoryData();
        setUpdateDialogOpen(false);
      } else {
        const newCategory = await CategoriesService.saveCategories(
          categorySave
        );
        enqueueSnackbar(
          `${categorySave.categoryName} adlı kategori başarıyla oluşturuldu.`,
          { variant: "success" }
        );
        fetchCategoryData();
        setCreateDialogOpen(false);
      }
      setCategorySave({
        categoryName: "",
        categoryDescription: "",
      });
    } catch (error) {
      enqueueSnackbar("İşlem sırasında bir hata oluştu.", {
        variant: "error",
      });
      console.error("İşlem sırasında hata:", error);
    }
  };

  const handleUpdateCategory = (categoryId, updatedCategoryData) => {
    setCategoryUpdate(updatedCategoryData);
    setUpdatingCategoryId(categoryId);
    setUpdateDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    try {
      await CategoriesService.deleteCategories(selectedCategoryId);
      enqueueSnackbar("Kategori başarıyla silindi.", {
        variant: "success",
      });
      fetchCategoryData();
      setDeleteAlertOpen(false);
    } catch (error) {
      enqueueSnackbar("Kategori silinirken bir hata oluştu.", {
        variant: "error",
      });
      console.error("Kategori silinirken hata:", error);
    }
  };

  const handleChangeCategoryCreate = (e) => {
    const { name, value } = e.target;
    setCategorySave((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeCategoryUpdate = (e) => {
    const { name, value } = e.target;
    setCategoryUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <AlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        handleAggree={() => handleDeleteCategory()}
        message={
          'Category "' +
          categoryData.find(
            (category) => category.categoryId === selectedCategoryId
          )?.categoryName +
          '" will delete?'
        }
      />
      <HomeAppBar />
      <Typography
        variant="h5"
        style={{ marginRight: "1300px", marginTop: "10px" }}
      >
        Categories
        <IconButton
          onClick={() => {
            setCreateDialogOpen(true);
          }}
        >
          <AddIcon sx={{ color: "dodgerblue" }} />
        </IconButton>
        <hr />
      </Typography>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {categoryData.map((category) => (
          <div key={category.categoryId}>
            <Button
              style={{ color: "black" }}
              onClick={() => fetchProductBYCategoryId(category.categoryId)}
            >
              <div
                style={{
                  width: "max-content", // Kategori adının uzunluğuna göre genişlik ayarlamak için
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  marginLeft: "17px",
                }}
              >
                {category.categoryName}{" "}
                <IconButton
                  onClick={() =>
                    handleUpdateCategory(category.categoryId, category)
                  }
                >
                  <EditTwoTone sx={{ color: "dodgerblue" }} />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteOpen(category.categoryId)}
                  sx={{ color: "dodgerblue", marginRight: "5px" }}
                >
                  <DeleteOutline />
                </IconButton>
              </div>
            </Button>
          </div>
        ))}
      </div>
      <Typography
        variant="h5"
        sx={{ marginLeft: "1300px", marginTop: "-500px" }}
      >
        {" "}
        <IconButton>
          <AddIcon
            sx={{ color: "dodgerblue" }}
            onClick={() => setCreateDialogOpen(true)}
          />
        </IconButton>
        <Typography sx={{marginTop:'170px'}}>Products</Typography>
        <hr />
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginTop: "0",
          marginRight: "15px",
        }}
      >
        {productsByCategoryId.map((product) => (
          <div key={product.productId}>
            <Link to={`/admin-records/products/${product.productId}`}>
              <Button style={{ color: "black" }}>
                <div
                  style={{
                    width: "max-content",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                    marginLeft: "17px",
                  }}
                >
                  {" "}
                  <IconButton sx={{ color: "dodgerblue", marginRight: "5px" }}>
                    <DeleteOutline />
                  </IconButton>
                  <IconButton>
                    <EditTwoTone sx={{ color: "dodgerblue" }} />
                  </IconButton>
                  {product.productName}{" "}
                </div>
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <Box sx={{ minHeight: 400, flexGrow: 1, maxWidth: 400 }}>
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          fullWidth={true}
          maxWidth={"md"}
        >
          <DialogTitle>Yeni Kategori Oluştur</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <div>
                <label style={{ marginBottom: "8px", display: "block" }}>
                  Kategori Adı:
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={categorySave.categoryName}
                  onChange={handleChangeCategoryCreate}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "8px",
                    marginBottom: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ marginBottom: "8px", display: "block" }}>
                  Açıklama:
                </label>
                <textarea
                  name="categoryDescription"
                  value={categorySave.categoryDescription}
                  onChange={handleChangeCategoryCreate}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "8px",
                    marginBottom: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                  required
                ></textarea>
              </div>
              <Button type="submit" variant="contained" color="primary">
                Kaydet
              </Button>
              <Button
                onClick={handleCloseCreatePopup}
                variant="outlined"
                color="error"
                sx={{ marginLeft: "7px" }}
              >
                Vazgeç
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
      <Box sx={{ minHeight: 400, flexGrow: 1, maxWidth: 400 }}>
        <Dialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          fullWidth={true}
          maxWidth={"md"}
        >
          <DialogTitle>Kategoriyi Güncelle</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <div>
                <label style={{ marginBottom: "8px", display: "block" }}>
                  Kategori Adı:
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={categoryUpdate.categoryName}
                  onChange={handleChangeCategoryUpdate}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "8px",
                    marginBottom: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ marginBottom: "8px", display: "block" }}>
                  Açıklama:
                </label>
                <textarea
                  name="categoryDescription"
                  value={categoryUpdate.categoryDescription}
                  onChange={handleChangeCategoryUpdate}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "8px",
                    marginBottom: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                  required
                ></textarea>
              </div>
              <Button type="submit" variant="contained" color="primary">
                Güncelle
              </Button>
              <Button
                onClick={handleCloseUpdatePopup}
                variant="outlined"
                color="error"
                sx={{ marginLeft: "7px" }}
              >
                Vazgeç
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}

export default NewCategoryForm;
