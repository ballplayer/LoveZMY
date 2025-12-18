
import React, { useState, useRef, useEffect } from 'react';
import { getSweetResponse } from '../geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDrawerProps {
  onClose: () => void;
  onNewMessage: (text: string) => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ onClose, onNewMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '宝贝，今天有什么开心的事想跟我分享吗？我会一直听着的～ 💖' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await getSweetResponse(`用户说：${userMsg}`);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
    onNewMessage(response);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-pink-200/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md mx-auto h-[70vh] bg-white rounded-t-[3rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-500 overflow-hidden border-t-4 border-pink-100">
        {/* Drag Handle Area */}
        <div className="w-full flex justify-center py-4 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-pink-100 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-8 pb-4 border-b border-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white text-xl">
              <i className="fas fa-heart-circle-check"></i>
            </div>
            <div>
              <h3 className="font-bold text-pink-600 font-title">心动树洞</h3>
              <p className="text-[10px] text-pink-300">正在陪宝贝聊天...</p>
            </div>
          </div>
          <button onClick={onClose} className="text-pink-300 hover:text-pink-500">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm transition-all animate-in zoom-in-95 ${
                  msg.role === 'user' 
                    ? 'bg-pink-400 text-white rounded-tr-none' 
                    : 'bg-pink-50 text-pink-700 rounded-tl-none border border-pink-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-pink-50 px-4 py-3 rounded-2xl rounded-tl-none animate-pulse">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-pink-50/50 backdrop-blur-md border-t border-pink-100">
          <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-pink-100 shadow-inner">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="跟我也说点什么吧..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-pink-600 placeholder-pink-200 focus:outline-none"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform shadow-md"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;
