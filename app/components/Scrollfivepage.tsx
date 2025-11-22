"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import AssignmentReturnedOutlinedIcon from "@mui/icons-material/AssignmentReturnedOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";

// ✅ replace this import path with your actual image
import last from "../../public/img/imgi_76_image.webp";

const LastSection: React.FC = () => {
  return (
    <>
      {/* --- Main two-column section --- */}
      <Box
        className="Last"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          marginTop: "10%",
          backgroundColor: "#faf7ef",
          width: "100%",
        }}
      >
        {/* --- Left Side --- */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#faf7ef",
            color: "black",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "start",
              alignContent: "center",
              textAlign: "start",
              width: "100%",
              height: "auto",
              backgroundColor: "#faf7ef",
              color: "black",
              marginLeft: "5%",
              paddingTop: "10%",
              paddingBottom: "10%",
            }}
          >
            <h1
              style={{
                width: "100%",
                fontSize: "32px",
                fontWeight: "bolder",
                textAlign: "start",
              }}
            >
              We Design Gold Differently
            </h1>

            <Box
              sx={{
                textAlign: "start",
                marginLeft: 0,
                width: "100%",
              }}
            >
              <p
                style={{
                  width: "60%",
                  fontSize: "16px",
                  marginTop: "12%",
                }}
              >
                Because beautiful jewelry is an expression of yourself: wear what
                you want, how you want, or celebrate whenever you want, and keep
                it forever. These products are for your big moments and everyday
                use.
              </p>
            </Box>

            <Box
              className="listt"
              sx={{
                textAlign: "start",
                marginLeft: 0,
                marginTop: "10%",
              }}
            >
              <p style={{ fontWeight: "bolder", fontSize: "16px" }}>
                High commitment
              </p>
              <p style={{ fontWeight: "bolder", fontSize: "16px" }}>
                Innovation in design
              </p>
              <p style={{ fontWeight: "bolder", fontSize: "16px" }}>
                24 hour response
              </p>
              <p style={{ fontWeight: "bolder", fontSize: "16px" }}>
                sustainability
              </p>
            </Box>
          </Box>

          <Link
            href="./pages/all"
            style={{
              color: "black",
              margin: "0 10px",
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                marginLeft: "5%",
                padding: "2%",
                width: "45%",
                height: "60px",
                backgroundColor: "transparent",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid black",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              Know More About Rose Gold Gallery
            </Box>
          </Link>
        </Box>

        {/* --- Right Side --- */}
        <Box
          sx={{
            flex: 1,
            cursor: "pointer",
            position: "relative",
            bgcolor: "#faf7ef",
            color: "black",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 16",
              cursor: "pointer",
              bgcolor: "#faf7ef",
              color: "black",
             
              
            }}
          >
            <Image
              src={last}
              alt="rings"
              fill
              style={{ objectFit: "contain" , display:"flex",
              justifyContent:"center",
              alignItems:"center"}}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </Box>
        </Box>
      </Box>

      {/* --- Bottom black section --- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: "100%",
          height: "100px",
          backgroundColor: "black",
          color: "white",
        }}
      >
        {/* Left Box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "50%", sm: "50%" },
            paddingY: { xs: 1, sm: 0 },
          }}
        >
          <AssignmentReturnedOutlinedIcon />
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Return Policy After a Month
          </Typography>
        </Box>

        {/* Right Box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "50%", sm: "50%" },
            paddingY: { xs: 1, sm: 0 },
          }}
        >
          <GppGoodOutlinedIcon />
          <Typography variant="body1">Forever Warranty</Typography>
        </Box>
      </Box>
    </>
  );
};

export default LastSection;
