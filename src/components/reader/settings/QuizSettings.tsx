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

  const handleDefaultModeChange = (key: keyof typeof quizSettings.defaultMode, value: boolean) => {
    dispatch(setQuizSettings({ 
      defaultMode: { ...quizSettings.defaultMode, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="api-key">OpenRouter API Key</Label>
        <Input
          id="api-key"
          type="password"
          value={quizSettings.apiKey}
          onChange={(e) => dispatch(setQuizSettings({ apiKey: e.target.value }))}
          placeholder="Enter your OpenRouter API key"
        />
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally and never sent to our servers.
          Get a key at <a href="https://openrouter.ai" className="underline" target="_blank" rel="noopener">openrouter.ai</a>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model-select">AI Model</Label>
        <Select
          value={quizSettings.selectedModel}
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
          Different models may have different capabilities and costs.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Default Number of Questions: {quizSettings.defaultNumQuestions}</Label>
        </div>
        <Slider
          value={[quizSettings.defaultNumQuestions]}
          min={1}
          max={20}
          step={1}
          onValueChange={([value]) => dispatch(setQuizSettings({ defaultNumQuestions: value }))}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Default Question Types</Label>
        <div className="flex items-center justify-between">
          <Label htmlFor="default-multiple-choice">Multiple Choice</Label>
          <Switch
            id="default-multiple-choice"
            checked={quizSettings.defaultMode.multipleChoice}
            onCheckedChange={(checked) => handleDefaultModeChange('multipleChoice', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="default-typed-answer">Typed Answer</Label>
          <Switch
            id="default-typed-answer"
            checked={quizSettings.defaultMode.typedAnswer}
            onCheckedChange={(checked) => handleDefaultModeChange('typedAnswer', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="default-ai-count">Let AI Determine Count</Label>
          <Switch
            id="default-ai-count"
            checked={quizSettings.defaultMode.aiGenerateCount}
            onCheckedChange={(checked) => handleDefaultModeChange('aiGenerateCount', checked)}
          />
        </div>
      </div>
    </div>
  );
}
