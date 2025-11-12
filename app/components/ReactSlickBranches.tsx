"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
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

// Dynamically import react-slick (SSR disabled)
const Slider = dynamic(() => import("react-slick"), { ssr: false });

// Arrow props
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
  const [isHovering, setIsHovering] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(5); // default (desktop)
  const [isMounted, setIsMounted] = useState(false);
  const images: StaticImageData[] = [a, b, c, d, e, f];

  // Detect screen width on client
  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width <= 480) setSlidesToShow(1);
      else if (width <= 768) setSlidesToShow(2);
      else if (width <= 1024) setSlidesToShow(3);
      else setSlidesToShow(5);
    };

    updateSlides(); // Run once on mount
    window.addEventListener("resize", updateSlides);
    setIsMounted(true);

    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  if (!isMounted) return null; // prevents SSR mismatch

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    nextArrow: <SampleNextArrow isHovering={isHovering} />,
    prevArrow: <SamplePrevArrow isHovering={isHovering} />,
  };

  return (
    <div
      className="slider-hover-wrapper"
      style={{ position: "relative", width: "100%", marginBottom: "100px" }}
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
                width: "100%",
                height: "100%",
                padding: "0 10px",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ResponsiveSlider;
