import React from 'react';
import type { Page } from '../types';
import { Card } from '../components/common/Card';
import { PageWrapper } from '../components/PageWrapper';
import { AcademicCapIcon, HeartIcon, DocumentTextIcon, CpuChipIcon } from '../components/common/icons';
import { findPageById } from '../constants';

interface ChooseYourPathProps {
  page: Page;
  setActivePage?: (page: Page) => void;
}

const paths = [
    { name: 'Preclinical', description: 'Focus on foundational sciences, flashcards, and quizzes.', icon: AcademicCapIcon, pageId: 'study-pack-generator' },
    { name: 'Clinical', description: 'Dive into case simulations, clinical guides, and drug info.', icon: HeartIcon, pageId: 'clinical-orientation' },
    { name: 'Exam Prep', description: 'Generate mock exams and intensive quizzes for boards.', icon: DocumentTextIcon, pageId: 'study-pack-generator' },
    { name: 'Internship', description: 'Access support tools, checklists, and orientation guides.', icon: CpuChipIcon, pageId: 'internship-support' },
];

export const ChooseYourPath: React.FC<ChooseYourPathProps> = ({ page, setActivePage }) => {
  const handleNavigation = (pageId: string) => {
    if (setActivePage) {
      const targetPage = findPageById(pageId);
      if (targetPage) {
        setActivePage(targetPage);
      }
    }
  };

  return (
    <PageWrapper page={page}>
      <Card>
        <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900">Customize Your Dashboard</h3>
            <p className="mt-2 text-base text-gray-600">
                Select your current focus to get the most relevant tools and advice.
            </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paths.map(path => (
            <button key={path.name} onClick={() => handleNavigation(path.pageId)} className="text-left p-0 border-0 bg-transparent hover:scale-105 transition-transform">
                <Card className="h-full hover:shadow-xl hover:border-sky-500 border-2 border-transparent transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 text-sky-600">
                        <path.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    </div>
                    <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-900">{path.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{path.description}</p>
                    </div>
                </div>
                </Card>
            </button>
          ))}
      </div>
      </Card>
    </PageWrapper>
  );
};