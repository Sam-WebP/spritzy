'use client';

import { useAppSelector } from '@/redux/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuizResults() {
  const { currentQuiz, userAnswers, evaluationResults } = useAppSelector(state => state.quiz);
  const router = useRouter();

  if (!currentQuiz) return null;

  const correctAnswers = currentQuiz.questions.reduce((count, question, index) => {
    if (question.type === 'multiple-choice') {
      return count + (userAnswers[index] === question.correctOptionIndex ? 1 : 0);
    } else {
      return count + (evaluationResults[question.id]?.isCorrect ? 1 : 0);
    }
  }, 0);

  const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

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
          {currentQuiz.questions.map((question, index) => (
            <div key={question.id} className="space-y-2">
              <h3 className="font-medium">
                Question {index + 1}: {question.question}
              </h3>
              <div className="pl-4 space-y-1">
                {question.type === 'multiple-choice' ? (
                  <>
                    <p>Your answer: {question.options?.[userAnswers[index] as number]}</p>
                    <p className={userAnswers[index] === question.correctOptionIndex 
                      ? "text-green-600" 
                      : "text-red-600"}>
                      {userAnswers[index] === question.correctOptionIndex 
                        ? '✓ Correct' 
                        : `✗ Incorrect (Correct answer: ${question.options?.[question.correctOptionIndex]})`}
                    </p>
                  </>
                ) : (
                  <>
                    <p>Your answer: {userAnswers[index]}</p>
                    {evaluationResults[question.id] && (
                      <p className={evaluationResults[question.id].isCorrect 
                        ? "text-green-600" 
                        : "text-red-600"}>
                        {evaluationResults[question.id].isCorrect 
                          ? '✓ Correct' 
                          : `✗ Incorrect (${evaluationResults[question.id].feedback})`}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center">
        <Button onClick={() => router.refresh()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Quiz
        </Button>
      </div>
    </div>
  );
}
