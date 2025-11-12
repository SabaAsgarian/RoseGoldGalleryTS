"use client";

import { Suspense } from 'react';
import AdminLoginPage from './login';

function AdminLoginFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f2f4f8'
    }}>
      <div>Loading...</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginPage />
    </Suspense>
  );
}
