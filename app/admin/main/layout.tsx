// app/admin/main/layout.tsx

import React from 'react';
// مسیر وارد کردن کامپوننت ResponsiveDrawer از سه سطح بالاتر تنظیم شده است
// (از app/admin/main به app/components)
import ResponsiveDrawer from './adminUi'; 

// Define the Root Layout Props interface
interface AdminLayoutProps {
  // children represents the specific page being rendered (e.g., products/page.tsx)
  children: React.ReactNode;
}

/**
 * AdminLayout component. This is a Server Component.
 * It ensures the ResponsiveDrawer (Admin UI) wraps all content 
 * only for paths under /admin/main.
 * * NOTE: This sub-layout automatically overrides the Header/Footer 
 * provided by the main RootLayout, because ResponsiveDrawer already 
 * handles the full visual structure (sidebar + main content area).
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  
  return (
    // ResponsiveDrawer is the client component that provides:
    // 1. MUI ThemeProvider
    // 2. AppBar and Drawer navigation structure
    // 3. The main content area where {children} (the page) is rendered
    <ResponsiveDrawer>
      {children}
    </ResponsiveDrawer>
  );
}