"use client";

import { Box } from "@mui/material";
import Link from "next/link";



const Page: React.FC = () => {
  return (
    <>
     <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: "5%",
          marginLeft: "3%",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            color: "black",
            marginBottom: 1,
            fontSize: "25px",
          }}
        >
          Our Best Sellers
        </Box>
        <Link href="../pages/all" passHref style={{ textDecoration: "none" }}>
          <Box
            sx={{
              padding: "2%",
              backgroundColor: "transparent",
              border: "2px solid black",
              width: "200px",
              height: "60px",
              color: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              marginBottom:"50px",
              "&:hover": {
                backgroundColor: "#faf7f1",
              },
            }}
          >
            Shop
          </Box>
        </Link>
      </Box>
    </>
  );
}
export default Page;