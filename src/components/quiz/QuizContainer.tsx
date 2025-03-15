'use client';

import { useAppSelector } from '@/redux/hooks';
import QuizGenerator from './QuizGenerator';
import Quiz from './Quiz';
import QuizResults from './QuizResults';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuizContainer() {
  const { currentQuiz, isCompleted, loading, error } = useAppSelector(state => state.quiz);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

  if (isCompleted) {
    return <QuizResults />;
  }

  return currentQuiz ? <Quiz /> : <QuizGenerator />;
}