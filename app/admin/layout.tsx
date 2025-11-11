// app/admin/layout.tsx
import React from 'react';
import ClientProviders from '../ClientProviders';

/**
 * AdminLayout component for admin section.
 * This layout is completely independent from the site layout.
 * It does NOT include Header and Footer components.
 * It only wraps children with ClientProviders for context support.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      {children}
    </ClientProviders>
  );
}