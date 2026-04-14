import React, { useState } from 'react';
import { Plus, MoreVertical, CheckCircle2, Circle, Trash2, Play, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, TaskStatus } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (id: string) => void;
  activeTaskId?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  activeTaskId
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: '待开始' },
    { status: 'in-progress', label: '进行中' },
    { status: 'done', label: '已完成' }
  ];

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">任务看板</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-orange text-white rounded-full text-sm font-medium hover:bg-brand-orange/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>添加任务</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {columns.map((col) => (
          <div key={col.status} className="flex flex-col space-y-4 min-w-[250px]">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {col.label} ({tasks.filter(t => t.status === col.status).length})
              </span>
            </div>

            <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-3 space-y-3 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {tasks
                  .filter((t) => t.status === col.status)
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        "group glass p-4 rounded-xl cursor-pointer transition-all",
                        activeTaskId === task.id ? "ring-2 ring-brand-orange border-transparent" : "hover:shadow-md"
                      )}
                      onClick={() => onSelectTask(task.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            "font-medium truncate",
                            task.status === 'done' && "line-through text-slate-400"
                          )}>
                            {task.title}
                          </h3>
                          <div className="flex items-center mt-2 space-x-3 text-xs text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.completedPomodoros}/{task.estimatedPomodoros}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {task.status !== 'done' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateTask(task.id, { status: 'done' });
                              }}
                              className="p-1 hover:text-emerald-500 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task.id);
                            }}
                            className="p-1 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {task.status !== 'done' && (
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mr-4">
                            <div 
                              className="h-full bg-brand-orange transition-all duration-500"
                              style={{ width: `${Math.min((task.completedPomodoros / task.estimatedPomodoros) * 100, 100)}%` }}
                            />
                          </div>
                          {activeTaskId !== task.id && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTask(task.id);
                                onUpdateTask(task.id, { status: 'in-progress' });
                              }}
                              className="text-xs font-bold text-brand-orange hover:underline"
                            >
                              专注
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6">新建任务</h3>
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">任务名称</label>
                  <input
                    autoFocus
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="你打算做什么？"
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-2 px-6 py-3 rounded-xl font-bold bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors shadow-lg"
                  >
                    创建任务
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
