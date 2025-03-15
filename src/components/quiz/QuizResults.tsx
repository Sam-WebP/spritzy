'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { resetQuiz } from '@/redux/slices/quizSlice';
import { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, RotateCcw } from 'lucide-react';
import QuizQuestion from './QuizQuestion';

export default function QuizResults() {
  const dispatch = useAppDispatch();
  const { currentQuiz, userAnswers } = useAppSelector(state => state.quiz);

  if (!currentQuiz) {
    return null;
  }

  const correctAnswers = userAnswers.reduce((count, answer, index) => {
    return count + (answer === currentQuiz.questions[index].correctOptionIndex ? 1 : 0);
  }, 0);

  const score = (correctAnswers / currentQuiz.questions.length) * 100;
  
  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-center mb-4">
          <Award className="h-10 w-10 mr-2 text-yellow-500" />
          Quiz Results
        </CardTitle>
        <div className="text-center text-xl">
          <CardDescription>
            Your score: {score.toFixed(0)}%
          </CardDescription>
          <CardDescription className="mt-1">
            {correctAnswers} out of {currentQuiz.questions.length} questions answered correctly
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {currentQuiz.questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionIndex={index}
                userAnswer={userAnswers[index]}
                showCorrectAnswer={true}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => dispatch(resetQuiz())}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Quiz
        </Button>
      </CardFooter>
    </div>
  );
}