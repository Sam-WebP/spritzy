'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { answerQuestion } from '@/redux/slices/quizSlice';
import { QuizQuestion as QuizQuestionType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  userAnswer: number | string;
}

export default function QuizQuestion({
  question,
  questionIndex,
  userAnswer,
}: QuizQuestionProps) {
  const { showResults, evaluationResults } = useAppSelector(state => state.quiz);
  const dispatch = useAppDispatch();
  const evaluationResult = evaluationResults[question.id];

  const handleOptionSelect = (selectedValue: string) => {
    if (!showResults) {
      dispatch(answerQuestion({ 
        questionIndex, 
        answer: parseInt(selectedValue) 
      }));
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="mb-4 font-medium">
          {question.question}
        </div>
        
        {question.type === 'multiple-choice' ? (
          <RadioGroup 
            value={typeof userAnswer === 'number' ? userAnswer.toString() : ''}
            onValueChange={handleOptionSelect}
            disabled={showResults}
          >
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-md",
                  showResults && index === question.correctOptionIndex 
                    ? "bg-green-100 dark:bg-green-900/20" 
                    : "",
                  showResults && 
                  typeof userAnswer === 'number' && 
                  userAnswer === index && 
                  index !== question.correctOptionIndex 
                    ? "bg-red-100 dark:bg-red-900/20" 
                    : ""
                )}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${questionIndex}-${index}`}
                  disabled={showResults}
                />
                <Label
                  htmlFor={`option-${questionIndex}-${index}`}
                  className={cn(
                    "flex-grow cursor-pointer",
                    showResults && index === question.correctOptionIndex
                      ? "font-medium text-green-700 dark:text-green-400"
                      : "",
                    showResults && 
                    typeof userAnswer === 'number' && 
                    userAnswer === index && 
                    index !== question.correctOptionIndex
                      ? "font-medium text-red-700 dark:text-red-400"
                      : ""
                  )}
                >
                  {option}
                  {showResults && index === question.correctOptionIndex && (
                    <span className="ml-2 text-green-600 dark:text-green-400 text-sm">
                      ✓ Correct
                    </span>
                  )}
                  {showResults && 
                   typeof userAnswer === 'number' && 
                   userAnswer === index && 
                   index !== question.correctOptionIndex && (
                    <span className="ml-2 text-red-600 dark:text-red-400 text-sm">
                      ✗ Incorrect
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            <Input
              value={typeof userAnswer === 'string' ? userAnswer : ''}
              onChange={(e) => !showResults && dispatch(answerQuestion({
                questionIndex,
                answer: e.target.value
              }))}
              readOnly={showResults}
              className={cn(
                showResults && evaluationResult
                  ? evaluationResult.isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : ""
              )}
            />
            {showResults && evaluationResult && (
              <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <p className={cn(
                  "font-medium",
                  evaluationResult.isCorrect
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                )}>
                  {evaluationResult.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </p>
                <p className="text-sm mt-1">{evaluationResult.feedback}</p>
                {!evaluationResult.isCorrect && question.correctAnswer && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Expected answer:</span> {question.correctAnswer}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
