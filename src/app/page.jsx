'use client';

import { useState } from 'react';
import AdminLoginPage from './admin_login';
import AdminRegister from './admin_register';
import { Box, Container, Typography, Tabs, Tab, Paper } from '@mui/material';
import { motion } from 'framer-motion';

export default function PixelleadPage() {
  const [activeTab, setActiveTab] = useState(0);

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
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={6} sx={{ width: 450, p: 4, borderRadius: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Pixellead Admin
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(e, newVal) => setActiveTab(newVal)}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {activeTab === 0 && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminLoginPage />
            </motion.div>
          )}
          {activeTab === 1 && (
            <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminRegister />
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
