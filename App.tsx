
import React, { useState, useEffect } from 'react';
import { FeedbackEntry } from './types';
import MoodSurvey from './components/MoodSurvey';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [view, setView] = useState<'survey' | 'dashboard'>('survey');

  // Load from local storage for persistence in demo
  useEffect(() => {
    const saved = localStorage.getItem('culture_pulse_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleAddEntry = (entry: FeedbackEntry) => {
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('culture_pulse_entries', JSON.stringify(updated));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
        setEntries([]);
        localStorage.removeItem('culture_pulse_entries');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <h1 className="text-xl font-bold text-slate-800">Culture Pulse</h1>
          </div>
          <div className="flex space-x-1 p-1 bg-slate-100 rounded-full">
            <button
              onClick={() => setView('survey')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                view === 'survey' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Submit
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                view === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-20">
        {view === 'survey' ? (
          <MoodSurvey onAdd={handleAddEntry} onGoToDashboard={() => setView('dashboard')} />
        ) : (
          <Dashboard entries={entries} onReset={handleReset} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; 2024 Culture Pulse &bull; 100% Anonymous</p>
      </footer>
    </div>
  );
};

export default App;
