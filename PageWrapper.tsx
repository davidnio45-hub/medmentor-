
import React from 'react';
import type { Page } from '../types';

interface PageWrapperProps {
  page: Page;
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ page, children }) => {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img src={page.imageUrl} alt={page.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 flex items-end p-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{page.title}</h2>
            <p className="text-slate-200 mt-1">{page.description}</p>
          </div>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
