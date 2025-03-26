import { Quiz, QuizOptionSelection, MultipleChoiceQuestion, TypedAnswerQuestion } from '@/types';

function createMockQuiz(text: string, numQuestions: number, questionTypes: QuizOptionSelection): Quiz {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const words = text.split(/\s+/).filter(w => w.length > 4);
  
  const questions: (MultipleChoiceQuestion | TypedAnswerQuestion)[] = [];
  
  for (let i = 0; i < numQuestions; i++) {
    const sentence = sentences[i % sentences.length] || `Content from paragraph ${i+1}`;
    const isMultipleChoice = questionTypes.multipleChoice && 
      (!questionTypes.typedAnswer || Math.random() > 0.5);
    
    if (isMultipleChoice) {
      const question: MultipleChoiceQuestion = {
        id: (i + 1).toString(),
        question: `What is the meaning of "${sentence.trim().slice(0, 40)}..." in the text?`,
        type: 'multiple-choice',
        options: [
          `Answer is related to ${words[i*4 % words.length] || 'concept 1'}`,
          `Answer is about ${words[(i*4+1) % words.length] || 'concept 2'}`,
          `Answer refers to ${words[(i*4+2) % words.length] || 'concept 3'}`,
          `Answer explains ${words[(i*4+3) % words.length] || 'concept 4'}`,
        ],
        correctOptionIndex: i % 4
      };
      questions.push(question);
    } else {
      const question: TypedAnswerQuestion = {
        id: (i + 1).toString(),
        question: `Explain the significance of "${sentence.trim().slice(0, 40)}..." in the text?`,
        type: 'typed-answer',
        correctAnswer: `This refers to ${words[i % words.length] || 'important concept'} in the text.`,
        context: sentence,
      };
      questions.push(question);
    }
  }
  
  return {
    id: Date.now().toString(),
    title: `Quiz on ${text.slice(0, 30)}...`,
    description: `A ${numQuestions}-question quiz to test your comprehension of the text`,
    questions,
  };
}

export async function generateQuiz(
  text: string,
  numQuestions: number = 5,
  apiKey: string,
  model: string,
  questionTypes: QuizOptionSelection
): Promise<Quiz> {
  const systemPrompt = `Based on the following text, create a quiz with ${numQuestions || 'an appropriate number of'} questions to test the reader's comprehension. For typed-answer questions, include the relevant context from the text that helps judge the answer. The context should be a direct quote from the text that contains the information needed to answer the question.
  
  Question types to include:
  ${questionTypes.multipleChoice ? '- Multiple choice questions\n' : ''}
  ${questionTypes.typedAnswer ? '- Typed answer questions (require exact answer matching)\n' : ''}
  
  Format the response as a JSON object with the following structure:
  {
    "title": "Quiz Title",
    "description": "Brief description of the quiz",
    "questions": [
      {
        "id": "1",
        "question": "Question text",
        "type": "multiple-choice" or "typed-answer",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Only for multiple-choice
        "correctOptionIndex": 0, // Only for multiple-choice (0-based)
        "correctAnswer": "Exact expected answer" // Only for typed-answer
      }
    ]
  }
  
  Here is the text to use as context:
  ${text}`;

  try {
    if (!apiKey) {
      return createMockQuiz(text, numQuestions, questionTypes);
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: 'Please generate the quiz based on the provided text.'
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Handle different response structures
    const content = data?.choices?.[0]?.message?.content || 
                   data?.result?.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No quiz content returned from API');
    }

    let quizData;
    try {
      quizData = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      throw new Error('Failed to parse quiz data from API response');
    }

    // Basic validation of quiz structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz format returned from API');
    }

    return {
      id: Date.now().toString(),
      title: quizData.title || 'Generated Quiz',
      description: quizData.description || 'Test your knowledge',
      questions: quizData.questions
    };

  } catch (error) {
    console.error('Error generating quiz:', error);
    if (error instanceof Error) {
      throw new Error(`Quiz generation failed: ${error.message}`);
    }
    throw new Error('Quiz generation failed due to an unknown error');
  }
}
