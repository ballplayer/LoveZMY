
import React from 'react';
import { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  onComplete: (id: string, e: React.MouseEvent) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onComplete }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-pink-600 font-title">日常养成</h2>
        <span className="text-xs text-pink-400">完成任务，收集爱意 ✨</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`group relative overflow-hidden flex items-center justify-between p-4 rounded-3xl transition-all duration-300 border ${
              task.completed 
                ? 'bg-pink-50/50 border-pink-200 grayscale-[0.5]' 
                : 'bg-white border-pink-100 hover:border-pink-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${
                task.completed ? 'bg-pink-100' : 'bg-pink-50'
              }`}>
                {task.icon}
              </div>
              <div>
                <h4 className={`font-bold ${task.completed ? 'text-pink-300 line-through' : 'text-pink-600'}`}>
                  {task.name}
                </h4>
                <p className="text-xs text-pink-400">+{task.points} 宝贝积分</p>
              </div>
            </div>

            <button
              disabled={task.completed}
              onClick={(e) => onComplete(task.id, e)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all jelly-btn ${
                task.completed
                  ? 'bg-pink-200 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200 active:scale-95'
              }`}
            >
              {task.completed ? (
                <span><i className="fas fa-check mr-1"></i> 已完成</span>
              ) : (
                '打卡'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
