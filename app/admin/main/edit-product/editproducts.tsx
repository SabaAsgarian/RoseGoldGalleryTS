"use client";

import React, { useEffect, useState, Suspense, ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Button, TextField } from "@mui/material";
import Loading from "./loading";

export const dynamic = "force-dynamic";

// ---------- Types ----------
interface Product {
  _id: string;
  title: string;
  price: string;
  weight: string;
  description: string;
  category: string;
}

type ProductForm = Omit<Product, "_id">;

// ---------- Component ----------
function EditProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>({
    title: "",
    price: "",
    weight: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`https://rosegoldgallerybackend.onrender.com/api/products`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        const item = data.find((p) => p._id === id);
        if (item) {
          setProduct(item);
          setForm({
            title: item.title,
            price: item.price,
            weight: item.weight,
            description: item.description,
            category: item.category,
          });
        }
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      const res = await fetch(
        `https://rosegoldgallerybackend.onrender.com/api/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        alert("Product edited!");
        router.push("/admin/main/products");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (!product) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <h2 style={{ fontSize: "25px" }}>Edit Product</h2>
      <TextField
        name="title"
        label="Title"
        fullWidth
        margin="normal"
        value={form.title}
        onChange={handleChange}
      />
      <TextField
        name="price"
        label="Price"
        fullWidth
        margin="normal"
        value={form.price}
        onChange={handleChange}
      />
      <TextField
        name="weight"
        label="Weight"
        fullWidth
        margin="normal"
        value={form.weight}
        onChange={handleChange}
      />
      <TextField
        name="description"
        label="Description"
        fullWidth
        margin="normal"
        value={form.description}
        onChange={handleChange}
      />
      <TextField
        name="category"
        label="Category"
        fullWidth
        margin="normal"
        value={form.category}
        onChange={handleChange}
      />

      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
}

export default function EditProduct() {
  return (
    <Suspense fallback={<Loading />}>
      <EditProductContent />
    </Suspense>
  );
}
