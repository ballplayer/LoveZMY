
import React from 'react';
import { Gift } from '../types';

interface MallProps {
  gifts: Gift[];
  points: number;
  onRedeem: (gift: Gift) => void;
}

const Mall: React.FC<MallProps> = ({ gifts, points, onRedeem }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-pink-600 font-title">爱的礼物店</h2>
        <div className="bg-pink-400 text-white px-3 py-1 rounded-full text-[10px] font-bold">
          VIP 专属
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {gifts.map((gift) => (
          <div 
            key={gift.id}
            className="bg-white rounded-[2rem] p-5 border border-pink-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow"
          >
            <div className="w-20 h-20 rounded-3xl bg-pink-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              {gift.image}
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-pink-600">{gift.name}</h4>
              <p className="text-[10px] text-pink-400 leading-tight">{gift.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-pink-500 font-bold text-sm">💎 {gift.cost}</span>
                <button
                  onClick={() => onRedeem(gift)}
                  disabled={points < gift.cost}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold jelly-btn transition-all ${
                    points >= gift.cost
                      ? 'bg-gradient-to-r from-rose-300 to-pink-300 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  立即兑换
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 text-center text-pink-300">
        <i className="fas fa-ellipsis-h text-2xl opacity-50"></i>
        <p className="text-xs mt-2 italic">更多心动奖励正在赶来...</p>
      </div>
    </div>
  );
};

export default Mall;
