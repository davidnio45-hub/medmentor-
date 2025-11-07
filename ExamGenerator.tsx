import React, { useState, useCallback } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import type { Page } from '../types';
import { generateTextFromPrompt } from '../services/geminiService';

interface ExamGeneratorProps {
  page: Page;
}

export const ExamGenerator: React.FC<ExamGeneratorProps> = ({ page }) => {
  const [year, setYear] = useState('1');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await generateTextFromPrompt(page.prompt!, year);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [year, page.prompt]);

  return (
    <PageWrapper page={page}>
      <div className="space-y-8">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center font-medium text-slate-700">
                Select Year:
                <select
                className="ml-2 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition flex-grow"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                >
                {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Generating...' : 'Generate Exam'}
            </button>
          </form>
        </Card>
        
        {(isLoading || error || result) && (
          <Card className="min-h-[12rem]">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Generated Exam</h3>
            {isLoading && <Spinner />}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            {result && !isLoading && !error && (
              <div className="prose max-w-none text-slate-600 whitespace-pre-wrap">
                {result}
              </div>
            )}
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};