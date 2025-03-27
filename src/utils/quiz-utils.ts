import { Quiz, QuizOptionSelection, MultipleChoiceQuestion, TypedAnswerQuestion, QuizQuestion } from '@/types';

// Updated Mock Quiz Logic
function createMockQuiz(text: string, numQuestions: number, questionTypes: QuizOptionSelection): Quiz {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const words = text.split(/\s+/).filter(w => w.length > 4);

  // Ensure at least one type is selected for mock generation
  const canBeMC = questionTypes.multipleChoice;
  const canBeTyped = questionTypes.typedAnswer;
  if (!canBeMC && !canBeTyped) {
    // Default to MC if somehow both are off (shouldn't happen with UI checks)
    questionTypes.multipleChoice = true;
  }

  const questions: QuizQuestion[] = []; // Use the union type

  for (let i = 0; i < numQuestions; i++) {
    const sentence = sentences[i % sentences.length] || `Content from paragraph ${i+1}`;
    let isMultipleChoice: boolean;

    if (canBeMC && canBeTyped) {
      isMultipleChoice = Math.random() > 0.5; // Random if both allowed
    } else if (canBeMC) {
      isMultipleChoice = true; // Only MC allowed
    } else {
      isMultipleChoice = false; // Only Typed allowed
    }

    const qId = (i + 1).toString();
    const randomWord = (index: number) => words[index % words.length] || `concept ${index + 1}`;

    if (isMultipleChoice) {
      const question: MultipleChoiceQuestion = {
        id: qId,
        question: `Regarding "${sentence.trim().slice(0, 40)}...", which statement is most accurate based on the text?`,
        type: 'multiple-choice',
        options: [
          `It relates to ${randomWord(i * 4)}`,
          `It signifies ${randomWord(i * 4 + 1)}`,
          `It contrasts with ${randomWord(i * 4 + 2)}`,
          `It explains ${randomWord(i * 4 + 3)}`,
        ],
        correctOptionIndex: i % 4
      };
      questions.push(question);
    } else {
      const question: TypedAnswerQuestion = {
        id: qId,
        question: `What is the main point or significance of "${sentence.trim().slice(0, 40)}..." according to the text?`,
        type: 'typed-answer',
        correctAnswer: `The significance is ${randomWord(i)}.`, // Simple mock answer
        context: sentence, // Provide context
      };
      questions.push(question);
    }
  }

  return {
    id: Date.now().toString(),
    title: `Mock Quiz: ${text.slice(0, 30)}...`,
    description: `A ${numQuestions}-question mock quiz`,
    questions,
  };
}

