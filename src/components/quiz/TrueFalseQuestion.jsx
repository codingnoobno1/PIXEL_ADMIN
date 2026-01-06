"use client";
import React from 'react';
import { Box, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';

export default function TrueFalseQuestion({ question, setQuestion }) {
  return (
    <Box>
      <TextField
        label="Question"
        fullWidth
        value={question.text}
        onChange={e => setQuestion({ ...question, text: e.target.value })}
        sx={{ mb: 2 }}
      />
      <ToggleButtonGroup
        value={question.correctAnswer}
        exclusive
        onChange={(_, value) => value !== null && setQuestion({ ...question, correctAnswer: value })}
        sx={{ mb: 2 }}
      >
        <ToggleButton value={true}>True</ToggleButton>
        <ToggleButton value={false}>False</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
