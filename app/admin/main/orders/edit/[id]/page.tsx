'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// === Types ===
interface ShippingAddress {
  city: string;
  street: string;
}

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  img?: string;
}

interface User {
  fname: string;
  lname: string;
  city?: string;
  street?: string;
}

interface Order {
  _id: string;
  trackingCode: string;
  userId?: User;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
}

interface EditOrderPageProps {
  params: Promise<{ id: string }>;
}

// === Styled Components ===
const WhiteTextField = styled(TextField)({
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  '& .MuiInputBase-input': {
    color: 'black',
  },
  '& .MuiInputLabel-root': {
    color: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black',
    },
    '&:hover fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'grey',
    },
  },
});

// === Component ===
export default function EditOrderPage({ params }: EditOrderPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Resolve params in Next.js 15+
    params.then((resolvedParams) => {
      setOrderId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/admin');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/admin');
      return;
    }

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, router]);

  const fetchOrder = async (): Promise<void> => {
    if (!orderId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin');
        return;
      }

      console.log('Fetching order with ID:', orderId);

      const response = await fetch(
        `https://rosegoldgallery-back.onrender.com/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/admin');
          return;
        }

        if (response.status === 404) {
          setError('Order not found');
          setLoading(false);
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch order');
      }

      const data: Order = await response.json();
      console.log('Received order data:', data);

      setOrder(data);
      setEditedOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!orderId || !editedOrder) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const response = await fetch(
        `https://rosegoldgallery-back.onrender.com/api/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: editedOrder.status,
            shippingAddress: editedOrder.shippingAddress,
            items: editedOrder.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Order not found');
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order');
      }

      const data = await response.json();
      setOrder(data.order || data);
      setIsEditing(false);
      alert('Order Updated Successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error instanceof Error ? error.message : 'Error updating order');
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '100vh',
          color: 'black',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography color="error" sx={{ color: 'black' }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/admin/main/orders')}
            sx={{ mt: 2 }}
          >
            Back to Orders List
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!order || !editedOrder) {
    return (
      <Container>
        <Typography>Order not found</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '92vw',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '100%' },
          mx: 'auto',
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton
                onClick={() => router.push('/admin/main/orders')}
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5">
                Edit order #{order.trackingCode}
              </Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>User&apos;s Name</TableCell>
                    <TableCell>Tracking code</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Op</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {order.userId
                        ? `${order.userId.fname} ${order.userId.lname}`
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>{order.trackingCode}</TableCell>
                    <TableCell>${order.totalAmount}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                          }}
                        >
                          <WhiteTextField
                            select
                            size="small"
                            value={editedOrder.status}
                            onChange={(e) =>
                              setEditedOrder({
                                ...editedOrder,
                                status: e.target.value,
                              })
                            }
                            sx={{ minWidth: 150 }}
                          >
                            <MenuItem value="pending">pending</MenuItem>
                            <MenuItem value="processing">processing</MenuItem>
                            <MenuItem value="shipped">shipped</MenuItem>
                            <MenuItem value="delivered">delivered</MenuItem>
                            <MenuItem value="completed">completed</MenuItem>
                            <MenuItem value="cancelled">cancelled</MenuItem>
                          </WhiteTextField>
                          <IconButton onClick={handleSave} color="primary">
                            <SaveIcon sx={{ color: 'black' }} />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setIsEditing(false);
                              setEditedOrder(order);
                            }}
                          >
                            <ArrowBackIcon sx={{ color: 'black' }} />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography>
                            {order.status === 'pending' && 'pending'}
                            {order.status === 'processing' && 'processing'}
                            {order.status === 'shipped' && 'shipped'}
                            {order.status === 'delivered' && 'delivered'}
                            {order.status === 'completed' && 'completed'}
                            {order.status === 'cancelled' && 'cancelled'}
                          </Typography>
                          <IconButton onClick={() => setIsEditing(true)}>
                            <EditIcon sx={{ color: 'black' }} />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => router.push('/admin/main/orders')}
                      >
                        <ArrowBackIcon sx={{ color: 'black' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Order Details
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', md: 'row' },
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2">
                                Order Date:
                              </Typography>
                              <Typography>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2">
                                Shipping Address:
                              </Typography>
                              {isEditing ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                  }}
                                >
                                  <WhiteTextField
                                    label="City"
                                    value={editedOrder.shippingAddress.city}
                                    onChange={(e) =>
                                      setEditedOrder({
                                        ...editedOrder,
                                        shippingAddress: {
                                          ...editedOrder.shippingAddress,
                                          city: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                  <WhiteTextField
                                    label="Address"
                                    value={editedOrder.shippingAddress.street}
                                    onChange={(e) =>
                                      setEditedOrder({
                                        ...editedOrder,
                                        shippingAddress: {
                                          ...editedOrder.shippingAddress,
                                          street: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </Box>
                              ) : (
                                <Typography>
                                  {order.shippingAddress.city} -{' '}
                                  {order.shippingAddress.street}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Products:
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Product Name</TableCell>
                                  <TableCell>Quantity</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell>Image</TableCell>
                                  {isEditing && <TableCell>Actions</TableCell>}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      {isEditing ? (
                                        <WhiteTextField
                                          size="small"
                                          value={editedOrder.items[index].name}
                                          onChange={(e) => {
                                            const newItems = [
                                              ...editedOrder.items,
                                            ];
                                            newItems[index] = {
                                              ...newItems[index],
                                              name: e.target.value,
                                            };
                                            setEditedOrder({
                                              ...editedOrder,
                                              items: newItems,
                                            });
                                          }}
                                        />
                                      ) : (
                                        item.name
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {isEditing ? (
                                        <WhiteTextField
                                          type="number"
                                          size="small"
                                          value={editedOrder.items[index].quantity}
                                          onChange={(e) => {
                                            const newItems = [
                                              ...editedOrder.items,
                                            ];
                                            newItems[index] = {
                                              ...newItems[index],
                                              quantity: parseInt(
                                                e.target.value
                                              ) || 0,
                                            };
                                            setEditedOrder({
                                              ...editedOrder,
                                              items: newItems,
                                            });
                                          }}
                                        />
                                      ) : (
                                        item.quantity
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {isEditing ? (
                                        <WhiteTextField
                                          type="number"
                                          size="small"
                                          value={editedOrder.items[index].price}
                                          onChange={(e) => {
                                            const newItems = [
                                              ...editedOrder.items,
                                            ];
                                            newItems[index] = {
                                              ...newItems[index],
                                              price: parseInt(e.target.value) || 0,
                                            };
                                            setEditedOrder({
                                              ...editedOrder,
                                              items: newItems,
                                            });
                                          }}
                                        />
                                      ) : (
                                        `$${item.price}`
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {item.img && (
                                        <img
                                          src={`https://rosegoldgallery-back.onrender.com/${item.img}`}
                                          alt={item.name}
                                          style={{
                                            width: '50px',
                                            height: '50px',
                                            objectFit: 'cover',
                                          }}
                                        />
                                      )}
                                    </TableCell>
                                    {isEditing && (
                                      <TableCell>
                                        <IconButton
                                          color="error"
                                          onClick={() => {
                                            const newItems =
                                              editedOrder.items.filter(
                                                (_, i) => i !== index
                                              );
                                            setEditedOrder({
                                              ...editedOrder,
                                              items: newItems,
                                            });
                                          }}
                                        >
                                          <DeleteOutlineIcon />
                                        </IconButton>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

