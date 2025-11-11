"use client";

import React, { useEffect, useState } from "react";
import MultiActionAreaCard from "../../../components/CardOfPages";
import brace from "../../../../public/img/bacelettop.jpg";
import Image from "next/image";
import useStore from "../../../store";
import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import CustomizedBreadcrumbs from '../../../components/BreadCrumbs';
// 🧩  API data structure
interface Product {
  _id: string; // required now
  id?: string;
  title: string;
  price: number;
  weight?: number;
  img: string;
  category?: string;
  [key: string]: any;
}

// 🛰️ Fetch function with ISR (Incremental Static Regeneration)
async function getData(): Promise<Product[]> {
  const res = await fetch(
    "https://rosegoldgallery-back.onrender.com/api/category/rings",
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data: " + res.statusText);
  }

  return res.json();
}

// 🪄 Component
const RingsPage: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addProduct } = useStore();
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Fetch products + window resize listener
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Ensure window width is set on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  return (
    <div>
     

      <h1
        style={{
          textAlign: "start",
        
          fontSize: "32px",
          fontWeight: "bold",
           display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: "3%",
          marginLeft: "3%",
          marginBottom:"3%"
        }}
      >
        Rings
      </h1>

      {/* 🖼️ Top Image */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "3%" }}>
        <div style={{ position: "relative", width: "100%", height: "230px" }}>
          <Image src={brace} alt="Rings" fill style={{ objectFit: "cover" }} priority />
        </div>
      </div>


        
        <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '0% auto' }}>
        <CustomizedBreadcrumbs />
      </Box>
      {/* 🪶 Product Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: windowWidth < 600 ? "75%" : windowWidth < 1024 ? "90%" : "75%",
          margin: "5% auto",
        }}
      >
        {loading ? (
          // 💨 Skeleton while loading
          Array.from(new Array(9)).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              style={{
                margin: "30px",
                border: "1px solid grey",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Skeleton variant="rectangular" width={300} height={300} />
              <Box sx={{ width: 290, backgroundColor: "white", height: 100 }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </Box>
              <Skeleton
                variant="rectangular"
                width={290}
                height={40}
                sx={{ borderRadius: "10px", marginBottom: "10px" }}
              />
            </div>
          ))
        ) : error ? (
          <p>Error: {error}</p>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={item._id || item.id || `rings-${index}`} // ✅ fixed key
              style={{
                flex:
                  windowWidth < 600
                    ? "1 0 100%"
                    : windowWidth < 1024
                    ? "1 0 50%"
                    : "1 0 33.33%",
                marginBottom: "5%",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MultiActionAreaCard data={item} />
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>


    </div>
  );
};

export default RingsPage;
