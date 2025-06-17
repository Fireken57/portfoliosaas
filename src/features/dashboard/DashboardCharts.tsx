import React from 'react';

type Props = {
  sectorPie: { label: string; value: number }[];
  benchmark: { label: string; value: number }[];
};

const DashboardCharts: React.FC<Props> = ({ sectorPie, benchmark }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Répartition par secteur</h2>
        <ul>
          {sectorPie.map((s, i) => (
            <li key={i}>{s.label}: {s.value}%</li>
          ))}
        </ul>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Performance vs Benchmark</h2>
        <ul>
          {benchmark.map((b, i) => (
            <li key={i}>{b.label}: {b.value}%</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardCharts; 