'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function RoleRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return; // Wait for session to load
    }

    if (status === 'unauthenticated') {
      router.replace('/admin_login');
      return;
    }

    if (session?.user?.role) {
      const { role } = session.user;
      if (role === 'project_mentor') {
        router.replace('/dashboard/project_mentor');
      } else if (role === 'quiz_controller') {
        router.replace('/dashboard/quiz_controller');
      } else {
        // Default redirect if role is unknown
        router.replace('/admin_login');
      }
    } else {
        // if no role, maybe redirect to login
        router.replace('/admin_login');
    }
  }, [session, status, router]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}
