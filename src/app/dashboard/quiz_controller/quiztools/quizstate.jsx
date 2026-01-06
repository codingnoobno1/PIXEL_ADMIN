'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import CreateQuizPage from './createquiz/page';
import { Box } from '@mui/material';

export default function QuizState(props) {
  const { data: session } = useSession();
  const createdByName = session?.user?.name || 'Unknown Faculty';

  const {
    batch, subject, batchIdx, quizType, semester,
    section, room, facultyId, onBack
  } = props;

  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const addQuestion = (question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const addQuestions = (newQuestions) => {
    if (Array.isArray(newQuestions) && newQuestions.length > 0) {
      setQuestions((prev) => [...prev, ...newQuestions]);
    }
  };

  const removeQuestion = (idx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetQuestions = () => setQuestions([]);

  const saveQuiz = async () => {
    if (questions.length === 0) {
      setSnackbar({ open: true, message: 'No questions to save.', severity: 'warning' });
      return;
    }

    setSaving(true);
    try {
      // Create an array of promises, one for each question to be saved.
      const savePromises = questions.map(question =>
        fetch('/api/quiz/save-question', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...question, batch, subject, semester, quizCategory: quizType, createdByName }),
        })
      );

      // Wait for all questions to be saved.
      const responses = await Promise.all(savePromises);

      // Check if any of the requests failed.
      const hasFailures = responses.some(res => !res.ok);

      if (hasFailures) {
        // Fetch error details from responses
        const errorDetails = await Promise.all(responses.filter(res => !res.ok).map(res => res.json()));
        console.error('Failed save responses:', errorDetails);
        throw new Error('One or more questions failed to save. Check console for details.');
      }

      setSnackbar({ open: true, message: 'Quiz questions saved successfully!', severity: 'success' });
      setQuestions([]); // Clear questions after successful save
    } catch (err) {
      console.error('Error saving questions:', err);
      setSnackbar({ open: true, message: 'Failed to save quiz questions.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
      }}
    >
      <CreateQuizPage
        batch={batch}
        subject={subject}
        batchIdx={batchIdx}
        quizType={quizType}
        semester={semester}
        section={section}
        room={room}
        facultyId={facultyId}
        onBack={onBack}
        addQuestion={addQuestion}
        addQuestions={addQuestions}
        saveQuiz={saveQuiz}
        questions={questions}
        saving={saving}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
        removeQuestion={removeQuestion}
        resetQuestions={resetQuestions}
      />
    </Box>
  );
}
