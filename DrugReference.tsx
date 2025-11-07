

import React from 'react';
import type { Page } from '../types';
// FIX: Correctly import generateTextFromPrompt as generateTextOnly is not exported.
import { generateTextFromPrompt } from '../services/geminiService';
import { BasePageTextOnly } from './BasePageTextOnly';

interface DrugReferenceProps {
  page: Page;
}

const renderResult = (result: string) => <div className="whitespace-pre-wrap">{result}</div>;

export const DrugReference: React.FC<DrugReferenceProps> = ({ page }) => {
  return (
    <BasePageTextOnly 
      page={page} 
      generateContent={generateTextFromPrompt} 
      inputPlaceholder="Enter a drug name (e.g., 'Aspirin')"
      renderResult={renderResult} 
    />
  );
};