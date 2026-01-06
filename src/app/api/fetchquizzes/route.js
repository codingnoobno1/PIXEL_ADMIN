import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';
import Subject from '@/models/Subject';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const batch = searchParams.get('batch');
    const subjectName = searchParams.get('subject');

    if (!batch || !subjectName) {
      return NextResponse.json({ message: 'Missing batch or subject query parameter' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('QUIZ');

    const subject = await db.collection('subjects').findOne({ name: { $regex: new RegExp(`^${subjectName}$`, 'i') } });

    if (!subject) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
    }

    const quizzes = await db.collection('quizzes').find({
      batch: batch,
      subjectId: subject._id
    }).toArray();

    return NextResponse.json(quizzes, { status: 200 });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Internal Server Error', detail: error.message }, { status: 500 });
  }
}
