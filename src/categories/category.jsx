import { AddShoppingCartOutlined } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HomeAppBar from "../AppBars/homeAppBar";
import CartsService from "../service/cartService";
import CategoriesService from "../service/categoriesService";
import FavoritesService from "../service/favoritesService";
import ProductsService from "../service/productsService";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Category() {
  const [productsByCategoryIdData, setProductsByCategoryIdData] = useState([]);
  const [categoryData, setCategoryData] = React.useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [arrangemet, setArrangement] = React.useState(10);
  const [favoritesData, setFavoritesData] = React.useState([]);
  const [cartData, setCartdata] = React.useState([]);

  const navigate = useNavigate();
  const [productNameFilter, setProductNameFilter] = useState("");


  const isFavorite = (productId) => {
    return favoritesData.some((favorite) => favorite.productId === productId);
  };

  const isCard = (productId) => {
    return cartData.some((cart) => cart.productId === productId);
  };

  const handleFavoriteIconColor = (productId) => {
    if (isFavorite(productId)) {
      return "primary";
    } else {
      return undefined;
    }
  };

  const handleAddCardIconColor = (productId) => {
    if (isCard(productId)) {
      return "primary";
    } else {
      return undefined;
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryData = await CategoriesService.getCategoriesById(
          categoryId
        );
        setCategoryData(categoryData);
      } catch (error) {
        console.error(
          "Category ${categoryId} id'li eylemleri getirirken hata",
          error
        );
      }
    };
    fetchCategoryData();
  }, []);

  const categoryId = window.location.pathname.split("/").pop();
  useEffect(() => {
    const fetchProductsByCategoryIdData = async () => {
      try {
        const productData = await ProductsService.getProductByCategoryId(
          categoryId
        );
        const productsWithExpanded = productData.map((product) => ({
          ...product,
          expanded: false,
        }));
        setProductsByCategoryIdData(productsWithExpanded);
      } catch (error) {
        console.error("Data çekerken hata", error);
      }
    };
    fetchProductsByCategoryIdData();
  }, []);

  useEffect(() => {
    const fetchFavoritesData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          const favoritesData = await FavoritesService.getFavoritesByUserId(
            token
          );
          setFavoritesData(favoritesData);
          console.log(favoritesData);
        } else {
         // enqueueSnackbar("Data çekerken hata ", { variant: "error" });
          console.log("Data çekerken hata: ");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          //enqueueSnackbar("LÜtfen giriş yapınız", { variant: "error" });
          console.log(error);
        } else {
         // enqueueSnackbar("Data çekerken hata:", { variant: "error" });
          console.log("Data çekerken hata:  ", error);
        }
      }
    };
    fetchFavoritesData();
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          const cartData = await CartsService.getCartsByUserId(token);
          setCartdata(cartData);
          console.log(cartData);
        } else {
          //enqueueSnackbar("Cart datalarını çekerken hata ", { variant: "error",});
          console.log("Data çekerken hata: ");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // enqueueSnackbar("LÜtfen giriş yapınız", { variant: "error" });
          console.log(error);
        } else {
         // enqueueSnackbar("Cart Data çekerken hata:", { variant: "error" });
          console.log("Data çekerken hata:  ", error);
        }
      }
    };
    fetchCartData();
  }, []);

  const handleExpandClick = (productId) => {
    setProductsByCategoryIdData((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? { ...product, expanded: !product.expanded }
          : product
      )
    );
  };

  const handleCardClick = (productId) => {
    const locationUrl = window.location.pathname;
    const url = `${locationUrl}/${productId}`;

    navigate(url);
  };

  const handleCardHover = (productId) => {
    setHoveredCard(productId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const handleChangeArrangement = (event) => {
    setArrangement(event.target.value);
  };

  const sortByHighestPrice = () => {
    setProductsByCategoryIdData((prevProducts) =>
      prevProducts.slice().sort((a, b) => b.price - a.price)
    );
  };

  const sortByLowestPrice = () => {
    setProductsByCategoryIdData((prevProducts) =>
      prevProducts.slice().sort((a, b) => a.price - b.price)
    );
  };

  const sortByNewProduct = () => {
    setProductsByCategoryIdData((prevProducts) =>
      prevProducts.slice().sort((a, b) => b.productId - a.productId)
    );
  };

  const sortRandomArrangement = () => {
    setProductsByCategoryIdData((prevProducts) =>
      prevProducts.slice().sort(() => Math.random() - 0.5)
    );
  };

  const sortByFavorites = () => {
    const favoriteCounts = productsByCategoryIdData.map((product) => ({
      ...product,
      favoriteCount: favoritesData.filter(fav => fav.productId === product.productId).length,
    }));
    setProductsByCategoryIdData(favoriteCounts.slice().sort((a, b) => b.favoriteCount - a.favoriteCount));
  };

  const HandleArrangementSelect = () => {
    return (
      <Box sx={{ minWidth: 130, marginLeft: "1170px", marginBottom: "15px" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Sıralama</InputLabel>
          <Select
            labelId="arrangement-simple-select-label"
            id="arrangement-simple-select"
            value={arrangemet}
            defaultValue={10}
            label="Sıralama"
            onChange={handleChangeArrangement}
          >
            <MenuItem value={10} onClick={sortRandomArrangement}>
              Önerilen Sıralama
            </MenuItem>
            <MenuItem value={30} onClick={sortByFavorites}>En Çok Beğenilenler </MenuItem>
            <MenuItem value={40} onClick={sortByLowestPrice}>
              En Düşük Fiyat
            </MenuItem>
            <MenuItem value={50} onClick={sortByHighestPrice}>
              En Yüksek Fiyat
            </MenuItem>
            <MenuItem value={70} onClick={sortByNewProduct}>
              En Yeniler
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  };

  const handleProductNameFilterChange = (event) => {
  const value = event.target.value.toLowerCase();
  setProductNameFilter(value);

  const filteredProducts = productsByCategoryIdData.filter((product) =>
    product.productName.toLowerCase().includes(value)
  );

  if (value === "") {
    ProductsService.getProductByCategoryId(categoryId).then((productData) => {
      const productsWithExpanded = productData.map((product) => ({
        ...product,
        expanded: false,
      }));
      setProductsByCategoryIdData(productsWithExpanded);
    });
  } else {
    setProductsByCategoryIdData(filteredProducts);
  }
};


  const handleAddFavoritesClick = async (productId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const updatedFavorites = [...favoritesData];

        const existingIndex = updatedFavorites.findIndex(
          (item) => item.productId === productId
        );
        if (existingIndex !== -1) {
          updatedFavorites.splice(existingIndex, 1);
          await FavoritesService.deleteByProductId(productId);
          enqueueSnackbar(
            `Favorilerden kaldırıldı.`,
            { variant: "info" }
          );
        } else {
          const productToAdd = productsByCategoryIdData.find(
            (item) => item.productId === productId
          );
          if (productToAdd) {
            await FavoritesService.saveFavorites(productToAdd);
            updatedFavorites.push(productToAdd);
            enqueueSnackbar(`${productToAdd.productName} favorilere eklendi`, {
              variant: "success",
            });
          }
        }

        setFavoritesData(updatedFavorites);
      } else {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "info" });     
           console.log("Data çekerken hata: ");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "error" });
        console.log(error);
      } else {
        enqueueSnackbar("Favori eklerken hata:", { variant: "error" });
        console.log("Favori eklerken hata:  ", error);
      }
    }
  };

  const handleAddCardClick = async (productId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const updatedCart = [...cartData];

        const existingIndex = updatedCart.findIndex(
          (item) => item.productId === productId
        );
        if (existingIndex !== -1) {
          updatedCart.splice(existingIndex, 1);
          await CartsService.deleteByProductId(productId);
          enqueueSnackbar(`Sepetten kaldırıldı` , {variant:'info'})
        } else {
          const productToAdd = productsByCategoryIdData.find(
            (item) => item.productId === productId
          );
          if (productToAdd) {
            await CartsService.savetoCart(productToAdd);
            updatedCart.push(productToAdd);
            enqueueSnackbar(`${productToAdd.productName} sepete eklendi.` , {variant:'success'})
          }
        }

        setCartdata(updatedCart);
      } else {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "info" });     
        console.log("Data çekerken hata: ");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("LÜtfen giriş yapınız", { variant: "error" });
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
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    mt: 3,
    mb: 2,
    px: 3,
  }}
