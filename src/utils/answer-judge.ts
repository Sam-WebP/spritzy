import { TypedAnswerQuestion } from '@/types';

export async function judgeTypedAnswer(
  question: TypedAnswerQuestion,
  userAnswer: string,
  apiKey: string,
  model: string
): Promise<{ isCorrect: boolean; feedback: string }> {
  if (!apiKey) {
    // Fallback to simple contains check if no API key
    const isCorrect = userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase());
    return {
      isCorrect,
      feedback: isCorrect 
        ? 'Your answer appears correct' 
        : `The expected answer was: ${question.correctAnswer}`
    };
  }

  const prompt = `Evaluate if the user's answer is correct for the given question and context.
  
Question: ${question.question}
Context: ${question.context}
Correct Answer: ${question.correctAnswer}
User Answer: ${userAnswer}

Evaluate if the user's answer is correct, considering:
- Semantic similarity to correct answer
- Coverage of key concepts
- Logical consistency with context

Return JSON with structure: { "isCorrect": boolean, "feedback": string }`;

  try {
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
          { role: 'system', content: prompt },
          { role: 'user', content: 'Please evaluate this answer.' }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    
    if (!content) throw new Error('No evaluation returned');
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error judging answer:', error);
    return {
      isCorrect: false,
      feedback: 'Error evaluating answer. Please try again.'
    };
  }
}
