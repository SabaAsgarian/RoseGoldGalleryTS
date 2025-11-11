'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
} from '@mui/material'
import { styled } from '@mui/material/styles'
// Assuming these components exist in the same relative path

import CustomizedBreadcrumbs from '../../../components/BreadCrumbs' // Assuming correct component name is bradcrumbs

// Import type definitions from formik/yup
import { useFormik } from 'formik'
import * as Yup from 'yup'

// --- 1. TYPE DEFINITIONS ---

// Define the structure for the User object
interface User {
  _id: string
  id: string
  img?: string
  fname: string
  lname: string
  email: string
  mobile: string
  age: number | string // Allow string for TextField input before conversion
  city: string
  street: string
  role: string
}

// Define the structure for an Order object
interface Order {
  _id: string
  createdAt: string // Date string
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'shipped' | 'delivered' | string
  // Add other necessary order fields here
}

// Define the structure for the InfoRow component props
interface InfoRowProps {
  label: string
  value: string | number | undefined | null
}

// --- 2. STYLED COMPONENTS ---

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0px 0px 8px 1px rgba(0, 0, 0, 0.75)',
}))

// WhiteTextField is not used in the final JSX, but kept for completeness
// const WhiteTextField = styled(TextField)({
//   backgroundColor: '#ffffff',
//   borderRadius: '4px',
//   '& .MuiInputBase-input': {
//     color: 'black',
//   },
//   // ... (rest of the WhiteTextField styles)
// });

// --- 3. VALIDATION SCHEMA ---

const validationSchema = Yup.object({
  fname: Yup.string().required('First name is required'),
  lname: Yup.string().required('Last name is required'),
  email: Yup.string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Email must be in format: email@domain.com')
    .required('Email is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{11}$/, 'Mobile number must be 11 digits')
    .required('Mobile number is required'),
  age: Yup.number()
    .positive('Age must be a positive number')
    .integer('Age must be a whole number')
    .required('Age is required'),
  city: Yup.string().required('City is required'),
  street: Yup.string().required('Street address is required'),
})

// Extract the inferred type for Formik initial values
type FormValues = Omit<Yup.InferType<typeof validationSchema>, 'age'> & {
  img: string
  role: string
  age: string // FIX: Override 'age' to be a string for the text field
  _id?: string
  id?: string
}

// --- 4. UTILITY FUNCTIONS ---

// Define API_BASE_URL (using environment variable from Next.js)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rosegoldgallery-back.onrender.com'

// Add this function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // The 'exp' is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now()
  } catch (error) {
    console.error('Token parsing error:', error)
    return true
  }
}

// InfoRow component with TypeScript props
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <Box
    sx={{
      display: 'flex',
      borderBottom: '1px solid #dee2e6',
      py: 2,
    }}
  >
    <Typography
      sx={{
        fontWeight: 'bold',
        width: '150px',
        color: '#495057',
      }}
    >
      {label}:
    </Typography>
    <Typography sx={{ color: '#212529' }}>{value || '---'}</Typography>
  </Box>
)

// --- 5. MAIN COMPONENT ---

