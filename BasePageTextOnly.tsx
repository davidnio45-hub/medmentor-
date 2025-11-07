
import React, { useState, useCallback } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import type { Page } from '../types';

interface BasePageTextOnlyProps {
  page: Page;
  generateContent: (prompt: string, userInput: string) => Promise<string>;
  inputPlaceholder: string;
  // FIX: Replaced JSX.Element with React.ReactNode to avoid namespace error.
  renderResult: (result: string) => React.ReactNode;
}

export const BasePageTextOnly: React.FC<BasePageTextOnlyProps> = ({ page, generateContent, inputPlaceholder, renderResult }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please enter your query.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await generateContent(page.prompt, inputText);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, page.prompt, generateContent]);

  return (
    <PageWrapper page={page}>
      <div className="space-y-8">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition flex-grow"
              placeholder={inputPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Generating...' : 'Submit'}
            </button>
          </form>
        </Card>
        
        {(isLoading || error || result) && (
          <Card className="min-h-[12rem]">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Result</h3>
            {isLoading && <Spinner />}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            {result && !isLoading && !error && (
              <div className="prose max-w-none text-slate-600">
                {renderResult(result)}
              </div>
            )}
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};