

import React, { useState, useEffect, useRef } from 'react';
import type { Page } from '../types';
// FIX: Correctly import generateTextWithContent as generateText is not exported.
import { generateTextWithContent } from '../services/geminiService';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
// FIX: Correctly import MicrophoneIcon from its location.
import { MicrophoneIcon } from '../components/common/icons';

interface VoiceToNoteProps {
  page: Page;
}

// Check for SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

export const VoiceToNote: React.FC<VoiceToNoteProps> = ({ page }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef(recognition);

  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) {
      setError("Speech recognition is not supported in this browser.");
      return;
    };

    rec.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };
    
    rec.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    return () => {
      rec.stop();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResult(null);
      setError(null);
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setError('No speech detected to process.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await generateTextWithContent(page.prompt!, transcript);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper page={page}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Voice Input</h3>
          <div className="w-full h-60 p-3 border border-slate-300 rounded-lg overflow-y-auto bg-slate-50">
            {transcript || <span className="text-slate-400">Your transcribed text will appear here...</span>}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={toggleListening}
              className={`flex items-center justify-center gap-2 w-48 py-3 text-white font-semibold rounded-lg shadow-md transition ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-sky-600 hover:bg-sky-700'}`}
            >
              <MicrophoneIcon className="w-6 h-6" />
              {isListening ? 'Stop Listening' : 'Start Dictation'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !transcript.trim() || isListening}
              className="w-48 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Processing...' : 'Generate SOAP Note'}
            </button>
          </div>
        </Card>
        
        <Card className="min-h-[24rem]">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">SOAP Note</h3>
          {isLoading && <Spinner />}
          {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          {result && !isLoading && !error && (
            <div className="prose max-w-none text-slate-600 whitespace-pre-wrap">{result}</div>
          )}
           {!isLoading && !error && !result && <p className="text-slate-500">Your generated SOAP note will appear here.</p>}
        </Card>
      </div>
    </PageWrapper>
  );
};