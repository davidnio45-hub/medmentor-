import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { CheckCircleIcon, XCircleIcon, HeartIcon, BeakerIcon, GlobeAltIcon, BookOpenIcon } from '../common/icons';

interface RoboticCheckScreenProps {
  onVerified: () => void;
}

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const allIcons = [
    { id: 1, icon: CheckCircleIcon, type: 'check' },
    { id: 2, icon: XCircleIcon, type: 'cross' },
    { id: 3, icon: HeartIcon, type: 'heart' },
    { id: 4, icon: CheckCircleIcon, type: 'check' },
    { id: 5, icon: BeakerIcon, type: 'beaker' },
    { id: 6, icon: GlobeAltIcon, type: 'globe' },
    { id: 7, icon: CheckCircleIcon, type: 'check' },
    { id: 8, icon: BookOpenIcon, type: 'book' },
    { id: 9, icon: HeartIcon, type: 'heart' }
];

export const RoboticCheckScreen: React.FC<RoboticCheckScreenProps> = ({ onVerified }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const images = useMemo(() => shuffleArray(allIcons), []);
  
  const targetType = 'check';

  const toggleSelection = (id: number) => {
    setError('');
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleSubmit = () => {
    const correctIds = new Set(images.filter(img => img.type === targetType).map(img => img.id));
    
    if (selectedIds.size !== correctIds.size) {
        setError('Verification failed. Try again.');
        return;
    }

    const allCorrect = [...selectedIds].every(id => correctIds.has(id));

    if (allCorrect) {
      onVerified();
    } else {
      setError('Verification failed. Try again.');
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
         <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sky-800">Dav Med App</h1>
            <p className="text-slate-600 mt-2">Step 3: Security Verification</p>
        </div>
        <Card>
          <div className="space-y-4">
            <div className="p-4 bg-sky-100 text-sky-800 rounded-md text-center">
                <p className="font-semibold">Select all images with a checkmark</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {images.map(image => {
                const isSelected = selectedIds.has(image.id);
                return (
                  <button
                    key={image.id}
                    onClick={() => toggleSelection(image.id)}
                    className={`relative w-full aspect-square border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-sky-500 bg-sky-100 scale-105' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <image.icon className="w-10 h-10 text-slate-500" />
                    {isSelected && <div className="absolute top-1 right-1 bg-sky-500 text-white rounded-full h-5 w-5 flex items-center justify-center"><CheckCircleIcon className="w-4 h-4" /></div>}
                  </button>
                )
              })}
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">{error}</p>}
            
            <button onClick={handleSubmit} className="w-full bg-sky-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Verify
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};