export const typeDefs = `#graphql
  type Quiz {
    id: String
    title: String
    date: String
  }

  type Subject {
    subject: String
    quizzes: [Quiz]
  }

  type Assignment {
    course: String
    semester: Int
    section: String
    roomNumber: String
    subjects: [Subject]
  }

  type Faculty {
    _id: ID!
    name: String
    email: String
    position: String
    department: String
    imageUrl: String
    classAssignments: [Assignment]
  }

  type Query {
    getFacultyAssignments: [Assignment]
  }

  type Mutation {
    getOrCreateFacultyAssignments: [Assignment]
    updateFacultyAssignments(classAssignments: [AssignmentInput]!): UpdateResponse
  }

  input QuizInput {
    id: String
    title: String
    date: String
  }

  input SubjectInput {
    subject: String
    quizzes: [QuizInput]
  }

  input AssignmentInput {
    course: String
    semester: Int
    section: String
    roomNumber: String
    subjects: [SubjectInput]
  }

  type UpdateResponse {
    success: Boolean
    message: String
  }
`;
