import { Paper, Typography } from '@mui/material';

export default function AcceptedProjects() {
  return (
    <Paper elevation={6} sx={{ p: 3, bgcolor: 'rgba(25, 118, 210, 0.1)', borderRadius: '12px' }}>
      <Typography sx={{ mb: 2, color: '#0D47A1' }}>
        This section will list all <strong>Accepted Projects</strong>.
      </Typography>
      <Typography sx={{ fontStyle: 'italic', color: '#1976D2' }}>
        No projects accepted yet.
      </Typography>
    </Paper>
  );
}
