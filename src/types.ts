export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: number;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  duration: number; // in seconds
  timestamp: number;
  type: 'focus' | 'short-break' | 'long-break';
}

export interface UserSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  theme: 'light' | 'dark';
}
