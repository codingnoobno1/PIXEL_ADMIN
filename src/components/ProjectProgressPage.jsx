import { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid
} from '@mui/material';

const evaluationStages = [
  'Evaluation 1',
  'Evaluation 2',
  'Evaluation 3',
  'Final Marks',
];

const initialProjects = [
  {
    id: 1,
    name: 'Project Alpha',
    currentStep: 1,
    people: ['tushar', 'jaspreet', 'gaurav'],
    ratings: [0, 0, 0, 0], // now numerical values
  },
  {
    id: 2,
    name: 'Project Beta',
    currentStep: 3,
    people: ['shantanu', 'arnav'],
    ratings: [8, 7, 6, 45],
  },
];

export default function ProjectProgressPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const handleProjectChange = (event) => {
    setSelectedProjectIndex(event.target.value);
  };

  const handleRatingChange = (index, value) => {
    const updatedProjects = [...projects];
    const max = index < 3 ? 10 : 60;
    const val = Math.max(0, Math.min(Number(value), max)); // Clamp within range
    updatedProjects[selectedProjectIndex].ratings[index] = val;
    setProjects(updatedProjects);
  };

  const selectedProject = projects[selectedProjectIndex];
  const currentStep = selectedProject.currentStep;

  const totalMarks = selectedProject.ratings.reduce((acc, val) => acc + val, 0);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Project Progress Evaluation
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Project</InputLabel>
        <Select
          value={selectedProjectIndex}
          label="Select Project"
          onChange={handleProjectChange}
        >
          {projects.map((project, index) => (
            <MenuItem key={project.id} value={index}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stepper activeStep={currentStep} alternativeLabel>
        {evaluationStages.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6">Current Stage: {evaluationStages[currentStep]}</Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
          People involved: {selectedProject.people.join(', ')}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>Marks Evaluation:</Typography>
        <Grid container spacing={2}>
          {evaluationStages.map((stage, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TextField
                type="number"
                label={`${stage} (${index < 3 ? '0–10' : '0–60'})`}
                value={selectedProject.ratings[index]}
                onChange={(e) => handleRatingChange(index, e.target.value)}
                fullWidth
                inputProps={{ min: 0, max: index < 3 ? 10 : 60 }}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Total Score: <strong>{totalMarks} / 90</strong>
        </Typography>
      </Paper>
    </Box>
  );
}
