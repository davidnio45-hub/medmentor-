

import React from 'react';
import type { Page } from '../types';
// FIX: Correctly import generateTextWithContent as generateText is not exported.
import { generateTextWithContent } from '../services/geminiService';
import { BasePage } from './BasePage';

interface StudyAssistantProps {
  page: Page;
}

const renderResult = (result: string) => <p>{result}</p>;

export const StudyAssistant: React.FC<StudyAssistantProps> = ({ page }) => {
  return <BasePage page={page} generateContent={generateTextWithContent} renderResult={renderResult} />;
};