import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { cn } from '@/src/lib/utils';

interface TimerProps {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onSessionComplete: (type: 'focus' | 'short-break' | 'long-break', duration: number) => void;
  activeTaskId?: string;
  activeTaskTitle?: string;
}

type TimerMode = 'focus' | 'short-break' | 'long-break';

export const Timer: React.FC<TimerProps> = ({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onSessionComplete,
  activeTaskTitle
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = (mode === 'focus' ? focusDuration : mode === 'short-break' ? shortBreakDuration : longBreakDuration) * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    resetTimer(mode);
  }, [focusDuration, shortBreakDuration, longBreakDuration]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (mode === 'focus') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF8C42', '#0F2B3D', '#ffffff']
      });
    }

    onSessionComplete(mode, totalTime);
    
    // Auto switch mode? Maybe just notify user
  };

  const resetTimer = (newMode: TimerMode = mode) => {
    setIsActive(false);
    setMode(newMode);
    const duration = newMode === 'focus' ? focusDuration : newMode === 'short-break' ? shortBreakDuration : longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-full">
        {(['focus', 'short-break', 'long-break'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => resetTimer(m)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              mode === m 
                ? "bg-white dark:bg-slate-700 shadow-sm text-brand-orange" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {m === 'focus' ? '专注' : m === 'short-break' ? '短休' : '长休'}
          </button>
        ))}
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-800"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="816.8"
            initial={{ strokeDashoffset: 816.8 }}
            animate={{ strokeDashoffset: 816.8 - (816.8 * progress) / 100 }}
            transition={{ duration: 0.5, ease: "linear" }}
            className={cn(
              "transition-colors duration-500",
              mode === 'focus' ? "text-brand-orange" : "text-emerald-500"
            )}
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <motion.span 
            key={timeLeft}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold font-mono tracking-tighter"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium uppercase tracking-widest">
            {mode === 'focus' ? '保持专注' : '休息时间'}
          </span>
        </div>

        {isActive && mode === 'focus' && (
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-brand-orange/20 -z-10"
          />
        )}
      </div>

      <div className="flex flex-col items-center space-y-4">
        {activeTaskTitle && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-brand-blue/5 dark:bg-white/5 rounded-lg border border-brand-blue/10 dark:border-white/10">
            <Brain className="w-4 h-4 text-brand-orange" />
            <span className="text-sm font-medium truncate max-w-[200px]">{activeTaskTitle}</span>
          </div>
        )}

        <div className="flex items-center space-x-6">
          <button
            onClick={() => resetTimer()}
            className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            title="重置"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={toggleTimer}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95",
              isActive 
                ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200" 
                : "bg-brand-orange text-white hover:scale-105"
            )}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>
      </div>
    </div>
  );
};
