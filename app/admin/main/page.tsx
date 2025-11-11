"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AlllPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to orders page as the default landing page
    router.push('/admin/main/orders');
  }, [router]);

  return null;
};

export default AlllPage;
