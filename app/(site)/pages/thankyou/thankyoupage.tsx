'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import CustomizedBreadcrumbs from '../../../components/BreadCrumbs';

interface Order {
  totalAmount: number;
  trackingCode: string;
  [key: string]: any; // for any additional fields
}

export default function ThankYou() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    console.log('Thank you page mounted');
    const orderData = localStorage.getItem('lastOrder');
    console.log('Retrieved from localStorage:', orderData);

    if (orderData) {
      try {
        const parsedOrder: Order = JSON.parse(orderData);
        console.log('Parsed order data:', parsedOrder);
        setOrder(parsedOrder);
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, []);

  const handleViewOrders = () => {
    window.location.href = '/pages/account';
  };

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '60%',
          margin: '5% auto'
        }}
      >
        <CustomizedBreadcrumbs />
      </Box>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />

          <Typography variant="h5" gutterBottom>
            Your order has been successfully registered.
          </Typography>

          {order?.trackingCode ? (
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 2
                }}
              >
                <Typography variant="body1" gutterBottom>
                  Total Amount: ${order.totalAmount.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Tracking Code: {order.trackingCode}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Please save your tracking code for future reference
              </Typography>
            </Box>
          ) : (
            <Box sx={{ my: 3 }}>
              <Typography color="error">Order details not available</Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" onClick={handleViewOrders}>
              View orders
            </Button>
            <Button variant="outlined" onClick={handleReturnHome}>
              Return to Main Page
            </Button>
          </Box>
        </Paper>
      </Container>
 
    </div>
  );
}