>
  {/* Sol: Filtreleme inputu */}
  <TextField
    placeholder="Ürün adına göre filtrele"
    variant="outlined"
    value={productNameFilter}
    onChange={handleProductNameFilterChange}
    sx={{
      borderRadius: "12px",
      backgroundColor: "#fff",
      width: { xs: "100%", sm: "250px" },
      mb: { xs: 2, sm: 0 },
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
      },
    }}
    InputProps={{
      sx: {
        fontSize: "14px",
      },
    }}
  />

  {/* Orta: Başlık */}
  <Typography
    variant="h6"
    sx={{
      fontWeight: 500,
      fontSize: "18px",
      color: "#333",
      textAlign: "center",
      flexGrow: 1,
    }}
  >
    {productNameFilter
      ? `"${productNameFilter}" için filtrelenmiş sonuçlar`
      : `"${categoryData.categoryName}" kategorisi için sonuçlar listeleniyor`}
  </Typography>

  {/* Sağ: Sıralama kutusu */}
  <FormControl
    sx={{
      minWidth: 180,
      backgroundColor: "#fff",
      borderRadius: "12px",
      ml: { xs: 0, sm: 2 },
    }}
  >
    <InputLabel id="arrangement-simple-select-label">Sıralama</InputLabel>
    <Select
      labelId="arrangement-simple-select-label"
      id="arrangement-simple-select"
      value={arrangemet}
      label="Sıralama"
      onChange={handleChangeArrangement}
    >
      <MenuItem value={10} onClick={sortRandomArrangement}>
        Önerilen Sıralama
      </MenuItem>
      <MenuItem value={30} onClick={sortByFavorites}>
        En Çok Beğenilenler
      </MenuItem>
      <MenuItem value={40} onClick={sortByLowestPrice}>
        En Düşük Fiyat
      </MenuItem>
      <MenuItem value={50} onClick={sortByHighestPrice}>
        En Yüksek Fiyat
      </MenuItem>
      <MenuItem value={70} onClick={sortByNewProduct}>
        En Yeniler
      </MenuItem>
    </Select>
  </FormControl>
