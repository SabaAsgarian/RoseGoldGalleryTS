"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";


// ---------- Types ----------
interface ShippingAddress {
  city: string;
  street: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  status: string;
  trackingCode: string;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
}

// ---------- Component ----------
const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("");
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    city: "",
    street: "",
  });
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrder = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://rosegoldgallery-back.onrender.com/api/orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("خطا در دریافت سفارش");

      const data: Order = await response.json();
      setOrder(data);
      setStatus(data.status);
      setTrackingCode(data.trackingCode);
      setTotalAmount(String(data.totalAmount));
      setShippingAddress(data.shippingAddress || { city: "", street: "" });
      setItems(data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://rosegoldgallery-back.onrender.com/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            trackingCode,
            totalAmount,
            shippingAddress,
            items,
          }),
        }
      );

      if (!response.ok) throw new Error("خطا در بروزرسانی سفارش");

      router.push("/components/admin/orders");
    } catch (error) {
      console.error(error);
    }
  };

  if (!order) return <p>در حال بارگذاری...</p>;

  return (

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Edit Order
          </Typography>

          {/* Tracking Code */}
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Tracking code"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              fullWidth
            />
          </Box>

          {/* Total Amount */}
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Total Price"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              fullWidth
            />
          </Box>

          {/* Shipping Address */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="City"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Street"
              value={shippingAddress.street}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, street: e.target.value })
              }
              fullWidth
            />
          </Box>

          {/* Order Status */}
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Order Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Box>

          {/* Product Items */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              محصولات سفارش
            </Typography>
            {items.map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}
              >
                <TextField
                  label="نام محصول"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].name = e.target.value;
                    setItems(newItems);
                  }}
                  fullWidth
                />
                <TextField
                  label="تعداد"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].quantity = Number(e.target.value);
                    setItems(newItems);
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="قیمت واحد"
                  type="number"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].price = Number(e.target.value);
                    setItems(newItems);
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
            ))}
          </Box>

          {/* Submit Button */}
          <Box>
            <Button
              sx={{ color: "black" }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUpdate}
            >
              بروزرسانی سفارش
            </Button>
          </Box>
        </Paper>
      </Container>

  );
}
export default Page;