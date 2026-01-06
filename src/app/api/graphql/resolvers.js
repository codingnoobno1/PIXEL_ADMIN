export const resolvers = {
  Query: {
    async getFacultyAssignments(_, __, { db, session }) {
      const email = session?.user?.email;
      if (!email) throw new Error('Unauthorized access');

      const faculty = await db.collection('facultyAssignments').findOne({ email });
      return faculty || null;
    },
  },

  Mutation: {
    async getOrCreateFacultyAssignments(_, __, { db, session }) {
      const email = session?.user?.email;
      const name = session?.user?.name || '';
      const facultyId = session?.user?.facultyId || '';
      const department = session?.user?.department || '';
      const position = session?.user?.position || '';
      const imageUrl = session?.user?.imageUrl || '';

      if (!email) throw new Error('Unauthorized access');

      const collection = db.collection('facultyAssignments');
      let record = await collection.findOne({ email });

      if (!record) {
        // ✅ Updated schema structure
        record = {
          name,
          email,
          facultyId,
          department,
          position,
          imageUrl,
          classAssignments: [
            {
              course: '',
              semester: 1,
              section: '',
              roomNumber: '',
              subjects: [],
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await collection.insertOne(record);
      }

      return record.classAssignments;
    },

    async updateFacultyAssignments(_, { classAssignments }, { db, session }) {
      const email = session?.user?.email;
      if (!email) {
        return {
          success: false,
          message: 'Unauthorized access',
        };
      }

      if (!Array.isArray(classAssignments)) {
        return {
          success: false,
          message: 'Invalid data structure for assignments',
        };
      }

      try {
        // ✅ Validate expected fields (optional, for safety)
        const valid = classAssignments.every(a =>
          a.course !== undefined &&
          a.semester !== undefined &&
          a.section !== undefined &&
          a.subjects !== undefined
        );

        if (!valid) {
          return {
            success: false,
            message: 'Assignment data is missing required fields',
          };
        }

        const result = await db.collection('facultyAssignments').updateOne(
          { email },
          {
            $set: {
              classAssignments,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );

        const success = result.matchedCount > 0 || result.upsertedCount > 0;

        return {
          success,
          message: success
            ? 'Assignments updated successfully'
            : 'No matching faculty found',
        };
      } catch (err) {
        console.error('MongoDB Update Error:', err);
        return {
          success: false,
          message: 'Database error while updating assignments',
        };
      }
    },
  },
};
