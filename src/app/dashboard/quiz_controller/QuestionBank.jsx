'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export default function QuestionBank() {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Question Bank
      </Typography>
      <Box>
        {/* Place your QuestionBank content here */}
        <Typography>Browse and manage your question bank here.</Typography>
      </Box>
    </Paper>
  );
}
