'use client';

import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import rin from '../../../../public/img/8.jpg';
import nec from '../../../../public/img/necklaceall.jpg';
import brac from '../../../../public/img/braceletall.jpg';
import eari from '../../../../public/img/11.jpg';
import All from '../../../../public/img/alltop.jpg';

import CustomizedBreadcrumbs from '../../../components/BreadCrumbs';

interface ImageContainerProps {
  src: StaticImageData;
  alt: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ src, alt }) => (
  <div style={{ position: 'relative', minWidth: '80%', maxWidth: '100%', height: '400px' }}>
    <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
  </div>
);

const Page: React.FC = () => {
  const productSections: { href: string; src: StaticImageData; label: string }[] = [
    { href: './rings', src: rin, label: 'Rings' },
    { href: './necklace', src: nec, label: 'Necklace' },
    { href: './bracelet', src: brac, label: 'Bracelet' },
    { href: './earings', src: eari, label: 'Earrings' },
  ];

  return (
    <>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'start',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: '3%',
          ml: '3%',
          mb: '3%',
        }}
      >
        All Products
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: '3%' }}>
        <Box sx={{ position: 'relative', width: '100%', height: '200px' }}>
          <Image src={All} alt="All" fill style={{ objectFit: 'cover' }} priority />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '5% auto' }}>
        <CustomizedBreadcrumbs />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '70%',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '2rem',
        }}
      >
        {productSections.map(({ href, src, label }) => (
          <Box key={label} sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            <Link href={href} passHref>
              <Box
                sx={{
                  cursor: 'pointer',
                  border: '1px solid black',
                  position: 'relative',
                  '&:hover': {
                    filter: 'brightness(0.8)',
                    '& .caption': {
                      backgroundColor: 'black',
                      color: 'white',
                      border: '1px solid white',
                    },
                  },
                }}
              >
                <ImageContainer src={src} alt={label} />
                <Box
                  className="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '60px',
                    backgroundColor: 'transparent',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {label}
                </Box>
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Page;
