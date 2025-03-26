'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setGenerationOptions, toggleOptionsDialog } from '@/redux/slices/quizSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function QuizOptions() {
  const dispatch = useAppDispatch();
  const { showOptionsDialog, quizSettings, generationOptions } = useAppSelector(state => state.quiz);
  const numQuestions = generationOptions?.numQuestions || quizSettings.defaultNumQuestions;
  const questionTypes = generationOptions?.questionTypes || quizSettings.defaultMode;

  const handleNumQuestionsChange = (value: number) => {
    dispatch(setGenerationOptions({ numQuestions: value }));
  };

  const handleQuestionTypeChange = (type: keyof typeof questionTypes, value: boolean) => {
    dispatch(setGenerationOptions({ 
      questionTypes: { ...questionTypes, [type]: value }
    }));
  };

  return (
    <Dialog open={showOptionsDialog} onOpenChange={() => dispatch(toggleOptionsDialog())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quiz Generation Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question-count">Number of Questions</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[numQuestions]}
                min={1}
                max={20}
                step={1}
                onValueChange={([value]) => handleNumQuestionsChange(value)}
                className="flex-1"
              />
              <Input
                id="question-count"
                value={numQuestions}
                onChange={(e) => handleNumQuestionsChange(Number(e.target.value))}
                className="w-16 text-center"
                type="number"
                min={1}
                max={20}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Question Types</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="multiple-choice">Multiple Choice</Label>
              <Switch
                id="multiple-choice"
                checked={questionTypes.multipleChoice}
                onCheckedChange={(checked) => handleQuestionTypeChange('multipleChoice', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="typed-answer">Typed Answer</Label>
              <Switch
                id="typed-answer"
                checked={questionTypes.typedAnswer}
                onCheckedChange={(checked) => handleQuestionTypeChange('typedAnswer', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-generate-count">Let AI Determine Count</Label>
              <Switch
                id="ai-generate-count"
                checked={questionTypes.aiGenerateCount}
                onCheckedChange={(checked) => handleQuestionTypeChange('aiGenerateCount', checked)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => dispatch(toggleOptionsDialog())}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
