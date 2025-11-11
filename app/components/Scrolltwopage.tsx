"use client";

import Image from "next/image";
import Link from "next/link";
import { Box } from "@mui/material";

import rin from "../../public/img/rin.jpg";
import nec from "../../public/img/neck.jpg";
import brac from "../../public/img/brac.jpg";
import eari from "../../public/img/ear.jpg";

const categories = [
  { name: "Rings", image: rin, href: "../pages/rings" },
  { name: "Necklace", image: nec, href: "../pages/necklace" },
  { name: "Bracelet", image: brac, href: "../pages/bracelet" },
  { name: "Earrings", image: eari, href: "../pages/earings" },
];

const Page: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)", // 2 columns on mobile
          md: "repeat(4, 1fr)", // 4 columns on larger screens
        },
        gap: 0,
        mt: 2,
      }}
    >
      {categories.map((cat) => (
        <Link key={cat.name} href={cat.href} passHref>
          <Box
            sx={{
              position: "relative",
              border: "1px solid black",
              cursor: "pointer",
              "&:hover": {
                filter: "brightness(0.8)",
                "& .caption": {
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                },
              },
            }}
          >
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                style={{ objectFit: "cover" ,}}
                sizes="(max-width: 600px) 100vw, 25vw"
                priority
              />
            </Box>

            <Box
              className="caption"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "60px",
                backgroundColor: "transparent",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
              }}
            >
              {cat.name}
            </Box>
          </Box>
        </Link>
      ))}
    </Box>
  );
}
export default Page;