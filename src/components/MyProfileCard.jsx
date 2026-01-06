'use client';

import { Avatar, Box, Card, IconButton, Typography } from '@mui/material';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyProfileCard() {
  const router = useRouter();

  return (
    <Card
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: '50px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        zIndex: 999,
      }}
    >
      <Avatar alt="Admin" src="/avatar.png" />
      <Box>
        <Typography variant="body2">Project Mentor</Typography>
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => router.push('/project_mentor/profile')}
            sx={{ color: 'white' }}
          >
            <User size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/pixellead/admin_login');
            }}
            sx={{ color: 'white' }}
          >
            <LogOut size={18} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
