
import React, { useState, useMemo } from 'react';
import { FeedbackEntry } from '../types';
import MoodChart from './MoodChart';
import { generateActionPlan } from '../services/geminiService';

interface DashboardProps {
  entries: FeedbackEntry[];
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, onReset }) => {
  const [actionPlan, setActionPlan] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    if (entries.length === 0) return { avg: 0, count: 0 };
    const sum = entries.reduce((acc, curr) => acc + curr.mood, 0);
    return {
      avg: (sum / entries.length).toFixed(1),
      count: entries.length,
    };
  }, [entries]);

  const handleMagicButton = async () => {
    setIsLoading(true);
    const plan = await generateActionPlan(entries);
    setActionPlan(plan);
    setIsLoading(false);
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4.5) return '🤩';
    if (mood >= 3.5) return '🙂';
    if (mood >= 2.5) return '😐';
    if (mood >= 1.5) return '😕';
    return '😭';
  };

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-tight">Average Mood</p>
          <div className="flex items-center justify-center mt-2">
            <span className="text-4xl font-bold text-slate-800">{stats.avg}</span>
            <span className="text-3xl ml-2">{getMoodEmoji(Number(stats.avg))}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-tight">Responses</p>
          <div className="mt-2">
            <span className="text-4xl font-bold text-slate-800">{stats.count}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Mood Distribution</h3>
        <div className="h-64">
          <MoodChart entries={entries} />
        </div>
      </div>

      {/* AI Action Plan Button */}
      <div className="relative group overflow-hidden">
        <button
          onClick={handleMagicButton}
          disabled={isLoading || entries.length === 0}
          className={`w-full py-5 px-8 rounded-3xl text-white font-bold text-lg shadow-xl flex items-center justify-center space-x-3 transition-all ${
            isLoading || entries.length === 0
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.01] active:scale-[0.99] shadow-purple-200'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Vibe...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">✨</span>
              <span>Magic AI Action Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Action Plan Results */}
      {actionPlan && (
        <div className="bg-white border-2 border-purple-100 rounded-3xl p-8 shadow-inner animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-bold text-purple-800 mb-6 flex items-center">
            <span className="mr-2">💡</span> Management Strategy
          </h3>
          <div className="space-y-6">
            {actionPlan.map((point, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Feedback Feed */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Comments</h3>
          <button 
            onClick={onReset}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 p-2 uppercase"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-slate-400 text-center py-10 italic">No feedback received yet.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-indigo-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                    <span className="text-xs font-bold text-slate-400">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    entry.mood >= 4 ? 'bg-green-100 text-green-700' : entry.mood <= 2 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    Mood: {entry.mood}/5
                  </span>
                </div>
                <p className="text-slate-600 text-sm italic">"{entry.comment || 'No comment provided'}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
