import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, Stack, Paper, CircularProgress } from '@mui/material';

export default function QuizGrid({ subject, batch, semester, onCreate, onAccess, onReschedule }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subject && batch && semester) {
      fetchQuizzes();
    }
  }, [subject, batch, semester]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
        <Typography mt={2}>Loading quizzes...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {quizzes.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Typography color="text.secondary" mb={2}>No quizzes created yet for {subject}</Typography>
            <Button variant="contained" color="primary" onClick={() => onCreate()} size="small">
              Create First Quiz
            </Button>
          </Paper>
        ) : (
          quizzes.map((quiz) => {
            const isOn = quiz.availabilityStatus === 'on';
            const isScheduled = quiz.availabilityStatus === 'scheduled';
            const isOff = quiz.availabilityStatus === 'off';

            let statusColor = 'default';
            let statusLabel = 'OFF';

            if (isOn) {
              statusColor = 'success';
              statusLabel = 'ON';
            } else if (isScheduled) {
              statusColor = 'warning';
              statusLabel = 'SCHEDULED';
            } else {
              statusColor = 'error';
              statusLabel = 'OFF';
            }

            return (
              <Paper key={quiz._id} sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.95)' }}>
                <Box>
                  <Typography fontWeight={700} color="#6C3483">{quiz.title}</Typography>
                  <Typography fontSize={13} color="text.secondary">
                    {quiz.questions?.length || 0} questions • {quiz.timeLimit} min • {quiz.maxMarks} marks
                  </Typography>
                  {isScheduled && quiz.scheduledStartTime && (
                    <Typography fontSize={12} color="warning.main">
                      Scheduled: {new Date(quiz.scheduledStartTime).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip label={statusLabel} color={statusColor} sx={{ fontWeight: 700 }} />
                  <Button variant="outlined" color="primary" onClick={() => onAccess(quiz._id)} size="small">
                    Manage
                  </Button>
                </Stack>
              </Paper>
            );
          })
        )}
      </Stack>
    </Box>
  );
}
