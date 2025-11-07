import React, { useState, useCallback } from 'react';
import type { Page, Flashcard } from '../types';
import { generateFlashcards } from '../services/geminiService';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';

interface FlashcardGeneratorProps {
  page: Page;
}

const RenderFlashcards: React.FC<{ result: Flashcard[] }> = ({ result }) => {
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  const toggleFlip = (index: number) => {
    setFlippedCardIndex(flippedCardIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {result.map((card, index) => (
        <div key={index} className="perspective-1000 h-48" onClick={() => toggleFlip(index)}>
          <div
            className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${
              flippedCardIndex === index ? 'rotate-y-180' : ''
            }`}
          >
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 bg-sky-100 border border-sky-200 rounded-lg shadow-md cursor-pointer">
              <p className="text-center font-semibold text-sky-800">{card.question}</p>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-4 bg-green-100 border border-green-200 rounded-lg shadow-md cursor-pointer">
              <p className="text-center text-green-800">{card.answer}</p>
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({ page }) => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<Flashcard[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = useCallback(async () => {
      if (!inputText.trim()) {
        setError('Please enter some text or upload a file.');
        return;
      }
      setIsLoading(true);
      setError(null);
      setResult(null);
      try {
        const apiResult = await generateFlashcards(page.prompt!, inputText);
        setResult(apiResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }, [inputText, page.prompt]);

    return (
        <PageWrapper page={page}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Input Content</h3>
            <textarea
                className="w-full h-60 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="Paste your medical text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <div className="mt-4 flex items-center justify-end">
                <button
                onClick={handleSubmit}
                disabled={isLoading || !inputText.trim()}
                className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
                >
                {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            </Card>
            
            <Card className="min-h-[24rem]">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Result</h3>
            {isLoading && <Spinner />}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            {result && !isLoading && !error && <RenderFlashcards result={result} />}
            {!isLoading && !error && !result && <p className="text-slate-500">Your generated flashcards will appear here.</p>}
            </Card>
        </div>
        </PageWrapper>
    );
};