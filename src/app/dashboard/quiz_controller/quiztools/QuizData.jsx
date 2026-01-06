'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { fetchAssignmentsFromApi } from '../batchquery';

export default function useQuizData() {
  const { data: session, status } = useSession();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBatchIdx, setSelectedBatchIdx] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [quizStatusMap, setQuizStatusMap] = useState({}); // ✅ Map of quiz types to status info

  // 🟡 Fetch assignments once session is available
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const user = session.user || {};
      const facultyId = user.facultyId || session.facultyId;
      const amiId = user.amiId || session.amiId;

      const enrichedSession = {
        ...session,
        facultyId,
        user: { ...user, amiId },
      };

      fetchAssignmentsFromApi(enrichedSession)
        .then(setAssignments)
        .catch(() => setAssignments([]))
        .finally(() => setLoading(false));
    }
  }, [status, session]);

  // 🟡 Reset subject when batch changes
  useEffect(() => {
    setSelectedSubject('');
  }, [selectedBatchIdx]);

  // 🟢 Selected batch based on index
  const selectedBatch = useMemo(() => {
    return selectedBatchIdx !== '' && assignments[selectedBatchIdx]
      ? assignments[selectedBatchIdx]
      : null;
  }, [selectedBatchIdx, assignments]);

  // 🟢 Subjects from selected batch
  const subjects = useMemo(() => selectedBatch?.subjects || [], [selectedBatch]);

  return {
    session,
    loading,
    assignments,
    selectedBatchIdx,
    setSelectedBatchIdx,
    selectedSubject,
    setSelectedSubject,
    selectedBatch,
    subjects,
    quizStatusMap,
    setQuizStatusMap,
  };
}
