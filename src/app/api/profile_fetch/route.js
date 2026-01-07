// profile_fetch/route.js
import Faculty from '@/models/Faculty';
import dbConnect from '@/lib/dbConnect'; // your mongoose connection helper
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    // Assuming you pass a query param like ?amizone_id=123 or ?email=abc@xyz.com
    const amizone_id = url.searchParams.get('amizone_id');
    const email = url.searchParams.get('email');

    if (!amizone_id && !email) {
      return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
    }

    const query = amizone_id ? { amizone_id } : { amity_email: email.toLowerCase() };
    const faculty = await Faculty.findOne(query)
      .populate({
        path: 'subjectsTaught.subjectId',
        select: 'name code',
      })
      .populate({
        path: 'subjectsTaught.sections',
        select: 'name',
      })
      .populate({
        path: 'quizzesCreated.quizId',
        select: 'title',
      })
      .populate({
        path: 'quizzesCreated.subjectId',
        select: 'name',
      })
      .populate({
        path: 'quizzesCreated.sectionId',
        select: 'name',
      })
      .lean();

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }

    // Format response data to be easier for frontend
    const subjectsTaughtFormatted = faculty.subjectsTaught.map(({ subjectId, sections }) => ({
      subject: subjectId?.name || 'Unknown',
      sections: sections.map(s => s.name),
    }));

    // Map classAssignments for frontend: array of { batch: sectionName, subjects: [subjectName] }
    // We can reconstruct this from subjectsTaught: each subject with its sections
    // But for now, let's just send raw data and frontend will handle mapping.

    return NextResponse.json({
      id: faculty._id,
      name: faculty.name,
      role: faculty.role,
      email: faculty.amity_email,
      amizone_id: faculty.amizone_id,
      subjectsTaught: faculty.subjectsTaught,
      quizzesCreated: faculty.quizzesCreated,
      leaderboardVisible: faculty.leaderboardVisible,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
