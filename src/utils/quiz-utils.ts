import { Quiz, QuizOptionSelection, MultipleChoiceQuestion, TypedAnswerQuestion, QuizQuestion } from '@/types';

/**
 * Creates a mock quiz based on the provided text.
 * Used as a fallback when an API key is not available or generation fails.
 * Tries to generate questions based on selected types.
 * @param text The source text for the quiz.
 * @param numQuestions The desired number of questions.
 * @param questionTypes The types of questions requested (MC, Typed).
 * @returns A mock Quiz object.
 */
function createMockQuiz(text: string, numQuestions: number, questionTypes: QuizOptionSelection): Quiz {
  // Basic text processing to get sentences and words for mock content
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20); // Filter short sentences
  const words = text.split(/\s+/).filter(w => w.length > 4); // Filter short words

  // Ensure at least one question type is selected, defaulting to Multiple Choice if not.
  const canBeMC = questionTypes.multipleChoice;
  const canBeTyped = questionTypes.typedAnswer;
  // This check prevents errors if UI somehow allows disabling both, although UI logic should prevent this.
  if (!canBeMC && !canBeTyped) {
    console.warn("Mock Quiz: Both question types were disabled, defaulting to Multiple Choice.");
    questionTypes.multipleChoice = true; // Ensure at least one type is possible
  }

  const questions: QuizQuestion[] = []; // Array to hold the generated mock questions

  // Generate the requested number of mock questions
  for (let i = 0; i < numQuestions; i++) {
    // Select a sentence and determine question type based on availability and randomness
    const sentence = sentences[i % sentences.length] || `Content from paragraph ${i+1}`; // Cycle through sentences
    let isMultipleChoice: boolean;

    if (canBeMC && canBeTyped) {
      isMultipleChoice = Math.random() > 0.5; // 50/50 chance if both are allowed
    } else if (canBeMC) {
      isMultipleChoice = true; // Must be MC if only MC is allowed
    } else {
      isMultipleChoice = false; // Must be Typed if only Typed is allowed
    }

    const qId = (i + 1).toString(); // Simple sequential ID for mock questions
    // Helper to get a somewhat relevant random word for mock answers/questions
    const randomWord = (index: number) => words[index % words.length] || `concept ${index + 1}`;

    // Create either a Multiple Choice or Typed Answer mock question
    if (isMultipleChoice) {
      const question: MultipleChoiceQuestion = {
        id: qId,
        question: `Regarding "${sentence.trim().slice(0, 40)}...", which statement is most accurate based on the text?`, // Generic MC question stem
        type: 'multiple-choice',
        options: [ // Generate plausible-looking but random options
          `It relates to ${randomWord(i * 4)}`,
          `It signifies ${randomWord(i * 4 + 1)}`,
          `It contrasts with ${randomWord(i * 4 + 2)}`,
          `It explains ${randomWord(i * 4 + 3)}`,
        ],
        correctOptionIndex: i % 4 // Arbitrarily assign a correct answer index
      };
      questions.push(question);
    } else {
      const question: TypedAnswerQuestion = {
        id: qId,
        question: `What is the main point or significance of "${sentence.trim().slice(0, 40)}..." according to the text?`, // Generic Typed question stem
        type: 'typed-answer',
        correctAnswer: `The significance is ${randomWord(i)}.`, // Simple placeholder correct answer
        context: sentence, // Include the sentence as context for potential evaluation
      };
      questions.push(question);
    }
  }

  // Construct the final mock Quiz object
  return {
    id: `mock-${Date.now().toString()}`, // Unique ID for the mock quiz
    title: `Mock Quiz: ${text.slice(0, 30)}...`,
    description: `A ${numQuestions}-question mock quiz based on the provided text.`,
    questions,
  };
}

/**
 * Generates a quiz using the OpenRouter API based on provided text and options.
 * Falls back to `createMockQuiz` if no API key is provided.
 * @param text The source text for quiz generation.
 * @param numQuestions The desired number of questions, or undefined if AI should decide.
 * @param apiKey The user's OpenRouter API key.
 * @param model The selected AI model ID (e.g., 'openai/gpt-4o').
 * @param questionTypes The requested types of questions and whether AI determines the count.
 * @returns A Promise resolving to the generated Quiz object.
 * @throws An error if API request or parsing fails.
 */
