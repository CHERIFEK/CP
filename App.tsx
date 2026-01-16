
import React, { useState, useEffect } from 'react';
import { FeedbackEntry } from './types';
import MoodSurvey from './components/MoodSurvey';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [view, setView] = useState<'survey' | 'dashboard'>('survey');

  useEffect(() => {
    const saved = localStorage.getItem('culture_pulse_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Could not load data");
      }
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
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">P</div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Culture Pulse</h1>
          </div>
          <div className="flex space-x-1 p-1 bg-slate-100 rounded-full border border-slate-200">
            <button
              onClick={() => setView('survey')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                view === 'survey' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Survey
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                view === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Results
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {view === 'survey' ? (
            <MoodSurvey onAdd={handleAddEntry} onGoToDashboard={() => setView('dashboard')} />
          ) : (
            <Dashboard entries={entries} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
        <p>&copy; 2024 Culture Pulse &bull; Secure & Anonymous</p>
      </footer>
    </div>
  );
};

export default App;
