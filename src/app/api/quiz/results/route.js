import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import QuizResult from '@/models/QuizResult';
import User from '@/models/User';
import Quiz from '@/models/Quiz';

export async function GET() {
  await dbConnect();

  try {
    const quizResults = await QuizResult.find({})
      .populate({
        path: 'studentId',
        model: User,
        select: 'name email',
      })
      .populate({
        path: 'quizId',
        model: Quiz,
        select: 'title',
      })
      .lean();

    const formattedResults = quizResults.map(result => ({
      id: result._id,
      userName: result.studentId ? result.studentId.name : 'Unknown User',
      userEmail: result.studentId ? result.studentId.email : 'N/A',
      quizTitle: result.quizId ? result.quizId.title : 'Unknown Quiz',
      score: result.totalScore,
      totalTime: result.totalTime,
      endedAt: result.createdAt,
    }));

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json({ message: 'Failed to fetch quiz results', error: error.message }, { status: 500 });
  }
}
