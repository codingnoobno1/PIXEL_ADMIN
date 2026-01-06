"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Publish as PublishIcon,
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

// Phase 1: Only MCQ, Fillup, TrueFalse
const PHASE_1_TYPES = QUESTION_TYPES.filter(qt =>
    ['mcq', 'fillup', 'truefalse'].includes(qt.value)
);

export default function CreateQuizPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Quiz metadata
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [batch, setBatch] = useState('');
    const [semester, setSemester] = useState('');
    const [timeLimit, setTimeLimit] = useState(60);
    const [availabilityStatus, setAvailabilityStatus] = useState('off');

    // Question management
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionType, setQuestionType] = useState('mcq');
    const [questionData, setQuestionData] = useState(DEFAULT_QUESTION['mcq']);
    const [editingIndex, setEditingIndex] = useState(null);

    // UI state
    const [subjects, setSubjects] = useState([]);
    const [batches, setBatches] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogOpen, setDialogOpen] = useState(false);

    // Fetch faculty assignments and extract subjects, batches, semesters
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!session) return;

            setFetchingData(true);
            try {
                const response = await fetch('/api/batchfetch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('📥 [createquiz] Received data from batchfetch:', data);
                    setAssignments(data);

                    // Extract unique batches
                    const uniqueBatches = [...new Set(data.map(a => a.course))].filter(Boolean);
                    console.log('📦 [createquiz] Unique batches:', uniqueBatches);
                    setBatches(uniqueBatches);

                    // Extract unique semesters
                    const uniqueSemesters = [...new Set(data.map(a => a.semester))].filter(Boolean);
                    console.log('📚 [createquiz] Unique semesters:', uniqueSemesters);
                    setSemesters(uniqueSemesters.sort((a, b) => a - b));

                    // Extract all subjects from all assignments
                    const allSubjects = data.flatMap(a => a.subjects || []);
                    console.log('📖 [createquiz] All subjects:', allSubjects);
                    const uniqueSubjects = Array.from(
                        new Map(allSubjects.map(s => [s, s])).values()
                    );
                    console.log('✅ [createquiz] Unique subjects:', uniqueSubjects);
                    setSubjects(uniqueSubjects);
                } else {
                    console.error('Failed to fetch assignments');
                    setSnackbar({
                        open: true,
                        message: 'Failed to load your assignments',
                        severity: 'error'
                    });
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setSnackbar({
                    open: true,
                    message: 'Error loading assignments',
                    severity: 'error'
                });
            } finally {
                setFetchingData(false);
            }
        };

        fetchAssignments();
    }, [session]);

    // Check authentication
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin_login');
        }
    }, [status, router]);

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

        // Reset form
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

    const handleSaveQuiz = async (publishNow = false) => {
        // Validation
        if (!title || !subject || !batch || !semester || !timeLimit) {
            setSnackbar({ open: true, message: 'Please fill all quiz metadata', severity: 'error' });
            return;
        }

        if (questions.length === 0) {
            setSnackbar({ open: true, message: 'Add at least one question', severity: 'error' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    subjectName: subject, // Send subject name instead of ID
                    batch,
                    semester,
                    timeLimit,
                    questions,
                    status: publishNow ? 'published' : 'draft',
                    availabilityStatus: availabilityStatus // Use selected status
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: `Quiz ${publishNow ? 'published' : 'saved as draft'} successfully!`,
                    severity: 'success'
                });

                // Reset form
                setTimeout(() => {
                    router.push('/quizmanagement');
                }, 2000);
            } else {
                setSnackbar({ open: true, message: data.error || 'Failed to save quiz', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Network error: ' + error.message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const QuestionComponent = COMPONENTS[questionType];
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    if (status === 'loading' || fetchingData) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
                <LinearProgress sx={{ width: 300 }} />
                <Typography variant="body2" color="text.secondary">
                    {status === 'loading' ? 'Loading session...' : 'Loading your assignments...'}
                </Typography>
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
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        mb: 3,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    }}
                >
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
                        Create Quiz
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Build engaging quizzes for your students
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
                            variant="outlined"
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                        />
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                select
                                label="Batch"
                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                                fullWidth
                                required
                                disabled={fetchingData || batches.length === 0}
                            >
                                {batches.map((b) => (
                                    <MenuItem key={b} value={b}>
                                        {b}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Semester"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                fullWidth
                                required
                                disabled={fetchingData || semesters.length === 0}
                            >
                                {semesters.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        Semester {s}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                fullWidth
                                required
                                disabled={fetchingData || subjects.length === 0}
                            >
                                {subjects.map((subj, index) => (
                                    <MenuItem key={index} value={subj}>
                                        {subj}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Time Limit (min)"
                                type="number"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(Number(e.target.value))}
                                fullWidth
                                required
                                inputProps={{ min: 1 }}
                            />

                            <TextField
                                select
                                label="Availability Status"
                                value={availabilityStatus}
                                onChange={(e) => setAvailabilityStatus(e.target.value)}
                                fullWidth
                                variant="outlined"
                            >
                                <MenuItem value="off">Off (Draft)</MenuItem>
                                <MenuItem value="on">On (Active)</MenuItem>
                                <MenuItem value="scheduled">Scheduled</MenuItem>
                            </TextField>
                        </Stack>
                    </Stack>
                </Paper>

                {/* Questions List */}
                <Paper elevation={8} sx={{ p: 4, mb: 3, borderRadius: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h5" fontWeight={700} color="primary">
                                Questions ({questions.length})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Points: {totalPoints}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setDialogOpen(true)}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                }
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
                                <Card
                                    key={index}
                                    elevation={3}
                                    sx={{
                                        borderRadius: 3,
                                        border: '2px solid',
                                        borderColor: 'divider',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            transform: 'translateY(-2px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <DragIcon sx={{ color: 'text.secondary', mt: 1 }} />
                                            <Box flex={1}>
                                                <Stack direction="row" spacing={1} mb={1}>
                                                    <Chip
                                                        label={`Q${index + 1}`}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                    <Chip
                                                        label={q.type.toUpperCase()}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={`${q.points || 1} pts`}
                                                        size="small"
                                                        color="secondary"
                                                    />
                                                    <Chip
                                                        label={q.difficulty || 'medium'}
                                                        size="small"
                                                        sx={{ textTransform: 'capitalize' }}
                                                    />
                                                </Stack>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {q.text}
                                                </Typography>
                                                {q.type === 'mcq' && q.options && (
                                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                                        {q.options.length} options
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditQuestion(index)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteQuestion(index)}
                                                >
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

                {/* Save Buttons */}
                <Paper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<SaveIcon />}
                            onClick={() => handleSaveQuiz(false)}
                            disabled={loading}
                            fullWidth
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                fontWeight: 700,
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            Save as Draft
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PublishIcon />}
                            onClick={() => handleSaveQuiz(true)}
                            disabled={loading}
                            fullWidth
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                }
                            }}
                        >
                            Publish Quiz
                        </Button>
                    </Stack>
                </Paper>
            </Box>

            {/* Add/Edit Question Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingIndex(null);
                    setQuestionData(DEFAULT_QUESTION[questionType]);
                }}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 4 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
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
                                <MenuItem key={qt.value} value={qt.value}>
                                    {qt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <QuestionComponent question={questionData} setQuestion={setQuestionData} />
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => {
                            setDialogOpen(false);
                            setEditingIndex(null);
                            setQuestionData(DEFAULT_QUESTION[questionType]);
                        }}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddQuestion}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
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
