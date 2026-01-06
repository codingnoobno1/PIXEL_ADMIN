import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import FacultyCard from '@/models/FacultyCard';
import Subject from '@/models/Subject'; // Import the Subject model
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Use dbConnect to ensure we're using the QUIZ database
    await dbConnect();

    const { session, assignments } = await req.json();
    const uuid = session?.user?.amiId;
    const facultyName = session?.user?.name;
    const facultyDepartment = session?.user?.department;
    const facultyPosition = session?.user?.position;
    const facultyImageUrl = session?.user?.imageUrl || '';
    const facultyId = session?.facultyId || session?.user?.facultyId;

    if (!uuid) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!facultyId) {
      return NextResponse.json({ success: false, message: 'Faculty ID not found in session' }, { status: 400 });
    }

    if (!assignments || !Array.isArray(assignments)) {
      return NextResponse.json({ success: false, message: 'Invalid assignments data' }, { status: 400 });
    }

    // Process assignments and subjects
    const newAssignments = await Promise.all(assignments.map(async (a) => {
      const processedSubjects = await Promise.all(a.subjects.map(async (subjectName) => {
        // Find or create the Subject document
        const foundOrCreatedSubject = await Subject.findOneAndUpdate(
          { name: subjectName },
          { $setOnInsert: { name: subjectName } },
          { upsert: true, new: true, runValidators: true }
        );
        return { subjectId: foundOrCreatedSubject._id, name: subjectName, quizzes: [] };
      }));

      return {
        batch: a.course,
        semester: a.semester,
        section: a.section,
        roomNumber: a.roomNumber,
        subjects: processedSubjects,
      };
    }));

    // CLEANUP: Delete any existing FacultyCard with wrong UUID (auto-generated)
    // This handles the migration from old auto-generated UUIDs to amiId-based UUIDs
    const oldCardWithWrongUuid = await FacultyCard.findOne({
      faculty: facultyId,
      uuid: { $ne: uuid } // UUID doesn't match the amiId
    });

    if (oldCardWithWrongUuid) {
      console.log('🧹 [batchsave] Deleting old card with wrong UUID:', oldCardWithWrongUuid.uuid);
      await FacultyCard.deleteOne({ _id: oldCardWithWrongUuid._id });
    }

    // Check if FacultyCard already exists
    const existingCard = await FacultyCard.findOne({ uuid: uuid });
    console.log('💾 [batchsave] Looking for uuid:', uuid);
    console.log('💾 [batchsave] Existing card found:', existingCard ? 'YES' : 'NO');

    let updatedFacultyCard;

    if (existingCard) {
      // Update existing card - don't touch the faculty field
      console.log('🔄 [batchsave] Updating existing card');
      updatedFacultyCard = await FacultyCard.findOneAndUpdate(
        { uuid: uuid },
        {
          $set: {
            name: facultyName,
            department: facultyDepartment,
            position: facultyPosition,
            imageUrl: facultyImageUrl,
            classAssignments: newAssignments,
          }
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new card - check if faculty already has a card
      const existingFacultyCard = await FacultyCard.findOne({ faculty: facultyId });
      console.log('🔍 [batchsave] Checking faculty:', facultyId);
      console.log('🔍 [batchsave] Existing faculty card:', existingFacultyCard ? 'YES' : 'NO');

      if (existingFacultyCard) {
        // Faculty already has a card, update it instead
        console.log('🔄 [batchsave] Updating existing faculty card with new uuid');
        updatedFacultyCard = await FacultyCard.findOneAndUpdate(
          { faculty: facultyId },
          {
            $set: {
              uuid: uuid,
              name: facultyName,
              department: facultyDepartment,
              position: facultyPosition,
              imageUrl: facultyImageUrl,
              classAssignments: newAssignments,
            }
          },
          { new: true, runValidators: true }
        );
      } else {
        // Create brand new card
        console.log('✨ [batchsave] Creating brand new faculty card');
        updatedFacultyCard = await FacultyCard.create({
          uuid: uuid,
          faculty: facultyId,
          name: facultyName,
          department: facultyDepartment,
          position: facultyPosition,
          imageUrl: facultyImageUrl,
          classAssignments: newAssignments,
        });
      }
    }

    console.log('✅ [batchsave] Final card uuid:', updatedFacultyCard?.uuid);
    console.log('✅ [batchsave] Final card has assignments:', updatedFacultyCard?.classAssignments?.length || 0);

    if (!updatedFacultyCard) {
      return NextResponse.json({ success: false, message: 'Failed to create or update faculty card' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Assignments saved successfully',
      facultyCard: updatedFacultyCard.toPublicJSON()
    });

  } catch (error) {
    console.error('API Error:', error);

    // Provide more specific error messages
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Duplicate entry detected. This faculty member already has a card.',
        details: error.message
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred.',
      details: error.message
    }, { status: 500 });
  }
}