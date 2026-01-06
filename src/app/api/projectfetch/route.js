import clientPromise from '@/lib/mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('your_database_name'); // REPLACE with your actual DB name
    const collection = db.collection('projects');

    const projects = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = projects.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      abstract: p.abstract,
      submittedBy: p.submittedBy,
      members: p.members || [],
      status: p.status || 'pending',
    }));

    return Response.json({ success: true, projects: formatted });
  } catch (error) {
    console.error('[PROJECT_FETCH_ERROR]', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch projects' }), {
      status: 500,
    });
  }
}
