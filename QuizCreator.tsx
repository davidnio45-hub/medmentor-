import React, { useState, useCallback } from 'react';
import type { Page, QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';

interface QuizCreatorProps {
  page: Page;
}

const RenderQuiz: React.FC<{ result: QuizQuestion[] }> = ({ result }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(result.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = option;
    setSelectedAnswers(newAnswers);
  };
  
  const getOptionClass = (questionIndex: number, option: string) => {
      if (!showResults) {
          return selectedAnswers[questionIndex] === option ? 'bg-sky-200 ring-2 ring-sky-500' : 'bg-slate-100 hover:bg-slate-200';
      }
      const isCorrect = option === result[questionIndex].correctAnswer;
      const isSelected = option === selectedAnswers[questionIndex];

      if(isCorrect) return 'bg-green-200 ring-2 ring-green-500';
      if(isSelected && !isCorrect) return 'bg-red-200 ring-2 ring-red-500';
      return 'bg-slate-100';
  }

  return (
    <div className="space-y-6">
      {result.map((item, qIndex) => (
        <div key={qIndex} className="p-4 border border-slate-200 rounded-lg bg-white">
          <p className="font-semibold">{qIndex + 1}. {item.question}</p>
          <div className="mt-4 space-y-2">
            {item.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() => handleSelectAnswer(qIndex, option)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${getOptionClass(qIndex, option)}`}
              >
                {option}
              </button>
            ))}
          </div>
          {showResults && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  <p><span className="font-bold">Correct Answer:</span> {item.correctAnswer}</p>
                  <p><span className="font-bold">Explanation:</span> {item.explanation}</p>
              </div>
          )}
        </div>
      ))}
      <div className="text-center mt-6">
        <button onClick={() => setShowResults(true)} className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700">
            Check Answers
        </button>
      </div>
    </div>
  );
};

export const QuizCreator: React.FC<QuizCreatorProps> = ({ page }) => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<QuizQuestion[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = useCallback(async () => {
      if (!inputText.trim()) {
        setError('Please enter some text for the quiz topic.');
        return;
      }
      setIsLoading(true);
      setError(null);
      setResult(null);
      try {
        const apiResult = await generateQuiz(page.prompt!, inputText);
        setResult(apiResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }, [inputText, page.prompt]);

    return (
        <PageWrapper page={page}>
            <Card>
                <h3 className="text-lg font-semibold mb-4 text-slate-700">Input Topic or Content</h3>
                <textarea
                    className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    placeholder="Paste your medical text or enter a topic here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className="mt-4 flex items-center justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !inputText.trim()}
                        className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
                    >
                        {isLoading ? 'Generating...' : 'Generate Quiz'}
                    </button>
                </div>
            </Card>

            {(isLoading || error || result) && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-slate-800">Generated Quiz</h3>
                    {isLoading && <Card><Spinner /></Card>}
                    {error && <Card><p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p></Card>}
                    {result && !isLoading && !error && <RenderQuiz result={result} />}
                </div>
            )}
        </PageWrapper>
    );
};