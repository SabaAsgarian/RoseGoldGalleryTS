'use client';

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  InputAdornment,
  TextField,
  Paper,
  styled,
  Typography,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  PaginationItem,
  MenuItem,
} from '@mui/material';

// --- Icon Imports ---
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PeopleIcon from '@mui/icons-material/People';

// --- Component/Context Imports ---
// Assuming these paths are correct in your project structure:

import Link from 'next/link';

// NOTE: myContext type is unknown without its definition, using 'any' for conversion safety.
const myContext: any = React.createContext(null as any); 


// --- Type Definitions ---
interface UserData {
  _id: string; 
  img: string;
  fname: string;
  lname: string;
  street: string;
  role: string;
  user: string;
  age: string;
  pass: string;
  city: string;
  email: string;
  mobile: string;
  id?: number; // Added since `val.id` is checked in Row component
}

// FormData is the state used for the "Add New User" form
type FormData = Omit<UserData, '_id'>;

interface RowProps {
  val: UserData;
  loadPage: () => void;
}

type SetDataFunction = React.Dispatch<React.SetStateAction<UserData[]>>;

// --- Styled Components ---

// NOTE: The original Item styled component had invalid status property names. I've corrected or removed them.
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1a2035' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

const WhiteTextField = styled(TextField)({
  backgroundColor: 'white',
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
      borderColor: 'black',
    },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#a9dfd8',
  color: 'black',
  '&:hover': {
    backgroundColor: '#8fcfc8',
  },
});

// --- Helper Functions ---

const loadPage = (setData: SetDataFunction) => {
  fetch('https://rosegoldgallerybackend.onrender.com/api/user')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to load data');
      }
      return res.json();
    })
    .then((data: UserData[]) => {
      console.log('Fetched data:', data);
      setData(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Error fetching data: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
    });
};

// --- Row Component ---

