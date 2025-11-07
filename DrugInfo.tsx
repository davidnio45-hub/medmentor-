import React from 'react';
import type { Page } from '../types';
import { generateTextFromPrompt } from '../services/geminiService';
import { BasePageTextOnly } from './BasePageTextOnly';

interface DrugInfoProps {
  page: Page;
}

const renderResult = (result: string) => <div className="whitespace-pre-wrap">{result}</div>;

export const DrugInfo: React.FC<DrugInfoProps> = ({ page }) => {
  return (
    <BasePageTextOnly 
      page={page} 
      generateContent={generateTextFromPrompt} 
      inputPlaceholder="Enter a drug name (e.g., 'Aspirin')"
      renderResult={renderResult} 
    />
  );
};