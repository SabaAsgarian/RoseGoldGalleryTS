"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "../globals.css";

// --- IMAGES ---
import a from "../../public/img/1.jpg";
import b from "../../public/img/2.jpg";
import c from "../../public/img/3.jpg";
import d from "../../public/img/4.jpg";
import e from "../../public/img/5.jpg";
import f from "../../public/img/6.jpg";
import g from "../../public/img/7.jpg";
import h from "../../public/img/8.jpg";
import i from "../../public/img/9.jpg";
import j from "../../public/img/10.jpg";
import k from "../../public/img/11.jpg";
import l from "../../public/img/neck.jpg";
import m from "../../public/img/13.jpg";

// ---------- Types ----------
interface ArrowProps {
  onClick?: () => void;
  isHovering: boolean;
}

// ---------- Custom Arrows ----------
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
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

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
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

// ---------- Slider Component ----------
const ReactSlick: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // ✅ برای درست ماندن وضعیت بعد از رفرش
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sliderContainer = document.querySelector(".slider-container");
    if (!sliderContainer) return;

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    sliderContainer.addEventListener("mouseenter", handleEnter);
    sliderContainer.addEventListener("mouseleave", handleLeave);

    return () => {
      sliderContainer.removeEventListener("mouseenter", handleEnter);
      sliderContainer.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const slides: { img: StaticImageData; link: string }[] = [
    { img: a, link: "../pages/necklace" },
    { img: b, link: "../pages/necklace" },
    { img: c, link: "../pages/necklace" },
    { img: d, link: "../pages/rings" },
    { img: e, link: "../pages/necklace" },
    { img: f, link: "../pages/necklace" },
    { img: g, link: "../pages/necklace" },
    { img: h, link: "../pages/rings" },
    { img: i, link: "../pages/bracelet" },
    { img: j, link: "../pages/rings" },
    { img: k, link: "../pages/earings" },
    { img: l, link: "../pages/necklace" },
    { img: m, link: "../pages/bracelet" },
  ];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow:
      windowWidth >= 1024 ? 5 : windowWidth >= 600 ? 3 : windowWidth >= 480 ? 2 : 1,
    slidesToScroll:
      windowWidth >= 1024 ? 5 : windowWidth >= 600 ? 3 : windowWidth >= 480 ? 2 : 1,
    nextArrow: <SampleNextArrow isHovering={isHovering} />,
    prevArrow: <SamplePrevArrow isHovering={isHovering} />,
    adaptiveHeight: true,
  };

  return (
    <div className="slider-container" style={{ position: "relative", padding: "0 10px" }}>
     <Slider key={windowWidth} {...(settings as any)}>
        {slides.map((slide, index) => (
          <div key={index} className="bg-white mix-blend-multiply" style={{ margin: "0 10px" }}>
            <div
              key={`inner-${index}`}
              className="bg-[#faf7f1] mix-blend-multiply"
              style={{ margin: "0 10px" }}
            >
              <Link href={slide.link} passHref>
                <Image
                  src={slide.img}
                  alt={`slide-${index}`}
                  className="image-hover"
                  style={{
                    height: "80%",
                    backgroundColor: "#faf7f1",
                    mixBlendMode: "multiply",
                    width: "100%",
                  }}
                  placeholder="blur"
                />
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ReactSlick;
