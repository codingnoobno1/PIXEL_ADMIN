"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    Card,
    CardContent,
    Chip,
    IconButton,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    LinearProgress,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreIcon,
    Schedule as ScheduleIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon
} from '@mui/icons-material';

export default function QuizManagementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, quizId: null });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin_login');
        } else if (status === 'authenticated') {
            fetchQuizzes();
        }
    }, [status, router]);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/quiz');
            if (response.ok) {
                const data = await response.json();
                setQuizzes(data.quizzes || []);
            } else {
                setSnackbar({ open: true, message: 'Failed to load quizzes', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error loading quizzes', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (quizId, currentStatus) => {
        const newStatus = currentStatus === 'on' ? 'off' : 'on';

        try {
            const response = await fetch(`/api/quiz/${quizId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availabilityStatus: newStatus }),
            });

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: `Quiz ${newStatus === 'on' ? 'enabled' : 'disabled'}`,
                    severity: 'success'
                });
                fetchQuizzes();
            } else {
                setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error updating status', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/quiz/${deleteDialog.quizId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSnackbar({ open: true, message: 'Quiz deleted successfully', severity: 'success' });
                fetchQuizzes();
            } else {
                const data = await response.json();
                setSnackbar({ open: true, message: data.error || 'Failed to delete quiz', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error deleting quiz', severity: 'error' });
        } finally {
            setDeleteDialog({ open: false, quizId: null });
        }
    };

    const getStatusColor = (availabilityStatus) => {
        switch (availabilityStatus) {
            case 'on': return 'success';
            case 'off': return 'error';
            case 'scheduled': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (availabilityStatus) => {
        switch (availabilityStatus) {
            case 'on': return <ActiveIcon fontSize="small" />;
            case 'off': return <InactiveIcon fontSize="small" />;
            case 'scheduled': return <ScheduleIcon fontSize="small" />;
            default: return null;
        }
    };

    if (status === 'loading' || loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <LinearProgress sx={{ width: 300 }} />
            </Box>
        );
    }

    // Group quizzes by subject
    const quizzesBySubject = quizzes.reduce((acc, quiz) => {
        const subjectName = quiz.subjectId?.name || 'Unknown';
        if (!acc[subjectName]) acc[subjectName] = [];
        acc[subjectName].push(quiz);
        return acc;
    }, {});

    return (
        <Box
            minHeight="100vh"
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4,
                px: { xs: 2, md: 4 }
            }}
        >
            <Box maxWidth="1400px" margin="0 auto">
                {/* Header */}
                <Paper elevation={8} sx={{ p: 4, mb: 3, borderRadius: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight={900}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Quiz Management
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Manage your quizzes - {quizzes.length} total
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/createquiz')}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            Create New Quiz
                        </Button>
                    </Stack>
                </Paper>

                {/* Quizzes by Subject */}
                {Object.keys(quizzesBySubject).length === 0 ? (
                    <Paper elevation={8} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" mb={2}>
                            No quizzes created yet
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/createquiz')}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            Create Your First Quiz
                        </Button>
                    </Paper>
                ) : (
                    Object.entries(quizzesBySubject).map(([subject, subjectQuizzes]) => (
                        <Paper key={subject} elevation={8} sx={{ p: 4, mb: 3, borderRadius: 4 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h5" fontWeight={700} color="primary">
                                    {subject}
                                </Typography>
                                <Chip
                                    label={`${subjectQuizzes.length}/5 quizzes`}
                                    color={subjectQuizzes.length >= 5 ? 'error' : 'primary'}
                                    sx={{ fontWeight: 700 }}
                                />
                            </Stack>

                            <Stack spacing={2}>
                                {subjectQuizzes.map((quiz) => (
                                    <Card
                                        key={quiz._id}
                                        elevation={3}
                                        sx={{
                                            borderRadius: 3,
                                            border: '2px solid',
                                            borderColor: quiz.availabilityStatus === 'on' ? 'success.main' : 'divider',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                <Box flex={1}>
                                                    <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                                                        <Chip
                                                            icon={getStatusIcon(quiz.availabilityStatus || 'off')}
                                                            label={(quiz.availabilityStatus || 'off').toUpperCase()}
                                                            color={getStatusColor(quiz.availabilityStatus || 'off')}
                                                            size="small"
                                                            sx={{ fontWeight: 700 }}
                                                        />
                                                        <Chip
                                                            label={quiz.status}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ textTransform: 'capitalize' }}
                                                        />
                                                        <Chip
                                                            label={`${quiz.questions?.length || 0}/10 questions`}
                                                            size="small"
                                                            color="secondary"
                                                        />
                                                        <Chip
                                                            label={`${quiz.timeLimit} min`}
                                                            size="small"
                                                        />
                                                    </Stack>
                                                    <Typography variant="h6" fontWeight={600} mb={1}>
                                                        {quiz.title}
                                                    </Typography>
                                                    {quiz.description && (
                                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                                            {quiz.description}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="caption" color="text.secondary">
                                                        {typeof quiz.batch === 'object' ? quiz.batch?.course : quiz.batch} • Semester {typeof quiz.semester === 'object' ? quiz.semester?.number : quiz.semester} • {quiz.maxMarks} marks
                                                    </Typography>
                                                </Box>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={(quiz.availabilityStatus || 'off') === 'on'}
                                                                onChange={() => handleStatusToggle(quiz._id, quiz.availabilityStatus || 'off')}
                                                                color="success"
                                                            />
                                                        }
                                                        label={(quiz.availabilityStatus || 'off') === 'on' ? 'ON' : 'OFF'}
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => router.push(`/editquiz/${quiz._id}`)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => setDeleteDialog({ open: true, quizId: quiz._id })}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Paper>
                    ))
                )}
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, quizId: null })}
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete Quiz?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this quiz? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteDialog({ open: false, quizId: null })}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
