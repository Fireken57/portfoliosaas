import React from 'react';

type Asset = {
  name: string;
  type: string;
  platform: string;
  quantity: number;
  value: number;
  currency: string;
};

type Props = {
  assets: Asset[];
};

const PortfolioTable: React.FC<Props> = ({ assets }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Actif</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Plateforme</th>
            <th className="px-4 py-2">Quantité</th>
            <th className="px-4 py-2">Valeur</th>
            <th className="px-4 py-2">Devise</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a, i) => (
            <tr key={i} className="bg-white dark:bg-zinc-900">
              <td className="px-4 py-2">{a.name}</td>
              <td className="px-4 py-2">{a.type}</td>
              <td className="px-4 py-2">{a.platform}</td>
              <td className="px-4 py-2">{a.quantity}</td>
              <td className="px-4 py-2">{a.value.toLocaleString()} €</td>
              <td className="px-4 py-2">{a.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable; 