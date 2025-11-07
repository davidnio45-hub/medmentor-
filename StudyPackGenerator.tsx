import React, { useState, useCallback } from 'react';
import type { Page, StudyPack, QuizQuestion, Flashcard } from '../types';
import { generateStudyPack } from '../services/geminiService';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';

interface StudyPackGeneratorProps {
  page: Page;
}

type Tab = 'summary' | 'flashcards' | 'quiz' | 'case';

const RenderFlashcards: React.FC<{ cards: Flashcard[] }> = ({ cards }) => {
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="perspective-1000 h-48" onClick={() => setFlippedCardIndex(flippedCardIndex === index ? null : index)}>
          <div className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${flippedCardIndex === index ? 'rotate-y-180' : ''}`}>
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 bg-sky-100 border border-sky-200 rounded-lg shadow-md cursor-pointer">
              <p className="text-center font-semibold text-sky-800">{card.question}</p>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-4 bg-green-100 border border-green-200 rounded-lg shadow-md cursor-pointer">
              <p className="text-center text-green-800">{card.answer}</p>
            </div>
          </div>
        </div>
      ))}
      <style>{`.perspective-1000 { perspective: 1000px; } .transform-style-preserve-3d { transform-style: preserve-3d; } .rotate-y-180 { transform: rotateY(180deg); } .backface-hidden { backface-visibility: hidden; }`}</style>
    </div>
  );
};

const RenderQuiz: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const getOptionClass = (qIndex: number, option: string) => {
      if (!showResults) return selectedAnswers[qIndex] === option ? 'bg-sky-200 ring-2 ring-sky-500' : 'bg-slate-100 hover:bg-slate-200';
      const isCorrect = option === questions[qIndex].correctAnswer;
      const isSelected = option === selectedAnswers[qIndex];
      if(isCorrect) return 'bg-green-200 ring-2 ring-green-500';
      if(isSelected && !isCorrect) return 'bg-red-200 ring-2 ring-red-500';
      return 'bg-slate-100';
  }

  return (
    <div className="space-y-6">
      {questions.map((item, qIndex) => (
        <div key={qIndex} className="p-4 border border-slate-200 rounded-lg bg-white">
          <p className="font-semibold">{qIndex + 1}. {item.question}</p>
          <div className="mt-4 space-y-2">
            {item.options.map((option, oIndex) => (
              <button key={oIndex} onClick={() => !showResults && setSelectedAnswers(p => { const n = [...p]; n[qIndex] = option; return n; })} className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${getOptionClass(qIndex, option)}`}>{option}</button>
            ))}
          </div>
          {showResults && <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm"><p><span className="font-bold">Correct Answer:</span> {item.correctAnswer}</p><p><span className="font-bold">Explanation:</span> {item.explanation}</p></div>}
        </div>
      ))}
      <div className="text-center mt-6">
        <button onClick={() => setShowResults(true)} className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700">Check Answers</button>
      </div>
    </div>
  );
};

export const StudyPackGenerator: React.FC<StudyPackGeneratorProps> = ({ page }) => {
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState<StudyPack | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('summary');
  
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const apiResult = await generateStudyPack(page.prompt!, topic);
            setResult(apiResult);
            setActiveTab('summary');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [topic, page.prompt]);

    const renderTabContent = () => {
        if (!result) return null;
        switch (activeTab) {
            case 'summary': return <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">{result.summary}</div>;
            case 'flashcards': return <RenderFlashcards cards={result.flashcards} />;
            case 'quiz': return <RenderQuiz questions={result.quiz} />;
            case 'case': return <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">{result.caseStudy}</div>;
            default: return null;
        }
    };

    const tabs: {id: Tab, label: string}[] = [
        { id: 'summary', label: 'Summary' },
        { id: 'flashcards', label: 'Flashcards' },
        { id: 'quiz', label: 'Quiz' },
        { id: 'case', label: 'Case Study' },
    ];

    return (
        <PageWrapper page={page}>
            <Card>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition flex-grow"
                        placeholder="Enter any medical module or topic (e.g., 'Acute Coronary Syndrome')"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
                    >
                        {isLoading ? 'Generating...' : 'Generate Study Pack'}
                    </button>
                </form>
            </Card>

            {(isLoading || error || result) && (
                <div className="mt-8">
                    {isLoading && <Card><Spinner /></Card>}
                    {error && <Card><p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p></Card>}
                    {result && !isLoading && !error && (
                        <Card>
                            <div className="border-b border-gray-200 mb-4">
                                <nav className="-mb-px flex space-x-6">
                                    {tabs.map(tab => (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="mt-4">{renderTabContent()}</div>
                        </Card>
                    )}
                </div>
            )}
        </PageWrapper>
    );
};