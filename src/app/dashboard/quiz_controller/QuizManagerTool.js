'use client';

import { useState, useEffect } from 'react';
import {
  Box, CircularProgress, Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { fetchAssignmentsFromApi } from './batchquery';
import QuizManagerLayout from './quiztools/QuizManagerLayout';
import QuizManagerHeader from './quiztools/QuizManagerHeader';
import BatchSelector from './quiztools/BatchSelector';
import SubjectSelector from './quiztools/SubjectSelector';
import QuizGrid from './quiztools/QuizGrid';


export default function QuizManagerTool() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatchIdx, setSelectedBatchIdx] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      const preparedSession = {
        ...session,
        facultyId: session.user?.facultyId || session.facultyId || undefined,
        user: {
          ...session.user,
          amiId: session.user?.amiId || session.user?.amiId || undefined,
        },
      };
      fetchAssignmentsFromApi(preparedSession)
        .then(setAssignments)
        .catch(() => setAssignments([]))
        .finally(() => setLoading(false));
    }
  }, [status]);

  // Reset subject when batch changes
  useEffect(() => {
    setSelectedSubject('');
  }, [selectedBatchIdx]);

  // Handler functions for quiz operations
  const handleCreateQuiz = (quizType) => {
    // Navigate to quiz creation page
    router.push('/createquiz');
  };

  const handleAccessQuiz = (quizType) => {
    // Navigate to quiz management page
    router.push('/quizmanagement');
  };

  const handleRescheduleQuiz = (quizType) => {
    // Navigate to quiz management page for rescheduling
    router.push('/quizmanagement');
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="secondary" />
        <Typography mt={2}>Loading assignments...</Typography>
      </Box>
    );
  }

  const selectedBatch =
    selectedBatchIdx !== '' && assignments[selectedBatchIdx]
      ? assignments[selectedBatchIdx]
      : null;
  const subjects = selectedBatch ? selectedBatch.subjects || [] : [];

  return (
    <QuizManagerLayout>
      <QuizManagerHeader />
      <BatchSelector
        assignments={assignments}
        selectedBatchIdx={selectedBatchIdx}
        setSelectedBatchIdx={setSelectedBatchIdx}
      />
      {selectedBatch && (
        <SubjectSelector
          subjects={subjects}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
        />
      )}
      {selectedBatch && selectedSubject && (
        <QuizGrid
          subject={selectedSubject}
          batch={selectedBatch.course}
          semester={selectedBatch.semester}
          onCreate={handleCreateQuiz}
          onAccess={handleAccessQuiz}
          onReschedule={handleRescheduleQuiz}
        />
      )}
    </QuizManagerLayout>
  );
}

function ReadOnlyAssignmentCard({ assignment }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#1e1e1e' }}>
      <Stack spacing={2}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth label="Batch" variant="filled"
            value={assignment.batch || assignment.course || ''}
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth label="Section" variant="filled"
            value={assignment.section}
            InputProps={{ readOnly: true }}
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth label="Semester" variant="filled"
            value={assignment.semester}
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth label="Room Number" variant="filled"
            value={assignment.roomNumber}
            InputProps={{ readOnly: true }}
          />
        </Box>

        <Box>
          <Typography fontWeight={600} mb={1}>Subjects</Typography>
          <Stack spacing={1}>
            {(assignment.subjects || []).map((subj, j) => (
              <TextField
                key={j}
                fullWidth
                label={`Subject ${j + 1}`}
                variant="filled"
                value={subj}
                InputProps={{ readOnly: true }}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

function AssignmentCard({
  index,
  assignment,
  onChange,
  onSubjectChange,
  onAddSubject,
  onRemoveSubject,
  onRemoveAssignment
}) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#1e1e1e' }}>
      <Stack spacing={2}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth label="Course" variant="filled"
            value={assignment.course}
            onChange={(e) => onChange(index, 'course', e.target.value)}
          />
          <TextField
            fullWidth label="Section" variant="filled"
            value={assignment.section}
            onChange={(e) => onChange(index, 'section', e.target.value)}
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth label="Semester" variant="filled"
            value={assignment.semester}
            onChange={(e) => onChange(index, 'semester', e.target.value)}
          />
          <TextField
            fullWidth label="Room Number" variant="filled"
            value={assignment.roomNumber}
            onChange={(e) => onChange(index, 'roomNumber', e.target.value)}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>Subjects</Typography>
          <IconButton color="error" onClick={() => onRemoveAssignment(index)}>
            <Delete />
          </IconButton>
        </Box>

        <Stack spacing={1}>
          {assignment.subjects.map((subj, j) => (
            <Box key={j} display="flex" gap={1}>
              <TextField
                fullWidth label={`Subject ${j + 1}`} variant="filled"
                value={subj}
                onChange={(e) => onSubjectChange(index, j, e.target.value)}
              />
              <IconButton color="error" onClick={() => onRemoveSubject(index, j)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Stack>

        <Button
          variant="outlined"
          onClick={() => onAddSubject(index)}
          startIcon={<Add />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Subject
        </Button>
      </Stack>
    </Paper>
  );
}
