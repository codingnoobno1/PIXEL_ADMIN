'use client';

import {
  Avatar,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  useTheme,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Profile1() {
  const theme = useTheme();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Typography>Loading profile...</Typography>;
  }

  if (!session) {
    return <Typography variant="h6" color="error">Not authenticated</Typography>;
  }

  const user = session.user;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        borderRadius: 5,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Avatar and Name */}
        <Grid item xs={12} sm={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              sx={{
                width: 110,
                height: 110,
                bgcolor: 'primary.main',
                mb: 2,
                boxShadow: (theme) => `0 4px 10px ${theme.palette.primary.light}`,
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 60, color: 'white' }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5, mb: 0.5 }}>
              {user.name || 'Unnamed Faculty'}
            </Typography>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              {user.position || 'Position'} — {user.role || 'Role'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user.email || user.amiId}
            </Typography>
          </Box>
        </Grid>

        {/* Stats Section */}
        <Grid item xs={12} sm={8}>
          <Grid container spacing={3}>
            {[ // Hardcoded stats for now — can be fetched via API in future
              {
                icon: <QuizIcon color="secondary" sx={{ fontSize: 30 }} />,
                label: 'Total Quizzes',
                value: 36,
              },
              {
                icon: <SchoolIcon color="info" sx={{ fontSize: 30 }} />,
                label: 'Courses This Sem',
                value: 4,
              },
              {
                icon: <BarChartIcon sx={{ color: '#ff9800', fontSize: 30 }} />,
                label: 'Avg. Question Level',
                value: '7.8 / 10',
              },
              {
                icon: <StarIcon sx={{ color: '#fdd835', fontSize: 30 }} />,
                label: 'Quiz Rating',
                value: '⭐ Top 5% Faculty',
              },
            ].map(({ icon, label, value }) => (
              <Grid key={label} item xs={6}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 3,
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  {icon}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 4 }} />
      <Typography
        variant="body2"
        sx={{
          mt: 3,
          color: 'text.secondary',
          fontStyle: 'italic',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        “Empowering students through structured assessments and engaging quizzes.”
      </Typography>
    </Paper>
  );
}
