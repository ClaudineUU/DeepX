import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FocusSession, Task } from '@/src/types';
import { TrendingUp, Clock, Target, CheckCircle } from 'lucide-react';

interface StatsProps {
  sessions: FocusSession[];
  tasks: Task[];
}

export const Stats: React.FC<StatsProps> = ({ sessions, tasks }) => {
  const totalFocusMinutes = Math.round(
    sessions
      .filter(s => s.type === 'focus')
      .reduce((acc, s) => acc + s.duration, 0) / 60
  );

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Process data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(day => {
    const daySessions = sessions.filter(s => 
      s.type === 'focus' && 
      new Date(s.timestamp).toISOString().split('T')[0] === day
    );
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return {
      name: weekdays[new Date(day).getDay()],
      minutes: Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60)
    };
  });

  const metrics = [
    { label: '总专注时长', value: `${totalFocusMinutes}m`, icon: Clock, color: 'text-brand-orange' },
    { label: '已完成任务', value: completedTasks, icon: CheckCircle, color: 'text-emerald-500' },
    { label: '任务完成率', value: `${completionRate}%`, icon: Target, color: 'text-blue-500' },
    { label: '日均时长', value: `${Math.round(totalFocusMinutes / 7)}m`, icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold tracking-tight">数据统计</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-2">
            <m.icon className={`w-6 h-6 ${m.color}`} />
            <span className="text-2xl font-bold">{m.value}</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">专注活跃度</h3>
          <span className="text-sm text-slate-500">最近 7 天</span>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#FF8C42' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="font-bold mb-4">专注任务排行</h3>
          <div className="space-y-4">
            {tasks
              .sort((a, b) => b.completedPomodoros - a.completedPomodoros)
              .slice(0, 3)
              .map(task => (
                <div key={task.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1 mr-4">{task.title}</span>
                  <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2 py-1 rounded">
                    {task.completedPomodoros} 番茄
                  </span>
                </div>
              ))}
            {tasks.length === 0 && <p className="text-sm text-slate-500 italic">暂无任务数据</p>}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
           <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
             <CheckCircle className="w-8 h-8 text-emerald-500" />
           </div>
           <h4 className="font-bold">继续加油！</h4>
           <p className="text-sm text-slate-500">坚持是深度工作的关键。你已经完成了 {completedTasks} 个任务。</p>
        </div>
      </div>
    </div>
  );
};
