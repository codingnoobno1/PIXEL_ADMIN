
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongo';
import Subject from '@/models/Subject';
import Faculty from '@/models/Faculty';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: "quizraiderx",
      });
    }

    const questionData = await request.json();

    if (!questionData) {
      return NextResponse.json({ message: 'No question data provided' }, { status: 400 });
    }

    const requiredFields = ['type', 'text', 'batch', 'subject', 'semester', 'quizCategory'];
    const missingFields = requiredFields.filter(field => !questionData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ message: 'Missing required fields', missing: missingFields }, { status: 400 });
    }

    const subjectDoc = await Subject.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${questionData.subject.trim()}$`, 'i') } },
      { $setOnInsert: { name: questionData.subject.trim() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const facultyDoc = await Faculty.findOneAndUpdate(
      { amizone_id: session.user.amiId },
      {
        $setOnInsert: {
          name: session.user.name,
          role: session.user.roles[0] || 'quiz_controllers',
          amity_email: session.user.email,
          amizone_id: session.user.amiId,
          password_hash: await bcrypt.hash(Math.random().toString(36).substring(7), 10),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const client = await clientPromise;
    const db = client.db('QUIZ');
    const questionsCollection = db.collection('quizzes');

    const quizDocument = {
      text: questionData.text,
      options: questionData.options,
      answer: questionData.answer,
      type: questionData.type,
      quizCategory: questionData.quizCategory,
      subjectId: subjectDoc._id,
      batch: questionData.batch,
      semester: parseInt(questionData.semester),
      createdBy: facultyDoc._id,
      createdAt: new Date(),
    };

    const result = await questionsCollection.insertOne(quizDocument);

    console.log('Quiz saved to MongoDB:', result.insertedId);

    return NextResponse.json({ message: 'Quiz saved successfully', quizId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error saving quiz to MongoDB:', error);
    return NextResponse.json({ message: 'Internal Server Error', detail: error.message }, { status: 500 });
  }
}
