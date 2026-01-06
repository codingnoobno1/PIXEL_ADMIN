import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongo';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const { batch, subject, quizType, questions } = await req.json();
    const facultyId = session.user?.facultyId || session.facultyId;
    if (!batch || !subject || !quizType || !questions || !facultyId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const db = (await clientPromise).db('quiz1');
    const result = await db.collection('quizzes').insertOne({
      batch,
      subject,
      quizType,
      questions,
      facultyId,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ success: true, quizId: result.insertedId }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
