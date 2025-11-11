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
          alignItems: "center",
          marginTop: "5%",
          marginLeft: "3%",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            color: "black",
           marginBottom: "25px",
            fontSize: "25px",
          }}
        >
          Our Branches
        </Box>
        <Box
          sx={{
            fontWeight: "thin",
            color: "black",
            marginBottom: "50px",
            fontSize: "15px",
          }}
        >
          Find our nearest branch based on your address.
        </Box>
       
      </Box>
    </>
  );
}
export default Page;