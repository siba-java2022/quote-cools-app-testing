'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export const AuthGuard = (WrappedComponent: any) => {
  const AuthComponent: React.FC = (props) => {
    const router = useRouter();


    useEffect(() => {
      if (typeof window != 'undefined') {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (!token) router.push("/login/");
      }
    }, []);

    // If token exists, render the wrapped component
    return <WrappedComponent {...props} />
  };

  return AuthComponent;
};
