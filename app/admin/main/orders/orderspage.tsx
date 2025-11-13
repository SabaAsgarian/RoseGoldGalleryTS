"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";


// ---------- Types ----------
interface User {
  fname: string;
  lname: string;
  city: string;
  street: string;
  role: string;
}

interface OrderItem {
  id: string;
  name?: string;
  quantity: number;
}

interface Order {
  _id: string;
  trackingCode: string;
  userId?: User;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

// ---------- Utils ----------
const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
};

// ---------- Component ----------
const Page: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token || isTokenExpired(token)) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/admin");
      return;
    }

    try {
      const user: User = JSON.parse(userData);
      if (user.role !== "admin") {
        router.push("/");
        return;
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/admin");
      return;
    }

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin");
        return;
      }

      const response = await fetch(
        "https://rosegoldgallerybackend.onrender.com/api/orders/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/admin");
          return;
        }
        throw new Error("Error Fetching Orders!!!");
      }

      const data: Order[] = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error Fetching Orders Please Try Again!!");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Are You Sure You Want to delete This Order???")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin");
        return;
      }

      const response = await fetch(
        `https://rosegoldgallerybackend.onrender.com/api/orders/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/admin");
          return;
        }
        throw new Error("Error In Deleting This Order!!");
      }

      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error In Deleting This Order!! Please Try Again!!!");
    }
  };

  if (loading) {
    return (
   
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
    
    );
  }

  return (
  
      <Box sx={{ maxWidth: "92vw", overflowX: "hidden" }}>
        <Box sx={{ width: "100%", mx: "auto", px: { xs: 1, sm: 2, md: 3 } }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Managing Orders
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tracking code</TableCell>
                      <TableCell>User&apos;s Name</TableCell>
                      <TableCell>Products</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Shipping address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Register Time</TableCell>
                      <TableCell>op</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order.trackingCode}</TableCell>
                        <TableCell>
                          {order.userId
                            ? `${order.userId.fname} ${order.userId.lname}`
                            : "Unknown"}
                        </TableCell>
                        <TableCell>
                          {order.items.map((item, itemIndex) => (
                            <div key={`${order._id}-${item.id || itemIndex}`}>
                              {item.name || "Unknown Product"} (x
                              {item.quantity})
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>${order.totalAmount}</TableCell>
                        <TableCell>
                          {order.userId
                            ? `${order.userId.city}, ${order.userId.street}`
                            : "Address not available"}
                        </TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              router.push(
                                `/admin/main/orders/edit/${order._id}`
                              )
                            }
                          >
                            <Edit sx={{ color: "black" }} />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(order._id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Container>
        </Box>
      </Box>
  
  );
}
export default Page;