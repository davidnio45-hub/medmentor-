import React from 'react';
import type { Page } from '../types';
import { generateTextFromPrompt } from '../services/geminiService';
import { BasePageTextOnly } from './BasePageTextOnly';

interface DiseaseAnalysisProps {
  page: Page;
}

const renderResult = (result: string) => <div className="whitespace-pre-wrap">{result}</div>;

export const DiseaseAnalysis: React.FC<DiseaseAnalysisProps> = ({ page }) => {
  return (
    <BasePageTextOnly 
      page={page} 
      generateContent={generateTextFromPrompt} 
      inputPlaceholder="Enter a disease name (e.g., 'Diabetes Mellitus Type 2')"
      renderResult={renderResult} 
    />
  );
};