import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { Navbar } from './components/Navbar';
import { Task, FocusSession, UserSettings } from './types';

const DEFAULT_SETTINGS: UserSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartFocus: false,
  theme: 'light'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'stats'>('timer');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('deepfocus_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('deepfocus_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTaskId, setActiveTaskId] = useState<string | undefined>(() => {
    const saved = localStorage.getItem('deepfocus_active_task');
    return saved || undefined;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('deepfocus_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('deepfocus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('deepfocus_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem('deepfocus_active_task', activeTaskId);
    } else {
      localStorage.removeItem('deepfocus_active_task');
    }
  }, [activeTaskId]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('deepfocus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('deepfocus_theme', 'light');
    }
  }, [isDarkMode]);

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      createdAt: Date.now()
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(undefined);
  };

  const handleSessionComplete = (type: 'focus' | 'short-break' | 'long-break', duration: number) => {
    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      taskId: type === 'focus' ? activeTaskId : undefined,
      duration,
      timestamp: Date.now(),
      type
    };
    setSessions([...sessions, newSession]);

    if (type === 'focus' && activeTaskId) {
      setTasks(tasks.map(t => 
        t.id === activeTaskId 
          ? { ...t, completedPomodoros: t.completedPomodoros + 1 } 
          : t
      ));
    }
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="min-h-screen pb-32">
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
            <span className="text-white font-black text-xl">D</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase">深焦 DeepFocus</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Timer
                focusDuration={DEFAULT_SETTINGS.focusDuration}
                shortBreakDuration={DEFAULT_SETTINGS.shortBreakDuration}
                longBreakDuration={DEFAULT_SETTINGS.longBreakDuration}
                onSessionComplete={handleSessionComplete}
                activeTaskId={activeTaskId}
                activeTaskTitle={activeTask?.title}
              />
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-250px)]"
            >
              <TaskList
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onSelectTask={setActiveTaskId}
                activeTaskId={activeTaskId}
              />
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-250px)]"
            >
              <Stats sessions={sessions} tasks={tasks} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
}

