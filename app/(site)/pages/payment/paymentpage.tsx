'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress
} from '@mui/material';

interface Order {
  totalAmount: number;
  [key: string]: any; // for any additional fields
}

export default function Payment() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderData = localStorage.getItem('lastOrder');

    if (!orderData) {
      router.push('/pages/basket');
      return;
    }

    try {
      const parsedOrder: Order = JSON.parse(orderData);
      if (!parsedOrder || typeof parsedOrder.totalAmount !== 'number') {
        throw new Error('Invalid order data');
      }
      setOrder(parsedOrder);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing order data:', error);
      localStorage.removeItem('lastOrder');
      router.push('/pages/basket');
    }
  }, [router]);

  const handlePayment = async () => {
    try {
      const paymentSuccessful = true;

      if (paymentSuccessful) {
        window.location.href = '/pages/thankyou';
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment error. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <p>Loading...</p>
        <CircularProgress color="inherit" />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Order payment
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography align="center">
            Payable amount: {order?.totalAmount.toLocaleString()} $
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handlePayment}>
            Pay
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
