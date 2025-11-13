"use client";
import { useEffect, useState } from "react";

import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
 // Assuming this is your sidebar component
import { Box, Button, CircularProgress } from "@mui/material";
import { styled } from '@mui/material/styles';
import Cardd from '../../../components/productcard'; // Assuming Cardd is a component that accepts Product data and an onDelete callback

// Define the interface for a Product object for type safety
// This must match the Product interface expected by Cardd component
interface Product {
  _id: string;
  createdAt?: string;
  title: string;
  price: number;
  img: string;
  category?: string;
  weight?: number;
}

const StyledButton = styled(Button)({
  backgroundColor: '#a9dfd8',
  color: 'black',
  '&:hover': {
    backgroundColor: '#8fcfc8',
  },
});

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("https://rosegoldgallerybackend.onrender.com/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json() as Promise<Product[]>;
      })
      .then((data) => {
        // Filter out products that don't have required fields (title, price, img)
        const validProducts = data.filter((product) => 
          product.title && product.price !== undefined && product.img
        );
        // Sort from newest to oldest (handle optional createdAt)
        const sorted = validProducts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <h1 style={{ textAlign: 'start', fontSize: '32px', fontWeight: 'bold' }}><InventoryIcon />Managing Products </h1>
          <StyledButton>
            <a 
              href="/admin/main/add-product" 
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
            >
              <AddCircleOutlineIcon />Add New Product 
            </a>
          </StyledButton>
        </Box>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '5% auto',
        }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <p>Loading...</p>
              <CircularProgress color="inherit" />
            </Box>
          ) : products.length > 0 ? (
            products.map((item) => {
              return (
                // Use a unique key like _id for better React performance
                <div key={item._id} style={{ padding: '10px' }}> 
                  <Cardd
                    data={item}
                    onDelete={(deletedId: string) => {
                      setProducts(prev => prev.filter(p => p._id !== deletedId));
                    }}
                  />
                </div>
              );
            })
          ) : (
            <p>No products found.</p>
          )}
        </div>
    
    </div>
  );
}