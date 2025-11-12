// @/components/admin/ResponsiveDrawer.tsx
"use client"
import React, { useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme, styled, alpha, Theme } from '@mui/material/styles';
import {
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, InputBase, Badge, MenuItem, Menu,
} from '@mui/material';
import {
  Menu as MenuIcon, Search as SearchIcon, AccountCircle, Notifications as NotificationsIcon,
  MoreVert as MoreIcon, Mail as MailIcon, Dashboard, Inventory2Outlined as Inventory2OutlinedIcon,
  Portrait as PortraitIcon, ShoppingBagOutlined as ShoppingBagOutlinedIcon,
  WebOutlined as WebOutlinedIcon, Logout as LogoutIcon
} from '@mui/icons-material';

// ---
// ## ⚙️ Theme Configuration (TypeScript Module Augmentation)

// 1. Extend MUI interfaces to include custom non-standard keys
declare module '@mui/material/styles' {
  interface TypeBackground {
    green?: string;
  }
  interface Palette {
    border: {
      primery: string;
    };
  }
  interface PaletteOptions {
    border?: {
      primery?: string;
    };
  }
}

// Define the custom dark theme with explicit types
const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      green: '#ffffff', // Now correctly typed
    },
    text: {
      primary: '#000',
      secondary: '#000',
    },
    border: {
      primery: '#000' // Now correctly typed
    }
  },
});

const drawerWidth = 240;

// ---
// ## 🔍 Styled Components

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
    },
  },
}));

// ---
// ## 🛠️ Component Interfaces and Types

interface MenuItemType {
  text: string;
  path: string;
  icon: React.ReactElement;
  action?: () => void;
}

interface ResponsiveDrawerProps {
  children?: ReactNode;
  window?: () => Window;
}

// ---
// ## 🚀 ResponsiveDrawer Component

function ResponsiveDrawer(props: ResponsiveDrawerProps) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Memoized handlers using useCallback
  const handleProfileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    handleMobileMenuClose();
  }, [handleMobileMenuClose]);

  const handleMobileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsClosing(true);
    setMobileOpen(false);
  }, []);

  const handleDrawerTransitionEnd = useCallback(() => {
    setIsClosing(false);
  }, []);

  const handleDrawerToggle = useCallback(() => {
    if (!isClosing) {
      setMobileOpen((prev) => !prev);
    }
  }, [isClosing]);

  const handleNavigation = useCallback((path: string, text: string) => {
    router.push(path);
    setSelectedItem(text);
    if (mobileOpen) {
      handleDrawerClose();
    }
  }, [router, mobileOpen, handleDrawerClose]);

  // Redirect to /admin if not authenticated while this UI is mounted
  useEffect(() => {
    if (typeof globalThis === 'undefined') return;
    try {
      const token = globalThis.localStorage?.getItem('token');
      const user = globalThis.localStorage?.getItem('user');
      if (!token || !user) {
        router.replace('/admin');
      }
    } catch {
      router.replace('/admin');
    }
  }, [router]);

  // Logout function
  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch {}
    }
    setSelectedItem('');
    // Hard redirect to avoid any stale client-side state pushing back to orders
    if (typeof globalThis !== 'undefined' && 'location' in globalThis) {
      (globalThis as any).location.replace('/admin?loggedout=1');
    } else {
      router.replace('/admin?loggedout=1');
    }
  }, [router]);

  // Menu items typed as MenuItemType[]
  const menuItems: MenuItemType[] = useMemo(() => [
    { text: 'Managing Products', path: '/admin/main/products', icon: <Inventory2OutlinedIcon /> },
    { text: 'Managing Users', path: '/admin/main/users', icon: <PortraitIcon /> },
    { text: 'Managing Orders', path: '/admin/main/orders', icon: <ShoppingBagOutlinedIcon /> },
    { text: 'Main Site', path: '/', icon: <WebOutlinedIcon /> }
  ], []);

  const secondaryMenuItems: MenuItemType[] = useMemo(() => [
    { text: "LogOut", path: "", icon: <LogoutIcon />, action: handleLogout }
  ], [handleLogout]);

  // ---
  // Drawer Content (Memoized for performance)

  const drawer = (
    <div style={{ border: '1px solid #e3e3e3', minHeight: '100vh', maxHeight: 'auto' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', borderBottom: '1px solid #e3e3e3', }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
          <Divider />
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path, item.text)}
              sx={{
                backgroundColor: selectedItem === item.text ? '#a9dfd8' : 'transparent',
                color: selectedItem === item.text ? 'black' : 'inherit',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: selectedItem === item.text ? '#a9dfd8' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {/* FIX: Remove React.cloneElement and rely on ListItemIcon to apply color via sx */}
              <ListItemIcon
                sx={{
                  color: selectedItem === item.text ? 'black' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => item.path ? handleNavigation(item.path, item.text) : item.action?.()}
              sx={{
                backgroundColor: selectedItem === item.text ? '#a9dfd8' : 'transparent',
                color: selectedItem === item.text ? 'black' : 'inherit',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: selectedItem === item.text ? '#a9dfd8' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {/* FIX: Remove React.cloneElement and rely on ListItemIcon to apply color via sx */}
              <ListItemIcon sx={{ color: selectedItem === item.text ? 'black' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Menu components (Rendered outside the main return for clarity)

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  // ---

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', bgcolor: 'background.default', color: 'text.primary' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'background.default',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Dashboard/>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle/>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* Mobile Drawer */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box', width: drawerWidth, bgcolor: 'background.default',
                color: 'text.primary'
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Permanent Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box', width: drawerWidth, bgcolor: 'background.default',
                color: 'text.primary'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, bgcolor: 'background.green',
            color: 'text.secondary',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// Optional: Keep PropTypes alongside TypeScript for runtime validation (though types are better)
ResponsiveDrawer.propTypes = {
  children: PropTypes.node,
  window: PropTypes.func,
};

export default ResponsiveDrawer;