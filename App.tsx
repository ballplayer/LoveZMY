
import React, { useState, useRef, useEffect } from 'react';
import { View, Task, Gift, AppState } from './types';
import { INITIAL_TASKS, GIFTS } from './constants';
import { getSweetResponse, speakText, decodeAudioData } from './geminiService';
import FloatingSparkles from './components/FloatingSparkles';

// Sub-components
import Home from './components/Home';
import Tasks from './components/Tasks';
import Mall from './components/Mall';
import Profile from './components/Profile';
import ChatDrawer from './components/ChatDrawer';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    points: 100,
    totalPointsEarned: 100,
    tasksCompleted: 0,
    currentView: View.HOME,
    aiResponse: "欢迎回家，我最爱的宝贝！今天也要元气满满哦～ 💖",
    inventory: []
  });

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const navigateTo = (view: View) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const playResponse = async (text: string) => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();

    setIsPlaying(true);
    const audioData = await speakText(text);
    if (audioData) {
      const buffer = await decodeAudioData(audioData, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } else {
      setIsPlaying(false);
    }
  };

  const createHeartBurst = (e: React.MouseEvent) => {
    const container = document.body;
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '💖';
      heart.className = 'heart-particle text-xl';
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      heart.style.transform = `rotate(${Math.random() * 360}deg)`;
      const destX = (Math.random() - 0.5) * 200;
      const destY = (Math.random() - 0.5) * 200;
      heart.style.setProperty('--dest-x', `${destX}px`);
      heart.style.setProperty('--dest-y', `${destY}px`);
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  };

  const handleCompleteTask = async (taskId: string, e: React.MouseEvent) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    createHeartBurst(e);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    
    const newPoints = state.points + task.points;
    const newTotal = state.totalPointsEarned + task.points;
    const newCount = state.tasksCompleted + 1;

    setState(prev => ({ ...prev, aiResponse: "宝贝稍等，正在记录你的优秀表现..." }));

    const sweetText = await getSweetResponse(`用户完成了任务：${task.name}，奖励了${task.points}宝贝积分。`);
    
    setState(prev => ({
      ...prev,
      points: newPoints,
      totalPointsEarned: newTotal,
      tasksCompleted: newCount,
      aiResponse: sweetText
    }));
    playResponse(sweetText);
  };

  const handleRedeemGift = async (gift: Gift) => {
    if (state.points < gift.cost) {
      const msg = "呜呜，宝贝积分还差一点点呢，再努力一下下嘛～ 🌸";
      setState(prev => ({ ...prev, aiResponse: msg }));
      playResponse(msg);
      return;
    }

    const newPoints = state.points - gift.cost;
    setState(prev => ({ ...prev, aiResponse: "正在打包这份爱..." }));

    const sweetText = await getSweetResponse(`用户兑换了礼物：${gift.name}，花费了${gift.cost}宝贝积分。这是一份来自男朋友的奖励。`);

    setState(prev => ({
      ...prev,
      points: newPoints,
      inventory: [...prev.inventory, gift.name],
      aiResponse: sweetText
    }));
    playResponse(sweetText);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-[#fff5f7] flex flex-col shadow-2xl overflow-hidden border-x-4 border-pink-100">
      <FloatingSparkles />

      {/* Header with Points */}
      <header className="pt-8 px-6 pb-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-500 font-title">宝贝养成计划</h1>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center shadow-md border border-pink-100">
            <span className="text-pink-400 mr-2">💎</span>
            <span className="font-bold text-pink-600">{state.points}</span>
          </div>
        </div>
      </header>

      {/* AI Message Bubble */}
      <section className="px-6 mb-4 z-10">
        <div 
          onClick={() => playResponse(state.aiResponse)}
          className={`bg-pink-50/90 border border-pink-200 rounded-2xl p-4 shadow-sm relative cursor-pointer active:scale-95 transition-transform ${isPlaying ? 'ring-2 ring-pink-300' : ''}`}
        >
          {isPlaying && <div className="sound-wave inset-0"></div>}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-pink-50 border-t border-l border-pink-200 rotate-45"></div>
          <p className="text-pink-700 text-sm italic relative z-10">
            <i className={`fas ${isPlaying ? 'fa-volume-high animate-bounce' : 'fa-heart'} text-pink-400 mr-2`}></i>
            {state.aiResponse}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 z-10 custom-scrollbar">
        {state.currentView === View.HOME && <Home tasks={tasks} />}
        {state.currentView === View.TASKS && <Tasks tasks={tasks} onComplete={handleCompleteTask} />}
        {state.currentView === View.MALL && <Mall gifts={GIFTS} points={state.points} onRedeem={handleRedeemGift} />}
        {state.currentView === View.PROFILE && <Profile state={state} />}
      </main>

      {/* Chat Trigger Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full shadow-lg shadow-pink-200 flex items-center justify-center text-white text-2xl floating z-40 hover:scale-110 active:scale-90 transition-all"
      >
        <i className="fas fa-comment-heart"></i>
      </button>

      {isChatOpen && <ChatDrawer onClose={() => setIsChatOpen(false)} onNewMessage={playResponse} />}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-pink-100 py-3 px-6 flex justify-between items-center z-50">
        <NavButton 
          active={state.currentView === View.HOME} 
          onClick={() => navigateTo(View.HOME)} 
          icon="fa-house-heart" 
          label="爱的小屋" 
        />
        <NavButton 
          active={state.currentView === View.TASKS} 
          onClick={() => navigateTo(View.TASKS)} 
          icon="fa-calendar-check" 
          label="养成" 
        />
        <NavButton 
          active={state.currentView === View.MALL} 
          onClick={() => navigateTo(View.MALL)} 
          icon="fa-bag-shopping" 
          label="商城" 
        />
        <NavButton 
          active={state.currentView === View.PROFILE} 
          onClick={() => navigateTo(View.PROFILE)} 
          icon="fa-user-heart" 
          label="我的" 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-pink-500 scale-110' : 'text-pink-300 hover:text-pink-400'}`}
  >
    <i className={`fas ${icon} text-lg`}></i>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
