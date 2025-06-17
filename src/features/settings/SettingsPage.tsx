import React from 'react';
import mockSettingsData from './mockSettingsData';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">API Keys</h2>
        <ul>
          {mockSettingsData.apiKeys.map((k, i) => <li key={i}>{k.name}: {k.value ? '******' : 'Non renseignée'}</li>)}
        </ul>
        <h2 className="font-semibold mb-2 mt-4">Préférences</h2>
        <ul>
          {mockSettingsData.preferences.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
        <h2 className="font-semibold mb-2 mt-4">Notifications</h2>
        <ul>
          {mockSettingsData.notifications.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage; 