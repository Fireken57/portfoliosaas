import React from 'react';

type Trade = {
  asset: string;
  type: string;
  platform: string;
  quantity: number;
  entry: number;
  exit: number;
  status: string;
  pnl: number;
  fees: number;
  comment: string;
};

type Props = {
  trades: Trade[];
};

const TradesTable: React.FC<Props> = ({ trades }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Actif</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Plateforme</th>
            <th className="px-4 py-2">Quantité</th>
            <th className="px-4 py-2">Entrée</th>
            <th className="px-4 py-2">Sortie</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">P&L</th>
            <th className="px-4 py-2">Frais</th>
            <th className="px-4 py-2">Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i} className="bg-white dark:bg-zinc-900">
              <td className="px-4 py-2">{t.asset}</td>
              <td className="px-4 py-2">{t.type}</td>
              <td className="px-4 py-2">{t.platform}</td>
              <td className="px-4 py-2">{t.quantity}</td>
              <td className="px-4 py-2">{t.entry}</td>
              <td className="px-4 py-2">{t.exit}</td>
              <td className="px-4 py-2">{t.status}</td>
              <td className="px-4 py-2">{t.pnl}</td>
              <td className="px-4 py-2">{t.fees}</td>
              <td className="px-4 py-2">{t.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesTable; 