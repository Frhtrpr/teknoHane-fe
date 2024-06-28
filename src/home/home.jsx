import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import styles from "../css/home.css";
import HomeAppBar from "../AppBars/homeAppBar";
import CategoriesService from "../service/categoriesService";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";

const StyledCard = styled("div")({
  margin: "0 auto",
  marginTop: "35px",
  marginBottom: "90px",
  height: 350,
  width: 900,
  objectFit: "cover",
});

const StyledMedia = styled(CardMedia)({
  height: "100%",
});

const Home = () => {
  const [value, setValue] = useState(0);
  const [index, setIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const images = [
    "https://n11scdn.akamaized.net/a1/1180_440/23/10/20/56/99/28/91/63/06/45/33/26/25082186515194202873.jpg",
    "https://n11scdn.akamaized.net/a1/1180_440/24/03/25/76/37/11/88/42/89/99/32/22/27715404288942586172.jpg",
    "https://n11scdn.akamaized.net/a1/1180_440/23/10/20/56/99/28/91/63/06/45/33/26/25082186515194202873.jpg",
    "https://n11scdn.akamaized.net/a1/1180_440/24/03/07/91/91/98/01/35/22/05/65/22/62270304203969638553.jpg",
    "https://n11scdn.akamaized.net/a1/1180_440/24/01/16/50/77/19/65/45/30/83/87/75/15341615975630290076.jpg",
    "https://n11scdn.akamaized.net/a1/1180_440/23/12/01/71/63/63/41/62/24/40/38/73/54832968631527127266.jpg",
    "https://n11scdn.akamaized.net/a1/1180_440/24/02/19/67/50/38/80/29/52/25/87/71/36305403325453875755.jpg",
    "https://n11scdn.akamaized.net/a1/1180_440/24/01/02/56/20/58/38/45/02/52/26/32/97121053547786515998.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoriesService.getAllCtegories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={styles["home-container"]}>
      <HomeAppBar />
      <Link style={{ marginLeft: "1370px" }} to={"/admin-records"}>
        Admin Records
      </Link>
      <StyledCard>
        <StyledMedia
          component="img"
          image={images[index]}
          alt="Placeholder Image"
          title="Placeholder Image"
        />
      </StyledCard>
      <div className={styles["content"]}>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid
              item
              key={category.categoryId}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              style={{ marginLeft: "90px" }}
            >
              <Link to={`/${category.categoryName}/${category.categoryId}`}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.categoryImages[0]}
                    alt={category.categoryName}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      {category.categoryName}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
              <br />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Home;
