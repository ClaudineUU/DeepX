import React from 'react';
import { Timer as TimerIcon, LayoutGrid, BarChart3, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NavbarProps {
  activeTab: 'timer' | 'tasks' | 'stats';
  onTabChange: (tab: 'timer' | 'tasks' | 'stats') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, isDarkMode, toggleDarkMode }) => {
  const navItems = [
    { id: 'timer', label: '专注', icon: TimerIcon },
    { id: 'tasks', label: '任务', icon: LayoutGrid },
    { id: 'stats', label: '统计', icon: BarChart3 },
  ] as const;

  return (
    <nav className="glass fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-full flex items-center space-x-2 z-50 shadow-2xl border-white/30">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={cn(
            "flex items-center space-x-2 px-5 py-2 rounded-full transition-all duration-300",
            activeTab === item.id 
              ? "bg-brand-orange text-white shadow-lg scale-105" 
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-white/5"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className={cn(
            "text-sm font-bold transition-all duration-300 overflow-hidden",
            activeTab === item.id ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0"
          )}>
            {item.label}
          </span>
        </button>
      ))}
      
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2" />
      
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full text-slate-500 hover:text-brand-orange hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </nav>
  );
};
