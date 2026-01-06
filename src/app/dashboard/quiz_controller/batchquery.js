export function createEmptyAssignment() {
  return {
    course: '',
    semester: '',
    section: '',
    roomNumber: '',
    subjects: [],
  };
}

export async function fetchAssignmentsFromApi(session) {
  try {
    // If session is missing or invalid, do not attempt fetch
    if (!session || !session.user || !session.user.amiId) {
      return [createEmptyAssignment()];
    }

    const res = await fetch('/api/batchfetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session, assignments: [] }),
    });

    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return [createEmptyAssignment()];
    }

    return data.map((a) => ({
      course: a.course || '',
      semester: a.semester || '',
      section: a.section || '',
      roomNumber: a.roomNumber || '',
      subjects: Array.isArray(a.subjects) ? a.subjects : [],
    }));
  } catch (err) {
    console.error('❌ Error fetching assignments:', err);
    return [createEmptyAssignment()];
  }
}

export async function saveAssignmentsToApi(session, assignments) {
  try {
    const payload = {
      session: {
        facultyId: session?.facultyId,
        user: {
          amiId: session?.user?.amiId,
          name: session?.user?.name,
          department: session?.user?.department,
          position: session?.user?.position,
          imageUrl: session?.user?.imageUrl || '',
        },
      },
      assignments: assignments.map((a) => ({
        course: a.course || '',
        semester: a.semester || '',
        section: a.section || '',
        roomNumber: a.roomNumber || '',
        subjects: Array.isArray(a.subjects) ? a.subjects : [],
      })),
    };

    const res = await fetch('/api/batchsave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Save failed');
    }

    return true;
  } catch (err) {
    console.error('❌ Error saving assignments:', err);
    return false;
  }
}
