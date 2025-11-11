"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import Image, { StaticImageData } from "next/image";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


// Import images
import a from "../../public/img/washington-Park-Mall.jpg";
import b from "../../public/img/shopping-malls-los-angeles.jpg";
import c from "../../public/img/san-francisco-centre-westfield-01.jpg";
import d from "../../public/img/losvegas.jpg";
import e from "../../public/img/chicago-Water-Tower-061014-0196_54_990x660.webp";
import f from "../../public/img/arizona.webp";

// Define props for custom arrows
interface ArrowProps {
  onClick?: () => void;
  isHovering: boolean;
}

// Custom Next Arrow
const SampleNextArrow: React.FC<ArrowProps> = ({ onClick, isHovering }) => (
  <IconButton
    onClick={onClick}
    sx={{
      backgroundColor: "white",
      color: "black",
      borderRadius: "50%",
      width: 50,
      height: 50,
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      opacity: isHovering ? 1 : 0,
      transition: "opacity 0.3s ease",
      boxShadow: "2px 5px 6px rgba(0,0,0,0.2)",
      "&:hover": { backgroundColor: "#f0f0f0" },
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

// Custom Prev Arrow
const SamplePrevArrow: React.FC<ArrowProps> = ({ onClick, isHovering }) => (
  <IconButton
    onClick={onClick}
    sx={{
      backgroundColor: "white",
      color: "black",
      borderRadius: "50%",
      width: 50,
      height: 50,
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      opacity: isHovering ? 1 : 0,
      transition: "opacity 0.3s ease",
      boxShadow: "2px 5px 6px rgba(0,0,0,0.2)",
      "&:hover": { backgroundColor: "#f0f0f0" },
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

const ResponsiveSlider: React.FC = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const images: StaticImageData[] = [a, b, c, d, e, f];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    nextArrow: <SampleNextArrow isHovering={isHovering} />,
    prevArrow: <SamplePrevArrow isHovering={isHovering} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: false,
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />,
        },
      },
    ],
  };

  return (
    <div
      className="slider-hover-wrapper"
      style={{ position: "relative", width: "100%",marginBottom:"100px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Slider {...settings}>
        {images.map((imgSrc, index) => (
          <div key={index}>
        
            <Image
              src={imgSrc}
              alt={`img-${index}`}
              className="image-hover2"
              style={{
                objectFit: "cover",
                width: "95%",
                height: "250px",
              }}
            />
        
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ResponsiveSlider;
