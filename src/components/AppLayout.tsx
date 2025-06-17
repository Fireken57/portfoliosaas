import Sidebar from './Sidebar';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-8 shadow-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-zinc-700">AlphaTrade Analytics</h1>
          {/* Ici tu peux ajouter un avatar, notifications, etc. */}
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
} 