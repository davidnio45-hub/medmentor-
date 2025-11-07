import React, { useState, useCallback } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import type { Page } from '../types';
import { generateTextFromPrompt } from '../services/geminiService';

interface HumanPhysiologyProps {
  page: Page;
}

const systems = [
    "Cardiovascular", "Respiratory", "Renal", "Endocrine", "Gastrointestinal", "Nervous"
];

export const HumanPhysiology: React.FC<HumanPhysiologyProps> = ({ page }) => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSystemSelect = useCallback(async (system: string) => {
    setSelectedSystem(system);
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await generateTextFromPrompt(page.prompt!, system);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [page.prompt]);

  return (
    <PageWrapper page={page}>
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Select a Physiological System</h3>
        <div className="flex flex-wrap gap-3">
            {systems.map(system => (
                <button
                    key={system}
                    onClick={() => handleSystemSelect(system)}
                    disabled={isLoading}
                    className={`px-4 py-2 font-semibold rounded-lg shadow-sm transition
                        ${selectedSystem === system && !isLoading ? 'bg-sky-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
                        ${isLoading ? 'bg-slate-300 cursor-not-allowed' : ''}
                    `}
                >
                    {system}
                </button>
            ))}
        </div>
      </Card>

      {(isLoading || error || result) && (
        <div className="mt-8">
            <Card className="min-h-[12rem]">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">
                    {isLoading ? `Generating Overview for ${selectedSystem}...` : `Physiology of the ${selectedSystem} System`}
                </h3>
                {isLoading && <Spinner />}
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
                {result && !isLoading && !error && (
                    <div className="prose max-w-none text-slate-600 whitespace-pre-wrap">{result}</div>
                )}
            </Card>
        </div>
      )}
    </PageWrapper>
  );
};