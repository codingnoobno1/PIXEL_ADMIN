'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Stack, MenuItem, TextField } from '@mui/material';
import QuizState from '../quiztools/quizstate'; // Import QuizState
import useQuizData from './quiztools/QuizData.jsx'; // Corrected import path
import { useSession } from 'next-auth/react';

export default function QuizManagerTool() {
  const { data: session, status } = useSession();
  const {
    assignments,
    subjects,
    selectedBatch,
    selectedBatchIdx,
    setSelectedBatchIdx,
    selectedSubject,
    setSelectedSubject,
    loading
  } = useQuizData();

  const [showQuizState, setShowQuizState] = useState(false);

  if (status === "loading" || loading) {
    return <Typography>Loading...</Typography>;
  }

  const handleSelectBatch = (event) => {
    setSelectedBatchIdx(event.target.value);
    setSelectedSubject(''); // Reset subject when batch changes
  };

  const handleSelectSubject = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleCreateQuiz = () => {
    if (selectedBatch && selectedSubject) {
      setShowQuizState(true);
    } else {
      alert('Please select both a Batch and a Subject.');
    }
  };

  const handleBackToSelection = () => {
    setShowQuizState(false);
  };

  if (showQuizState) {
    return (
      <QuizState
        batch={selectedBatch.course}
        subject={selectedSubject}
        semester={selectedBatch.semester}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage Quizzes</Typography>

      <Stack spacing={3} direction="row" sx={{ mb: 3 }}>
        <TextField
          select
          label="Select Batch"
          value={selectedBatchIdx}
          onChange={handleSelectBatch}
          fullWidth
          variant="outlined"
        >
          {assignments.map((assignment, index) => (
            <MenuItem key={index} value={index}>
              {assignment.course} - Sem {assignment.semester}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select Subject"
          value={selectedSubject}
          onChange={handleSelectSubject}
          fullWidth
          disabled={!selectedBatch}
          variant="outlined"
        >
          {subjects.map((subject, index) => (
            <MenuItem key={index} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateQuiz}
        disabled={!selectedBatch || !selectedSubject}
      >
        Create New Quiz
      </Button>
    </Box>
  );
}
