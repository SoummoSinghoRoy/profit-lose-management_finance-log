"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const UnProtectedRoute = ({ children }) => {
  const {isAuthenticated} = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return !isAuthenticated ? children : null;
};

export default UnProtectedRoute;