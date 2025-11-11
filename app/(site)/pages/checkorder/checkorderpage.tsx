'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';


interface User {
  fname: string;
  lname: string;
  city: string;
  street: string;
  mobile: string;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  img: string;
}

interface OrderResponse {
  order: Record<string, any>;
  [key: string]: any;
}

export default function CheckOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const cartData = localStorage.getItem('cart');

    if (!userData || !cartData) {
      router.push('/pages/basket');
      return;
    }

    try {
      const parsedUser: User = JSON.parse(userData);
      const parsedCart = JSON.parse(cartData);
      setUser(parsedUser);
      setCartItems(parsedCart.items);
      setTotalAmount(parsedCart.totalAmount);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing data:', error);
      router.push('/pages/basket');
    }
  }, [router]);

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/pages/userlogin');
        return;
      }

      if (!user) return;

      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          img: item.img
        })),
        totalAmount,
        shippingAddress: {
          city: user.city,
          street: user.street
        }
      };

      const response = await fetch('https://rosegoldgallery-back.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data: OrderResponse = await response.json();

      if (response.ok) {
        const trackingCode = Math.random().toString(36).substring(2, 15).toUpperCase();
        const orderToStore = {
          ...data.order,
          totalAmount,
          trackingCode
        };

        localStorage.setItem('lastOrder', JSON.stringify(orderToStore));
        localStorage.removeItem('cart');

        setTimeout(() => {
          window.location.href = '/pages/payment';
        }, 100);
      } else {
        throw new Error(data.error || 'Error placing order');
      }
    } catch (error: any) {
      console.error('Error during order confirmation:', error);
      alert(error.message || 'Error placing order. Please try again.');
    }
  };

  if (loading || !user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div>
   
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Confirm Order
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Receiver's Information
            </Typography>
            <Typography>Name: {user.fname} {user.lname}</Typography>
            <Typography>Address: {user.city}، {user.street}</Typography>
            <Typography>Mobile No: {user.mobile}</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={`https://rosegoldgallery-back.onrender.com/${item.img}`}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                        {item.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.price}</TableCell>
                    <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <strong>Total :</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${totalAmount.toFixed(2)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleConfirmOrder}>
              Pay & Final Registration of the order
            </Button>
            <Button variant="outlined" onClick={() => router.push('/pages/basket')}>
              Return To Cart
            </Button>
          </Box>
        </Paper>
      </Container>
  
    </div>
  );
}
