'use client';

import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';

export default function Navbar({ title = 'Dashboard', onMenuClick }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar position="static" sx={{ backgroundColor: '#1A237E' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 'bold', color: '#E3F2FD' }}>
            {title}
          </Typography>

          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ fontWeight: 'bold', color: '#64B5F6' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}
