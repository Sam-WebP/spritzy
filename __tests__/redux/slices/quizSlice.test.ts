import quizReducer, {
    setCurrentQuiz,
    nextQuestion,
    previousQuestion,
    answerQuestion,
    completeQuiz,
    resetQuiz,
    setLoading,
    setEvaluating,
    setError,
    setQuizSettings,
    setGenerationOptions,
    toggleQuizDialog,
    toggleOptionsDialog,
    storeEvaluationResult,
    showResults,
    quizInitialState
} from '@/redux/slices/quizSlice';
import { describe, it, expect } from 'vitest';
import type { Quiz, QuizSettings, QuizOptionSelection } from '@/types';

describe('quizSlice', () => {
    const sampleQuiz: Quiz = {
        id: '1',
        title: 'Sample Quiz',
        questions: [
            {
                id: 'q1',
                question: 'What is 2+2?',
                type: 'multiple-choice',
                options: ['3', '4', '5'],
                correctOptionIndex: 1
            }
        ]
    };

    const sampleSettings: QuizSettings = {
        apiKey: 'test-key',
        selectedModel: 'gpt-3.5',
        defaultNumQuestions: 5,
        defaultMode: {
            multipleChoice: true,
            typedAnswer: false,
            aiGenerateCount: false
        }
    };

    describe('initial state', () => {
        it('should return the initial state', () => {
            expect(quizReducer(undefined, { type: 'unknown' })).toEqual(quizInitialState);
        });
    });

    describe('setCurrentQuiz', () => {
        it('should set the current quiz and initialize state', () => {
            const newState = quizReducer(quizInitialState, setCurrentQuiz(sampleQuiz));
            expect(newState.currentQuiz).toEqual(sampleQuiz);
            expect(newState.currentQuestionIndex).toBe(0);
            expect(newState.userAnswers).toEqual([-1]); // Array length matches question count
            expect(newState.isCompleted).toBe(false);
            expect(newState.evaluationResults).toEqual({});
        });

        it('should reset state when payload is null', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                currentQuestionIndex: 1,
                userAnswers: [1],
                isCompleted: true
            };
            const newState = quizReducer(stateWithQuiz, setCurrentQuiz(null));
            expect(newState).toEqual(quizInitialState);
        });
    });

    describe('nextQuestion', () => {
        it('should increment currentQuestionIndex when not at end', () => {
            const extendedQuiz = {
                ...sampleQuiz,
                questions: [
                    ...sampleQuiz.questions,
                    {
                        id: 'q2',
                        question: 'What is 3+3?',
                        type: 'multiple-choice' as const,
                        options: ['5', '6', '7'],
                        correctOptionIndex: 1
                    }
                ]
            };

            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: extendedQuiz,
                currentQuestionIndex: 0,
                userAnswers: new Array(2).fill(-1) // Matches new question count
            };
            const newState = quizReducer(stateWithQuiz, nextQuestion());
            expect(newState.currentQuestionIndex).toBe(1);
        });

        it('should not increment when at last question', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                currentQuestionIndex: sampleQuiz.questions.length - 1
            };
            const newState = quizReducer(stateWithQuiz, nextQuestion());
            expect(newState.currentQuestionIndex).toBe(sampleQuiz.questions.length - 1);
        });
    });

    describe('previousQuestion', () => {
        it('should decrement currentQuestionIndex when not at start', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                currentQuestionIndex: 1
            };
            const newState = quizReducer(stateWithQuiz, previousQuestion());
            expect(newState.currentQuestionIndex).toBe(0);
        });

        it('should not decrement when at first question', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                currentQuestionIndex: 0
            };
            const newState = quizReducer(stateWithQuiz, previousQuestion());
            expect(newState.currentQuestionIndex).toBe(0);
        });
    });

    describe('answerQuestion', () => {
        it('should record the answer for the specified question', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                userAnswers: [-1]
            };
            const newState = quizReducer(
                stateWithQuiz,
                answerQuestion({ questionIndex: 0, answer: 1 })
            );
            expect(newState.userAnswers).toEqual([1]);
        });

        it('should ignore invalid question indices', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                userAnswers: [-1]
            };
            const newState = quizReducer(
                stateWithQuiz,
                answerQuestion({ questionIndex: 5, answer: 1 })
            );
            expect(newState.userAnswers).toEqual([-1]);
        });
    });

    describe('completeQuiz', () => {
        it('should mark as completed when all questions are answered', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                userAnswers: [1] // All questions answered
            };
            const newState = quizReducer(stateWithQuiz, completeQuiz());
            expect(newState.isCompleted).toBe(true);
        });

        it('should set error when not all questions are answered', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                userAnswers: [-1] // Unanswered
            };
            const newState = quizReducer(stateWithQuiz, completeQuiz());
            expect(newState.isCompleted).toBe(false);
            expect(newState.error).toBe("Please answer all questions before finishing.");
        });

        it('should handle null currentQuiz gracefully', () => {
            const stateWithoutQuiz = {
                ...quizInitialState,
                currentQuiz: null,
                userAnswers: []
            };
            const newState = quizReducer(stateWithoutQuiz, completeQuiz());
            expect(newState.isCompleted).toBe(true); // Still marks as completed
            expect(newState.error).toBeNull();
        });
    });

    describe('setLoading', () => {
        it('should set loading state', () => {
            const newState = quizReducer(quizInitialState, setLoading(true));
            expect(newState.loading).toBe(true);
        });
    });

    describe('setError', () => {
        it('should set error message', () => {
            const error = 'Test error';
            const newState = quizReducer(quizInitialState, setError(error));
            expect(newState.error).toBe(error);
        });

        it('should clear error when null is passed', () => {
            const stateWithError = { ...quizInitialState, error: 'Existing error' };
            const newState = quizReducer(stateWithError, setError(null));
            expect(newState.error).toBeNull();
        });
    });

    describe('setQuizSettings', () => {
        it('should update quiz settings', () => {
            const newState = quizReducer(quizInitialState, setQuizSettings(sampleSettings));
            expect(newState.quizSettings).toEqual({
                ...quizInitialState.quizSettings,
                ...sampleSettings
            });
        });
    });

    describe('setGenerationOptions', () => {
        it('should update generation options', () => {
            const options = {
                numQuestions: 3,
                questionTypes: {
                    multipleChoice: true,
                    typedAnswer: true,
                    aiGenerateCount: false
                }
            };
            const newState = quizReducer(quizInitialState, setGenerationOptions(options));
            expect(newState.generationOptions).toEqual(options);
        });
    });

    describe('toggleQuizDialog', () => {
        it('should toggle showQuizDialog', () => {
            const newState = quizReducer(quizInitialState, toggleQuizDialog());
            expect(newState.showQuizDialog).toBe(true);

            const newState2 = quizReducer(newState, toggleQuizDialog());
            expect(newState2.showQuizDialog).toBe(false);
        });

        it('should reset quiz state when closing dialog', () => {
            const stateWithQuiz = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                currentQuestionIndex: 1,
                userAnswers: [1],
                isCompleted: true,
                evaluationResults: { 'q1': { isCorrect: true, feedback: 'Correct' } },
                showResults: true,
                showQuizDialog: true
            };
            const newState = quizReducer(stateWithQuiz, toggleQuizDialog());
            expect(newState.showQuizDialog).toBe(false);
            expect(newState.currentQuiz).toBeNull();
            expect(newState.currentQuestionIndex).toBe(0);
            expect(newState.userAnswers).toEqual([]);
            expect(newState.isCompleted).toBe(false);
            expect(newState.evaluationResults).toEqual({});
            expect(newState.showResults).toBe(false);
        });
    });

    describe('toggleOptionsDialog', () => {
        it('should toggle showOptionsDialog', () => {
            const newState = quizReducer(quizInitialState, toggleOptionsDialog());
            expect(newState.showOptionsDialog).toBe(true);

            const newState2 = quizReducer(newState, toggleOptionsDialog());
            expect(newState2.showOptionsDialog).toBe(false);
        });

        it('should reset generationOptions when opening dialog', () => {
            const stateWithOptions = {
                ...quizInitialState,
                generationOptions: {
                    numQuestions: 10,
                    questionTypes: {
                        multipleChoice: false,
                        typedAnswer: true,
                        aiGenerateCount: false
                    }
                }
            };
            const newState = quizReducer(stateWithOptions, toggleOptionsDialog());
            expect(newState.generationOptions?.numQuestions).toBe(
                quizInitialState.quizSettings.defaultNumQuestions
            );
            expect(newState.generationOptions?.questionTypes).toEqual(
                quizInitialState.quizSettings.defaultMode
            );
        });
    });

    describe('resetQuiz', () => {
        it('should reset all quiz state fields', () => {
            const stateWithData = {
                ...quizInitialState,
                currentQuiz: sampleQuiz,
                currentQuestionIndex: 1,
                userAnswers: [1],
                isCompleted: true,
                loading: true,
                evaluating: true,
                error: 'Test error',
                evaluationResults: { 'q1': { isCorrect: true, feedback: 'Correct' } },
                showResults: true
            };
            const newState = quizReducer(stateWithData, resetQuiz());
            expect(newState).toEqual({
                ...quizInitialState,
                quizSettings: stateWithData.quizSettings // Settings should persist
            });
        });
    });

    describe('setEvaluating', () => {
        it('should set evaluating state', () => {
            const newState = quizReducer(quizInitialState, setEvaluating(true));
            expect(newState.evaluating).toBe(true);
        });
    });

    describe('storeEvaluationResult', () => {
        it('should store evaluation result for a question', () => {
            const result = { isCorrect: true, feedback: 'Correct answer' };
            const newState = quizReducer(quizInitialState,
                storeEvaluationResult({ questionId: 'q1', result }));
            expect(newState.evaluationResults.q1).toEqual(result);
        });

        it('should update existing evaluation result', () => {
            const initialState = {
                ...quizInitialState,
                evaluationResults: { 'q1': { isCorrect: false, feedback: 'Incorrect' } }
            };
            const result = { isCorrect: true, feedback: 'Correct answer' };
            const newState = quizReducer(initialState,
                storeEvaluationResult({ questionId: 'q1', result }));
            expect(newState.evaluationResults.q1).toEqual(result);
        });
    });

    describe('showResults', () => {
        it('should set showResults to true', () => {
            const newState = quizReducer(quizInitialState, showResults());
            expect(newState.showResults).toBe(true);
        });
    });
});
