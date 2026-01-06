'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export default function MarkedQuestions() {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Marked Questions
      </Typography>
      <Box>
        {/* Place your MarkedQuestions content here */}
        <Typography>View and review your marked questions here.</Typography>
      </Box>
    </Paper>
  );
}
