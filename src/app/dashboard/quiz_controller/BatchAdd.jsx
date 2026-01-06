'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, IconButton,
  Paper, Snackbar, Alert, Stack, CircularProgress
} from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import {
  fetchAssignmentsFromApi,
  saveAssignmentsToApi,
  createEmptyAssignment
} from './batchquery';

export default function AssignClassPage() {
  const { data: session, status } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (status === 'authenticated') {
      // Prepare session data with facultyId and amiId included
      const preparedSession = prepareSession(session);

      fetchAssignmentsFromApi(preparedSession)
        .then(setAssignments)
        .catch(() => setAssignments([createEmptyAssignment()]))
        .finally(() => setLoading(false));
    }
  }, [status]);

  const prepareSession = (session) => {
    if (!session) return null;

    // Example: add your custom facultyId and amiId from somewhere
    // Replace below with your real logic of how to get these from your session/user object
    return {
      ...session,
      facultyId: session.user?.id || session.facultyId || undefined,
      user: {
        ...session.user,
        amiId: session.user?.amiId || undefined,
      },
    };
  };

  const showAlert = (message, severity = 'info') =>
    setAlert({ open: true, message, severity });

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleChange = (i, field, value) => {
    const updated = [...assignments];
    updated[i][field] = value;
    setAssignments(updated);
  };

  const handleSubjectChange = (i, j, value) => {
    const updated = [...assignments];
    updated[i].subjects[j] = value;
    setAssignments(updated);
  };

  const addAssignment = () => {
    setAssignments([...assignments, createEmptyAssignment()]);
  };

  const removeAssignment = (i) => {
    const updated = [...assignments];
    updated.splice(i, 1);
    setAssignments(updated);
  };

  const addSubject = (i) => {
    const updated = [...assignments];
    updated[i].subjects.push('');
    setAssignments(updated);
  };

  const removeSubject = (i, j) => {
    const updated = [...assignments];
    updated[i].subjects.splice(j, 1);
    setAssignments(updated);
  };

  const handleSave = async () => {
    if (status !== 'authenticated') return;

    const valid = assignments.every(a =>
      a.course && a.course.trim().length > 0 &&
      a.semester && !isNaN(Number(a.semester)) &&
      Number(a.semester) >= 1 && Number(a.semester) <= 12 &&
      Array.isArray(a.subjects) && a.subjects.length > 0 &&
      a.subjects.every(s => s && s.trim().length >= 2)
    );
    if (!valid) {
      showAlert('Please complete all fields and ensure subjects are at least 2 characters.', 'warning');
      return;
    }

    setSaving(true);
    const preparedSession = prepareSession(session);
    const success = await saveAssignmentsToApi(preparedSession, assignments);
    setSaving(false);

    if (success) showAlert('✅ Assignments saved successfully!', 'success');
    else showAlert('❌ Failed to save assignments.', 'error');
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="secondary" />
        <Typography mt={2}>Loading assignments...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" py={4}>
      <Typography variant="h4" textAlign="center" mb={4} fontWeight={700} color="primary">
        Assign Batch & Subjects
      </Typography>

      <Stack spacing={3}>
        {assignments.map((assignment, i) => (
          <AssignmentCard
            key={i}
            index={i}
            assignment={assignment}
            onChange={handleChange}
            onSubjectChange={handleSubjectChange}
            onAddSubject={addSubject}
            onRemoveSubject={removeSubject}
            onRemoveAssignment={removeAssignment}
          />
        ))}

        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="contained" color="primary" onClick={addAssignment} startIcon={<Add />}>
            Add Batch
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSave}
            startIcon={<Save />}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </Box>
      </Stack>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
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
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth label="Course" variant="outlined"
            value={assignment.course}
            onChange={(e) => onChange(index, 'course', e.target.value)}
          />
          <TextField
            fullWidth label="Section" variant="outlined"
            value={assignment.section}
            onChange={(e) => onChange(index, 'section', e.target.value)}
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth label="Semester" variant="outlined"
            value={assignment.semester}
            onChange={(e) => onChange(index, 'semester', e.target.value)}
          />
          <TextField
            fullWidth label="Room Number" variant="outlined"
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
                fullWidth label={`Subject ${j + 1}`} variant="outlined"
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
