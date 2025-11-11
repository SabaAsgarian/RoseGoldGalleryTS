// Site Layout - With Header and Footer for main site pages
import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ClientProviders from '../ClientProviders'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientProviders>
      <Header />
      {children}
      <Footer />
    </ClientProviders>
  )
}

