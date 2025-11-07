import React, { useState } from 'react';
import { Card } from '../common/Card';

interface PinScreenProps {
  onPinSuccess: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({ onPinSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'meddavid') {
      onPinSuccess();
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sky-800">Dav Med App</h1>
            <p className="text-slate-600 mt-2">Step 1: Enter Access PIN</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-slate-700">Enter PIN</label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
            
            <button type="submit" className="w-full bg-sky-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Unlock App
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};