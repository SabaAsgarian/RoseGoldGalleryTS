"use client";
import React, { useRef, useState, useCallback } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { styled } from '@mui/material/styles';
import { TextField, Button, Box, Container, Typography, IconButton } from '@mui/material'; 
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from "next/link";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './register.css';

// --- Interface Definitions for Type Safety ---

/**
 * Defines the structure and types for the form's initial values.
 */
interface FormValues {
    fname: string;
    lname: string;
    email: string;
    pass: string;
    role: string;
}

/**
 * Defines the structure and types for the validation errors.
 */
type FormErrors = {
    [K in keyof FormValues]?: string;
};

// --- Styled Components (MUI) ---

const WhiteTextField = styled(TextField)({
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    // Apply styling to the inner InputBase component for black text/label color
    '& .MuiInputBase-input': {
        color: 'black',
    },
    '& .MuiInputLabel-root': {
        color: 'grey', // Label color when not focused
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black',
        },
        '&:hover fieldset': {
            borderColor: 'black',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#a9dfd8', // Highlight color when focused
        },
    },
});

const StyledButton = styled(Button)({
    backgroundColor: '#a9dfd8',
    color: 'black',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: '#8fcfc8',
    },
});

// --- Main Component ---

const AdminLoginPage: React.FC = () => {
    const router = useRouter();
    // Use boolean state for password visibility
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // Use useRef to get a reference to the visibility icon container
    const showicRef = useRef<HTMLDivElement>(null);

    // --- Formik Setup ---

    const initialValues: FormValues = {
        fname: "",
        lname: "",
        email: "",
        pass: "",
        role: "admin", // Default role set to "admin"
    };

    // Validation function now explicitly typed to return FormErrors
    const validate = (values: FormValues): FormErrors => {
        const errors: FormErrors = {};

        if (!values.fname) errors.fname = "First Name is required";
        if (!values.lname) errors.lname = "Last Name is required";
        
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email.toUpperCase())) {
            errors.email = "Invalid email address";
        }

        if (!values.pass) errors.pass = "Password is required";

        return errors;
    };

    // Submission handler with async/await and explicit typing
    const onSubmit = async (values: FormValues) => {
        
        try {
            const res = await fetch("https://rosegoldgallery-back.onrender.com/api/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                console.log("Registration successful!");
                router.push("/components/admin/login");
            } else {
                console.error("Registration failed! Server status:", res.status);
            }
        } catch (error) {
            console.error("Network Error during registration:", error);
        }
    };

    const formik = useFormik<FormValues>({
        initialValues,
        validate,
        onSubmit,
    });

    // --- Handler Functions ---
    
    // Toggle password visibility handler (Simplified)
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);
    
    return (
        <Box sx={{ 
            backgroundColor: '#f2f4f8', 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '2rem 0', // Ensure padding for mobile view
        }}>
            <Container 
                maxWidth="sm" 
                sx={{ 
                    backgroundColor: '#ffffff', 
                    padding: { xs: '2rem', sm: '3rem' },
                    borderRadius: '10px', 
                    boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.1)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    marginTop: '2rem',
                    marginBottom: '2rem'
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ fontWeight: 'bold', marginBottom: '2rem', color: 'black' }}
                >
                    Admin Register
                </Typography>
                
                <Box 
                    component="form" 
                    onSubmit={formik.handleSubmit} 
                    sx={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {/* First Name */}
                    <WhiteTextField
                        fullWidth
                        label="First Name"
                        id="fname"
                        name="fname"
                        type="text"
                        placeholder="Enter Your First Name"
                        autoComplete="given-name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fname}
                        error={formik.touched.fname && Boolean(formik.errors.fname)}
                        helperText={formik.touched.fname && formik.errors.fname}
                    />

                    {/* Last Name */}
                    <WhiteTextField
                        fullWidth
                        label="Last Name"
                        id="lname"
                        name="lname"
                        type="text"
                        placeholder="Enter Your Last Name"
                        autoComplete="family-name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lname}
                        error={formik.touched.lname && Boolean(formik.errors.lname)}
                        helperText={formik.touched.lname && formik.errors.lname}
                    />

                    {/* Email */}
                    <WhiteTextField
                        fullWidth
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter Your Email"
                        autoComplete="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    {/* Password */}
                    <WhiteTextField
                        fullWidth
                        label="Password"
                        id="pass"
                        name="pass"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Your Password"
                        autoComplete="new-password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.pass}
                        error={formik.touched.pass && Boolean(formik.errors.pass)}
                        helperText={formik.touched.pass && formik.errors.pass}
                        // Input Adornment for visibility toggle
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    sx={{ color: 'black' }}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            ),
                        }}
                    />
                    
                    {/* Role (Read-only or Hidden field for 'admin') */}
                    <WhiteTextField
                        fullWidth
                        label="Role"
                        id="role"
                        name="role"
                        type="text"
                        value={formik.values.role}
                        InputProps={{ readOnly: true }} // Prevent user editing
                        sx={{ opacity: 0.7 }} // Visually indicate it's not editable
                    />

                    {/* Submit Button */}
                    <StyledButton type="submit" variant="contained" fullWidth sx={{ marginTop: '1rem' }}>
                        Register
                    </StyledButton>
                </Box>
                
                {/* Login Link */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'black' }}>
                        Already Have Admin Account?
                    </Typography>
                    <Link href="/components/admin/login" passHref legacyBehavior>
                        {/* FIX: Changed component="a" to as="a" on the StyledButton to fix the type error. */}
                        <StyledButton as="a" variant="text" sx={{ padding: '0 8px', minWidth: 'auto' }}>
                            Login
                        </StyledButton>
                    </Link>
                </Box>

                {/* Main Site Link */}
                <Box sx={{ width: '100%', maxWidth: '400px', marginTop: '2rem' }}>
                    <Link href="/" passHref legacyBehavior>
                         {/* FIX: Changed component="a" to as="a" on the StyledButton to fix the type error. */}
                        <StyledButton as="a" variant="outlined" fullWidth>
                            Go to Main Site
                        </StyledButton>
                    </Link>
                </Box>
            </Container>
        </Box>
    );
}
export default AdminLoginPage;