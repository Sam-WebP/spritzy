'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleQuizDialog, resetQuiz } from '@/redux/slices/quizSlice';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import QuizContainer from './QuizContainer';
import QuizOptions from './QuizOptions';

export default function QuizDialog() {
  const dispatch = useAppDispatch();
  const { showQuizDialog } = useAppSelector(state => state.quiz);

  const handleClose = () => {
    dispatch(toggleQuizDialog());
    dispatch(resetQuiz());
  };

  return (
    <>
      <Dialog open={showQuizDialog} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-[800px] w-[95vw] h-[90vh] flex flex-col"
          data-testid="quiz-dialog"
        >
          <DialogTitle>Quiz</DialogTitle>
          <DialogDescription>
            Test your understanding of the text with these questions.
          </DialogDescription>
          <div className="flex-1 overflow-auto py-4">
            <Card className="border-0 shadow-none">
              <QuizContainer />
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      <QuizOptions />
    </>
  );
}
