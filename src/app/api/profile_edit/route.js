import Faculty from '@models/Faculty'; // Use PascalCase for Mongoose model imports by convention
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    const {
      name,
      role,
      amity_email,
      amizone_id,
      password_hash,
      subjectsTaught = [],
      quizzesCreated = [],
      leaderboardVisible = true,
    } = data;

    if (!name || !role || !amity_email || !amizone_id || !password_hash) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find existing faculty by amizone_id or amity_email (case-insensitive)
    let faculty = await Faculty.findOne({
      $or: [
        { amizone_id },
        { amity_email: amity_email.toLowerCase() }
      ],
    });

    if (!faculty) {
      // Create new faculty
      faculty = new Faculty({
        name,
        role,
        amity_email: amity_email.toLowerCase(),
        amizone_id,
        password_hash,
        subjectsTaught,
        quizzesCreated,
        leaderboardVisible,
      });
    } else {
      // Update existing faculty fields
      faculty.name = name;
      faculty.role = role;
      faculty.amity_email = amity_email.toLowerCase();
      faculty.password_hash = password_hash;
      faculty.subjectsTaught = subjectsTaught;
      faculty.quizzesCreated = quizzesCreated;
      faculty.leaderboardVisible = leaderboardVisible;
    }

    await faculty.save();

    return NextResponse.json({ message: 'Faculty profile saved', facultyId: faculty._id }, { status: 200 });

  } catch (error) {
    console.error('Error saving faculty profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
