import React, { useState, useCallback } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import type { Page } from '../types';
import { generateAnatomyImage, generateTextFromPrompt } from '../services/geminiService';

interface AnatomyViewerProps {
  page: Page;
}

const bodyParts = [
    "Brain", "Heart", "Lungs", "Liver", "Kidneys", "Stomach", "Knee Joint", "Shoulder Joint"
];

export const AnatomyViewer: React.FC<AnatomyViewerProps> = ({ page }) => {
  const [selectedPart, setSelectedPart] = useState(bodyParts[0]);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [textResult, setTextResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setImageResult(null);
    setTextResult(null);
    try {
      // Generate image and text in parallel
      const [imgBase64, textDesc] = await Promise.all([
          generateAnatomyImage(page.prompt!, selectedPart),
          generateTextFromPrompt(page.prompt!, selectedPart)
      ]);
      setImageResult(imgBase64);
      setTextResult(textDesc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPart, page.prompt]);

  return (
    <PageWrapper page={page}>
      <div className="space-y-8">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition flex-grow"
              value={selectedPart}
              onChange={(e) => setSelectedPart(e.target.value)}
            >
              {bodyParts.map(part => <option key={part} value={part}>{part}</option>)}
            </select>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Generating...' : 'Generate View'}
            </button>
          </form>
        </Card>
        
        {(isLoading || error || imageResult || textResult) && (
          <Card className="min-h-[12rem]">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Result</h3>
            {isLoading && <Spinner />}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            {!isLoading && !error && (imageResult || textResult) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {imageResult && (
                    <div>
                        <img 
                            src={`data:image/png;base64,${imageResult}`} 
                            alt={`Anatomy of ${selectedPart}`}
                            className="rounded-lg border shadow-md"
                        />
                    </div>
                )}
                {textResult && (
                    <div className="prose max-w-none text-slate-600 whitespace-pre-wrap">
                        {textResult}
                    </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};