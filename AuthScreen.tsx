import React, { useState } from 'react';
import type { User } from '../../types';
import { Card } from '../common/Card';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: isLogin ? 'David N.' : 'New User',
      email: isLogin ? 'david@medapp.com' : 'new@medapp.com',
      isGuest: false,
      isVerified: true,
    });
  };

  const handleGuestLogin = () => {
    onLoginSuccess({
      name: 'Guest',
      email: 'guest@medapp.com',
      isGuest: true,
      isVerified: false,
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sky-800">Dav Med App</h1>
            <p className="text-slate-600 mt-2">Step 2: Login or Create Account</p>
        </div>
        <Card>
          <div className="flex border-b mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-center font-semibold transition-colors ${isLogin ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}`}>Log In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-center font-semibold transition-colors ${!isLogin ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}`}>Sign Up</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input type="text" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input type="email" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
              </div>
            )}
            <div className="flex items-center space-x-2">
                <input id="save-password" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                <label htmlFor="save-password" className="text-sm text-slate-700">Save password with Google</label>
            </div>
            <button type="submit" className="w-full bg-sky-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              {isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={handleGuestLogin} className="text-sm text-sky-600 hover:underline">Continue as Guest (Limited Access)</button>
          </div>
        </Card>
      </div>
    </div>
  );
};