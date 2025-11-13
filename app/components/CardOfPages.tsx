"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";

import useStore from "../store";


// Define props type
interface ProductData {
  _id: string;
  img: string;
  title: string;
  price: number;
  category?: string;
  weight?: number;
}


interface MultiActionAreaCardProps {
  data: ProductData;
}

const MultiActionAreaCard: React.FC<MultiActionAreaCardProps> = ({ data }) => {
  const temp = {
    id: data._id,
    img: data.img,
    title: data.title,
    price: data.price,
    count: 1,
  };

  const { addProduct } = useStore();

  return (
  
      <Card sx={{ minWidth: 300, maxWidth: 350, border: "1px solid black" }}>
        <CardActionArea>
          <div
            style={{
              backgroundColor: "#faf7f1",
              mixBlendMode: "multiply",
            }}
            className="firstt"
          >
            <CardMedia
              component="img"
              image={`https://rosegoldgallerybackend.onrender.com/${data.img}`}
              alt={data.category}
              style={{
                backgroundColor: "#faf7f1",
                mixBlendMode: "multiply",
                height: "300px",
              }}
              className="secondd"
              loading="lazy"
            />
          </div>

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              weight : {data.weight} gr
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              price : {data.price}$
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions>
          <Button
            onClick={() => addProduct(temp)}
            size="large"
            color="primary"
            sx={{
              backgroundColor: "black",
              color: "white",
              width: "100%",
              textAlign: "center",
              "&:hover": {
                backgroundColor: "#3e3e3e",
              },
            }}
          >
            Add To Cart
          </Button>
        </CardActions>
      </Card>

  );
};

export default MultiActionAreaCard;
