'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';

// ✅ Role options
const roleOptions = [
  { key: 'project_mentor', label: 'Project Mentor' },
  { key: 'quiz_controller', label: 'Quiz Controller (Faculty)' },
  { key: 'admin_project_coordinator', label: 'Admin Project Coordinator' },
];

// ✅ University position options
const positionOptions = [
  'Dean',
  'Associate Dean',
  'Head of Department (HOD)',
  'Head of Section (HOS)',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lab Assistant',
  'Research Scholar',
  'Administrative Staff',
];

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [amityEmail, setAmityEmail] = useState('');
  const [amizoneId, setAmizoneId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Multi-role handler
  const handleRoleChange = (event) => {
    const value = event.target.value;
    setSelectedRoles(typeof value === 'string' ? value.split(',') : value);
  };

  // ✅ Simple email validator
  const isValidAmityEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@amity\.edu(\.in)?$/.test(email);

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    if (!name || !position || selectedRoles.length === 0 || !amityEmail || !amizoneId || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (!isValidAmityEmail(amityEmail)) {
      setError('Please use a valid Amity email address (e.g., user@amity.edu).');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          position,
          roles: selectedRoles,
          amity_email: amityEmail,
          amizone_id: amizoneId,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          email: amityEmail,
          password,
        });

        if (result?.ok) {
          if (selectedRoles.includes('project_mentor')) {
            router.push('/dashboard/project_mentor');
          } else if (selectedRoles.includes('quiz_controller')) {
            router.push('/dashboard/quiz_controller');
          } else if (selectedRoles.includes('admin_project_coordinator')) {
            router.push('/dashboard/admin_project_coordinator');
          } else {
            router.push('/admin_login');
          }
        } else {
          setError('Login after registration failed. Please login manually.');
        }
      } else {
        setError(data.error || 'Something went wrong during registration.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f172a 40%, #2563eb 100%)' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 480,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.96)',
        }}
      >
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Admin Registration
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

          {/* ✅ Position Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select value={position} onChange={(e) => setPosition(e.target.value)} label="Position">
              {positionOptions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ✅ Multi-select Roles */}
          <FormControl fullWidth>
            <InputLabel>Select Role(s)</InputLabel>
            <Select
              multiple
              value={selectedRoles}
              onChange={handleRoleChange}
              renderValue={(selected) =>
                selected
                  .map((value) => roleOptions.find((role) => role.key === value)?.label)
                  .join(', ')
              }
            >
              {roleOptions.map((role) => (
                <MenuItem key={role.key} value={role.key}>
                  <Checkbox checked={selectedRoles.includes(role.key)} />
                  <ListItemText primary={role.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Amity Email" type="email" value={amityEmail} onChange={(e) => setAmityEmail(e.target.value)} fullWidth />
          <TextField label="Amizone ID" value={amizoneId} onChange={(e) => setAmizoneId(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
        </Box>

        {error && (
          <Typography color="error" align="center" mt={2} fontWeight={500}>
            {error}
          </Typography>
        )}

        <Box mt={4}>
          <Button
            onClick={handleRegister}
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ py: 1.4, fontWeight: 600, fontSize: '1rem', borderRadius: 3 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>

        <Typography align="center" mt={3} sx={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <a href="/admin_login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </a>
        </Typography>
      </Paper>
    </motion.div>
  );
}
