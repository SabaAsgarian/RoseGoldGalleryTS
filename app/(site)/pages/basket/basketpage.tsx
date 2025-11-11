"use client";
import React, { useEffect, useState } from "react";
import useStore, { Product, StoreState } from "../../../store";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import Link from "next/link";

const PayButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "darkgray",
  },
});

const CartPage: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const { products, plusFromCart, minusFromCart, num, totalPrice } =
    useStore() as StoreState;
  const [isClient, setIsClient] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    totalPrice();

    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalPrice]);

  if (!isClient) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "80vh",
        }}
      >
        <Box sx={{ fontSize: "50px", textAlign: "center" }}>
          <p>Loading...</p>
          <CircularProgress color="inherit" />
        </Box>
      </Box>
    );
  }

  const handlePlaceOrder = () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      const currentPath = "/pages/basket";
      localStorage.setItem("redirectAfterLogin", currentPath);
      router.push("/pages/userlogin");
      return;
    }

    const cartData = {
      items: products.map((item: Product) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: item.count,
        img: item.img,
      })),
      totalAmount: num,
    };

    localStorage.setItem("cart", JSON.stringify(cartData));
    router.push("/pages/checkorder");
  };

  return (
    <>
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
          marginBottom: "3%",
        }}
      >
        Cart
      </h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={8}>
                Product Details
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Add</TableCell>
              <TableCell>Remove</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((val: Product) => (
              <TableRow key={val.id}>
                <TableCell>
                  <img
                    src={`https://rosegoldgallery-back.onrender.com/${val.img}`}
                    alt={val.title}
                    style={{
                      width: "50px",
                      height: "50px",
                      border: "1px solid black",
                      borderRadius: "50%",
                      backgroundColor: "#d2c9a9",
                    }}
                  />
                </TableCell>
                <TableCell>{val.title}</TableCell>
                <TableCell align="left">{val.price}$</TableCell>
                <TableCell align="left">{val.count}</TableCell>
                <TableCell align="left">
                  <button
                    onClick={() => {
                      plusFromCart(val.id);
                      totalPrice();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      border: "0px",
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </button>
                </TableCell>
                <TableCell align="left">
                  <button
                    onClick={() => {
                      minusFromCart(val.id);
                      totalPrice();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      border: "0px",
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </button>
                </TableCell>
                <TableCell align="left">{val.price * val.count}$</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h3
          style={{
            textAlign: "start",
            marginTop: "2%",
            marginBottom: "2%",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          - Total Price Of Your Shopping Is: {num}$
        </h3>

        {orderSuccess ? (
          <h3 style={{ color: "green", textAlign: "center" }}>
            ✅ Order placed successfully!
          </h3>
        ) : (
          <Stack
            spacing={3}
            direction="row"
            sx={{
              marginTop: "2%",
              justifyContent: "center",
              marginBottom: "20%",
              gap: "30px",
            }}
          >
            <PayButton
              onClick={handlePlaceOrder}
              disabled={loading}
              sx={{ height: "50px", width: "300px" }}
            >
              {loading ? "Processing..." : "Place Order"}
              <PaymentIcon sx={{ marginLeft: "10px" }} />
            </PayButton>

            <Link href="./shop">
              <Button
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  border: "2px solid black",
                  height: "50px",
                  width: "300px",
                }}
              >
                Continue To Shop
              </Button>
            </Link>
          </Stack>
        )}
      </TableContainer>
    </>
  );
};

export default CartPage;
