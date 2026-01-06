// src/app/dashboard/quiz_controller/fetchAssignmentsFromApi.js

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { getDefaultAssignments } from './getDefaultAssignments';
import { isValidAssignment } from './validators';

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

/**
 * Fetch class assignments via GraphQL based on the session
 * If not found, creates default structure and returns it
 *
 * @param {Object} session - Faculty session object
 * @param {string} session.user.email
 * @param {string} [session.user.name]
 * @param {string} [session.user.facultyId]
 * @returns {Promise<Array>} classAssignments
 */
export async function fetchAssignmentsFromApi(session) {
  if (!session?.user?.email) {
    console.warn('No email in session. Using fallback.');
    return getDefaultAssignments();
  }

  const { email, name, facultyId } = session.user;

  const GET_OR_CREATE_ASSIGNMENTS = gql`
    mutation GetOrCreateFacultyAssignments($email: String!, $name: String, $facultyId: String) {
      getOrCreateFacultyAssignments(email: $email, name: $name, facultyId: $facultyId) {
        batch
        semester
        subjects {
          subject
          quizzes {
            id
            title
            date
          }
        }
      }
    }
  `;

  try {
    const { data } = await client.mutate({
      mutation: GET_OR_CREATE_ASSIGNMENTS,
      variables: { email, name, facultyId },
    });

    const assignments = data?.getOrCreateFacultyAssignments;

    if (Array.isArray(assignments) && assignments.every(isValidAssignment)) {
      return assignments;
    }

    console.warn('GraphQL returned invalid structure. Falling back.');
  } catch (error) {
    console.error('GraphQL fetch error:', error);
  }

  return getDefaultAssignments();
}
