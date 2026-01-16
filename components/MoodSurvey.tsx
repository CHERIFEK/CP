
import React, { useState } from 'react';
import { FeedbackEntry } from '../types';

interface MoodSurveyProps {
  onAdd: (entry: FeedbackEntry) => void;
  onGoToDashboard: () => void;
}

const MoodSurvey: React.FC<MoodSurveyProps> = ({ onAdd, onGoToDashboard }) => {
  const [mood, setMood] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { value: 1, label: '😭', color: 'bg-rose-100 border-rose-200' },
    { value: 2, label: '😕', color: 'bg-orange-100 border-orange-200' },
    { value: 3, label: '😐', color: 'bg-amber-100 border-amber-200' },
    { value: 4, label: '🙂', color: 'bg-emerald-100 border-emerald-200' },
    { value: 5, label: '🤩', color: 'bg-teal-100 border-teal-200' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood === 0) return;

    const newEntry: FeedbackEntry = {
      id: crypto.randomUUID(),
      mood,
      comment,
      timestamp: Date.now(),
    };

    onAdd(newEntry);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-4xl">
          ✨
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Thank You!</h2>
          <p className="text-slate-500 mt-2">Your anonymous feedback has been safely delivered.</p>
        </div>
        <div className="flex flex-col space-y-3 pt-4">
          <button
            onClick={() => {
              setMood(0);
              setComment('');
              setSubmitted(false);
            }}
            className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all"
          >
            Submit Another
          </button>
          <button
            onClick={onGoToDashboard}
            className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 transition-all"
          >
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">How's the vibe?</h2>
        <p className="text-slate-500">Your feedback is 100% anonymous and helps improve our team.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Select your mood</label>
          <div className="grid grid-cols-5 gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  mood === m.value 
                    ? `border-indigo-500 ring-4 ring-indigo-50 bg-white scale-110` 
                    : `${m.color} border-transparent grayscale-[0.5] hover:grayscale-0`
                }`}
              >
                <span className="text-4xl">{m.label}</span>
                <span className="text-xs mt-2 font-medium text-slate-600">{m.value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Additional Comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts, suggestions, or concerns..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[120px]"
          />
        </div>

        <button
          disabled={mood === 0}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all ${
            mood === 0 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200 active:scale-[0.98]'
          }`}
        >
          Send Vibe Check
        </button>
      </form>
    </div>
  );
};

export default MoodSurvey;
