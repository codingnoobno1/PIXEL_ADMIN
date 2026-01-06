"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
    Stack,
    Card,
    CardContent,
    IconButton,
    Chip,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Divider
} from '@mui/material';
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ArrowBack as BackIcon,
    DragIndicator as DragIcon
} from '@mui/icons-material';
import { QUESTION_TYPES } from '@/components/quiz/QuestionTypes';
import MCQQuestion from '@/components/quiz/MCQQuestion';
import FillupQuestion from '@/components/quiz/FillupQuestion';
import TrueFalseQuestion from '@/components/quiz/TrueFalseQuestion';

const COMPONENTS = {
    mcq: MCQQuestion,
    fillup: FillupQuestion,
    truefalse: TrueFalseQuestion,
};

const DEFAULT_QUESTION = {
    mcq: { text: '', options: ['', '', '', ''], correctAnswer: '', points: 1, difficulty: 'medium' },
    fillup: { text: '', correctAnswer: '', points: 1, difficulty: 'medium' },
    truefalse: { text: '', correctAnswer: true, points: 1, difficulty: 'medium' },
};

const PHASE_1_TYPES = QUESTION_TYPES.filter(qt =>
    ['mcq', 'fillup', 'truefalse'].includes(qt.value)
);

export default function EditQuizPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const quizId = params.id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState(60);
    const [questions, setQuestions] = useState([]);
    const [questionType, setQuestionType] = useState('mcq');
    const [questionData, setQuestionData] = useState(DEFAULT_QUESTION['mcq']);
    const [editingIndex, setEditingIndex] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin_login');
        } else if (status === 'authenticated' && quizId) {
            fetchQuiz();
        }
    }, [status, quizId, router]);

    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/quiz/${quizId}`);
            if (response.ok) {
                const data = await response.json();
                const quiz = data.quiz;

                setTitle(quiz.title);
                setDescription(quiz.description || '');
                setTimeLimit(quiz.timeLimit);
                setQuestions(quiz.questions || []);
            } else {
                setSnackbar({ open: true, message: 'Failed to load quiz', severity: 'error' });
                router.push('/quizmanagement');
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error loading quiz', severity: 'error' });
            router.push('/quizmanagement');
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setQuestionType(type);
        setQuestionData(DEFAULT_QUESTION[type]);
    };

    const handleAddQuestion = () => {
        if (!questionData.text || questionData.text.trim() === '') {
            setSnackbar({ open: true, message: 'Question text is required', severity: 'error' });
            return;
        }

        if (questions.length >= 10 && editingIndex === null) {
            setSnackbar({ open: true, message: 'Maximum 10 questions allowed', severity: 'error' });
            return;
        }

        const newQuestion = {
            type: questionType,
            ...questionData,
        };

        if (editingIndex !== null) {
            const updated = [...questions];
            updated[editingIndex] = newQuestion;
            setQuestions(updated);
            setEditingIndex(null);
            setSnackbar({ open: true, message: 'Question updated!', severity: 'success' });
        } else {
            setQuestions([...questions, newQuestion]);
            setSnackbar({ open: true, message: 'Question added!', severity: 'success' });
        }

        setQuestionData(DEFAULT_QUESTION[questionType]);
        setDialogOpen(false);
    };

    const handleEditQuestion = (index) => {
        const question = questions[index];
        setQuestionType(question.type);
        setQuestionData(question);
        setEditingIndex(index);
        setDialogOpen(true);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
        setSnackbar({ open: true, message: 'Question deleted', severity: 'info' });
    };

    const handleSaveQuiz = async () => {
        if (!title || !timeLimit) {
            setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
            return;
        }

        if (questions.length === 0) {
            setSnackbar({ open: true, message: 'Add at least one question', severity: 'error' });
            return;
        }

        if (questions.length > 10) {
            setSnackbar({ open: true, message: 'Maximum 10 questions allowed', severity: 'error' });
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`/api/quiz/${quizId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    timeLimit,
                    questions
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Quiz updated successfully!',
                    severity: 'success'
                });

                setTimeout(() => {
                    router.push('/quizmanagement');
                }, 2000);
            } else {
                setSnackbar({ open: true, message: data.error || 'Failed to update quiz', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Network error: ' + error.message, severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const QuestionComponent = COMPONENTS[questionType];
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    if (status === 'loading' || loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <LinearProgress sx={{ width: 300 }} />
            </Box>
        );
    }

    return (
        <Box
            minHeight="100vh"
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4,
                px: { xs: 2, md: 4 }
            }}
        >
            <Box maxWidth="1200px" margin="0 auto">
                {/* Header */}
                <Paper elevation={8} sx={{ p: 4, mb: 3, borderRadius: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <IconButton onClick={() => router.push('/quizmanagement')}>
                            <BackIcon />
                        </IconButton>
                        <Typography
                            variant="h3"
                            fontWeight={900}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Edit Quiz
                        </Typography>
                    </Stack>
                    <Typography variant="subtitle1" color="text.secondary">
                        Update quiz details and questions
                    </Typography>
                </Paper>

                {/* Quiz Metadata */}
                <Paper elevation={8} sx={{ p: 4, mb: 3, borderRadius: 4 }}>
                    <Typography variant="h5" fontWeight={700} mb={3} color="primary">
                        Quiz Information
                    </Typography>
                    <Stack spacing={3}>
                        <TextField
                            label="Quiz Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="Time Limit (min)"
                            type="number"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                        />
                    </Stack>
                </Paper>

                {/* Questions List */}
                <Paper elevation={8} sx={{ p: 4, mb: 3, borderRadius: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h5" fontWeight={700} color="primary">
                                Questions ({questions.length}/10)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Points: {totalPoints}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setDialogOpen(true)}
                            disabled={questions.length >= 10}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            Add Question
                        </Button>
                    </Stack>

                    {questions.length === 0 ? (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            No questions added yet. Click "Add Question" to get started!
                        </Alert>
                    ) : (
                        <Stack spacing={2}>
                            {questions.map((q, index) => (
                                <Card key={index} elevation={3} sx={{ borderRadius: 3, border: '2px solid', borderColor: 'divider' }}>
                                    <CardContent>
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <DragIcon sx={{ color: 'text.secondary', mt: 1 }} />
                                            <Box flex={1}>
                                                <Stack direction="row" spacing={1} mb={1}>
                                                    <Chip label={`Q${index + 1}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                                                    <Chip label={q.type.toUpperCase()} size="small" variant="outlined" />
                                                    <Chip label={`${q.points || 1} pts`} size="small" color="secondary" />
                                                    <Chip label={q.difficulty || 'medium'} size="small" sx={{ textTransform: 'capitalize' }} />
                                                </Stack>
                                                <Typography variant="body1" fontWeight={600}>{q.text}</Typography>
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton size="small" color="primary" onClick={() => handleEditQuestion(index)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteQuestion(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Paper>

                {/* Save Button */}
                <Paper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveQuiz}
                        disabled={saving}
                        fullWidth
                        sx={{
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Paper>
            </Box>

            {/* Add/Edit Question Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editingIndex !== null ? 'Edit Question' : 'Add New Question'}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 3 }}>
                    <Stack spacing={3}>
                        <TextField
                            select
                            label="Question Type"
                            value={questionType}
                            onChange={handleTypeChange}
                            fullWidth
                            disabled={editingIndex !== null}
                        >
                            {PHASE_1_TYPES.map((qt) => (
                                <MenuItem key={qt.value} value={qt.value}>{qt.label}</MenuItem>
                            ))}
                        </TextField>
                        <QuestionComponent question={questionData} setQuestion={setQuestionData} />
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddQuestion} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
                        {editingIndex !== null ? 'Update' : 'Add'} Question
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
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
