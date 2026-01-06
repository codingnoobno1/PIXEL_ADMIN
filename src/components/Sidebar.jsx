'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material';
import { FileText, ClipboardList, Briefcase } from 'lucide-react';

const routes = [
  { id: 'proposal', label: 'Proposal', icon: FileText },
  { id: 'ongoing', label: 'Ongoing Projects', icon: ClipboardList },
  { id: 'internship', label: 'Internship Evaluation', icon: Briefcase },
];

export default function Sidebar({ onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('proposal');

  const handleMenuClick = (id) => {
    setSelectedMenu(id);
    if (onSelect) onSelect(id);
  };

  return (
    <motion.aside
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      initial={false}
      animate={{ width: expanded ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        background: '#121a2a',
        color: '#cfd8dc',
        borderRight: '1px solid #2f3a52',
        zIndex: 1200,
        paddingTop: 56,   // Reduced from 80
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <List sx={{ px: 0, mt: 0 }}>
        {routes.map(({ id, label, icon: Icon }) => {
          const isActive = selectedMenu === id;
          return (
            <Tooltip
              key={id}
              title={!expanded ? label : ''}
              placement="right"
              arrow
              enterDelay={500}
              leaveDelay={200}
            >
              <ListItem
                button
                onClick={() => handleMenuClick(id)}
                sx={{
                  px: 2.5,
                  py: 1.1,     // Reduced from 1.5
                  my: 0.35,    // Reduced from 0.75
                  mx: 1,
                  borderRadius: 2,
                  backgroundColor: isActive ? '#1976d2' : 'transparent',
                  color: isActive ? '#e3f2fd' : '#90a4ae',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: isActive ? '#1565c0' : '#1c2833',
                    color: '#e3f2fd',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 0,
                    mr: expanded ? 2.5 : 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>

                {expanded && (
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={isActive ? 700 : 500}
                        noWrap
                        sx={{ fontSize: '1rem' }}
                      >
                        {label}
                      </Typography>
                    }
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mt: 2, mx: 2, borderColor: '#2f3a52' }} />

      <Box flexGrow={1} />
      {/* Placeholder for profile or settings */}
    </motion.aside>
  );
}
