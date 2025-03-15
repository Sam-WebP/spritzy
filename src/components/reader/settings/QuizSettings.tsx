'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setApiKey, setSelectedModel, setNumQuestions } from '@/redux/slices/quizSlice';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Available models
const AVAILABLE_MODELS = [
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'openai/gpt-4', name: 'GPT-4' },
  { id: 'anthropic/claude-instant-v1', name: 'Claude Instant' },
  { id: 'anthropic/claude-2', name: 'Claude 2' },
  { id: 'google/palm-2', name: 'PaLM 2' },
];

export default function QuizSettings() {
  const dispatch = useAppDispatch();
  const { apiKey, selectedModel, numQuestions } = useAppSelector(state => state.quiz);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="api-key">OpenRouter API Key</Label>
        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => dispatch(setApiKey(e.target.value))}
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
          value={selectedModel}
          onValueChange={(value) => dispatch(setSelectedModel(value))}
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
          <Label>Number of Questions: {numQuestions}</Label>
        </div>
        <Slider
          value={[numQuestions]}
          min={3}
          max={10}
          step={1}
          onValueChange={([value]) => dispatch(setNumQuestions(value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}