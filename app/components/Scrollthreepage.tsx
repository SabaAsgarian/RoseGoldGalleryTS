"use client";

import React from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

import left from "../../public/img/homeleft.jpg";
import right from "../../public/img/homeright.jpg";

const HomeShowcase: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
        mt: 2,
        width: "100%",
      }}
    >
      {/* ===== Left Side (Earrings) ===== */}
      <Link href="../pages/necklace" passHref>
        <Box
          sx={{
            cursor: "pointer",
            border: "1px solid black",
            position: "relative",
            bgcolor: "#f1eee4cc",
            color: "black",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              borderBottom: "1px solid black",
            }}
          >
            <Image
              src={left}
              alt="Earrings"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </Box>

          {/* Caption: Title */}
          <Box
            sx={{
              position: "absolute",
              bottom: "15%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "60px",
              backgroundColor: "transparent",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bolder",
              textAlign: "center",
            }}
          >
            Shining for You
          </Box>

          {/* Caption: Button (hover only on button) */}
          <Box
            sx={{
              position: "absolute",
              bottom: "5%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              px: 2,
              py: 1,
              backgroundColor: "#f1eee4cc",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              fontWeight: 500,
              textAlign: "center",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
            Shop Our New Earrings
          </Box>
        </Box>
      </Link>

      {/* ===== Right Side (Necklaces) ===== */}
      <Link href="../pages/earings" passHref>
        <Box
          sx={{
            cursor: "pointer",
            border: "1px solid black",
            position: "relative",
            bgcolor: "#f1eee4cc",
            color: "black",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              borderBottom: "1px solid black",
            }}
          >
            <Image
              src={right}
              alt="Necklace"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </Box>

          {/* Caption: Title */}
          <Box
            sx={{
              position: "absolute",
              bottom: "15%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "60px",
              backgroundColor: "transparent",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bolder",
              textAlign: "center",
            }}
          >
            Necklace for You
          </Box>

          {/* Caption: Button (hover only on button) */}
          <Box
            sx={{
              position: "absolute",
              bottom: "5%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              px: 2,
              py: 1,
              backgroundColor: "#f1eee4cc",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              textAlign: "center",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
          Shop Our New Necklaces
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default HomeShowcase;