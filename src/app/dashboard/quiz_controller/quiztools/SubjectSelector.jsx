import React from 'react';
import { TextField, MenuItem, Typography, Box } from '@mui/material';

export default function SubjectSelector({ subjects, selectedSubject, setSelectedSubject }) {
  return (
    <Box mb={4} width="100%">
      <Typography
        variant="h6"
        mb={1}
        fontWeight={700}
        sx={{ color: '#CA6F1E', letterSpacing: 1 }}
      >
        Subjects
      </Typography>
      <TextField
        select
        fullWidth
        label="Select Subject"
        value={selectedSubject}
        onChange={e => setSelectedSubject(e.target.value)}
        variant="filled"
        disabled={subjects.length === 0}
        SelectProps={{
          native: false,
          MenuProps: {
            PaperProps: {
              sx: {
                bgcolor: '#fff',
                color: '#873600',
                borderRadius: 2,
                mt: 1,
                boxShadow: 4,
                maxHeight: 300,
              },
            },
            MenuListProps: {
              sx: { py: 1 }
            }
          },
        }}
        sx={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 2,
          fontWeight: 600,
          color: '#873600',
          boxShadow: 2,
          mb: 0,
        }}
      >
        {subjects.map((subj, idx) => (
          <MenuItem
            key={idx}
            value={subj}
            sx={{
              background: selectedSubject === subj ? '#FAD7A0' : '#fff',
              color: '#873600',
              fontWeight: 700,
              mb: 1,
              borderRadius: 2,
              '&:hover': { background: '#FDEBD0' },
              transition: 'background 0.2s',
            }}
          >
            {subj}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
