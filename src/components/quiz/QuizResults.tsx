'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { resetQuiz } from '@/redux/slices/quizSlice'; // Action to start over
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { QuizQuestion } from '@/types'; // Type definition for questions

export default function QuizResults() {
  // Get quiz state from Redux
  const { currentQuiz, userAnswers, evaluationResults } = useAppSelector(state => state.quiz);
  const dispatch = useAppDispatch();

  // Don't render if there's no quiz data available
  if (!currentQuiz) return null;

  // Calculate the number of correct answers
  // Initialize accumulator `count` as a number
  const correctAnswers = currentQuiz.questions.reduce((count: number, question: QuizQuestion, index: number) => {
    const answer = userAnswers[index];
    // Skip unanswered questions (-1 is the initial state)
    if (answer === undefined || answer === -1) return count;

    // Check correctness based on question type
    if (question.type === 'multiple-choice') {
      // Correct if user's numeric answer matches the correct index
      return count + (typeof answer === 'number' && answer === question.correctOptionIndex ? 1 : 0);
    } else {
      // Correct if the evaluation result for this typed question is marked as correct
      return count + (evaluationResults[question.id]?.isCorrect ? 1 : 0);
    }
  }, 0); // Start counting from 0

  // Calculate the score percentage
  const score = currentQuiz.questions.length > 0
    ? Math.round((correctAnswers / currentQuiz.questions.length) * 100)
    : 0; // Avoid division by zero if questions array is empty

  /**
   * Handles the click event for the "Start New Quiz" button.
   * Dispatches the `resetQuiz` action to clear the current quiz state.
   */
  const handleStartNewQuiz = () => {
    dispatch(resetQuiz());
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          {/* Display the final score */}
          <div className="text-2xl font-bold mt-4">
            Your Score: {score}%
          </div>
          {/* Display the number of correct answers out of total */}
          <div className="text-sm text-muted-foreground">
            {correctAnswers} out of {currentQuiz.questions.length} correct
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Iterate through each question to display its result */}
          {/* Explicitly type `question` and `index` for clarity */}
          {currentQuiz.questions.map((question: QuizQuestion, index: number) => {
            const userAnswer = userAnswers[index]; // Get the user's answer for this question
            const evaluation = evaluationResults[question.id]; // Get AI evaluation if available (for typed)
            const isAnswered = userAnswer !== undefined && userAnswer !== -1; // Check if the question was answered

            return (
              // Use question ID as key for stable rendering
              <div key={question.id} className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
                {/* Display the question text */}
                <h3 className="font-medium">
                  Question {index + 1}: {question.question}
                </h3>
                <div className="pl-4 space-y-1 text-sm">
                  {/* Handle display based on whether the question was answered */}
                  {!isAnswered ? (
                     <p className="text-muted-foreground italic">Not Answered</p>
                  ) : question.type === 'multiple-choice' ? (
                    // Display for Multiple Choice questions
                    <>
                      <p>Your answer: {question.options?.[userAnswer as number] ?? 'Invalid Answer'}</p>
                      {/* Indicate correctness and show correct answer if wrong */}
                      <p className={userAnswer === question.correctOptionIndex
                        ? "text-green-600 dark:text-green-400" // Style for correct
                        : "text-red-600 dark:text-red-400"   // Style for incorrect
                      }>
                        {userAnswer === question.correctOptionIndex
                          ? '✓ Correct'
                          : `✗ Incorrect (Correct: ${question.options?.[question.correctOptionIndex] ?? 'N/A'})`}
                      </p>
                    </>
                  ) : (
                    // Display for Typed Answer questions
                    <>
                      <p>Your answer: {typeof userAnswer === 'string' ? userAnswer : 'Invalid Answer'}</p>
                      {/* Display evaluation result from AI if available */}
                      {evaluation ? (
                         <p className={evaluation.isCorrect
                           ? "text-green-600 dark:text-green-400" // Style for correct
                           : "text-red-600 dark:text-red-400"   // Style for incorrect
                         }>
                           {evaluation.isCorrect
                             ? `✓ Correct` // Show simple correct message
                             // Show incorrect message and AI feedback
                             : `✗ Incorrect. ${evaluation.feedback}`}
                           {/* Show expected answer if incorrect and if provided in original quiz data */}
                           {!evaluation.isCorrect && question.correctAnswer && (
                             <span className="block text-xs text-muted-foreground">(Expected: {question.correctAnswer})</span>
                           )}
                         </p>
                      ) : (
                        // Fallback message if evaluation is missing or failed
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
      {/* Button to reset the quiz state and allow generating a new one */}
      <div className="mt-6 flex justify-center">
        <Button onClick={handleStartNewQuiz} aria-label="Start a new quiz">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Quiz
        </Button>
      </div>
    </div>
  );
}
