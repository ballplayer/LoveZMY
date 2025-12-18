
import { Task, Gift } from './types';

export const INITIAL_TASKS: Task[] = [
  { id: '1', name: '早睡早起', points: 20, icon: '🌙', completed: false },
  { id: '2', name: '乖乖喝水 8 杯', points: 15, icon: '💧', completed: false },
  { id: '3', name: '今日运动打卡', points: 30, icon: '🧘‍♀️', completed: false },
  { id: '4', name: '心情记录', points: 10, icon: '📝', completed: false },
  { id: '5', name: '按时吃饭', points: 20, icon: '🍱', completed: false },
  { id: '6', name: '对我微笑一次', points: 50, icon: '🌸', completed: false },
];

export const GIFTS: Gift[] = [
  { id: 'g1', name: '专属奶茶外卖', cost: 500, image: '🥤', description: '想喝哪家点哪家，我买单！' },
  { id: 'g2', name: '电影之夜选片权', cost: 1000, image: '🎬', description: '这个周末，我陪你看任何你想看的电影。' },
  { id: 'g3', name: '清空购物车（限额版）', cost: 5000, image: '🛒', description: '选中你心仪的小惊喜，我来付款～' },
  { id: 'g4', name: '神秘大牌礼物', cost: 9999, image: '🎁', description: '我为你精心准备的终极惊喜，敬请期待。' },
];
