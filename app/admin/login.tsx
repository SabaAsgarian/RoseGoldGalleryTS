'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import './login.css';

// === Types ===
interface LoginResponse {
  token: string;
  admin: {
    name?: string;
    email?: string;
    [key: string]: any;
  };
  error?: string;
}

// === Styled Components ===
const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
});

const WhiteTextField = styled(TextField)({
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  '& .MuiInputBase-input': {
    color: 'black'
  },
  '& .MuiInputLabel-root': {
    color: 'white'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black'
    },
    '&:hover fieldset': {
      borderColor: 'black'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'grey'
    }
  }
});

const StyledButton = styled(Button)({
  backgroundColor: '#a9dfd8',
  color: 'black',
  '&:hover': {
    backgroundColor: '#8fcfc8'
  }
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rosegoldgallery-back.onrender.com';

function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showpass, setShowpass] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If we came from an explicit logout, hard-clear any stale storage and do NOT redirect
    const loggedOutFlag = searchParams.get('loggedout');
    if (loggedOutFlag === '1') {
      try {
        localStorage.clear();
      } catch {}
      return;
    }

    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (token && tokenExpiration) {
      const expirationDate = new Date(tokenExpiration);
      const now = new Date();

      if (expirationDate > now) {
        router.push('/admin/main/orders');
        const timeLeft = expirationDate.getTime() - now.getTime();
        const logoutTimer = setTimeout(() => {
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
          router.push('/admin');
        }, timeLeft);

        return () => clearTimeout(logoutTimer);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        router.push('/admin');
      }
    }
  }, [router, searchParams]);

  const formik = useFormik({
    initialValues: {
      email: '',
      pass: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      pass: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });

        const data: LoginResponse = await res.json();

        if (res.ok && data.token) {
          const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({ ...data.admin, role: 'admin' }));
          localStorage.setItem('tokenExpiration', tokenExpiration.toString());
          router.push('/admin/main/orders');
        } else {
          alert(data.error || 'Login failed! Check your credentials.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const toggleShowPassword = () => {
    if (!showic.current) return;
    setShowpass((prev) => !prev);
    const children = showic.current.children;
    if (children.length >= 2) {
      (children[0] as HTMLElement).style.display = showpass ? 'none' : 'flex';
      (children[1] as HTMLElement).style.display = showpass ? 'flex' : 'none';
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: '#f2f4f8',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Backdrop
        sx={{
          color: 'black',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        open={isLoading}
      >
        <p>Loading...</p>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#ffffff',
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.75)',
          mt: '5%',
          mb: '5%'
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            m: '10%'
          }}
        >
          <StyledForm onSubmit={formik.handleSubmit}>
            <Typography variant="h4" fontWeight="bold" textAlign="start">
              Admin Login
            </Typography>

            <label htmlFor="email">Email</label>
            <WhiteTextField
              id="email"
              name="email"
              type="email"
              placeholder="Enter Your Email"
              autoComplete="on"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <label htmlFor="pass">Password</label>
            <WhiteTextField
              id="pass"
              name="pass"
              type={showpass ? 'password' : 'text'}
              placeholder="Enter Your Password"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pass}
              error={formik.touched.pass && Boolean(formik.errors.pass)}
              helperText={formik.touched.pass && formik.errors.pass}
            />

            <div
              onClick={toggleShowPassword}
              ref={showic}
              className="relative flex justify-center items-center cursor-pointer"
              style={{ width: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <VisibilityOffIcon />
              </span>
              <span style={{ display: 'none' }}>
                <VisibilityIcon />
              </span>
            </div>

            <StyledButton type="submit">Sign In</StyledButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: 2 }}>
              <Typography>Don't Have Admin Account?</Typography>
              <Link href="/admin/register">
                <StyledButton>Register</StyledButton>
              </Link>
            </Box>
          </StyledForm>

          <Box sx={{ width: '100%', mt: '10%' }}>
            <Link href="/">
              <StyledButton sx={{ width: '100%' }}>Main Site</StyledButton>
            </Link>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}

export default AdminLoginPage;
