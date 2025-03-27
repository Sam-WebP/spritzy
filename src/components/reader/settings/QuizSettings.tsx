'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setQuizSettings } from '@/redux/slices/quizSlice';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const AVAILABLE_MODELS = [
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'openai/gpt-4o-2024-11-20', name: 'GPT-4o' },
  { id: 'google/gemini-2.0-pro-exp-02-05:free', name: 'Gemini Pro 2.0' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini Flash 2.0' },
];

export default function QuizSettings() {
  const dispatch = useAppDispatch();
  // Retrieve current quiz settings from Redux state
  const { quizSettings } = useAppSelector(state => state.quiz);
  const { defaultMode, defaultNumQuestions, apiKey, selectedModel } = quizSettings;

  /**
   * Handles changes to the default question type toggles (Multiple Choice, Typed Answer).
   * Ensures that at least one question type remains active.
   * @param key The specific question type being changed ('multipleChoice' or 'typedAnswer').
   * @param value The new boolean state of the toggle.
   */
  const handleDefaultModeChange = (key: keyof typeof defaultMode, value: boolean) => {
    // Check if the *other* primary question type is active
    const otherIsActive = key === 'multipleChoice'
      ? defaultMode.typedAnswer
      : defaultMode.multipleChoice;

    // Prevent unchecking the last active primary question type
    if (!value && !otherIsActive && (key === 'multipleChoice' || key === 'typedAnswer')) {
      console.warn("Cannot disable the last active question type.");
      return; // Exit without dispatching if it's the last one
    }

    // Dispatch the update to the Redux store
    dispatch(setQuizSettings({
      defaultMode: { ...defaultMode, [key]: value }
    }));
  };

  /**
   * Handles changes to the default number of questions slider.
   * Only updates the state if the "Let AI Determine Count" option is disabled.
   * @param value The new value from the slider.
   */
  const handleNumQuestionsChange = (value: number) => {
    // Ignore slider changes if AI is set to determine the count
    if (!defaultMode.aiGenerateCount) {
      dispatch(setQuizSettings({ defaultNumQuestions: value }));
    }
  };

  /**
   * Handles toggling the "Let AI Determine Count" switch.
   * Updates the corresponding state in Redux.
   * @param checked The new boolean state of the toggle.
   */
  const handleAiCountToggle = (checked: boolean) => {
    // Update the aiGenerateCount flag in the default mode settings
    dispatch(setQuizSettings({
      defaultMode: { ...defaultMode, aiGenerateCount: checked }
    }));
  };

  // Determine if the number of questions input/slider should be disabled
  const isNumQuestionsDisabled = defaultMode.aiGenerateCount;

  return (
    <div className="space-y-6">
      {/* Section for OpenRouter API Key input */}
      <div className="space-y-2">
        <Label htmlFor="api-key">OpenRouter API Key</Label>
        <Input
          id="api-key"
          type="password" // Hide the key visually
          value={apiKey}
          onChange={(e) => dispatch(setQuizSettings({ apiKey: e.target.value }))}
          placeholder="Enter your OpenRouter API key"
          aria-label="OpenRouter API Key Input"
        />
        <p className="text-xs text-muted-foreground">
          {/* Security reassurance and link to get a key */}
          Your API key is stored locally and never sent to our servers.
          Get a key at <a href="https://openrouter.ai" className="underline" target="_blank" rel="noopener noreferrer">openrouter.ai</a>
        </p>
      </div>

      {/* Section for selecting the AI model */}
      <div className="space-y-2">
        <Label htmlFor="model-select">AI Model</Label>
        <Select
          value={selectedModel}
          onValueChange={(value) => dispatch(setQuizSettings({ selectedModel: value }))}
        >
          <SelectTrigger id="model-select" aria-label="Select AI Model">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {/* Map through available models to create dropdown items */}
            {AVAILABLE_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {/* Important note regarding API key compatibility */}
          Ensure your API key has access to the selected model.
        </p>
      </div>

      {/* Section for setting the default number of questions */}
      <div className="space-y-2">
        <div className="flex justify-between">
          {/* Label updates based on whether AI determines the count */}
          <Label htmlFor="num-questions-slider" className={isNumQuestionsDisabled ? "text-muted-foreground" : ""}>
            Default Number of Questions: {isNumQuestionsDisabled ? '(AI Decides)' : defaultNumQuestions}
          </Label>
        </div>
        <Slider
          id="num-questions-slider" // Add id for label association
          value={[defaultNumQuestions]}
          min={1}
          max={20}
          step={1}
          onValueChange={([value]) => handleNumQuestionsChange(value)}
          disabled={isNumQuestionsDisabled} // Disable slider if AI determines count
          aria-label="Default number of questions slider"
        />
        {/* Min/Max labels for the slider */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      {/* Section for selecting default question types */}
      <div className="space-y-4">
        <Label>Default Question Types</Label>
        {/* Toggle for Multiple Choice questions */}
        <div className="flex items-center justify-between">
          <Label htmlFor="default-multiple-choice">Multiple Choice</Label>
          <Switch
            id="default-multiple-choice"
            checked={defaultMode.multipleChoice}
            onCheckedChange={(isChecked) => handleDefaultModeChange('multipleChoice', isChecked)}
            // Disable unchecking if it's the only active type
            disabled={!defaultMode.multipleChoice && !defaultMode.typedAnswer}
            aria-label="Toggle default multiple choice questions"
          />
        </div>
        {/* Toggle for Typed Answer questions */}
        <div className="flex items-center justify-between">
          <Label htmlFor="default-typed-answer">Typed Answer</Label>
          <Switch
            id="default-typed-answer"
            checked={defaultMode.typedAnswer}
            onCheckedChange={(isChecked) => handleDefaultModeChange('typedAnswer', isChecked)}
            // Disable unchecking if it's the only active type
            disabled={!defaultMode.typedAnswer && !defaultMode.multipleChoice}
            aria-label="Toggle default typed answer questions"
          />
        </div>
        {/* Toggle for letting AI determine the question count */}
        <div className="flex items-center justify-between">
          <Label htmlFor="default-ai-count">Let AI Determine Count</Label>
          <Switch
            id="default-ai-count"
            checked={defaultMode.aiGenerateCount}
            onCheckedChange={handleAiCountToggle} // Use dedicated handler
            aria-label="Toggle AI determining question count"
          />
        </div>
      </div>
    </div>
  );
}