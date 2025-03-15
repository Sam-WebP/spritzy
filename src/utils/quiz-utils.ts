import { Quiz } from '@/types';

export async function generateQuiz(text: string, numQuestions: number, apiKey: string, model: string): Promise<Quiz> {
  const systemPrompt = `Based on the following text, create a multiple-choice quiz with ${numQuestions} questions to test the reader's comprehension.
  Format the response as a JSON object with the following structure:
  {
    "title": "Quiz Title",
    "description": "Brief description of the quiz",
    "questions": [
      {
        "id": "1",
        "question": "Question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctOptionIndex": 0 // Index of the correct answer (0-based)
      }
    ]
  }
  
  Here is the text to use as context:
  ${text}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Create a ${numQuestions}-question quiz based on the provided text.` }
  ];

  try {
    // For development/testing, return mock data if no API key
    if (!apiKey) {
      return createMockQuiz(text, numQuestions);
    }

    // Make the actual API call to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-3.5-turbo',
        messages,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from API');
    }

    const quizData = JSON.parse(content);
    return {
      id: Date.now().toString(),
      ...quizData
    };

  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}

// Create a mock quiz for testing/development
function createMockQuiz(text: string, numQuestions: number): Quiz {
  // Extract some text snippets to use in questions
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const words = text.split(/\s+/).filter(w => w.length > 4);
  
  return {
    id: Date.now().toString(),
    title: `Quiz on ${text.slice(0, 30)}...`,
    description: `A ${numQuestions}-question quiz to test your comprehension of the text`,
    questions: Array.from({ length: numQuestions }, (_, i) => {
      // Use text from the original content if available
      const sentence = sentences[i % sentences.length] || `Content from paragraph ${i+1}`;
      return {
        id: (i + 1).toString(),
        question: `What is the meaning of "${sentence.trim().slice(0, 40)}..." in the text?`,
        options: [
          `Answer is related to ${words[i*4 % words.length] || 'concept 1'}`,
          `Answer is about ${words[(i*4+1) % words.length] || 'concept 2'}`,
          `Answer refers to ${words[(i*4+2) % words.length] || 'concept 3'}`,
          `Answer explains ${words[(i*4+3) % words.length] || 'concept 4'}`,
        ],
        correctOptionIndex: i % 4,
      };
    }),
  };
}