import React from 'react';
import mockPlansData from './mockPlansData';

const PlansPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Plans de trading</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Liste des plans</h2>
        <ul>
          {mockPlansData.plans.map((p, i) => (
            <li key={i}>
              <b>{p.name}</b> - TP: {p.tp} / SL: {p.sl} / Taille: {p.size} / Probabilité: {p.probability}%
              <br />Scénario: {p.scenario}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlansPage; 