</Box>

<Grid
  container
  spacing={3}
  justifyContent={productsByCategoryIdData.length === 1 ? "flex-start" : "center"}
  sx={{ paddingX: 3 ,mb:3}}
>
  {productsByCategoryIdData
    .filter((product) =>
      product.productName.toLowerCase().includes(productNameFilter.toLowerCase())
    )
    .map((product) => (
      <Grid
        item
        key={product.productId}
        xs={12}
        sm={6}
        md={3}
        style={{ display: "flex", justifyContent: "left" }}
      >
        <Tooltip title={product.productName} followCursor>
          <Card
            onClick={() => handleCardClick(product.productId)}
            onMouseEnter={() => handleCardHover(product.productId)}
            onMouseLeave={handleCardLeave}
            sx={{
              width: '100%',
              boxShadow:
                hoveredCard === product.productId
                  ? "0 4px 20px rgba(0,0,0,0.3)"
                  : "0 1px 5px rgba(0,0,0,0.1)",
              borderRadius: 3,
              transition: "box-shadow 0.3s ease",
              cursor: "pointer",
              ":hover": {
                boxShadow: "0 6px 25px rgba(0,0,0,0.4)",
              },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader title={product.productName} />
            <CardMedia
              component="img"
              height="194"
              image={product.productImages[0]}
              alt={product.productName}
  style={{
    height: 160, 
    objectFit: 'contain', 
    padding: '10px' 
  }}               />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                <strong>Fiyat: {product.price} TL</strong>
              </Typography>
            </CardContent>

            <CardActions disableSpacing>
              <IconButton
                aria-label="favorilere ekle"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAddFavoritesClick(product.productId);
                }}
              >
                <FavoriteIcon
                  color={handleFavoriteIconColor(product.productId)}
                />
              </IconButton>

              <IconButton
                aria-label="sepete ekle"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAddCardClick(product.productId);
                }}
              >
                <AddShoppingCartOutlined
                  color={handleAddCardIconColor(product.productId)}
                  sx={{ ml: 1 }}
                />
              </IconButton>

              <ExpandMore
                expand={product.expanded}
                onClick={(event) => {
                  event.stopPropagation();
                  handleExpandClick(product.productId);
                }}
                aria-expanded={product.expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>

            <Collapse in={product.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography sx={{ color: "red" }}>
                  <strong>Stok: {product.stockQuantity}</strong>
                </Typography>
                <br />
                <Typography paragraph>{product.productInfo}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Tooltip>
      </Grid>
    ))}
</Grid>

    </>
  );
}

export default Category;
