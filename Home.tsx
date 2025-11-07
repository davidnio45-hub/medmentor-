

import React from 'react';
import { Card } from '../components/common/Card';
// FIX: Import HUBS instead of non-existent PAGES
import { HUBS } from '../constants';
import { HomeIcon } from '../components/common/icons';

export const Home: React.FC = () => {
  // FIX: Find the home page from HUBS
  const homePage = HUBS.find(h => h.id === 'orientation')?.pages.find(p => p.id === 'choose-path')!;
  // FIX: Get all pages by flattening HUBS
  const allPages = HUBS.flatMap(hub => hub.pages);
  
  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
       <div className="relative rounded-xl overflow-hidden shadow-lg">
        {/* FIX: Remove img tag that uses non-existent imageUrl property and replace with a placeholder */}
        <div className="w-full h-48 bg-gradient-to-r from-sky-500 to-sky-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 flex items-end p-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{homePage.title}</h2>
            <p className="text-slate-200 mt-1">{homePage.description}</p>
          </div>
        </div>
      </div>
      
      <Card>
        <div className="text-center">
            <HomeIcon className="mx-auto h-12 w-12 text-sky-600" />
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">Get Started</h3>
            <p className="mt-2 text-base text-gray-600">
                Welcome to your personal AI-powered medical study companion. Use the sidebar to navigate through the different tools available to enhance your learning experience.
            </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FIX: Filter pages based on the correct home page id */}
          {allPages.filter(p => p.id !== 'choose-path').map(page => (
            <Card key={page.id} className="hover:shadow-xl hover:border-sky-500 border-2 border-transparent transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-sky-100 text-sky-600">
                    <page.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{page.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{page.description}</p>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};