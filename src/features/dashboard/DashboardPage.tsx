import React from 'react';
import DashboardCharts from './DashboardCharts';
import mockDashboardData from './mockDashboardData';

const DashboardPage: React.FC = () => {
  const { pnl, healthScore, alerts, news, sectorPie, benchmark } = mockDashboardData;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">P&L cumulé</h2>
          <div className="text-2xl font-bold">{pnl} €</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Score santé IA</h2>
          <div className="text-2xl font-bold">{healthScore.score} / 100</div>
          <div className="text-sm text-gray-500 mt-1">{healthScore.explanation}</div>
        </div>
      </div>
      <DashboardCharts sectorPie={sectorPie} benchmark={benchmark} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Alertes</h2>
          <ul className="list-disc ml-5">
            {alerts.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Actualités personnalisées</h2>
          <ul className="list-disc ml-5">
            {news.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 