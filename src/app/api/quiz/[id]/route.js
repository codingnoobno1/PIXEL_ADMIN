import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';
import User from '@/models/User'; // Import User model to register schema

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Await params in Next.js 15
        const { id } = await params;

        const quiz = await Quiz.findById(id)
            .populate('subjectId', 'name')
            .populate('sectionId')
            .populate('createdBy', 'name email')
            .populate('questions');

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // Students shouldn't see answers
        const userRoles = session.user?.roles || [];
        const isFaculty = userRoles.some(role =>
            ['faculty', 'admin', 'quiz_controller'].includes(role)
        );

        if (!isFaculty) {
            // Remove correct answers and test case outputs for students
            quiz.questions = quiz.questions.map(q => {
                const question = q.toObject();
                delete question.correctAnswer;
                if (question.testCases) {
                    question.testCases = question.testCases.map(tc => ({
                        input: tc.input
                        // output removed
                    }));
                }
                return question;
            });
        }

        return NextResponse.json({ quiz }, { status: 200 });

    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRoles = session.user?.roles || [];
        const isFaculty = userRoles.some(role =>
            ['faculty', 'admin', 'quiz_controller'].includes(role)
        );

        if (!isFaculty) {
            return NextResponse.json(
                { error: 'Only faculty members can update quizzes' },
                { status: 403 }
            );
        }

        await dbConnect();

        // Await params in Next.js 15
        const { id } = await params;

        const body = await req.json();
        const updates = {};

        // Only update allowed fields
        if (body.title !== undefined) updates.title = body.title;
        if (body.description !== undefined) updates.description = body.description;
        if (body.timeLimit !== undefined) updates.timeLimit = body.timeLimit;
        if (body.questions !== undefined) updates.questions = body.questions;
        if (body.status !== undefined) updates.status = body.status;
        if (body.availabilityStatus !== undefined) updates.availabilityStatus = body.availabilityStatus;
        if (body.scheduledStartTime !== undefined) updates.scheduledStartTime = body.scheduledStartTime;
        if (body.scheduledEndTime !== undefined) updates.scheduledEndTime = body.scheduledEndTime;

        const quiz = await Quiz.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('subjectId', 'name')
            .populate('questions')
            .populate('createdBy', 'name email');

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, quiz }, { status: 200 });

    } catch (error) {
        console.error('Error updating quiz:', error);
        return NextResponse.json(
            { error: 'Failed to update quiz', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only admins can delete quizzes
        const userRoles = session.user?.roles || [];
        if (!userRoles.includes('admin')) {
            return NextResponse.json(
                { error: 'Only admins can delete quizzes' },
                { status: 403 }
            );
        }

        await dbConnect();

        // Await params in Next.js 15
        const { id } = await params;

        const quiz = await Quiz.findByIdAndDelete(id);

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Quiz deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting quiz:', error);
        return NextResponse.json(
            { error: 'Failed to delete quiz', details: error.message },
            { status: 500 }
        );
    }
}
