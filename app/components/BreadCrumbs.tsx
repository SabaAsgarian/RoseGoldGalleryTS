'use client'

import * as React from 'react'
import { emphasize, styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'

// Breadcrumb type
interface Breadcrumb {
  href: string
  label: string
  icon?: React.ReactElement
}

// Styled breadcrumb chip
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800]

  return {
    backgroundColor,
    height: theme.spacing(4),
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: '0.9rem',
    textTransform: 'capitalize',
    transition: 'all 0.3s ease',
    borderRadius: Number(theme.shape.borderRadius) * 2,
    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.08),
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
    '&:active': {
      boxShadow: theme.shadows[2],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  }
})

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  event.preventDefault()
  console.info('Breadcrumb clicked.')
}

const breadcrumbs: Breadcrumb[] = [
  { href: '/', label: 'Home', icon: <HomeIcon fontSize="small" /> },
  { href: '/pages/all', label: 'All' },
  { href: '/pages/bracelet', label: 'Bracelet' },
  { href: '/pages/earings', label: 'Earrings' },
  { href: '/pages/rings', label: 'Rings' },
  { href: '/pages/necklace', label: 'Necklace' },
]

const CustomizedBreadcrumbs: React.FC = () => {
  return (
    <Box
      role="presentation"
      onClick={handleClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        borderRadius: 3,
        width: 'fit-content',
        mx: 'auto',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: 'text.secondary',
          letterSpacing: '0.05em',
          fontSize: { xs: '1rem', sm: '1.1rem' },
        }}
      >
        Explore Collections
      </Typography>

      <Breadcrumbs
        aria-label="breadcrumb"
        separator="›"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          '& .MuiChip-root': { my: 0.5 },
        }}
      >
        {breadcrumbs.map((crumb) => (
          <StyledBreadcrumb
            key={crumb.label}
            clickable
            icon={crumb.icon}
            label={
              <Link
                href={crumb.href}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'inline-block',
                  width: '100%',
                }}
              >
                {crumb.label}
              </Link>
            }
          />
        ))}
      </Breadcrumbs>
    </Box>
  )
}

export default CustomizedBreadcrumbs
