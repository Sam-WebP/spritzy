'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentQuiz, setLoading, setError, toggleOptionsDialog } from '@/redux/slices/quizSlice';
import { generateQuiz } from '@/utils/quiz-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Settings } from 'lucide-react';

export default function QuizGenerator() {
  const dispatch = useAppDispatch();
  const { quizSettings, generationOptions } = useAppSelector(state => state.quiz);
  const { text } = useAppSelector(state => state.reader);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!text.trim()) {
      dispatch(setError('There is no text to create a quiz from. Please add some text to the reader first.'));
      return;
    }

    setIsGenerating(true);
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const numQuestions = generationOptions?.questionTypes?.aiGenerateCount
        ? undefined
        : generationOptions?.numQuestions || quizSettings.defaultNumQuestions;

      const quiz = await generateQuiz(
        text,
        numQuestions,
        quizSettings.apiKey,
        quizSettings.selectedModel,
        generationOptions?.questionTypes || quizSettings.defaultMode
      );
      dispatch(setCurrentQuiz(quiz));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setError('Failed to generate quiz. Please try again.'));
      }
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Quiz on Current Text
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleOptionsDialog())}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate a quiz based on the current text in the reader.
        </p>

        {!quizSettings.apiKey && (
          <p className="text-amber-500 text-sm">
            No API key set. You can add your OpenRouter API key in the Settings under the Quiz tab.
            Using mock questions for demonstration.
          </p>
        )}

        <Button
          className="w-full"
          onClick={handleGenerateQuiz}
          disabled={!text.trim() || isGenerating}
          data-testid="generate-quiz-dialog-button"
        >
          {isGenerating ? 'Generating...' : 'Generate Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
}