function Row({ val, loadPage }: RowProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState<UserData>({ ...val });

  // Handle change for the editable fields
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Type assertion to ensure name is a valid key of UserData
    setNewData({ ...newData, [name as keyof UserData]: value });
  };

  const handleDelete = () => {
    if (!val._id) {
      alert('Invalid User ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`https://rosegoldgallerybackend.onrender.com/api/user/${val._id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            alert('Deleted successfully!');
            loadPage();
          } else {
            throw new Error('Failed to delete');
          }
        })
        .catch((error) => {
          alert('Error: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
        });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!val._id) {
      alert('Invalid User ID');
      return;
    }

    fetch(`https://rosegoldgallerybackend.onrender.com/api/user/${val._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        alert('User updated successfully!');
        setIsEditing(false);
        loadPage();
      })
      .catch((error) => alert('Error: ' + (error instanceof Error ? error.message : 'An unknown error occurred')));
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'black' }}
          >
            {open ? <KeyboardArrowUpIcon sx={{ color: 'black' }} /> : <KeyboardArrowDownIcon sx={{ color: 'black' }} />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <WhiteTextField name="img" label="Image URL" value={newData.img} onChange={handleEditChange} size="small" />
              <WhiteTextField name="fname" label="First Name" value={newData.fname} onChange={handleEditChange} size="small" />
              <WhiteTextField name="lname" label="Last Name" value={newData.lname} onChange={handleEditChange} size="small" />
              <WhiteTextField name="role" label="Role" value={newData.role} onChange={handleEditChange} size="small" />
              <WhiteTextField name="email" label="Email" value={newData.email} onChange={handleEditChange} size="small" />
              <WhiteTextField name="mobile" label="Mobile" value={newData.mobile} onChange={handleEditChange} size="small" />
              <WhiteTextField name="pass" label="Password" value={newData.pass} onChange={handleEditChange} size="small" />
              <WhiteTextField name="user" label="User Name" value={newData.user} onChange={handleEditChange} size="small" />
              <WhiteTextField name="city" label="City" value={newData.city} onChange={handleEditChange} size="small" />
              <WhiteTextField name="street" label="Street" value={newData.street} onChange={handleEditChange} size="small" />
              <WhiteTextField name="age" label="Age" value={newData.age} onChange={handleEditChange} size="small" />
              <IconButton onClick={handleSave}>
                <EditNoteIcon sx={{ color: 'black' }} />
              </IconButton>
              <IconButton onClick={() => setIsEditing(false)}>
                <ArrowBackIcon sx={{ color: 'black' }} />
              </IconButton>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              {newData.img && (
                <img
                  src={newData.img}
                  alt="User"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              )}
              <span>{newData.fname} {newData.lname}</span>
            </Box>
          )}
        </TableCell>
        <TableCell align="left">{val.role}</TableCell>
        <TableCell align="left">{val.email}</TableCell>
        <TableCell align="left">{val.city}, {val.street}</TableCell>
        <TableCell align="left">{val.mobile}</TableCell>
        <TableCell align="center">
          {val.id === 0 ? null : ( 
            <IconButton onClick={handleEditClick}>
              <EditNoteIcon sx={{ color: 'black' }} />
            </IconButton>
          )}
        </TableCell>
        <TableCell align="center">
          {val._id === '1' ? null : ( // Assuming a specific _id like '1' is the one to exclude from deletion
            <IconButton onClick={handleDelete}>
              <DeleteOutlineIcon sx={{ color: 'black' }} />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                More Detail:
              </Typography>
              <Typography variant="body2">User: {val.user}</Typography>
              <Typography variant="body2">Password: {val.pass}</Typography>
              <Typography variant="body2">Age: {val.age}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// --- Main Page Component ---

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    loadPage(setData);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    img: '',
    fname: '',
    lname: '',
    street: '',
    role: '',
    user: '',
    age: '',
    pass: '',
    city: '',
    email: '',
    mobile: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Type assertion to ensure name is a key of FormData
    setFormData({ ...formData, [name as keyof FormData]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission if wrapped in a form
    const { img, fname, lname, street, role, user, age, pass, city, email, mobile } = formData;

    // Check if all fields are filled
    if (!img || !fname || !lname || !street || !role || !user || !age || !pass || !city || !email || !mobile) {
      alert('Please fill all the fields');
      return;
    }

    const url = 'https://rosegoldgallerybackend.onrender.com/api/user';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to add user');
        }
        alert('New user added!');
        setFormData({
          img: '',
          fname: '',
          lname: '',
          street: '',
          role: '',
          user: '',
          age: '',
          pass: '',
          city: '',
          email: '',
          mobile: ''
        }); // Reset form
        setOpen(false); // Close accordion after submission
        loadPage(setData); // Refresh data
      })
      .catch(error => {
        alert('New user not added: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
      });
  };

  // Filter data based on search term
  const filteredData = data.filter((user) =>
    user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate paginated data
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
   
      <Box sx={{
        maxWidth: '92vw',
        overflowX: 'hidden'
      }}>
        {/* The Grid container/item wrappers have been removed as requested. */}
        <Box sx={{
          width: { xs: '100%', sm: '100%' },
          mx: 'auto',
          px: { xs: 1, sm: 2, md: 3 },
        }}>
          <Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <h1 style={{ textAlign: 'start', marginTop: '2rem', fontSize: '32px', fontWeight: 'bold' }}>
                <PeopleIcon /> Users
              </h1>

              <WhiteTextField
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: { xs: '100%', sm: '300px' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{
              width: '100%',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                height: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px'
              }
            }}>
              <TableContainer component={Paper} sx={{
                minWidth: 650,
                '@media (max-width: 600px)': {
                  minWidth: 1000 
                }
              }}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>phone</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((val) => (
                      <myContext.Provider value={val} key={'post' + val._id}>
                        <Row
                          val={val}
                          loadPage={() => loadPage(setData)}
                        />
                      </myContext.Provider>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {filteredData.length > rowsPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={Math.ceil(filteredData.length / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  renderItem={(item) => (
                    <PaginationItem
                      slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mt: 5, fontWeight: 'bolder' }}>
              ADD New Users
              <ControlPointIcon
                sx={{ cursor: 'pointer', fontSize: '50px', color: 'black' }}
                onClick={() => setOpen(!open)}
              />
            </Box>
            <Accordion expanded={open}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}>
                <h2>Add Users Details</h2>
              </AccordionSummary>
              <AccordionDetails>
                {/* Wrapped in Box for layout, removed FormControl for simpler TextField usage */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, m: 1 }} component="form" onSubmit={handleSubmit}>
                  <WhiteTextField
                    id="img"
                    name="img"
                    label="Image URL"
                    value={formData.img}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <WhiteTextField
                    id="fname"
                    name="fname"
                    label="First Name"
                    value={formData.fname}
                    onChange={handleInputChange}
                  />
                  <WhiteTextField
                    id="lname"
                    name="lname"
                    label="Last Name"
                    value={formData.lname}
                    onChange={handleInputChange}
                  />
                  <WhiteTextField
                    id="street"
                    name="street"
                    label="Street"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                  <WhiteTextField
                    id="role"
                    name="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleInputChange}
                    select // Changed to select for better role handling
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </WhiteTextField>
                  <WhiteTextField
                    id="user"
                    name="user"
                    label="Username"
                    value={formData.user}
                    onChange={handleInputChange}
                  />
                  <WhiteTextField
                    id="age"
                    name="age"
                    label="Age"
                    value={formData.age}
                    onChange={handleInputChange}
                    type="number" // Added type number
                  />
                  <WhiteTextField
                    id="pass"
                    name="pass"
                    label="Password"
                    value={formData.pass}
                    onChange={handleInputChange}
                    type="password" // Added type password
                  />
                  <WhiteTextField
                    id="city"
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <WhiteTextField
                    id="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" // Added type email
                  />
                  <WhiteTextField
                    id="mobile"
                    name="mobile"
                    label="Mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                  <StyledButton variant="contained" type="submit" sx={{ alignSelf: 'center' }}>Submit</StyledButton>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
  
  );
}