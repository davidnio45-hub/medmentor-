

import React from 'react';
import type { Page } from '../types';
// FIX: Correctly import generateTextFromPrompt as generateTextOnly is not exported.
import { generateTextFromPrompt } from '../services/geminiService';
import { BasePageTextOnly } from './BasePageTextOnly';

interface PlannerTrackerProps {
  page: Page;
}

const renderResult = (result: string) => <div className="whitespace-pre-wrap">{result}</div>;

export const PlannerTracker: React.FC<PlannerTrackerProps> = ({ page }) => {
  return (
    <BasePageTextOnly 
      page={page} 
      generateContent={generateTextFromPrompt} 
      inputPlaceholder="e.g., 'Cardiology exam in 2 weeks, 10 hours/week available'"
      renderResult={renderResult}
    />
  );
};