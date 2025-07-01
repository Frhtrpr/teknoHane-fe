import { Card, CardContent, CardMedia, Typography } from "@mui/material";

function ProductCard({ name, description, imageUrl, url }) {

  
  return (
    <a href={url} style={{ textDecoration: "none", color: "inherit", marginBottom: "40px" }}>
      <Card style={{ minWidth: "200px" }}>
        <CardMedia
          component="img"
          height="200" 
          width="100%" 
          image={imageUrl}
          alt={name}
        />
        <CardContent style={{ padding: "3px" }}>
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </a>
  );
}

export default ProductCard;
