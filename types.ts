
export enum View {
  HOME = 'HOME',
  TASKS = 'TASKS',
  MALL = 'MALL',
  PROFILE = 'PROFILE'
}

export interface Task {
  id: string;
  name: string;
  points: number;
  icon: string;
  completed: boolean;
}

export interface Gift {
  id: string;
  name: string;
  cost: number;
  image: string;
  description: string;
}

export interface AppState {
  points: number;
  totalPointsEarned: number;
  tasksCompleted: number;
  currentView: View;
  aiResponse: string;
  inventory: string[];
}
