'use client';

import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { User, FolderKanban, BookOpen, Bookmark } from 'lucide-react';

const sidebarWidth = 260;

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <Box
      sx={{
        width: sidebarWidth,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ p: 3, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontWeight="bold" align="center" sx={{ letterSpacing: 1, color: 'primary.main' }}>
          🎯 Quiz Dashboard
        </Typography>
      </Box>

      <List component="nav" sx={{ flexGrow: 1, p: 1 }}>
        <ListItemButton
          selected={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
        >
          <ListItemIcon>
            <User size={20} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'quizmanager'}
          onClick={() => setActiveTab('quizmanager')}
          sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
        >
          <ListItemIcon>
            <FolderKanban size={20} />
          </ListItemIcon>
          <ListItemText primary="Quiz Manager Tool" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'questionbank'}
          onClick={() => setActiveTab('questionbank')}
          sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
        >
          <ListItemIcon>
            <BookOpen size={20} />
          </ListItemIcon>
          <ListItemText primary="Question Bank" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'markedquestions'}
          onClick={() => setActiveTab('markedquestions')}
          sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
        >
          <ListItemIcon>
            <Bookmark size={20} />
          </ListItemIcon>
          <ListItemText primary="Marked Questions" />
        </ListItemButton>
      </List>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'center', fontSize: 12, color: 'text.secondary' }}>
        &copy; 2025 Your Company
      </Box>
    </Box>
  );
}
