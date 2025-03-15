'use client';

import { useAppDispatch } from '@/redux/hooks';
import { answerQuestion } from '@/redux/slices/quizSlice';
import { QuizQuestion as QuizQuestionType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  userAnswer: number;
  showCorrectAnswer?: boolean;
}

export default function QuizQuestion({
  question,
  questionIndex,
  userAnswer,
  showCorrectAnswer = false,
}: QuizQuestionProps) {
  const dispatch = useAppDispatch();
  
  const handleOptionSelect = (optionIndex: number) => {
    dispatch(answerQuestion({ questionIndex, answerIndex: optionIndex }));
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="mb-4 font-medium">
          {question.question}
        </div>
        <RadioGroup value={userAnswer.toString()} onValueChange={(value) => handleOptionSelect(parseInt(value))}>
          {question.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-2 p-3 rounded-md",
                showCorrectAnswer && index === question.correctOptionIndex 
                  ? "bg-green-100 dark:bg-green-900/20" 
                  : "",
                showCorrectAnswer && userAnswer === index && index !== question.correctOptionIndex 
                  ? "bg-red-100 dark:bg-red-900/20" 
                  : ""
              )}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`option-${questionIndex}-${index}`}
                disabled={showCorrectAnswer}
              />
              <Label
                htmlFor={`option-${questionIndex}-${index}`}
                className={cn(
                  "flex-grow cursor-pointer",
                  showCorrectAnswer && index === question.correctOptionIndex
                    ? "font-medium text-green-700 dark:text-green-400"
                    : "",
                  showCorrectAnswer && userAnswer === index && index !== question.correctOptionIndex
                    ? "font-medium text-red-700 dark:text-red-400"
                    : ""
                )}
              >
                {option}
                {showCorrectAnswer && index === question.correctOptionIndex && (
                  <span className="ml-2 text-green-600 dark:text-green-400 text-sm">
                    ✓ Correct
                  </span>
                )}
                {showCorrectAnswer && userAnswer === index && index !== question.correctOptionIndex && (
                  <span className="ml-2 text-red-600 dark:text-red-400 text-sm">
                    ✗ Incorrect
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}