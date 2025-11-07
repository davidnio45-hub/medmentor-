import React from 'react';
import type { Page } from '../types';
import { generateTextWithContent } from '../services/geminiService';
import { BasePage } from './BasePage';

interface StudyGuidanceProps {
  page: Page;
}

const renderResult = (result: string) => <div className="whitespace-pre-wrap">{result}</div>;

export const StudyGuidance: React.FC<StudyGuidanceProps> = ({ page }) => {
  return <BasePage page={page} generateContent={generateTextWithContent} renderResult={renderResult} />;
};