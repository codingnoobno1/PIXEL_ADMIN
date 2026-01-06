'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [amity_email, setAmityEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email: amity_email, // must match NextAuth CredentialsProvider
      password,
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    // On success, redirect to dashboard for selected role
    router.push(`/dashboard/${role}`);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to top, #000000, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={6} sx={{ p: 4, width: 380, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Admin Login
          </Typography>

          <TextField
            label="Amity Email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={amity_email}
            onChange={(e) => setAmityEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="project_mentor">Project Mentor</MenuItem>
              <MenuItem value="quiz_controller">Quiz Controller (Faculty)</MenuItem>
              <MenuItem value="admin_project_coordinator">Admin Project Coordinator</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>

          {error && (
            <Typography color="error" align="center" mt={2}>
              {error}
            </Typography>
          )}

          <Box mt={3} textAlign="center">
            <Typography
              variant="body2"
              color="primary"
              component={Link}
              href="/pixellead/admin_register"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Go to Admin Register
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
