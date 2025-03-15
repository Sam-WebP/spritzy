'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  nextQuestion,
  previousQuestion,
  completeQuiz,
  resetQuiz,
} from '@/redux/slices/quizSlice';
import { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import QuizQuestion from './QuizQuestion';

export default function Quiz() {
  const dispatch = useAppDispatch();
  const {
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
  } = useAppSelector(state => state.quiz);

  if (!currentQuiz) {
    return null;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== -1;
  const allQuestionsAnswered = userAnswers.every(answer => answer !== -1);

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>{currentQuiz.title}</CardTitle>
        <CardDescription>{currentQuiz.description}</CardDescription>
        <div className="mt-2">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-right mt-1 text-muted-foreground">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <QuizQuestion
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          userAnswer={userAnswers[currentQuestionIndex]}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => dispatch(previousQuestion())}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button variant="outline" onClick={() => dispatch(resetQuiz())}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
          <Button onClick={() => dispatch(nextQuestion())} disabled={!hasAnsweredCurrent}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => dispatch(completeQuiz())} disabled={!allQuestionsAnswered}>
            Finish
            <CheckCircle2 className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </div>
  );
}