// Updated Generate Quiz Function (mainly the prompt)
export async function generateQuiz(
  text: string,
  numQuestions: number | undefined, // Allow undefined for AI count
  apiKey: string,
  model: string,
  questionTypes: QuizOptionSelection
): Promise<Quiz> {

  // Determine requested types
  const requestedTypes: string[] = [];
  if (questionTypes.multipleChoice) requestedTypes.push("multiple-choice");
  if (questionTypes.typedAnswer) requestedTypes.push("typed-answer");

  // Handle edge case where no types are selected (should be prevented by UI)
  if (requestedTypes.length === 0) {
    questionTypes.multipleChoice = true; // Default to MC
    requestedTypes.push("multiple-choice");
  }

  const numQuestionsString = questionTypes.aiGenerateCount
    ? "an appropriate number of (typically 3-7)" // Guide AI if it determines count
    : `${numQuestions || 5}`; // Use specified or default if not AI count

  // Refined System Prompt
  const systemPrompt = `You are an expert quiz generator. Based *only* on the provided text, create a quiz to test the reader's comprehension.
Generate exactly ${numQuestionsString} questions.
Generate *only* the following question types: ${requestedTypes.join(' and ')}. Do NOT generate any other types.

For multiple-choice questions:
- Ensure options are plausible but only one is correct according to the text.
- Provide the 0-based index of the correct option.

For typed-answer questions:
- The question should ask for specific information found in the text.
- Provide the exact, concise answer expected based *only* on the text.
- Include a 'context' field containing the specific sentence(s) from the text needed to answer the question.

Format the entire response as a single, valid JSON object matching this structure:
{
  "title": "Quiz on Provided Text",
  "description": "A quiz testing comprehension of the text.",
  "questions": [
    {
      "id": "1", // unique string ID for each question
      "question": "The question text?",
      "type": "multiple-choice", // or "typed-answer"
      // --- For multiple-choice ONLY ---
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 1, // 0-based index
      // --- For typed-answer ONLY ---
      "correctAnswer": "The exact answer derived from the text.",
      "context": "The relevant sentence(s) quoted directly from the text."
    }
    // ... more questions
  ]
}

Strictly adhere to the JSON format. Do not include explanations outside the JSON structure.

Text for Quiz Generation:
--- START TEXT ---
${text}
--- END TEXT ---
`;

  try {
    // Use mock quiz if no API key is provided
    if (!apiKey) {
      console.warn("No API key provided. Generating mock quiz.");
      return createMockQuiz(text, numQuestions || 5, questionTypes);
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Add referrer and app name for OpenRouter policy compliance
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
        'X-Title': 'Spritzy Speed Reader',
      },
      body: JSON.stringify({
        model,
        messages: [
          // System prompt defines the task and structure
          { role: 'system', content: systemPrompt },
          // User prompt triggers the generation based on the system instructions
          { role: 'user', content: 'Generate the quiz now based on the text and instructions provided.' }
        ],
        temperature: 0.6, // Slightly lower temp for more consistent structure
        max_tokens: 1500, // Increased token limit
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: `Request failed with status ${response.status}` } };
      }
      console.error("API Error Response:", errorData);
      throw new Error(
        errorData.error?.message ||
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("API Response Data:", data);
      throw new Error('No quiz content returned from API');
    }

    let quizData;
    try {
      quizData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse API response:', content, parseError);
      throw new Error('Invalid JSON format received from API.');
    }

    if (!quizData || typeof quizData !== 'object' || !Array.isArray(quizData.questions)) {
      console.error('Invalid quiz structure: questions array not found or invalid.', quizData);
      throw new Error('Invalid quiz structure received from API.');
    }

     // Add IDs if missing
     // Fix: Explicitly type 'q' as 'any' here before validation/casting
    quizData.questions.forEach((q: unknown, index: number) => {
      // Check if 'q' is a non-null object before accessing properties
      if (q && typeof q === 'object') {
          // Now we can safely attempt to access properties, but 'q' is still 'object'
          // We need to assert the type or check for property existence
          const questionObject = q as Partial<QuizQuestion>; // Use Partial for safe access
  
          if (!questionObject.id) {
              // Assign ID only if it doesn't exist
              (q as { id?: string }).id = (index + 1).toString();
          }
  
          // Optional: Add more validation here for required fields like 'question', 'type'
          if (!questionObject.question || typeof questionObject.question !== 'string') {
            console.warn(`Question at index ${index} is missing or has invalid 'question' property.`);
            // Handle invalid question (e.g., filter it out later or throw error)
          }
          if (!questionObject.type || (questionObject.type !== 'multiple-choice' && questionObject.type !== 'typed-answer')) {
             console.warn(`Question at index ${index} is missing or has invalid 'type' property.`);
             // Handle invalid question
          }
      } else {
          console.warn(`Invalid item found in questions array at index ${index}:`, q);
          // Handle invalid item (e.g., filter it out later)
      }
    });

    return {
      id: Date.now().toString(),
      title: quizData.title || 'Generated Quiz',
      description: quizData.description || 'Test your knowledge',
      questions: quizData.questions as QuizQuestion[] // Cast after validation and adding IDs
    };
    
  } catch (error) {
    console.error('Error during quiz generation:', error);
    // Rethrow a more user-friendly message
    if (error instanceof Error) {
      throw new Error(`Quiz generation failed: ${error.message}. Please check your API key, model access, and connection.`);
    }
    throw new Error('An unknown error occurred during quiz generation.');
  }
}