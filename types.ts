// FIX: Import React to provide JSX namespace.
import React from 'react';

export interface Page {
    id: string;
    title: string;
    prompt?: string;
    // FIX: Changed JSX.Element to React.ReactNode to resolve namespace error.
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
    description: string;
    component: React.FC<{ page: Page }>;
    props?: Record<string, any>; // For additional properties for generic components
}

export interface Hub {
    id: string;
    title: string;
    // FIX: Changed JSX.Element to React.ReactNode to resolve namespace error.
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
    pages: Page[];
}

export interface User {
    name: string;
    email: string;
    isGuest: boolean;
    isVerified: boolean;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface Flashcard {
    question: string;
    answer: string;
}

export interface StudyPack {
    summary: string;
    flashcards: Flashcard[];
    quiz: QuizQuestion[];
    caseStudy: string;
}