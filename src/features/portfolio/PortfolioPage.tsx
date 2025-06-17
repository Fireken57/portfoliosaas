import React from 'react';
import PortfolioTable from './PortfolioTable';
import mockPortfolioData from './mockPortfolioData';

const PortfolioPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <PortfolioTable assets={mockPortfolioData.assets} />
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 mt-6">
        <h2 className="font-semibold mb-2">Stats avancées</h2>
        <ul>
          <li>Répartition par secteur : {mockPortfolioData.stats.bySector.join(', ')}</li>
          <li>Répartition par devise : {mockPortfolioData.stats.byCurrency.join(', ')}</li>
          <li>Répartition par pays : {mockPortfolioData.stats.byCountry.join(', ')}</li>
        </ul>
      </div>
    </div>
  );
};

export default PortfolioPage; 