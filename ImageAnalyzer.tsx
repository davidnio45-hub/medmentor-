
import React, { useState, useCallback } from 'react';
import type { Page } from '../types';
import { analyzeImage } from '../services/geminiService';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { PhotoIcon } from '../components/common/icons';

interface ImageAnalyzerProps {
  page: Page;
}

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ page }) => {
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage({ file, preview: URL.createObjectURL(file) });
      setResult(null);
      setError(null);
    } else {
        setError("Please select a valid image file.");
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = useCallback(async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await toBase64(image.file);
      const apiResult = await analyzeImage(page.prompt, base64Image, image.file.type);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [image, page.prompt]);

  return (
    <PageWrapper page={page}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Upload Image</h3>
          <div className="w-full h-60 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
            {image ? (
              <img src={image.preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
            ) : (
              <div className="text-center text-slate-500">
                <PhotoIcon className="mx-auto h-12 w-12" />
                <p>Image preview will appear here</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition">
              {image ? 'Change Image' : 'Select Image'}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !image}
              className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </Card>
        
        <Card className="min-h-[24rem]">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Analysis</h3>
          {isLoading && <Spinner />}
          {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          {result && !isLoading && !error && (
            <div className="prose max-w-none text-slate-600 whitespace-pre-wrap">{result}</div>
          )}
           {!isLoading && !error && !result && <p className="text-slate-500">Your image analysis will appear here.</p>}
        </Card>
      </div>
    </PageWrapper>
  );
};
