"use client";

import React, { useRef, useState, ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import CustomizedBreadcrumbs from "../../../components/BreadCrumbs";

// ---------- Types ----------
interface RegisterFormValues {
  fname: string;
  lname: string;
  email: string;
  mobile: string;
  pass: string;
  city: string;
  street: string;
  age: number | string;
  img: string;
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
  "& .MuiInputLabel-root": { color: "black" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "black" },
    "&:hover fieldset": { borderColor: "black" },
    "&.Mui-focused fieldset": { borderColor: "grey" },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "#3e3e3e",
    color: "white",
  },
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rosegoldgallery-back.onrender.com";

// ---------- Component ----------
const UserRegister: React.FC = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(true);
  const showIconRef = useRef<HTMLDivElement | null>(null);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      mobile: "",
      pass: "",
      city: "",
      street: "",
      age: "",
      img: "",
    },
    validationSchema: Yup.object({
      fname: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters"),
      lname: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{11}$/, "Mobile number must be 11 digits")
        .required("Mobile number is required"),
      pass: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      city: Yup.string().required("City is required"),
      street: Yup.string().required("Street address is required"),
      age: Yup.number()
        .min(18, "Must be at least 18 years old")
        .required("Age is required"),
      img: Yup.string().optional(),
    }),
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const registrationData = {
          ...values,
          age: Number(values.age),
        };

        const res = await fetch(`${API_BASE_URL}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registrationData),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registration successful! Please login.");
          router.push("/pages/userlogin");
        } else {
          if (data.details) {
            Object.keys(data.details).forEach((key) => {
              setFieldError(key, data.details[key].message);
            });
          } else if (data.error?.includes("Email")) {
            setFieldError("email", data.error);
          } else if (data.error?.includes("Mobile")) {
            setFieldError("mobile", data.error);
          } else if (data.missing) {
            data.missing.forEach((field: string) => {
              setFieldError(field, `${field} is required`);
            });
          } else {
            alert(data.error || "Registration failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Server error. Please try again later.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    if (!showIconRef.current) return;
    const [visible, hidden] = showIconRef.current.children;
    if (showPass) {
      (visible as HTMLElement).style.display = "flex";
      (hidden as HTMLElement).style.display = "none";
    } else {
      (visible as HTMLElement).style.display = "none";
      (hidden as HTMLElement).style.display = "flex";
    }
    setShowPass(!showPass);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        formik.setFieldValue("img", result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------- JSX ----------
  return (
    <>
     

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "60%",
          margin: "2% auto",
        }}
      >
        <CustomizedBreadcrumbs />
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "#ffffff",
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.75)",
            py: 4,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StyledForm onSubmit={formik.handleSubmit}>
              <h1
                style={{
                  textAlign: "start",
                  marginTop: "2rem",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                Register
              </h1>

              {/* ---------- Image Upload ---------- */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                {selectedImage ? (
                  <Box
                    sx={{
                      position: "relative",
                      width: "fit-content",
                      margin: "auto",
                    }}
                  >
                    <img
                      src={selectedImage}
                      alt="Profile preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      onClick={() => {
                        setSelectedImage(null);
                        formik.setFieldValue("img", "");
                      }}
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        minWidth: "30px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        p: 0,
                      }}
                    >
                      ×
                    </Button>
                  </Box>
                ) : (
                  <StyledButton
                    
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Profile Picture
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </StyledButton>
                )}
              </Box>

              {/* ---------- Form Fields ---------- */}
              {[
                { id: "fname", label: "First Name", type: "text" },
                { id: "lname", label: "Last Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "mobile", label: "Mobile", type: "tel" },
                { id: "city", label: "City", type: "text" },
                { id: "street", label: "Street Address", type: "text" },
                { id: "age", label: "Age", type: "number" },
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <label htmlFor={id}>{label}</label>
                  <WhiteTextField
                    id={id}
                    type={type}
                    placeholder={`Enter Your ${label}`}
                    {...formik.getFieldProps(id as keyof RegisterFormValues)}
                    error={
                      !!formik.touched[id as keyof RegisterFormValues] &&
                      !!formik.errors[id as keyof RegisterFormValues]
                    }
                    helperText={
                      formik.touched[id as keyof RegisterFormValues] &&
                      (formik.errors[id as keyof RegisterFormValues] as string)
                    }
                  />
                </div>
              ))}

              {/* ---------- Password ---------- */}
              <label htmlFor="pass">Password</label>
              <WhiteTextField
                id="pass"
                type={showPass ? "password" : "text"}
                placeholder="Enter Your Password"
                {...formik.getFieldProps("pass")}
                error={formik.touched.pass && Boolean(formik.errors.pass)}
                helperText={formik.touched.pass && formik.errors.pass}
              />
              <div
                onClick={togglePasswordVisibility}
                ref={showIconRef}
                className="mt-[10%] mb-[10%] w-[10%] relative flex justify-center cursor-pointer items-center"
              >
                <span style={{ display: "none" }}>
                  <VisibilityIcon />
                </span>
                <span style={{ display: "flex" }}>
                  <VisibilityOffIcon />
                </span>
              </div>

              {/* ---------- Buttons ---------- */}
              <StyledButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Registering..." : "Register"}
              </StyledButton>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography>Already Have an Account?</Typography>
                <Link href="/pages/userlogin">
                  <StyledButton>Login</StyledButton>
                </Link>
              </Box>

              <Box sx={{ width: "100%", mt: "10%", mb: "10%" }}>
                <Link href="/">
                  <StyledButton sx={{ width: "100%" }}>Main Site</StyledButton>
                </Link>
              </Box>
            </StyledForm>
          </Box>
        </Container>
      </Container>

   
    </>
  );
};

export default UserRegister;