export default function AccountPage() {
  const router = useRouter()
  // Use defined types for state
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Initial values for Formik
  const initialFormValues: FormValues = {
    img: '',
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    age: '',
    city: '',
    street: '',
    role: '',
  }

  const formik = useFormik<FormValues>({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token')

        // Ensure user is not null before accessing its properties
        if (!user || !token || isTokenExpired(token)) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/pages/userlogin')
          return
        }

        const userId = user._id
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // Ensure age is sent as a number if required by backend
            ...values,
            age: Number(values.age),
            _id: userId,
            id: userId,
          }),
        })

        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/pages/userlogin')
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const updatedUser = (await response.json()) as User

        // Ensure we preserve the ID fields and merge with the current user state
        const userToSave: User = {
          ...user, // Preserve existing fields
          ...updatedUser, // Overwrite with new fields
          _id: userId,
          id: userId,
        }
        setUser(userToSave)
        localStorage.setItem('user', JSON.stringify(userToSave))
        setIsEditing(false)
        formik.resetForm({ values: userToSave as FormValues }) // Reset form with the new values
        alert('Profile updated successfully!')
      } catch (error) {
        console.error('Update error:', error)
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

        if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('401')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/pages/userlogin')
          return
        }
        alert('Error updating profile: ' + errorMessage)
      }
    },
  })

  const handleEdit = () => {
    // Check if user is null before accessing properties
    if (!user) return
    
    // The type check is now correct because age is defined as string in FormValues
    formik.setValues({
      img: user.img || '',
      fname: user.fname || '',
      lname: user.lname || '',
      email: user.email || '',
      mobile: user.mobile || '',
      // No need for a cast; String(user.age) is correctly assigned to FormValues['age'] (string)
      age: user.age ? String(user.age) : '', 
      city: user.city || '',
      street: user.street || '',
      role: user.role || '',
      _id: user._id, // Include ID fields
      id: user.id,
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    // Reset form to the current user state values (if user exists)
    if (user) {
      formik.resetForm({
        values: {
          img: user.img || '',
          fname: user.fname || '',
          lname: user.lname || '',
          email: user.email || '',
          mobile: user.mobile || '',
          // No need for a cast or 'as { values: FormValues }'
          age: user.age ? String(user.age) : '',
          city: user.city || '',
          street: user.street || '',
          role: user.role || '',
        },
      }) // Cast removed
    } else {
      formik.resetForm()
    }
    setIsEditing(false)
  }

  // Modify useEffect to check token expiration and fetch data
  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (!token || !userData || isTokenExpired(token)) {
        // Clear localStorage if token is expired or missing
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/pages/userlogin')
        return
      }

      try {
        const parsedUser = JSON.parse(userData) as Partial<User>
        
        // Ensure user has both _id and id for consistency
        const userWithIds: User = {
          ...parsedUser as User,
          _id: parsedUser._id || parsedUser.id || '',
          id: parsedUser.id || parsedUser._id || '',
          // Defaulting required fields if missing from localStorage
          fname: parsedUser.fname || '',
          lname: parsedUser.lname || '',
          email: parsedUser.email || '',
          mobile: parsedUser.mobile || '',
          age: parsedUser.age || '',
          city: parsedUser.city || '',
          street: parsedUser.street || '',
          role: parsedUser.role || '',
        }

        // Redirect if essential ID fields are missing (though this should be rare)
        if (!userWithIds._id) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/pages/userlogin')
          return
        }

        setUser(userWithIds)
        
        // Now fetch orders
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/pages/userlogin')
          return
        }

        if (response.ok) {
          const ordersData = (await response.json()) as Order[]
          setOrders(ordersData)
        } else {
           console.error('Failed to fetch orders:', response.statusText)
        }

      } catch (error) {
        console.error('Error fetching user or orders:', error)
        
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

        if (errorMessage.includes('unauthorized') || errorMessage.includes('token')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/pages/userlogin')
          return
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUserAndOrders()
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  // --- 6. RENDER LOGIC ---

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '80vh',
        }}
      >
        <p>Loading...</p>
        <CircularProgress color="inherit" />
      </Box>
    )
  }

  if (!user) return <Typography>Please Sign In To Your Account.</Typography>

  return (
    <div>
  
      <h1 style={{ textAlign: "start",
        
          fontSize: "32px",
          fontWeight: "bold",
           display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: "3%",
          marginLeft: "3%",
          marginBottom:"3%" }}>
        Account Center
      </h1>
      <Box
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '60%',
          margin: '1% auto',
        }}
      >
        <CustomizedBreadcrumbs />
      </Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <StyledPaper>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              src={user.img}
              alt={`${user.fname} ${user.lname}`}
              sx={{
                border: '1px solid black',
                borderRadius: '50%',
                width: 80,
                height: 80,
                margin: '0 auto',
                mb: 2,
                bgcolor: user.img ? 'transparent' : '#1976d2',
              }}
            >
              {!user.img && user.fname?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
              {user.fname} {user.lname}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              bgcolor: '#f8f9fa',
              p: 3,
              borderRadius: '8px',
            }}
          >
            {isEditing ? (
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="fname"
                  value={formik.values.fname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fname && Boolean(formik.errors.fname)}
                  helperText={formik.touched.fname && (formik.errors.fname as string)} // Cast to string
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lname"
                  value={formik.values.lname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lname && Boolean(formik.errors.lname)}
                  helperText={formik.touched.lname && (formik.errors.lname as string)} // Cast to string
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && (formik.errors.email as string)} // Cast to string
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={formik.touched.mobile && (formik.errors.mobile as string)} // Cast to string
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && (formik.errors.age as string)} // Cast to string
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && (formik.errors.city as string)} // Cast to string
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={formik.values.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.street && Boolean(formik.errors.street)}
                  helperText={formik.touched.street && (formik.errors.street as string)} // Cast to string
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="contained" color="error" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </form>
            ) : (
              <>
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Mobile" value={user.mobile} />
                <InfoRow label="Age" value={user.age} />
                <InfoRow label="City" value={user.city} />
                <InfoRow label="Address" value={user.street} />
                <InfoRow label="User Type" value={user.role} />
              </>
            )}
          </Box>
          {!isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Log out
              </Button>
              <Button variant="outlined" color="primary" onClick={handleEdit}>
                Edit Information
              </Button>
            </Box>
          )}
        </StyledPaper>

        <StyledPaper>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Your Orders
          </Typography>
          {orders.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell>{order.totalAmount.toLocaleString()} $</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor:
                              order.status === 'pending'
                                ? '#ffc107'
                                : order.status === 'processing'
                                ? '#ff9800'
                                : order.status === 'completed'
                                ? '#2196f3'
                                : order.status === 'shipped'
                                ? '#4caf50'
                                : order.status === 'delivered'
                                ? '#8bc34a'
                                : '#f44336',
                            color:
                              order.status === 'pending'
                                ? 'black'
                                : 'white', // General white color for all other dark backgrounds
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            textTransform: 'capitalize' // Ensure status looks good
                          }}
                        >
                          {order.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <Typography color="text.secondary">You Have No Orders...</Typography>
            </Box>
          )}
        </StyledPaper>
      </Container>
 
    </div>
  )
}