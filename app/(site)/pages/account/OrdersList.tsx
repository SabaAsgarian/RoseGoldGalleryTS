'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://rosegoldgallerybackend.onrender.com/api/orders/user'
        );
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
