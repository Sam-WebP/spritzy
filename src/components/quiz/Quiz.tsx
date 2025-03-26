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
    showResults,
  } = useAppSelector(state => state.quiz);

  if (!currentQuiz || showResults) {
    return null;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  
  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined && 
                           userAnswers[currentQuestionIndex] !== -1;
  
  const allQuestionsAnswered = userAnswers.every(answer => 
    answer !== undefined && answer !== -1
  );

  const handleCompleteQuiz = () => {
    dispatch(completeQuiz());
  };

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
      <CardFooter className="flex justify-between gap-1 sm:gap-2">
        <Button
          variant="outline"
          onClick={() => dispatch(previousQuestion())}
          disabled={currentQuestionIndex === 0}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="whitespace-nowrap">Previous</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => dispatch(resetQuiz())}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>Reset</span>
        </Button>
        {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
          <Button 
            onClick={() => dispatch(nextQuestion())} 
            disabled={!hasAnsweredCurrent}
            className="text-xs sm:text-sm px-2 sm:px-4"
          >
            <span>Next</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleCompleteQuiz} 
            disabled={!allQuestionsAnswered}
            className="text-xs sm:text-sm px-2 sm:px-4"
          >
            <span>Finish</span>
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
          </Button>
        )}
      </CardFooter>
    </div>
  );
}
