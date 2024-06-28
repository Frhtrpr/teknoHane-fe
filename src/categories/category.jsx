import React, { useEffect, useState } from "react";
import HomeAppBar from "../AppBars/homeAppBar";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import ProductsService from "../service/productsService";
import CategoriesService from "../service/categoriesService";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import FavoritesService from "../service/favoritesService";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { AddShoppingCartOutlined } from "@mui/icons-material";
import CartsService from "../service/cartService";

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
  const handleProductNameFilterChange = (event) => {
    setProductNameFilter(event.target.value);
  };

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
      <Typography
        variant="h5"
        style={{
          marginRight: "960px",
          marginTop: "25px",
        }}
      >
        "{categoryData.categoryName}" araması için sonuçlar listeleniyor
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {" "}
        <div style={{ marginRight: "1200px", marginTop: "10px" }}>
          {" "}
          <TextField
            label="Ürün Adı"
            value={productNameFilter}
            onChange={handleProductNameFilterChange}
            style={{ marginRight: "10px", marginBottom: "15px" }}
          />
        </div>
        <HandleArrangementSelect />
        {productsByCategoryIdData
          .filter((product) =>
            product.productName
              .toLowerCase()
              .includes(productNameFilter.toLowerCase())
          )
          .map((product, index) => (
            <React.Fragment key={product.productId}>
              {index % 4 === 0 && index !== 0 && (
                <div style={{ width: "100%", marginBottom: "25px" }}></div>
              )}
              <Tooltip
                title={product.productName}
                followCursor
                style={{ width: "300px" }}
              >
                <Card
                  onClick={() => handleCardClick(product.productId)}
                  key={product.productId}
                  onMouseEnter={() => handleCardHover(product.productId)}
                  onMouseLeave={handleCardLeave}
                  sx={{
                    maxWidth: 260,
                    margin: "0 auto 10px",
                    marginLeft: "50px",
                    marginTop: "25px",
                    boxShadow:
                      hoveredCard === product.productId
                        ? "0 0 10px rgba(0,0,0,0.5)"
                        : "none",
                  }}
                >
                  <CardHeader
                  
                    title={product.productName}
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image={product.productImages[0]}
                    alt={"Paella dish"}
                    style={{ objectFit: "cover" }}
                  />

                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fiyat: {product.price} TL</strong>
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton
                      aria-label="add to favorites"
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
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAddCardClick(product.productId);
                      }}
                    >
                      {" "}
                      <AddShoppingCartOutlined
                        color={handleAddCardIconColor(product.productId)}
                        sx={{ marginLeft: "5px" }}
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
            </React.Fragment>
          ))}
      </div>
    </>
  );
}

export default Category;
