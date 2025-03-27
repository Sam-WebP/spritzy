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
  const { quizSettings } = useAppSelector(state => state.quiz);
  const { defaultMode, defaultNumQuestions, apiKey, selectedModel } = quizSettings;

  const handleDefaultModeChange = (key: keyof typeof defaultMode, value: boolean) => {
    const otherIsActive = key === 'multipleChoice'
      ? defaultMode.typedAnswer
      : defaultMode.multipleChoice;

    // Prevent disabling the last active type
    if (!value && !otherIsActive && (key === 'multipleChoice' || key === 'typedAnswer')) {
      return; // Don't allow unchecking the last one
    }

    dispatch(setQuizSettings({
      defaultMode: { ...defaultMode, [key]: value }
    }));
  };

  const handleNumQuestionsChange = (value: number) => {
    // Only update if AI count is not enabled
    if (!defaultMode.aiGenerateCount) {
      dispatch(setQuizSettings({ defaultNumQuestions: value }));
    }
  };

  const handleAiCountToggle = (checked: boolean) => {
    dispatch(setQuizSettings({
      defaultMode: { ...defaultMode, aiGenerateCount: checked }
    }));
  };

  const isNumQuestionsDisabled = defaultMode.aiGenerateCount;

  return (
    <div className="space-y-6">
      {/* API Key */}
      <div className="space-y-2">
        <Label htmlFor="api-key">OpenRouter API Key</Label>
        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => dispatch(setQuizSettings({ apiKey: e.target.value }))}
          placeholder="Enter your OpenRouter API key"
        />
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally and never sent to our servers.
          Get a key at <a href="https://openrouter.ai" className="underline" target="_blank" rel="noopener noreferrer">openrouter.ai</a>
        </p>
      </div>

      {/* AI Model */}
      <div className="space-y-2">
        <Label htmlFor="model-select">AI Model</Label>
        <Select
          value={selectedModel}
          onValueChange={(value) => dispatch(setQuizSettings({ selectedModel: value }))}
        >
          <SelectTrigger id="model-select">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Ensure your API key has access to the selected model.
        </p>
      </div>

      {/* Default Number of Questions */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className={isNumQuestionsDisabled ? "text-muted-foreground" : ""}>
            Default Number of Questions: {isNumQuestionsDisabled ? '(AI Decides)' : defaultNumQuestions}
          </Label>
        </div>
        <Slider
          value={[defaultNumQuestions]}
          min={1}
          max={20}
          step={1}
          onValueChange={([value]) => handleNumQuestionsChange(value)}
          disabled={isNumQuestionsDisabled}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      {/* Default Question Types */}
      <div className="space-y-4">
        <Label>Default Question Types</Label>
        <div className="flex items-center justify-between">
          <Label htmlFor="default-multiple-choice">Multiple Choice</Label>
          <Switch
            id="default-multiple-choice"
            checked={defaultMode.multipleChoice}
            // Fix: Pass the received boolean directly
            onCheckedChange={(isChecked) => handleDefaultModeChange('multipleChoice', isChecked)}
            disabled={!defaultMode.multipleChoice && !defaultMode.typedAnswer} // Corrected logic for disabling
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="default-typed-answer">Typed Answer</Label>
          <Switch
            id="default-typed-answer"
            checked={defaultMode.typedAnswer}
             // Fix: Pass the received boolean directly
            onCheckedChange={(isChecked) => handleDefaultModeChange('typedAnswer', isChecked)}
            disabled={!defaultMode.typedAnswer && !defaultMode.multipleChoice} // Corrected logic for disabling
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="default-ai-count">Let AI Determine Count</Label>
          <Switch
            id="default-ai-count"
            checked={defaultMode.aiGenerateCount}
             // Fix: Pass the received boolean directly
            onCheckedChange={handleAiCountToggle}
          />
        </div>
      </div>
    </div>
  );
}