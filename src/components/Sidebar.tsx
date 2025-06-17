"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PieChart, List, BarChart2, ClipboardList, Bot, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
  { href: '/portfolio', label: 'Portfolio', icon: <PieChart size={20} /> },
  { href: '/trades', label: 'Trades', icon: <List size={20} /> },
  { href: '/analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  { href: '/plans', label: 'Plans', icon: <ClipboardList size={20} /> },
  { href: '/assistant-ia', label: 'Assistant IA', icon: <Bot size={20} /> },
  { href: '/settings', label: 'Paramètres', icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-white border-r border-zinc-200 flex flex-col py-6 px-4 shadow-sm fixed top-0 left-0 z-20">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="font-bold text-xl text-blue-600">AlphaTrade</span>
      </div>
      <nav className="flex-1">  
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-600 ${pathname === item.href ? 'bg-blue-100 text-blue-700' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-xs text-zinc-400 px-2">© 2024 AlphaTrade</div>
    </aside>
  );
} 