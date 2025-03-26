'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { evaluateAllAnswers } from '@/redux/slices/quizSlice';
import QuizGenerator from './QuizGenerator';
import Quiz from './Quiz';
import QuizResults from './QuizResults';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuizContainer() {
  const dispatch = useAppDispatch();
  const { currentQuiz, isCompleted, loading, evaluating, error, showResults } = useAppSelector(state => state.quiz);
                                                             // ↑ Added error here

  useEffect(() => {
    if (isCompleted && currentQuiz) {
      dispatch(evaluateAllAnswers());
    }
  }, [isCompleted, dispatch, currentQuiz]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p>Evaluating your answers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isCompleted && showResults) {
    return <QuizResults />;
  }

  if (currentQuiz) {
    return <Quiz />;
  }

  return <QuizGenerator />;
}
