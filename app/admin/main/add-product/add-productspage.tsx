"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useState } from "react";

// ---------- Types ----------
interface FormValues {
    title: string;
    price: string;
    weight: string;
    category: string;
    description: string;
}

// ---------- Styled Components ----------
const StyledForm = styled("form")({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
});

const WhiteTextField = styled(TextField)({
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    "& .MuiInputBase-input": { color: "black" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "black" },
        "&:hover fieldset": { borderColor: "black" },
        "&.Mui-focused fieldset": { borderColor: "grey" },
    },
});

const StyledButton = styled(Button)<{ component?: string }>({
  backgroundColor: '#a9dfd8',
  color: 'black',
  '&:hover': {
    backgroundColor: '#8fcfc8',
  },
});

const VisuallyHiddenInput = styled('input')({
    display: 'none',
});

// ---------- Component ----------
export default function AddProduct() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const formik = useFormik<FormValues>({
        initialValues: {
            title: "",
            price: "",
            weight: "",
            category: "",
            description: "",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required").min(2, "Too short"),
            price: Yup.number().typeError("Price must be a number").required().min(0),
            weight: Yup.number().typeError("Weight must be a number").required().min(0),
            category: Yup.string().required("Category is required"),
            description: Yup.string().required("Description is required"),
        }),
        onSubmit: async (values) => {
            if (!selectedFile) {
                alert("Please select an image");
                return;
            }
            const formData = new FormData();
            Object.keys(values).forEach(key => formData.append(key, (values as any)[key]));
            formData.append("img", selectedFile);

            const res = await fetch("https://rosegoldgallery-back.onrender.com/api/products", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                alert("Product added successfully!");
                router.push("/admin/main/products");
            } else alert(data.message || "Failed to add product");
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const fields: { id: keyof FormValues; label: string; type: string }[] = [
        { id: "title", label: "Product Title", type: "text" },
        { id: "price", label: "Product Price", type: "number" },
        { id: "weight", label: "Product Weight", type: "number" },
        { id: "category", label: "Product Category", type: "text" },
        { id: "description", label: "Product Description", type: "text" },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1><AddCircleOutlineIcon /> Add New Product</h1>

            <StyledForm onSubmit={formik.handleSubmit}>
                {fields.map(({ id, label, type }) => (
                    <Box key={id} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography sx={{ fontWeight: "bold" }}>{label}:</Typography>
                        <WhiteTextField
                            id={id}
                            type={type}
                            placeholder={`Enter ${label}`}
                            {...formik.getFieldProps(id)}
                            error={formik.touched[id] && Boolean(formik.errors[id])}
                            helperText={formik.touched[id] && formik.errors[id]}
                            variant="outlined"
                        />
                    </Box>
                ))}

                <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                    <Typography sx={{ fontWeight: "bold" }}>Product Image:</Typography>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                        {selectedImage ? (
                            <Box sx={{ position: 'relative', width: 'fit-content', margin: 'auto' }}>
                                <img
                                    src={selectedImage}
                                    alt="Product preview"
                                    style={{ width: 100, height: 100, objectFit: "cover" }}
                                />
                                <Button
                                    onClick={() => { setSelectedImage(null); setSelectedFile(null); }}
                                    sx={{ position: 'absolute', top: -10, right: -10, width: 30, height: 30, p: 0 }}
                                >×</Button>
                            </Box>
                        ) : (
                            <StyledButton component="label" startIcon={<CloudUploadIcon />}>
                                Upload Product Image
                                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
                            </StyledButton>
                        )}
                    </Box>
                </Box>

                <StyledButton type="submit">{formik.isSubmitting ? "Adding..." : "Add Product"}</StyledButton>
            </StyledForm>
        </Box>
    );
}
