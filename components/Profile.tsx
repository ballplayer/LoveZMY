
import React from 'react';
import { AppState } from '../types';

interface ProfileProps {
  state: AppState;
}

const Profile: React.FC<ProfileProps> = ({ state }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 border border-pink-100 shadow-sm text-center relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-50 rounded-full -ml-12 -mb-12 opacity-50"></div>

        <div className="relative z-10 space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-pink-200 p-1 bg-white">
            <img 
              src="https://picsum.photos/seed/love/200/200" 
              alt="User" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-pink-600">最爱的宝贝仙女</h2>
            <p className="text-xs text-pink-400 mt-1">✨ 我的爱意成长手册 ✨</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon="fa-gem" 
          label="累计获得积分" 
          value={state.totalPointsEarned} 
          color="pink" 
        />
        <StatCard 
          icon="fa-calendar-check" 
          label="完成打卡次数" 
          value={state.tasksCompleted} 
          color="rose" 
        />
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-6 border border-pink-100 shadow-sm">
        <h3 className="text-pink-500 font-bold mb-4 flex items-center">
          <i className="fas fa-gift mr-2"></i> 已兑换奖励 ({state.inventory.length})
        </h3>
        {state.inventory.length === 0 ? (
          <p className="text-sm text-pink-300 text-center py-4 italic">暂未兑换任何礼物，快去商城看看吧～</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {state.inventory.map((item, i) => (
              <span key={i} className="bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs border border-pink-100">
                🎁 {item}
              </span>
            ))}
          </div>
        )}
      </div>

      <button className="w-full bg-white border border-pink-200 text-pink-400 py-3 rounded-2xl text-xs font-medium hover:bg-pink-50 transition-colors">
        <i className="fas fa-heart-pulse mr-2"></i> 给开发者（也就是我）留言
      </button>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-3xl border border-${color}-100 text-center`}>
    <i className={`fas ${icon} text-${color}-400 text-lg mb-2`}></i>
    <div className={`text-[10px] text-${color}-400`}>{label}</div>
    <div className={`text-xl font-bold text-${color}-600`}>{value}</div>
  </div>
);

export default Profile;
