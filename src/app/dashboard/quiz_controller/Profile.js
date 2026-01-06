'use client';

import { Box, Container, Grid, Paper } from '@mui/material';
import { useSession } from 'next-auth/react';
import Profile1 from './Profile1';
import BatchAdd from './BatchAdd';

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading session...</div>;
  if (!session) return <div>Access denied</div>; // Optional: guard for unauthenticated users

  // Now you can access session.user.role, session.user.amiId, etc.
  return (
    <Container maxWidth="md">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Profile1 session={session} />
        </Grid>
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
            }}
          >
            <BatchAdd session={session} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
