import React from 'react';
import TradesTable from './TradesTable';
import mockTradesData from './mockTradesData';

const TradesPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Trades</h1>
      <TradesTable trades={mockTradesData.trades} />
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 mt-6">
        <h2 className="font-semibold mb-2">Filtres</h2>
        <ul>
          <li>Statut : {mockTradesData.filters.status.join(', ')}</li>
          <li>Plateforme : {mockTradesData.filters.platform.join(', ')}</li>
          <li>Secteur : {mockTradesData.filters.sector.join(', ')}</li>
        </ul>
      </div>
    </div>
  );
};

export default TradesPage; 