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
  // Get dialog visibility, default settings, and any *current* temporary generation options
  const { showOptionsDialog, quizSettings, generationOptions: currentGenerationOptions } = useAppSelector(state => state.quiz);

  // Determine the values to display: use current temporary options if they exist, otherwise use the defaults.
  // This ensures the dialog reflects the defaults when first opened or if no temp options were set.
  const numQuestions = currentGenerationOptions?.numQuestions ?? quizSettings.defaultNumQuestions;
  const questionTypes = currentGenerationOptions?.questionTypes ?? quizSettings.defaultMode;

  // Check if the 'AI Determine Count' option is active, which disables manual count selection
  const isNumQuestionsDisabled = questionTypes.aiGenerateCount;

  /**
   * Updates the temporary number of questions for the next generation.
   * Only applies if 'AI Determine Count' is off.
   * @param value The desired number of questions.
   */
  const handleNumQuestionsChange = (value: number) => {
    // Ignore changes if AI is deciding the count
    if (!questionTypes.aiGenerateCount) {
      dispatch(setGenerationOptions({
        // Spread existing temporary options to preserve other settings (like questionTypes)
        ...currentGenerationOptions,
        // Make sure the current question types are explicitly passed to avoid reverting to default
        questionTypes: questionTypes,
        numQuestions: value // Update only the number of questions
      }));
    }
  };

  /**
   * Updates the temporary question type selection (Multiple Choice, Typed Answer) for the next generation.
   * Prevents disabling the last active question type.
   * @param type The question type being toggled.
   * @param value The new state of the toggle.
   */
  const handleQuestionTypeChange = (type: keyof typeof questionTypes, value: boolean) => {
    // Determine if the other primary question type is currently active
    const otherIsActive = type === 'multipleChoice'
      ? questionTypes.typedAnswer
      : questionTypes.multipleChoice;

    // Prevent unchecking if this is the last active primary type
    if (!value && !otherIsActive && (type === 'multipleChoice' || type === 'typedAnswer')) {
      return; // Stop the update
    }

    // Dispatch update, preserving other temporary options (like numQuestions)
    dispatch(setGenerationOptions({
      ...currentGenerationOptions,
      // Update the specific question type within the questionTypes object
      questionTypes: { ...questionTypes, [type]: value }
    }));
  };

  /**
   * Handles toggling the 'AI Determine Count' option for the next generation.
   * @param checked The new state of the toggle.
   */
  const handleAiCountToggle = (checked: boolean) => {
    // Dispatch update, preserving other temporary options
    dispatch(setGenerationOptions({
      ...currentGenerationOptions,
      // Update the aiGenerateCount flag within the questionTypes object
      questionTypes: { ...questionTypes, aiGenerateCount: checked }
    }));
  };

  return (
    // Dialog controlled by Redux state `showOptionsDialog`
    <Dialog open={showOptionsDialog} onOpenChange={() => dispatch(toggleOptionsDialog())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quiz Generation Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Section for Number of Questions */}
          <div className="space-y-2">
            {/* Label changes text and style if AI decides count */}
            <Label htmlFor="question-count-slider" className={isNumQuestionsDisabled ? "text-muted-foreground" : ""}>
              Number of Questions {isNumQuestionsDisabled ? '(AI Decides)' : ''}
            </Label>
            <div className="flex items-center gap-4">
              {/* Slider for selecting number of questions */}
              <Slider
                id="question-count-slider" // Add id for label
                value={[numQuestions]}
                min={1}
                max={20}
                step={1}
                onValueChange={([value]) => handleNumQuestionsChange(value)}
                className="flex-1"
                disabled={isNumQuestionsDisabled} // Disable if AI decides count
                aria-label="Number of questions slider"
              />
              {/* Input field as an alternative way to set the number */}
              <Input
                id="question-count-input" // Use different id
                value={numQuestions}
                onChange={(e) => handleNumQuestionsChange(Number(e.target.value))}
                className="w-16 text-center"
                type="number"
                min={1}
                max={20}
                disabled={isNumQuestionsDisabled} // Disable if AI decides count
                aria-label="Number of questions input"
              />
            </div>
          </div>

          {/* Section for Question Types */}
          <div className="space-y-4">
            <Label>Question Types</Label>
            {/* Toggle for Multiple Choice */}
            <div className="flex items-center justify-between">
              <Label htmlFor="multiple-choice">Multiple Choice</Label>
              <Switch
                id="multiple-choice"
                checked={questionTypes.multipleChoice}
                onCheckedChange={(isChecked) => handleQuestionTypeChange('multipleChoice', isChecked)}
                // Prevent unchecking if Typed Answer is also unchecked
                disabled={!questionTypes.multipleChoice && !questionTypes.typedAnswer}
                aria-label="Toggle multiple choice questions for next generation"
              />
            </div>
            {/* Toggle for Typed Answer */}
            <div className="flex items-center justify-between">
              <Label htmlFor="typed-answer">Typed Answer</Label>
              <Switch
                id="typed-answer"
                checked={questionTypes.typedAnswer}
                onCheckedChange={(isChecked) => handleQuestionTypeChange('typedAnswer', isChecked)}
                 // Prevent unchecking if Multiple Choice is also unchecked
                disabled={!questionTypes.typedAnswer && !questionTypes.multipleChoice}
                aria-label="Toggle typed answer questions for next generation"
              />
            </div>
            {/* Toggle for AI Determine Count */}
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-generate-count">Let AI Determine Count</Label>
              <Switch
                id="ai-generate-count"
                checked={questionTypes.aiGenerateCount}
                onCheckedChange={handleAiCountToggle} // Use the specific handler
                aria-label="Toggle AI determining question count for next generation"
              />
            </div>
          </div>
        </div>
        {/* Button to close the dialog and proceed (options are already saved in Redux temp state) */}
        <div className="flex justify-end">
          <Button onClick={() => dispatch(toggleOptionsDialog())}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}