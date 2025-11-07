import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Page } from '../types';
import { generateTextFromPrompt } from '../services/geminiService';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';

interface ClinicalCaseSimulatorProps {
  page: Page;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export const ClinicalCaseSimulator: React.FC<ClinicalCaseSimulatorProps> = ({ page }) => {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseStarted, setCaseStarted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages])

  const handleSendMessage = useCallback(async (messageText: string, isFirstMessage: boolean = false) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // The prompt is complex, so we build a history string for context
      const history = messages.map(m => `${m.sender === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n');
      const fullPromptContent = isFirstMessage ? messageText : `${history}\nStudent: ${messageText}`;
      
      const aiResponseText = await generateTextFromPrompt(page.prompt!, fullPromptContent);
      const aiMessage: Message = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
      if (!caseStarted) {
        setCaseStarted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [page.prompt, topic, messages, caseStarted]);

  const handleStartCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      handleSendMessage(`Start a case about ${topic}.`, true);
    }
  };
  
  const handleUserResponseSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const userResponse = formData.get('userResponse') as string;
      if (userResponse) {
        handleSendMessage(userResponse);
        e.currentTarget.reset();
      }
  }

  return (
    <PageWrapper page={page}>
      <Card>
        {!caseStarted ? (
          <form onSubmit={handleStartCase} className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a clinical topic (e.g., 'Myocardial Infarction')"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition flex-grow"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !topic.trim()} className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition">
              {isLoading ? 'Starting...' : 'Start Case'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 bg-slate-50 rounded-lg border space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-lg p-3 rounded-xl ${msg.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />')}}></div>
                  </div>
                </div>
              ))}
              {isLoading && <div className="flex justify-start"><div className="max-w-lg p-3 rounded-xl bg-slate-200"><Spinner /></div></div>}
            </div>
            <form onSubmit={handleUserResponseSubmit} className="flex gap-4">
              <input
                name="userResponse"
                type="text"
                placeholder="Your diagnosis and plan..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition flex-grow"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading} className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition">
                Send
              </button>
            </form>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Card>
    </PageWrapper>
  );
};
