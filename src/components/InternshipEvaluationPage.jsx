'use client';

import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import { useState } from 'react';

export default function InternshipEvaluationPage() {
  // Skill factors state
  const [factors, setFactors] = useState({
    technicalSkills: '',
    communication: '',
    problemSolving: '',
    punctuality: '',
  });

  // Projects state
  const [miniProjectScore, setMiniProjectScore] = useState('');
  const [miniProjectLearningApplied, setMiniProjectLearningApplied] = useState('');
  
  const [majorProjectScore, setMajorProjectScore] = useState('');
  const [majorProjectLearningApplied, setMajorProjectLearningApplied] = useState('');

  const [remarks, setRemarks] = useState('');
  const [finalCgpa, setFinalCgpa] = useState(null);

  // Handle skill factor changes
  const handleFactorChange = (factor, value) => {
    const score = Math.min(Math.max(Number(value), 0), 10);
    setFactors((prev) => ({
      ...prev,
      [factor]: score,
    }));
  };

  // Validate project scores and learning application inputs (0-10 scale)
  const handleProjectScoreChange = (setter, value) => {
    const score = value === '' ? '' : Math.min(Math.max(Number(value), 0), 10);
    setter(score);
  };

  // Calculate final CGPA by combining skills + mini + major projects
  const calculateFinalCgpa = () => {
    // Convert skill factors to numbers
    const skillScores = Object.values(factors).map(Number);
    if (
      skillScores.some((score) => isNaN(score) || score === '') ||
      miniProjectScore === '' || miniProjectLearningApplied === '' ||
      majorProjectScore === '' || majorProjectLearningApplied === ''
    ) {
      setFinalCgpa(null);
      return;
    }

    // Average skill factors (out of 10)
    const avgSkills = skillScores.reduce((a, b) => a + b, 0) / skillScores.length;

    // Mini project combined score = (score + learning applied)/2
    const miniProjectCombined = (Number(miniProjectScore) + Number(miniProjectLearningApplied)) / 2;

    // Major project combined score = (score + learning applied)/2
    const majorProjectCombined = (Number(majorProjectScore) + Number(majorProjectLearningApplied)) / 2;

    // Weighting scheme (adjust weights if needed)
    // Example: Skills 40%, Mini 25%, Major 35%
    const finalScore = 
      avgSkills * 0.4 + 
      miniProjectCombined * 0.25 + 
      majorProjectCombined * 0.35;

    setFinalCgpa(finalScore.toFixed(2)); // 2 decimal places
  };

  const handleSubmit = () => {
    if (finalCgpa === null) {
      alert('Please calculate final CGPA before submitting!');
      return;
    }
    const evaluationData = {
      factors,
      miniProject: {
        score: miniProjectScore,
        learningApplied: miniProjectLearningApplied,
      },
      majorProject: {
        score: majorProjectScore,
        learningApplied: majorProjectLearningApplied,
      },
      finalCgpa,
      remarks,
    };
    // Replace with real submission logic/API
    console.log('Internship Evaluation Submitted:', evaluationData);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Internship Evaluation - Industrial Training Analyzer
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Skills Evaluation (Rate 0-10)
        </Typography>

        <Grid container spacing={2}>
          {Object.keys(factors).map((factor) => (
            <Grid item xs={12} sm={6} key={factor}>
              <TextField
                fullWidth
                label={factor
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                value={factors[factor]}
                type="number"
                inputProps={{ min: 0, max: 10 }}
                onChange={(e) => handleFactorChange(factor, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Mini Project Section */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Mini Project Evaluation (0-10)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mini Project Score"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={miniProjectScore}
                onChange={(e) => handleProjectScoreChange(setMiniProjectScore, e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Learning Applied in Mini Project"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={miniProjectLearningApplied}
                onChange={(e) => handleProjectScoreChange(setMiniProjectLearningApplied, e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Major Project Section */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Major End Project Evaluation (0-10)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Major Project Score"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={majorProjectScore}
                onChange={(e) => handleProjectScoreChange(setMajorProjectScore, e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Learning Applied in Major Project"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={majorProjectLearningApplied}
                onChange={(e) => handleProjectScoreChange(setMajorProjectLearningApplied, e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Button variant="outlined" onClick={calculateFinalCgpa}>
            Calculate Final CGPA
          </Button>
        </Box>

        {finalCgpa !== null && (
          <Typography variant="h6" mt={2}>
            Final CGPA (Skills + Projects): {finalCgpa} / 10
          </Typography>
        )}

        <TextField
          fullWidth
          label="Remarks / Feedback"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          multiline
          rows={4}
          sx={{ mt: 2 }}
        />

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Submit Evaluation
        </Button>
      </Paper>
    </Box>
  );
}
