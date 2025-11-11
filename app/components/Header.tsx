"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
 
  Menu,
  Drawer,
  CssBaseline,
  List,
  Divider,
  ListItem,
  ListItemButton,

  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CallIcon from "@mui/icons-material/Call";
import SearchIcon from '@mui/icons-material/Search';
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled as muiStyled } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import logo from "../../public/img/logo.png";

// -------------------------------
// Styled Components
// -------------------------------

const HeaderContainer = muiStyled(Box)(({ theme }) => ({
  backgroundColor: "#f1eee4",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 3),
}));

const SupportContainer = styled(Box)({
  width: "100%",
  backgroundColor: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px 0",
});

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  position: "static",
  backgroundColor: "white",
  color: "black",
  borderBottom: "1px solid black",
  boxShadow: "none",
  "&:hover": {
    color: "#ccaf71",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
  zIndex: 999,
  "&:hover": {
    color: "#ccaf71",
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "white",
    color: "black",
  },
  zIndex: theme.zIndex.drawer + 2,
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "black",
  margin: "0 10px",
  textDecoration: "none",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#ccaf71",
  },
}));



const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "black",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#ccaf71",
    backgroundColor: "transparent",
  },
}));

// -------------------------------
// Component
// -------------------------------

const HeaderComponent: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const [goldPrice, setGoldPrice] = React.useState<string>("");
  const [displayText, setDisplayText] =
    React.useState<string>("⭐ Shine With Rose ⭐");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // -------------------------------
  // Fetch Gold Price (Client Only)
  // -------------------------------

  React.useEffect(() => {
    if (typeof window === "undefined") return; // Ensure client-side only

    const fetchGoldPrice = async () => {
      try {
        const response = await axios.get("https://www.goldapi.io/api/XAU/USD", {
          headers: {
            "x-access-token": "goldapi-3y9buxh19m0r4cp4x-io",
          },
        });
        if (response.data?.price) {
          setGoldPrice(response.data.price.toString());
        } else {
          setGoldPrice("Unavailable");
        }
      } catch (error) {
        console.error("Error fetching gold price:", error);
        setGoldPrice("3400.1");
      }
    };

    fetchGoldPrice();
  }, []);

  // -------------------------------
  // Dynamic Display Text
  // -------------------------------

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const texts = [
      "⭐ Shine With Rose ⭐",
      "🔄 Return Policy After One Month 🔄",
    ];
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % texts.length;
      setDisplayText(texts[index]);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // -------------------------------
  // Handlers
  // -------------------------------


  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // -------------------------------
  // Menus
  // -------------------------------

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
  
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      
    </Menu>
  );

  // -------------------------------
  // Render
  // -------------------------------

  return (
    <>
      <HeaderContainer
        sx={{
          height: { xs: "130px", sm: "130px", md: "80px", lg: "60px" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
          <CallIcon />
          <Typography  sx={{ ml: 1 ,fontSize:"12px"}}>
            01171822
          </Typography>
        </Box>
        <Typography textAlign="center" fontSize="12px">
          {displayText}
        </Typography>
        <Typography fontSize="12px">
          {goldPrice ? `${goldPrice}$` : "Loading..."}
        </Typography>
      </HeaderContainer>

      <SupportContainer>
        <Typography  sx={{ color: "white",
                textAlign:"center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize:"12px",
                wordBreak:"break-word"
                }}>
          👆 Get up to 10% off bestselling products and enter the draw to win five 2-gram gold bars.
        </Typography>
      </SupportContainer>

      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar>
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link href="../pages/basket">
                <StyledIconButton>
                  <LocalMallOutlinedIcon />
                </StyledIconButton>
              </Link>
              <Link href="../pages/account">
                <StyledIconButton>
                  <PersonOutlineOutlinedIcon />
                </StyledIconButton>
              </Link>
              <StyledIconButton>
                  <SearchIcon />
                </StyledIconButton>
            </Box>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                ml: { xs: 0, lg: "30%" },
              }}
            >
              <Link href="/" passHref>
                <Image src={logo} alt="logo" height={50} width={100} />
              </Link>
            </Typography>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              <StyledLink href="/">Home</StyledLink>
              <StyledLink href="../pages/all">All</StyledLink>
              <StyledLink href="../pages/bracelet">Bracelet</StyledLink>
              <StyledLink href="../pages/earings">Earrings</StyledLink>
              <StyledLink href="../pages/rings">Rings</StyledLink>
              <StyledLink href="../pages/necklace">Necklace</StyledLink>
              <StyledLink href="../admin">
                Admin Panel
              </StyledLink>
            </Box>

            {/* Mobile Drawer Button */}
            {isSmallScreen && (
              <IconButton color="inherit" onClick={handleDrawerOpen}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* Drawer for Mobile */}
        {isSmallScreen && (
          <StyledDrawer anchor="right" open={open} variant="persistent">
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {[
                { text: "Home", href: "/" },
                { text: "All", href: "../pages/all" },
                { text: "Bracelet", href: "../pages/bracelet" },
                { text: "Earrings", href: "../pages/earings" },
                { text: "Rings", href: "../pages/rings" },
                { text: "Necklace", href: "../pages/necklace" },
                { text: "Admin Panel", href: "../admin" },
              ].map((item) => (
                <ListItem key={item.text} disablePadding>
                  <Link
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      width: "100%",
                      color: "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        padding: "10px 20px",
                        "&:hover": { color: "#ccaf71" },
                      }}
                    >
                      {item.text}
                    </Box>
                  </Link>
                </ListItem>
              ))}
            </List>
          </StyledDrawer>
        )}
      </Box>

      {renderMobileMenu}
      {renderMenu}
    </>
  );
};

// Disable SSR to avoid hydration mismatch
const PrimarySearchAppBar = dynamic(() => Promise.resolve(HeaderComponent), {
  ssr: false,
});

export default PrimarySearchAppBar;
