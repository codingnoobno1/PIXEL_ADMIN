
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import FacultyCard from '@/models/FacultyCard';

export async function POST(req) {
  // Use dbConnect to ensure we're using the QUIZ database
  await dbConnect();
  const { session } = await req.json();

  const uuid = session?.user?.amiId;
  console.log('🟢 [batchfetch] uuid:', uuid, 'amiId:', session?.amiId, 'session.user.amiId:', session?.user?.amiId);
  if (!uuid) {
    return Response.json({ error: 'Unauthorized or incomplete session' }, { status: 401 });
  }

  try {
    const doc = await FacultyCard.findOne({ uuid });

    console.log('📊 [batchfetch] Found doc:', doc ? 'YES' : 'NO');
    console.log('📊 [batchfetch] classAssignments:', doc?.classAssignments);

    if (!doc || !Array.isArray(doc.classAssignments)) {
      console.log('⚠️ [batchfetch] No doc or no classAssignments, returning empty array');
      return Response.json([], { status: 200 });
    }


    const assignments = doc.classAssignments.map((a) => ({
      course: a.batch || '',
      semester: a.semester || '',
      section: a.section || '',
      roomNumber: a.roomNumber || '',
      subjects: Array.isArray(a.subjects) ? a.subjects.map((s) => s.name) : [],
    }));

    console.log('✅ [batchfetch] Returning assignments:', JSON.stringify(assignments, null, 2));
    return Response.json(assignments, { status: 200 });
  } catch (err) {
    console.error('❌ Mongo fetch error:', err);
    return Response.json({ error: 'Mongo error', detail: err.message }, { status: 500 });
  }
}
