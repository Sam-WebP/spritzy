'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { resetQuiz } from '@/redux/slices/quizSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { QuizQuestion } from '@/types'; // Import QuizQuestion type

export default function QuizResults() {
  const { currentQuiz, userAnswers, evaluationResults } = useAppSelector(state => state.quiz);
  const dispatch = useAppDispatch();

  if (!currentQuiz) return null;

  // Fix: Add types for reduce parameters
  const correctAnswers = currentQuiz.questions.reduce((count: number, question: QuizQuestion, index: number) => {
    const answer = userAnswers[index];
    if (answer === undefined || answer === -1) return count;

    if (question.type === 'multiple-choice') {
      return count + (typeof answer === 'number' && answer === question.correctOptionIndex ? 1 : 0);
    } else {
      return count + (evaluationResults[question.id]?.isCorrect ? 1 : 0);
    }
  }, 0); // Initial value 0 ensures count starts as number

  const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

  const handleStartNewQuiz = () => {
    dispatch(resetQuiz());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <div className="text-2xl font-bold mt-4">
            Your Score: {score}%
          </div>
          <div className="text-sm text-muted-foreground">
            {correctAnswers} out of {currentQuiz.questions.length} correct
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fix: Add types for map parameters */}
          {currentQuiz.questions.map((question: QuizQuestion, index: number) => {
            const userAnswer = userAnswers[index];
            const evaluation = evaluationResults[question.id];
            const isAnswered = userAnswer !== undefined && userAnswer !== -1;

            return (
              <div key={question.id} className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium">
                  Question {index + 1}: {question.question}
                </h3>
                <div className="pl-4 space-y-1 text-sm">
                  {!isAnswered ? (
                     <p className="text-muted-foreground italic">Not Answered</p>
                  ) : question.type === 'multiple-choice' ? (
                    <>
                      <p>Your answer: {question.options?.[userAnswer as number] ?? 'Invalid Answer'}</p>
                      <p className={userAnswer === question.correctOptionIndex
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"}>
                        {userAnswer === question.correctOptionIndex
                          ? '✓ Correct'
                          : `✗ Incorrect (Correct: ${question.options?.[question.correctOptionIndex] ?? 'N/A'})`}
                      </p>
                    </>
                  ) : ( // Typed Answer
                    <>
                      <p>Your answer: {typeof userAnswer === 'string' ? userAnswer : 'Invalid Answer'}</p>
                      {evaluation ? (
                         <p className={evaluation.isCorrect
                           ? "text-green-600 dark:text-green-400"
                           : "text-red-600 dark:text-red-400"}>
                           {evaluation.isCorrect
                             ? `✓ Correct`
                             : `✗ Incorrect. ${evaluation.feedback}`}
                           {!evaluation.isCorrect && question.correctAnswer && (
                             <span className="block text-xs text-muted-foreground">(Expected: {question.correctAnswer})</span>
                           )}
                         </p>
                      ) : (
                        <p className="text-muted-foreground italic">Evaluation pending or failed.</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center">
        <Button onClick={handleStartNewQuiz}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Quiz
        </Button>
      </div>
    </div>
  );
}