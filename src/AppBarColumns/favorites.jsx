import {
  AddShoppingCartOutlined,
  RemoveCircleOutlineOutlined
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
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
import AlertDialog from "../Alert/AlertDialog";
import HomeAppBar from "../AppBars/homeAppBar";
import CartsService from "../service/cartService";
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

function Favorites() {
  const [favoritesData, setFavoritesData] = React.useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [arrangement, setArrangement] = React.useState(10);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [selectedFavoriteId, setSelectedfavoriteId] = React.useState(null);
  const [cartData, setCartdata] = React.useState([]);
  const [productNameFilter, setProductNameFilter] = React.useState("");

  const navigate = useNavigate();

  const filteredFavorites = favoritesData.filter(favorite =>
  favorite.product?.productName.toLowerCase().includes(productNameFilter.toLowerCase())
);


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
        // enqueueSnackbar("Data çekerken hata ", { variant: "error" });
        console.log("Data çekerken hata: ");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        enqueueSnackbar("Lütfen giriş yapınız", { variant: "error" });
        console.log(error);
        throw error;
      } else {
        // enqueueSnackbar("Sepete eklerken hata:", { variant: "error" });
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
              product: product, 
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
        // enqueueSnackbar("Data çekerken hata:", { variant: "error" });
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
        .sort((a, b) => b.product.price - a.product.price)
    );
  };

  const sortByLowestPrice = () => {
    setFavoritesData((prevFavorites) =>
      prevFavorites
        .slice()
        .sort((a, b) => a.product.price - b.product.price)
    );
  };

  const sortByNewestProducts = () => {
    setFavoritesData((prevFavorites) =>
      prevFavorites.slice().sort((a, b) => {
        const dateA = new Date(a.product.creationDate);
        const dateB = new Date(b.product.creationDate);

        if (isNaN(dateA) || isNaN(dateB)) {
          return 1;
        }

        return dateB - dateA;
      })
    );
  };

  const sortRandomArrangement = () => {
  setFavoritesData((prevFavorites) => {
    const shuffled = [...prevFavorites];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
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

    const handleCardClick = (productId) => {
    const locationUrl = window.location.pathname;
    const url = `${locationUrl}/${productId}`;

    navigate(url);
  };


  return (
    <>
      <AlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        handleAggree={() => handleDeleteFavorite()}
      message="Kaldırmak istediğinize emin misiniz?"

      />

      <HomeAppBar />
 <Box
  sx={{
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    mt: 3,
    mb: 2,
    px: 3,
  }}
>
  {/* Sol: Filtreleme */}
  <Box sx={{ flexShrink: 0, width: { xs: "100%", sm: "250px" }, mb: { xs: 2, sm: 0 } }}>
    <TextField
      placeholder="Ürün adına göre filtrele"
      variant="outlined"
      value={productNameFilter}
      onChange={(e) => setProductNameFilter(e.target.value)}
      sx={{
        borderRadius: "12px",
        backgroundColor: "#fff",
        width: "100%",
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
  </Box>

  <Box sx={{ flexGrow: 1, flexBasis: 0, textAlign: "center" }}>
    <Typography
      variant="h5"
      sx={{
        color: "#1e90ff",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <FavoriteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
      Favorilerim
    </Typography>
  </Box>

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
      value={arrangement}
      label="Sıralama"
      onChange={handleChangeArrangement}
    >
      <MenuItem value={10} onClick={sortRandomArrangement}>
        Önerilen Sıralama
      </MenuItem>
      <MenuItem value={20} onClick={sortByLowestPrice}>
        En Düşük Fiyat
      </MenuItem>
      <MenuItem value={30} onClick={sortByHighestPrice}>
        En Yüksek Fiyat
      </MenuItem>
      <MenuItem value={40} onClick={sortByNewestProducts}>
        En Yeniler
      </MenuItem>
    </Select>
  </FormControl>
</Box>

 <Grid container spacing={3} justifyContent="flex-start" sx={{ paddingX: 3 }}>
  {filteredFavorites.length === 0 ? (
    <Box
      sx={{
        width: "100%",
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "text.secondary",
        fontSize: "1.2rem",
      }}
    >
      {/* Dilersen buraya bir ikon veya resim de ekleyebilirsin */}
      <FavoriteBorderIcon sx={{ fontSize: 80, mb: 2, color: "lightgray" }} />
      Favori ürün bulunamadı.
    </Box>
  ) : (
    filteredFavorites.map((favorite) =>
      favorite.product ? (
        <Grid
          item
          key={favorite.favoriteId}
          xs={12}
          sm={6}
          md={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Tooltip title={favorite.product.productName} followCursor>
            <Card
              onMouseEnter={() => handleCardHover(favorite.product.productId)}
              onMouseLeave={handleCardLeave}
              onClick={() => handleCardClick(favorite.product.productId)}
              sx={{
                maxWidth: "%",
                boxShadow:
                  hoveredCard === favorite.product.productId
                    ? "0 0 10px rgba(0,0,0,0.5)"
                    : "none",
                marginTop: 3,
                width: "100%",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardHeader title={favorite.product.productName} />
              <CardMedia
                component="img"
                height="194"
                image={
                  favorite.product.productImages &&
                  favorite.product.productImages[0]
                }
                alt={favorite.product.productName}
                style={{
                  height: 160,
                  objectFit: "contain",
                  padding: "10px",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {favorite.product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
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
                  <AddShoppingCartOutlined
                    color={handleAddCardIconColor(favorite.product.productId)}
                    sx={{ ml: 1 }}
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

              <Collapse in={favorite.expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography sx={{ color: "red" }}>
                    <strong>Stok: {favorite.product.stockQuantity}</strong>
                  </Typography>
                  <br />
                  <Typography paragraph>{favorite.product.productInfo}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Tooltip>
        </Grid>
      ) : null
    )
  )}
</Grid>

    </>
  );
}

export default Favorites;
