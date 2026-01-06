import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import Subject from '@/models/Subject';
import User from '@/models/User'; // Import User model to register schema

export async function POST(req) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user is faculty/admin
        const userRoles = session.user?.roles || [];
        const isFaculty = userRoles.some(role =>
            ['faculty', 'admin', 'quiz_controller', 'project_mentor'].includes(role)
        );

        if (!isFaculty) {
            return NextResponse.json(
                { error: 'Only faculty members can create quizzes' },
                { status: 403 }
            );
        }

        await dbConnect();

        const { title, description, subjectName, sectionId, batch, semester, timeLimit, questions, status, availabilityStatus } = await req.json();

        // Validation
        if (!title || !subjectName || !batch || !semester || !timeLimit) {
            return NextResponse.json(
                { error: 'Missing required fields: title, subjectName, batch, semester, timeLimit' },
                { status: 400 }
            );
        }

        if (!questions || questions.length === 0) {
            return NextResponse.json(
                { error: 'Quiz must have at least one question' },
                { status: 400 }
            );
        }

        if (questions.length > 10) {
            return NextResponse.json(
                { error: 'Quiz cannot have more than 10 questions' },
                { status: 400 }
            );
        }

        if (timeLimit <= 0) {
            return NextResponse.json(
                { error: 'Time limit must be greater than 0' },
                { status: 400 }
            );
        }

        // Find or create Subject
        let subject = await Subject.findOne({ name: subjectName });
        if (!subject) {
            subject = await Subject.create({ name: subjectName });
        }
        const subjectId = subject._id; // Use the ID of the found or created subject

        // Check quiz limit per subject (max 5 quizzes per subject)
        const existingQuizCount = await Quiz.countDocuments({
            subjectId,
            batch,
            semester,
            status: { $ne: 'archived' } // Don't count archived quizzes
        });

        if (existingQuizCount >= 5) {
            return NextResponse.json(
                {
                    error: 'Maximum 5 quizzes per subject reached',
                    details: `You already have ${existingQuizCount} quizzes for ${subjectName} in ${batch} Semester ${semester}`
                },
                { status: 400 }
            );
        }

        // Create questions first
        const createdQuestions = await Question.insertMany(
            questions.map(q => ({
                ...q,
                subjectId, // Use the obtained subjectId
                createdBy: session.user.id
            }))
        );

        const questionIds = createdQuestions.map(q => q._id);
        const totalPoints = createdQuestions.reduce((sum, q) => sum + (q.points || 1), 0);

        // Create quiz
        const quiz = await Quiz.create({
            title,
            description,
            subjectId, // Use the obtained subjectId
            sectionId,
            batch,
            semester,
            timeLimit,
            maxMarks: totalPoints,
            questions: questionIds,
            createdBy: session.user.id,
            status: status || 'draft',
            availabilityStatus: availabilityStatus || 'off'
        });

        // Populate and return
        const populatedQuiz = await Quiz.findById(quiz._id)
            .populate('subjectId', 'name')
            .populate('questions')
            .populate('createdBy', 'name email');

        return NextResponse.json({
            success: true,
            quiz: populatedQuiz
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating quiz:', error);
        return NextResponse.json(
            { error: 'Failed to create quiz', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const batch = searchParams.get('batch');
        const semester = searchParams.get('semester');
        const subjectId = searchParams.get('subjectId');
        const status = searchParams.get('status');

        const query = {};
        if (batch) query.batch = batch;
        if (semester) query.semester = semester;
        if (subjectId) query.subjectId = subjectId;
        if (status) query.status = status;

        // Faculty can see all quizzes, students only see published
        const userRoles = session.user?.roles || [];
        const isFaculty = userRoles.some(role =>
            ['faculty', 'admin', 'quiz_controller'].includes(role)
        );

        if (!isFaculty) {
            query.status = 'published';
        }

        const quizzes = await Quiz.find(query)
            .populate('subjectId', 'name')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ quizzes }, { status: 200 });

    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quizzes', details: error.message },
            { status: 500 }
        );
    }
}
