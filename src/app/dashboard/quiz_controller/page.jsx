'use client';

import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Typography, ThemeProvider } from '@mui/material';
import { SessionProvider, useSession } from 'next-auth/react';

import Sidebar from './Sidebar';
import Profile from './Profile';
import QuizManagerTool from './QuizManagerTool';
import QuestionBank from './QuestionBank';
import MarkedQuestions from './MarkedQuestions';
import theme from './theme';

export default function DashboardWrapper() {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <ClientSafeDashboard />
      </ThemeProvider>
    </SessionProvider>
  );
}


function ClientSafeDashboard() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent mismatch by only rendering after client hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Avoid rendering on server

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h6">🔄 Loading session...</Typography>
      </Box>
    );
  }

  if (!session || !session.user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h6">🚫 Access Denied. Please log in.</Typography>
      </Box>
    );
  }

  return <Dashboard session={session} />;
}

function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile session={session} />;
      case 'quizmanager':
        return <QuizManagerTool session={session} />;
      case 'questionbank':
        return <QuestionBank session={session} />;
      case 'markedquestions':
        return <MarkedQuestions session={session} />;
      default:
        return <Profile session={session} />;
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            overflowY: 'auto',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </>
  );
}
