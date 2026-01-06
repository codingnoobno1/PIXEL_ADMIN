// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import Faculty from '@/models/Faculty';
import dbConnect from '@/lib/dbConnect';

export async function POST(request) {
  try {
    await dbConnect();

    const { name, position, roles, amity_email, amizone_id, password } = await request.json();

    // ✅ Validate required fields
    if (!name || !position || !roles || roles.length === 0 || !amity_email || !amizone_id || !password) {
      return NextResponse.json(
        { error: 'Name, position, roles, email, amizone_id, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = amity_email.trim().toLowerCase();
    const cleanAmizone = amizone_id.trim();

    // ✅ Validate position
    const validPositions = Faculty.schema.path('position').enumValues;
    if (!validPositions.includes(position)) {
      return NextResponse.json(
        { error: `Invalid position: ${position}. Allowed positions: ${validPositions.join(', ')}` },
        { status: 400 }
      );
    }

    // ✅ Validate roles
    const validRoles = Faculty.schema.path('roles').caster.enumValues;
    const invalidRoles = roles.filter((r) => !validRoles.includes(r));
    if (invalidRoles.length > 0) {
      return NextResponse.json(
        { error: `Invalid roles: ${invalidRoles.join(', ')}. Allowed roles: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // ✅ Check duplicates
    const existingFaculty = await Faculty.findOne({
      $or: [{ amity_email: cleanEmail }, { amizone_id: cleanAmizone }],
    });

    if (existingFaculty) {
      const field = existingFaculty.amity_email === cleanEmail ? 'email' : 'Amizone ID';
      return NextResponse.json({ error: `Faculty already exists with this ${field}` }, { status: 409 });
    }

    // ✅ Create Faculty (password auto-hashed via pre-save middleware)
    const newFaculty = await Faculty.create({
      name: name.trim(),
      position,
      roles,
      amity_email: cleanEmail,
      amizone_id: cleanAmizone,
      password, // plain password — schema will hash it
    });

    return NextResponse.json(
      {
        message: 'Faculty registered successfully',
        faculty: {
          id: newFaculty._id,
          name: newFaculty.name,
          email: newFaculty.amity_email,
          position: newFaculty.position,
          roles: newFaculty.roles,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('🚨 Registration error:', error);

    if (error.code === 11000 && error.keyPattern) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ error: `A faculty member with this ${field} already exists.` }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
