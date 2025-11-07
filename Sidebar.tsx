import React from 'react';
import type { Page, Hub } from '../types';
import { HomeIcon } from './common/icons';

interface SidebarProps {
  hubs: Hub[];
  activePage: Page | null;
  setActivePage: (page: Page) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ hubs, activePage, setActivePage, isSidebarOpen, setSidebarOpen }) => {

  const handlePageChange = (page: Page) => {
    setActivePage(page);
    setSidebarOpen(false);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Dav Med App</h1>
        <p className="text-sky-200 mt-1 text-sm">AI Medical Assistant</p>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {hubs.map((hub) => (
          hub.id !== 'legal' && // Don't show legal pages in sidebar nav
          <details key={hub.id} className="group" open={hub.pages.some(p => p.id === activePage?.id)}>
            <summary className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200 text-sky-100 hover:bg-sky-800 hover:text-white">
              <hub.icon className="w-5 h-5 mr-3" />
              <span>{hub.title}</span>
              <svg className="w-4 h-4 ml-auto transition-transform duration-300 group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </summary>
            <div className="pl-6 pt-1 space-y-1">
              {hub.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center w-full pl-6 pr-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-left ${
                    activePage?.id === page.id
                      ? 'bg-sky-700 text-white'
                      : 'text-sky-100 hover:bg-sky-800 hover:text-white'
                  }`}
                >
                  <page.icon className="w-4 h-4 mr-3" />
                  {page.title}
                </button>
              ))}
            </div>
          </details>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block md:w-64 lg:w-72 bg-sky-900 text-white flex-shrink-0">
        {sidebarContent}
      </aside>
      <div
        className={`fixed inset-0 z-30 transition-opacity bg-black bg-opacity-50 md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-sky-900 text-white transform transition-transform md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};