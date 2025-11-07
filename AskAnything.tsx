

import React from 'react';
import type { Page } from '../types';
// FIX: Correctly import generateTextFromPrompt as generateTextOnly is not exported.
import { generateTextFromPrompt } from '../services/geminiService';
import { BasePageTextOnly } from './BasePageTextOnly';

interface AskAnythingProps {
  page: Page;
}

const renderResult = (result: string) => <div className="whitespace-pre-wrap">{result}</div>;

export const AskAnything: React.FC<AskAnythingProps> = ({ page }) => {
  return (
    <BasePageTextOnly 
      page={page} 
      generateContent={generateTextFromPrompt}
      inputPlaceholder="Ask any medical question..."
      renderResult={renderResult} 
    />
  );
};