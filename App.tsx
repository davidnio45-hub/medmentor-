import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { HUBS } from './constants';
import type { Page, User } from './types';
import { AuthScreen } from './components/auth/AuthScreen';
import { Footer } from './components/Footer';
import { ChooseYourPath } from './pages/ChooseYourPath';
import { PinScreen } from './components/auth/PinScreen';
import { RoboticCheckScreen } from './components/auth/RoboticCheckScreen';

enum AuthState {
  PIN_ENTRY,
  LOGIN,
  ROBOTIC_CHECK,
  AUTHENTICATED,
}

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.PIN_ENTRY);
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const defaultPage = useMemo(() => HUBS.find(h => h.id === 'orientation')?.pages.find(p => p.id === 'choose-path'), []);

  if (authState !== AuthState.AUTHENTICATED) {
    switch (authState) {
      case AuthState.PIN_ENTRY:
        return <PinScreen onPinSuccess={() => setAuthState(AuthState.LOGIN)} />;
      case AuthState.LOGIN:
        return <AuthScreen onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setAuthState(AuthState.ROBOTIC_CHECK);
        }} />;
      case AuthState.ROBOTIC_CHECK:
        return <RoboticCheckScreen onVerified={() => setAuthState(AuthState.AUTHENTICATED)} />;
      default:
        return <PinScreen onPinSuccess={() => setAuthState(AuthState.LOGIN)} />;
    }
  }
  
  const PageComponent = activePage?.component || ChooseYourPath;
  const pageToRender = activePage || defaultPage;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        hubs={HUBS}
        activePage={activePage} 
        setActivePage={setActivePage} 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
          <h1 className="text-xl font-bold text-sky-700">Dav Med App</h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {pageToRender && (
            pageToRender.component === ChooseYourPath 
              ? <ChooseYourPath page={pageToRender} setActivePage={setActivePage} /> 
              : <PageComponent page={pageToRender} />
          )}
        </div>
        <Footer setActivePage={setActivePage} />
      </main>
    </div>
  );
};

export default App;