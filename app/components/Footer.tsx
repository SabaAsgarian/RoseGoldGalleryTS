"use client";

import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AssignmentReturnedOutlinedIcon from "@mui/icons-material/AssignmentReturnedOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import MailIcon from "@mui/icons-material/Mail";
import Image from "next/image";
import Link from "next/link";


// image imports
import logO from "../../public/img/logo2.png";
import Me from "../../public/img/me.png";

// ✅ styled component
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f9f9f9",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "start",
  color: theme.palette.text.secondary,
  boxShadow: "none",
  ...(theme.palette.mode === "dark" && {
    backgroundColor: "#f9f9f9",
  }),
}));

// ✅ component definition
const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
        backgroundColor: "#f9f9f9",
        marginTop: "10%",
        color: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
          marginLeft: "5%",
          marginTop: "5%",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Image
            src={logO}
            alt="Logo"
            priority
            width={550}
            height={150}
            style={{
              width: "100%",
              maxWidth: "550px",
              height: "auto",
              marginBottom: "10%",
            }}
          />
        </Link>

        {/* ✅ Policy & Warranty section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            height: "auto",
            backgroundColor: "transparent",
            color: "black",
            marginBottom: "7%",
            marginTop: "5%",
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "25%", md: "25%" },
              mb: { xs: 2, md: 0 },
            }}
          >
            <AssignmentReturnedOutlinedIcon
              sx={{
                fontSize: "40px",
                boxShadow: "1px 1px 100px 0px #c6a55f inset",
                borderRadius: "50%",
              }}
            />
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              Return Policy After a Month
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "25%", md: "25%" },
              textAlign: "center",
              mb: { xs: 2, md: 0 },
            }}
          >
            <RedeemOutlinedIcon
              sx={{
                fontSize: "40px",
                boxShadow: "1px 1px 100px 0px #c6a55f inset",
                borderRadius: "50%",
              }}
            />
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              Sending multiple products at the same time
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "25%", md: "25%" },
              mb: { xs: 2, md: 0 },
            }}
          >
            <GppGoodOutlinedIcon
              sx={{
                fontSize: "40px",
                boxShadow: "1px 1px 100px 0px #c6a55f inset",
                borderRadius: "50%",
              }}
            />
            <Typography variant="body1">Forever Warranty</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "25%", md: "25%" },
            }}
          >
            <ChangeCircleOutlinedIcon
              sx={{
                fontSize: "40px",
                boxShadow: "1px 1px 100px 0px #c6a55f inset",
                borderRadius: "50%",
              }}
            />
            <Typography variant="body1">Exchange Up To A week</Typography>
          </Box>
        </Box>

        {/* ✅ Link stacks */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 3, sm: 2, md: 4, lg: 10 }}
        >
          <Item>
            <a
              href="#link1"
              style={{ color: "black", textDecoration: "none", textAlign: "start" }}
            >
              <p style={{fontWeight:"bolder",marginBottom:"5%"}}>for you</p>
              <p className="p-hover">Cooperation with Rose</p>
              <p className="p-hover">Grant of representation</p>
              <p className="p-hover">Frequently asked questions</p>
              <p className="p-hover">Be Gold Campaign</p>
            </a>
          </Item>

          <Item>
            <a
              href="#link2"
              style={{ color: "black", textDecoration: "none", textAlign: "start" }}
            >
              <p style={{fontWeight:"bolder",marginBottom:"5%"}}>guide</p>
              <p className="p-hover">How to order and pay</p>
              <p className="p-hover">Delivery of orders</p>
              <p className="p-hover">Exchanges and returns</p>
              <p className="p-hover">Terms of use and user privacy</p>
              <p className="p-hover">Sizing guide</p>
            </a>
          </Item>

          <Item>
            <a
              href="#link3"
              style={{ color: "black", textDecoration: "none", textAlign: "start" }}
            >
              <p style={{fontWeight:"bolder",marginBottom:"5%"}}>Rose GoldGallery</p>
              <p className="p-hover">About Rose</p>
              <p className="p-hover">branches</p>
              <p className="p-hover">blog</p>
              <p className="p-hover">Contact us</p>
            </a>
          </Item>
        </Stack>

        {/* ✅ Developer Info */}
        <Box sx={{ width: "100%", my: "5%" }}>
          <Stack spacing={2}>
            <Item>
              <Image
                src={Me}
                alt="Developer image"
                width={100}
                height={100}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#c9a659",
                }}
              />
              Developed by Saba Asgarian
              <Link href="https://www.instagram.com/saba_asgarian_">
                <InstagramIcon sx={{ color: "black", ml: "2%" }} />
              </Link>
              <Link href="https://www.linkedin.com/in/saba-asgarian-69161088">
                <LinkedInIcon sx={{ color: "black", ml: "2%" }} />
              </Link>
              <Link href="https://github.com/SabaAsgarian">
                <GitHubIcon sx={{ color: "black", ml: "2%" }} />
              </Link>
              <Link href="mailto:sabaasgarian591@gmail.com">
                <MailIcon sx={{ color: "black", ml: "2%" }} />
              </Link>
            </Item>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
