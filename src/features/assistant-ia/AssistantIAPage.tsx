import React from 'react';
import mockAssistantIAData from './mockAssistantIAData';

const AssistantIAPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Assistant IA</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
        <h2 className="font-semibold mb-2">Chat IA (mock)</h2>
        <div className="bg-zinc-800 text-white rounded p-2 mb-2">{mockAssistantIAData.chatHistory.map((msg, i) => <div key={i}><b>{msg.role}:</b> {msg.content}</div>)}</div>
        <h2 className="font-semibold mb-2">Suggestions IA</h2>
        <ul>
          {mockAssistantIAData.suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
        <h2 className="font-semibold mb-2">Analyses fondamentales</h2>
        <ul>
          {mockAssistantIAData.analyses.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default AssistantIAPage; 