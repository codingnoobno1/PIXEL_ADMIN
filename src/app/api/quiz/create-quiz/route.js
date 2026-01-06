import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const quizData = await request.json();

    const {
      title,
      subjectName,
      batch,
      semester,
      timeLimit,
      createdByEmail, // Assuming email is used to identify the creator
      questionIds,
    } = quizData;

    // Basic validation
    if (!title || !subjectName || !batch || !semester || !timeLimit || !createdByEmail || !questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ message: 'Missing or invalid quiz data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('QUIZ'); // Target the 'QUIZ' database

    // Look up Subject ID
    const subjectsCollection = db.collection('subjects');
    const subject = await subjectsCollection.findOne({ name: subjectName });
    if (!subject) {
      return NextResponse.json({ message: `Subject '${subjectName}' not found` }, { status: 404 });
    }

    // Look up CreatedBy (Faculty/User) ID
    // Assuming a 'faculties' collection or 'users' collection for creators
    const facultyCollection = db.collection('faculties'); // Or 'users' depending on your setup
    const createdBy = await facultyCollection.findOne({ email: createdByEmail });
    if (!createdBy) {
      return NextResponse.json({ message: `Creator with email '${createdByEmail}' not found` }, { status: 404 });
    }

    // Convert questionIds strings to ObjectId
    const objectQuestionIds = questionIds.map(id => new ObjectId(id));

    const quizzesCollection = db.collection('quizzes'); // Target the 'quizzes' collection

    const newQuiz = {
      title,
      subjectId: subject._id,
      batch,
      semester: parseInt(semester), // Ensure semester is stored as a number
      timeLimit: parseInt(timeLimit), // Ensure timeLimit is stored as a number
      createdBy: createdBy._id,
      questions: objectQuestionIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await quizzesCollection.insertOne(newQuiz);

    console.log('Quiz saved to MongoDB:', result.insertedId);

    return NextResponse.json({ message: 'Quiz created successfully', quizId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz in MongoDB:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
