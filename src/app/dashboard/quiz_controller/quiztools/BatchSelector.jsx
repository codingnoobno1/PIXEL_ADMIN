import React from 'react';
import { TextField, MenuItem, Typography, Box } from '@mui/material';

export default function BatchSelector({ assignments, selectedBatchIdx, setSelectedBatchIdx }) {
  return (
    <Box mb={4} width="100%">
      <Typography
        variant="h6"
        mb={1}
        fontWeight={700}
        sx={{ color: '#2874A6', letterSpacing: 1 }}
      >
        Assigned Batch
      </Typography>
      <TextField
        select
        fullWidth
        label="Select Batch"
        value={selectedBatchIdx}
        onChange={e => setSelectedBatchIdx(e.target.value)}
        variant="filled"
        SelectProps={{
          native: false,
          MenuProps: {
            PaperProps: {
              sx: {
                bgcolor: '#fff',
                color: '#154360',
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
          color: '#154360',
          boxShadow: 2,
          mb: 0,
        }}
      >
        {assignments.map((a, idx) => (
          <MenuItem
            key={idx}
            value={idx}
            sx={{
              background: selectedBatchIdx === String(idx) ? '#F9E79F' : '#fff',
              color: '#154360',
              fontWeight: 700,
              mb: 1,
              borderRadius: 2,
              '&:hover': { background: '#FCF3CF' },
              transition: 'background 0.2s',
            }}
          >
            {`${a.batch || a.course} | Sem: ${a.semester} | Sec: ${a.section} | Room: ${a.roomNumber}`}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
