
'use client';

import React, { useState } from 'react';
import {
  Box, Paper, Typography, Stack, TextField, Button, CircularProgress, Avatar, Divider
} from '@mui/material';

export default function GeminiAI({ addQuestions, setSnackbar }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      if (setSnackbar) setSnackbar({ open: true, message: 'Please enter a topic!', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      });

      const data = await res.json();

      if (res.ok && data.questions?.length) {
        addQuestions(data.questions); // Add the new questions to the parent state
        if (setSnackbar) setSnackbar({ open: true, message: `Successfully generated ${data.questions.length} questions!`, severity: 'success' });
      } else {
        throw new Error(data.error || 'No questions were generated.');
      }
    } catch (err) {
      console.error('Gemini generation failed:', err);
      if (setSnackbar) setSnackbar({ open: true, message: `AI generation failed: ${err.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, mt: 3, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: '#1976d2' }}>🧠</Avatar>
        <Typography variant="h6" fontWeight={600}>AI Question Generator</Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enter a topic below to automatically generate a set of questions for your quiz.
      </Typography>

      <TextField
        fullWidth
        label="Quiz Topic"
        placeholder="e.g., Introduction to React Hooks"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button
        onClick={generateQuiz}
        variant="contained"
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Questions'}
      </Button>
    </Paper>
  );
}

