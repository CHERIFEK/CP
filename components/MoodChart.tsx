
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { FeedbackEntry } from '../types';

interface MoodChartProps {
  entries: FeedbackEntry[];
}

const MoodChart: React.FC<MoodChartProps> = ({ entries }) => {
  const data = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    entries.forEach((e) => {
      if (e.mood >= 1 && e.mood <= 5) {
        counts[e.mood - 1]++;
      }
    });
    return [
      { name: '1', label: '😭', value: counts[0], color: '#f43f5e' },
      { name: '2', label: '😕', value: counts[1], color: '#f59e0b' },
      { name: '3', label: '😐', value: counts[2], color: '#fbbf24' },
      { name: '4', label: '🙂', value: counts[3], color: '#10b981' },
      { name: '5', label: '🤩', value: counts[4], color: '#14b8a6' },
    ];
  }, [entries]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 24 }}
        />
        <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MoodChart;
