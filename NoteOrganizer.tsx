

import React from 'react';
import type { Page } from '../types';
// FIX: Correctly import generateTextWithContent as generateText is not exported.
import { generateTextWithContent } from '../services/geminiService';
import { BasePage } from './BasePage';

interface NoteOrganizerProps {
  page: Page;
}

const renderResult = (result: string) => <div className="whitespace-pre-wrap">{result}</div>;

export const NoteOrganizer: React.FC<NoteOrganizerProps> = ({ page }) => {
  return <BasePage page={page} generateContent={generateTextWithContent} renderResult={renderResult} />;
};