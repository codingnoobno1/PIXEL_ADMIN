import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie'; // You must install this

// Combined localStorage + cookies for redundancy
const quizMetaStorage = {
  getItem: (name) => {
    const local = localStorage.getItem(name);
    const cookie = Cookies.get(name);

    return local || cookie || null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
    Cookies.set(name, value, { expires: 7 }); // cookie expires in 7 days
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    Cookies.remove(name);
  },
};

const useQuizStore = create(
  persist(
    (set) => ({
      currentBatch: null,
      currentSubject: null,
      selectedQuiz: null,

      setCurrentBatch: (batch) => set({ currentBatch: batch }),
      setCurrentSubject: (subject) => set({ currentSubject: subject }),
      setSelectedQuiz: (quiz) => set({ selectedQuiz: quiz }),

      clearQuizMeta: () =>
        set({
          currentBatch: null,
          currentSubject: null,
          selectedQuiz: null,
        }),
    }),
    {
      name: 'quiz-meta-store',
      storage: quizMetaStorage,
    }
  )
);

export default useQuizStore;
