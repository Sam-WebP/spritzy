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
  const { showOptionsDialog, quizSettings, generationOptions: currentGenerationOptions } = useAppSelector(state => state.quiz);

  // Prioritize current generation options, fall back to defaults
  const numQuestions = currentGenerationOptions?.numQuestions ?? quizSettings.defaultNumQuestions;
  const questionTypes = currentGenerationOptions?.questionTypes ?? quizSettings.defaultMode;
  const isNumQuestionsDisabled = questionTypes.aiGenerateCount;

  const handleNumQuestionsChange = (value: number) => {
    // Only update if AI count is not enabled
    if (!questionTypes.aiGenerateCount) {
      dispatch(setGenerationOptions({
        // Preserve existing options, only update numQuestions
        ...currentGenerationOptions,
        questionTypes: questionTypes, // Ensure current types are preserved
        numQuestions: value
      }));
    }
  };

  const handleQuestionTypeChange = (type: keyof typeof questionTypes, value: boolean) => {
    const otherIsActive = type === 'multipleChoice'
      ? questionTypes.typedAnswer
      : questionTypes.multipleChoice;

    // Prevent disabling the last active type (excluding aiGenerateCount)
    if (!value && !otherIsActive && (type === 'multipleChoice' || type === 'typedAnswer')) {
      return; // Don't allow unchecking the last one
    }

    dispatch(setGenerationOptions({
      ...currentGenerationOptions, // Preserve other options like numQuestions
      questionTypes: { ...questionTypes, [type]: value }
    }));
  };

  const handleAiCountToggle = (checked: boolean) => {
    dispatch(setGenerationOptions({
      ...currentGenerationOptions,
      questionTypes: { ...questionTypes, aiGenerateCount: checked }
    }));
  };

  return (
    <Dialog open={showOptionsDialog} onOpenChange={() => dispatch(toggleOptionsDialog())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quiz Generation Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="question-count" className={isNumQuestionsDisabled ? "text-muted-foreground" : ""}>
              Number of Questions {isNumQuestionsDisabled ? '(AI Decides)' : ''}
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[numQuestions]}
                min={1}
                max={20}
                step={1}
                onValueChange={([value]) => handleNumQuestionsChange(value)}
                className="flex-1"
                disabled={isNumQuestionsDisabled}
                aria-label="Number of questions slider"
              />
              <Input
                id="question-count"
                value={numQuestions}
                onChange={(e) => handleNumQuestionsChange(Number(e.target.value))}
                className="w-16 text-center"
                type="number"
                min={1}
                max={20}
                disabled={isNumQuestionsDisabled}
                aria-label="Number of questions input"
              />
            </div>
          </div>

          {/* Question Types */}
          <div className="space-y-4">
            <Label>Question Types</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="multiple-choice">Multiple Choice</Label>
              <Switch
                id="multiple-choice"
                checked={questionTypes.multipleChoice}
                 // Fix: Pass the received boolean directly
                onCheckedChange={(isChecked) => handleQuestionTypeChange('multipleChoice', isChecked)}
                disabled={!questionTypes.multipleChoice && !questionTypes.typedAnswer} // Corrected logic
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="typed-answer">Typed Answer</Label>
              <Switch
                id="typed-answer"
                checked={questionTypes.typedAnswer}
                 // Fix: Pass the received boolean directly
                onCheckedChange={(isChecked) => handleQuestionTypeChange('typedAnswer', isChecked)}
                disabled={!questionTypes.typedAnswer && !questionTypes.multipleChoice} // Corrected logic
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-generate-count">Let AI Determine Count</Label>
              <Switch
                id="ai-generate-count"
                checked={questionTypes.aiGenerateCount}
                 // Fix: Pass the received boolean directly
                onCheckedChange={handleAiCountToggle}
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