export async function generateQuiz(
  text: string,
  numQuestions: number | undefined,
  apiKey: string,
  model: string,
  questionTypes: QuizOptionSelection
): Promise<Quiz> {

  // Determine which question types are actually requested
  const requestedTypes: string[] = [];
  if (questionTypes.multipleChoice) requestedTypes.push("multiple-choice");
  if (questionTypes.typedAnswer) requestedTypes.push("typed-answer");

  // Ensure at least one type is requested, defaulting to MC if none selected (UI should prevent this)
  if (requestedTypes.length === 0) {
    console.warn("generateQuiz: No question types selected, defaulting to Multiple Choice.");
    questionTypes.multipleChoice = true;
    requestedTypes.push("multiple-choice");
  }

  // Determine the string representation for the number of questions for the prompt
  const numQuestionsString = questionTypes.aiGenerateCount
    ? "an appropriate number of (typically 3-7)" // Provide guidance if AI decides
    : `${numQuestions || 5}`; // Use specified number or default to 5

  // Construct the detailed system prompt for the AI model
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
    // If no API key is provided, generate and return a mock quiz immediately
    if (!apiKey) {
      console.warn("No API key provided. Generating mock quiz.");
      return createMockQuiz(text, numQuestions || 5, questionTypes);
    }

    // Make the API call to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Required headers for OpenRouter policy compliance
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost', // Your app's origin
        'X-Title': 'Spritzy Speed Reader', // Your app's name
      },
      body: JSON.stringify({
        model: model, // The selected AI model
        messages: [
          { role: 'system', content: systemPrompt }, // Provide the detailed instructions
          { role: 'user', content: 'Generate the quiz now based on the text and instructions provided.' } // Trigger the generation
        ],
        temperature: 0.6, // Control creativity vs. determinism (lower is more focused)
        max_tokens: 1500, // Limit the response length
        response_format: { type: 'json_object' } // Request JSON output directly
      })
    });

    // Handle API errors (non-2xx responses)
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json(); // Try to parse error details from response body
      } catch {
        errorData = { error: { message: `Request failed with status ${response.status}` } }; // Fallback error
      }
      console.error("API Error Response:", errorData);
      // Throw a descriptive error including details from the API if possible
      throw new Error(
        errorData.error?.message ||
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    // Parse the successful JSON response
    const data = await response.json();

    // Extract the generated content
    const content = data?.choices?.[0]?.message?.content;

    // Handle cases where the API response is missing the expected content
    if (!content) {
      console.error("API Response Data Missing Content:", data);
      throw new Error('No quiz content returned from API');
    }

    // Parse the JSON string content into a JavaScript object
    let quizData;
    try {
      quizData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse API response JSON:', content, parseError);
      throw new Error('Invalid JSON format received from API.');
    }

    // Basic validation of the parsed quiz structure
    if (!quizData || typeof quizData !== 'object' || !Array.isArray(quizData.questions)) {
      console.error('Invalid quiz structure received:', quizData);
      throw new Error('Invalid quiz structure received from API.');
    }

     // Ensure each question has an ID, adding one sequentially if missing
     // Use 'unknown' for type safety during iteration
    quizData.questions.forEach((q: unknown, index: number) => {
      if (q && typeof q === 'object') {
          // Assert structure partially for safe property access/assignment
          const questionObject = q as Partial<QuizQuestion>;
          if (!questionObject.id) {
              (q as { id?: string }).id = (index + 1).toString(); // Add ID if missing
          }
          // Further validation (optional but recommended)
          if (!questionObject.question || typeof questionObject.question !== 'string') {
             console.warn(`Generated question at index ${index} lacks a valid 'question' property.`);
          }
          // Add checks for 'type', 'options'/'correctOptionIndex' or 'correctAnswer'/'context' based on type
      } else {
           console.warn(`Invalid item in generated questions array at index ${index}.`);
      }
    });

    // Construct the final Quiz object to be returned
    return {
      id: `ai-${Date.now().toString()}`, // Unique ID for the AI-generated quiz
      title: quizData.title || 'Generated Quiz', // Use title from API or default
      description: quizData.description || 'Test your knowledge', // Use description from API or default
      // Assert the final type after potentially adding IDs and validation
      questions: quizData.questions as QuizQuestion[]
    };

  } catch (error) {
    // Catch and log any errors during the process
    console.error('Error during quiz generation process:', error);
    // Re-throw a user-friendly error message
    if (error instanceof Error) {
      // Append helpful context to the original error message
      throw new Error(`Quiz generation failed: ${error.message}. Please check your API key, model access, and connection.`);
    }
    // Fallback for non-Error objects thrown
    throw new Error('An unknown error occurred during quiz generation.');
  }
}