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
  const [slidesToShow, setSlidesToShow] = useState(5);
  const [key, setKey] = useState(0);

  // ✅ ریسپانسیو واقعی با حفظ وضعیت بعد از رفرش
  useEffect(() => {
    const calcSlides = () => {
      const width = window.innerWidth;
      if (width >= 1024) return 5;
      if (width >= 768) return 3;
      if (width >= 480) return 2;
      return 1;
    };

    const updateSlides = () => {
      setSlidesToShow(calcSlides());
      setKey((prev) => prev + 1); // ری‌ماینت اسلایدر برای sync کامل
    };

    updateSlides(); // در رفرش
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const slides: { img: StaticImageData; link: string }[] = [
    { img: a, link: "/pages/necklace" },
    { img: b, link: "/pages/necklace" },
    { img: c, link: "/pages/necklace" },
    { img: d, link: "/pages/rings" },
    { img: e, link: "/pages/necklace" },
    { img: f, link: "/pages/necklace" },
    { img: g, link: "/pages/necklace" },
    { img: h, link: "/pages/rings" },
    { img: i, link: "/pages/bracelet" },
    { img: j, link: "/pages/rings" },
    { img: k, link: "/pages/earings" },
    { img: l, link: "/pages/necklace" },
    { img: m, link: "/pages/bracelet" },
  ];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    nextArrow: <SampleNextArrow isHovering={isHovering} />,
    prevArrow: <SamplePrevArrow isHovering={isHovering} />,
    adaptiveHeight: true,
  };

  return (
    <div
      className="slider-container"
      style={{ position: "relative", padding: "0 10px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Slider key={key} {...(settings as any)}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-white mix-blend-multiply"
            style={{ margin: "0 10px" }}
          >
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
                   
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
