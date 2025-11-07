import React, { useState, useCallback } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import type { Page } from '../types';

interface BasePageProps {
  page: Page;
  generateContent: (prompt: string, content: string) => Promise<any>;
  renderResult: (result: any) => React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ page, generateContent, renderResult }) => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!fileContent.trim()) {
      setError('Please upload a file.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await generateContent(page.prompt, fileContent);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [fileContent, page.prompt, generateContent]);

  return (
    <PageWrapper page={page}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Upload Data</h3>
          <p className="text-sm text-slate-500 mb-4">Upload a .txt or .csv file with your grades or progress notes for analysis.</p>
          <div className="w-full h-60 p-3 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
            {fileName ? (
                <p className="text-slate-700 font-medium">{fileName}</p>
            ) : (
                <p className="text-slate-500">Your file will appear here</p>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition">
              Upload File
              <input type="file" className="hidden" accept=".txt,.csv" onChange={handleFileChange} />
            </label>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !fileContent.trim()}
              className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </Card>
        
        <Card className="min-h-[24rem]">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Result</h3>
          {isLoading && <Spinner />}
          {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          {result && !isLoading && !error && (
            <div className="prose max-w-none text-slate-600">
              {renderResult(result)}
            </div>
          )}
          {!isLoading && !error && !result && <p className="text-slate-500">Your personalized advice will appear here.</p>}
        </Card>
      </div>
    </PageWrapper>
  );
};
