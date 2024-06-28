import React, { useEffect, useState } from "react";
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
import HomeAppBar from "../AppBars/homeAppBar";
import FavoritesService from "../service/favoritesService";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {
  AddShoppingCart,
  AddShoppingCartOutlined,
  RemoveCircleOutlineOutlined,
} from "@mui/icons-material";
import AlertDialog from "../Alert/AlertDialog";
import ProductsService from "../service/productsService";
import CartsService from "../service/cartService";
import { useNavigate } from "react-router";

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

function Favorites() {
  const [favoritesData, setFavoritesData] = React.useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [arrangement, setArrangement] = React.useState(10);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [selectedFavoriteId, setSelectedfavoriteId] = React.useState(null);
  const [cartData, setCartdata] = React.useState([]);
  const navigate = useNavigate();

  const handleDeleteOpen = (favoriteId) => {
    setSelectedfavoriteId(favoriteId);
    setDeleteAlertOpen(true);
  };

  const isCard = (productId) => {
    return cartData.some((cart) => cart.productId === productId);
  };

  const handleAddCardIconColor = (productId) => {
    if (isCard(productId)) {
      return "primary";
    } else {
      return undefined;
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          const cartData = await CartsService.getCartsByUserId(token);
          setCartdata(cartData);
          console.log(cartData);
        } else {
          //enqueueSnackbar("Cart datalarını çekerken hata ", {   variant: "error", });
          console.log("Data çekerken hata: ");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          //  enqueueSnackbar("LÜtfen giriş yapınız", { variant: "error" });
          console.log(error);
        } else {
          //enqueueSnackbar("Cart Data çekerken hata:", { variant: "error" });
          console.log("Data çekerken hata:  ", error);
        }
      }
    };
    fetchCartData();
  }, []);

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
        } else {
          const productToAdd = favoritesData.find(
            (item) => item.productId === productId
          );
          if (productToAdd) {
            await CartsService.savetoCart(productToAdd);
            updatedCart.push(productToAdd);
          }
        }

        setCartdata(updatedCart);
      } else {
        enqueueSnackbar("Data çekerken hata ", { variant: "error" });
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

  const fetchFavoritesData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const favoritesData = await FavoritesService.getFavoritesByUserId(
          token
        );
        const favoriteProducts = await Promise.all(
          favoritesData.map(async (favorite) => {
            const product = await ProductsService.getProductById(
              favorite.productId
            );
            return {
              ...favorite,
              product: product, // Ürün bilgisini favori verisine ekle
            };
          })
        );
        setFavoritesData(favoriteProducts);
      } else {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "info" });
        console.log("Data çekerken hata: ");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
      //  enqueueSnackbar("Lütfen giriş yapınız", { variant: "error" });
        console.log(error);
        // throw error;
      } else {
        enqueueSnackbar("Data çekerken hata:", { variant: "error" });
        console.log("Data çekerken hata:  ", error);
      }
    }
  };
  useEffect(() => {
    fetchFavoritesData();
  }, []);

  const handleExpandClick = (productId) => {
    setFavoritesData((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        expanded:
          product.productId === productId
            ? !product.expanded
            : product.expanded,
      }))
    );
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
    setFavoritesData((prevFavorites) =>
      prevFavorites
        .slice()
        .sort((a, b) => b.productId.price - a.productId.price)
    );
  };

  const sortByLowestPrice = () => {
    setFavoritesData((prevFavorites) =>
      prevFavorites
        .slice()
        .sort((a, b) => a.productId.price - b.productId.price)
    );
  };

  const sortByNewestProducts = () => {
    setFavoritesData((prevFavorites) =>
      prevFavorites.slice().sort((a, b) => {
        const dateA = new Date(a.productId.creationDate);
        const dateB = new Date(b.productId.creationDate);

        if (isNaN(dateA) || isNaN(dateB)) {
          return 1;
        }

        return dateB - dateA; // Sort in descending order (newest first)
      })
    );
  };

  const HandleArrangementSelect = () => {
    return (
      <Box
        sx={{
          minWidth: 130,
          marginLeft: "1060px",
          marginBottom: "15px",
          marginTop: "15px",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Sıralama</InputLabel>
          <Select
            labelId="arrangement-simple-select-label"
            id="arrangement-simple-select"
            value={arrangement}
            defaultValue={10}
            label="Sıralama"
            onChange={handleChangeArrangement}
          >
            <MenuItem value={10}>Önerilen Sıralama</MenuItem>
            <MenuItem value={20}>En Çok Satanlar</MenuItem>
            <MenuItem value={30}>En Çok Beğenilenler</MenuItem>
            <MenuItem value={40} onClick={sortByLowestPrice}>
              En Düşük Fiyat
            </MenuItem>
            <MenuItem value={50} onClick={sortByHighestPrice}>
              En Yüksek Fiyat
            </MenuItem>
            <MenuItem value={60}>En Çok Beğenilenler</MenuItem>
            <MenuItem value={70} onClick={sortByNewestProducts}>
              En Yeniler
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  };

  const handleDeleteFavorite = async () => {
    try {
      await FavoritesService.deleteFavorites(selectedFavoriteId);
      enqueueSnackbar("Ürün favorilerden kaldırıldı", { variant: "success" });
      fetchFavoritesData();
      setDeleteAlertOpen();
    } catch (error) {
      enqueueSnackbar("Ürünü favorilerden kaldırırken hata oluştu", {
        variant: "error",
      });
      console.error("Favori ürünü silme hatası:", error);
    }
  };

  return (
    <>
      <AlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        handleAggree={() => handleDeleteFavorite()}
        message={
          'Favorites "' +
          favoritesData.find(
            (favorite) => favorite.favoriteId === selectedFavoriteId
          ) +
          '" will delete?'
        }
      />

      <HomeAppBar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "50px",
          marginTop: "15px",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h5">
          <FavoriteIcon sx={{ width: "60px", color: "#1e90ff" }} />
          Favorilerim
        </Typography>
        <HandleArrangementSelect />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {favoritesData &&
          favoritesData.map((favorite, index) => (
            <React.Fragment key={favorite.favoriteId}>
              {favorite.product && index % 4 === 0 && index !== 0 && (
                <div style={{ width: "100%", marginBottom: "25px" }}></div>
              )}
              {favorite.product && (
                <Tooltip
                  title={favorite.product.productName}
                  followCursor
                  style={{ width: "300px" }}
                >
                  <Card
                    key={favorite.product.productId}
                    onMouseEnter={() =>
                      handleCardHover(favorite.product.productId)
                    }
                    onMouseLeave={handleCardLeave}
                    sx={{
                      maxWidth: 260,
                      margin: "0 auto 10px",
                      marginLeft: "50px",
                      marginTop: "25px",
                      boxShadow:
                        hoveredCard === favorite.product.productId
                          ? "0 0 10px rgba(0,0,0,0.5)"
                          : "none",
                    }}
                  >
                    <CardHeader
                 
                      title={favorite.product.productName}
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={
                        favorite.product.productImages &&
                        favorite.product.productImages[0]
                      }
                      alt={"Paella dish"}
                      style={{ objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {favorite.product.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Fiyat: {favorite.product.price} TL</strong>
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteOpen(favorite.favoriteId)}
                      >
                        <RemoveCircleOutlineOutlined />
                      </IconButton>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddCardClick(favorite.product.productId);
                        }}
                      >
                        {" "}
                        <AddShoppingCartOutlined
                          color={handleAddCardIconColor(
                            favorite.product.productId
                          )}
                          sx={{ marginLeft: "5px" }}
                        />
                      </IconButton>
                      <ExpandMore
                        expand={favorite.expanded}
                        onClick={() =>
                          handleExpandClick(favorite.product.productId)
                        }
                        aria-expanded={favorite.expanded}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                    <Collapse
                      in={favorite.expanded}
                      timeout="auto"
                      unmountOnExit
                    >
                      <CardContent>
                        <Typography sx={{ color: "red" }}>
                          <strong>
                            Stok: {favorite.product.stockQuantity}
                          </strong>
                        </Typography>
                        <br />
                        <Typography paragraph>
                          {favorite.product.productInfo}
                        </Typography>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Tooltip>
              )}
            </React.Fragment>
          ))}
      </div>
    </>
  );
}

export default Favorites;
