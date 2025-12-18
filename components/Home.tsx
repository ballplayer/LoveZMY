
import React, { useState } from 'react';
import { Task } from '../types';
import { getDailyFortune } from '../geminiService';

interface HomeProps {
  tasks: Task[];
}

const Home: React.FC<HomeProps> = ({ tasks }) => {
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const [fortune, setFortune] = useState<string | null>(null);
  const [loadingFortune, setLoadingFortune] = useState(false);

  const handleDrawCard = async () => {
    setLoadingFortune(true);
    const card = await getDailyFortune();
    setFortune(card);
    setLoadingFortune(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-gradient-to-tr from-pink-200 to-rose-100 rounded-full p-2 shadow-inner border-4 border-white/50 floating">
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
          <img 
            src="https://picsum.photos/seed/princess/300/300" 
            alt="Princess" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-pink-400 text-white p-3 rounded-full shadow-lg border-2 border-white">
          <span className="text-xl">👑</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-pink-600 font-title">公主的小屋</h2>
        <p className="text-pink-400 text-sm">今日还有 {pendingTasks} 项甜蜜任务待完成</p>
      </div>

      {/* Daily Fortune Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300"></div>
        <h3 className="text-pink-500 font-bold mb-4 flex items-center">
          <i className="fas fa-sparkles mr-2 text-rose-400"></i> 心动抽卡
        </h3>
        
        {!fortune ? (
          <button 
            onClick={handleDrawCard}
            disabled={loadingFortune}
            className="w-full py-10 border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center justify-center group hover:bg-pink-50 transition-colors"
          >
            <div className={`text-4xl mb-2 transition-transform group-hover:scale-125 ${loadingFortune ? 'animate-spin' : ''}`}>🎴</div>
            <p className="text-pink-300 text-xs font-medium">{loadingFortune ? '正在为您抽取惊喜...' : '点击抽取今日专属心动语录'}</p>
          </button>
        ) : (
          <div className="animate-in zoom-in-95 duration-500 bg-gradient-to-br from-pink-50 to-white p-5 rounded-2xl border border-pink-100 shadow-inner">
            <p className="text-pink-700 italic text-sm leading-relaxed mb-4 text-center">“{fortune}”</p>
            <div className="flex justify-center">
              <button onClick={() => setFortune(null)} className="text-[10px] text-pink-300 hover:text-pink-400 uppercase tracking-widest">
                再抽一张
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm">
        <h3 className="text-pink-500 font-bold mb-4 flex items-center">
          <i className="fas fa-stars mr-2"></i> 今日概览
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pink-50 rounded-2xl p-4 text-center border border-pink-100">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-xs text-pink-400">已坚持</div>
            <div className="font-bold text-pink-600">7 天</div>
          </div>
          <div className="bg-rose-50 rounded-2xl p-4 text-center border border-rose-100">
            <div className="text-2xl mb-1">💖</div>
            <div className="text-xs text-rose-400">获得好评</div>
            <div className="font-bold text-rose-600">99+</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
