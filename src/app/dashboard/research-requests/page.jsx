'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Chip, Button, TextField,
    MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, CircularProgress
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';

export default function ResearchRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        if (filterStatus === 'all') {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(requests.filter(r => r.status === filterStatus));
        }
    }, [filterStatus, requests]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/research-requests');

            if (!response.ok) throw new Error('Failed to fetch requests');

            const data = await response.json();
            setRequests(data.requests || []);
            setFilteredRequests(data.requests || []);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setDetailsOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'warning';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0a0a0a' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, bgcolor: '#0a0a0a', minHeight: '100vh' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', py: 4, px: 2 }}>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 1600, mx: 'auto', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography variant="h4" fontWeight={700} mb={3} sx={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Research Requests Dashboard
                </Typography>

                {/* Filter */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        select
                        label="Filter by Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="all">All Requests</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </TextField>
                    <Typography variant="body2" color="text.secondary">
                        Showing {filteredRequests.length} of {requests.length} requests
                    </Typography>
                </Box>

                {/* Requests Table */}
                {filteredRequests.length === 0 ? (
                    <Alert severity="info">No research requests found.</Alert>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                    <TableCell sx={{ color: '#a78bfa', fontWeight: 700 }}>Student</TableCell>
                                    <TableCell sx={{ color: '#a78bfa', fontWeight: 700 }}>Faculty</TableCell>
                                    <TableCell sx={{ color: '#a78bfa', fontWeight: 700 }}>Research Area</TableCell>
                                    <TableCell sx={{ color: '#a78bfa', fontWeight: 700 }}>Status</TableCell>
                                    <TableCell sx={{ color: '#a78bfa', fontWeight: 700 }}>Submitted</TableCell>
                                    <TableCell sx={{ color: '#a78bfa', fontWeight: 700 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.map((request) => (
                                    <TableRow
                                        key={request._id}
                                        sx={{
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <TableCell sx={{ color: 'white' }}>
                                            <Typography variant="body2" fontWeight={600}>{request.studentName}</Typography>
                                            {request.studentEmail && (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    {request.studentEmail}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            {request.facultyName}
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            {request.researchArea}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.status.toUpperCase()}
                                                color={getStatusColor(request.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                startIcon={<Visibility />}
                                                onClick={() => handleViewDetails(request)}
                                                sx={{ color: '#00FFFF' }}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white' }}>
                    Research Request Details
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#0f172a', color: 'white', mt: 2 }}>
                    {selectedRequest && (
                        <Box>
                            <Typography variant="h6" sx={{ color: '#00FFFF', mb: 2 }}>Student Information</Typography>
                            <Typography><strong>Name:</strong> {selectedRequest.studentName}</Typography>
                            <Typography><strong>Email:</strong> {selectedRequest.studentEmail || 'N/A'}</Typography>
                            <Typography><strong>Enrollment:</strong> {selectedRequest.studentEnrollment || 'N/A'}</Typography>

                            <Typography variant="h6" sx={{ color: '#00FFFF', mt: 3, mb: 2 }}>Research Details</Typography>
                            <Typography><strong>Faculty:</strong> {selectedRequest.facultyName}</Typography>
                            <Typography><strong>Area:</strong> {selectedRequest.researchArea}</Typography>
                            {selectedRequest.proposedTopic && (
                                <Typography><strong>Topic:</strong> {selectedRequest.proposedTopic}</Typography>
                            )}

                            <Typography variant="h6" sx={{ color: '#00FFFF', mt: 3, mb: 1 }}>Motivation</Typography>
                            <Typography sx={{ whiteSpace: 'pre-wrap', bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 1 }}>
                                {selectedRequest.motivation}
                            </Typography>

                            {selectedRequest.skills && selectedRequest.skills.length > 0 && (
                                <>
                                    <Typography variant="h6" sx={{ color: '#00FFFF', mt: 3, mb: 1 }}>Skills</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {selectedRequest.skills.map((skill, idx) => (
                                            <Chip key={idx} label={skill} size="small" sx={{ bgcolor: 'rgba(0,255,255,0.2)', color: '#00FFFF' }} />
                                        ))}
                                    </Box>
                                </>
                            )}

                            {selectedRequest.previousWork && (
                                <>
                                    <Typography variant="h6" sx={{ color: '#00FFFF', mt: 3, mb: 1 }}>Previous Work</Typography>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{selectedRequest.previousWork}</Typography>
                                </>
                            )}

                            <Typography variant="h6" sx={{ color: '#00FFFF', mt: 3, mb: 1 }}>Status</Typography>
                            <Chip label={selectedRequest.status.toUpperCase()} color={getStatusColor(selectedRequest.status)} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#0f172a', p: 2 }}>
                    <Button onClick={() => setDetailsOpen(false)} sx={{ color: 'white' }}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
