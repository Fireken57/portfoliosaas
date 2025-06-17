import React from 'react';
import mockAnalyticsData from './mockAnalyticsData';

const AnalyticsPage: React.FC = () => {
  const { correlations, stats, heatmap, suggestions } = mockAnalyticsData;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Corrélations</h2>
        <ul>
          {correlations.map((c, i) => (
            <li key={i}>{c.asset1} / {c.asset2} : {c.value}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Stats avancées</h2>
        <ul>
          {stats.map((s, i) => (
            <li key={i}>{s.label} : {s.value}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Heatmap</h2>
        <pre className="bg-zinc-800 text-white rounded p-2">{heatmap}</pre>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Suggestions IA</h2>
        <ul>
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsPage; 