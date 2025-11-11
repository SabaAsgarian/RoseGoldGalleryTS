'use client'

import React from 'react'
import { UserProvider } from './context/mycontext' // adjust path if needed

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserProvider>{children}</UserProvider>
}
