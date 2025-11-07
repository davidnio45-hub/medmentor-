import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import type { Page } from '../types';
import { generateTextFromPrompt } from '../services/geminiService';

interface StaticContentPageProps {
  page: Page;
}

export const StaticContentPage: React.FC<StaticContentPageProps> = ({ page }) => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // We pass an empty string for userInput as the prompt is self-contained
        const apiResult = await generateTextFromPrompt(page.prompt!, "");
        setResult(apiResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [page.prompt]);

  return (
    <PageWrapper page={page}>
        <Card className="min-h-[24rem]">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">AI Generated Guide</h3>
            {isLoading && <Spinner />}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            {result && !isLoading && !error && (
            <div className="prose max-w-none text-slate-600 whitespace-pre-wrap">{result}</div>
            )}
        </Card>
    </PageWrapper>
  );
};