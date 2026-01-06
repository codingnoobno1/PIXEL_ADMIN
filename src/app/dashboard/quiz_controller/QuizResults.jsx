'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSession } from 'next-auth/react';

export default function QuizResults() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch quiz results from an API endpoint
      const fetchQuizResults = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch('/api/quiz/results'); // This endpoint needs to be created
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setResults(data);
        } catch (e) {
          console.error("Failed to fetch quiz results:", e);
          setError("Failed to load quiz results.");
        } finally {
          setLoading(false);
        }
      };
      fetchQuizResults();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setError("Please log in to view quiz results.");
    }
  }, [status]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading quiz results...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">No quiz results found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quiz Results
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="quiz results table">
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Quiz Title</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell>Date Taken</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow
                key={result.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {result.userName || 'N/A'}
                </TableCell>
                <TableCell>{result.quizTitle || 'N/A'}</TableCell>
                <TableCell align="right">{result.score}</TableCell>
                <TableCell>{new Date(result.endedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
