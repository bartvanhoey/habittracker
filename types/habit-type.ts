import { Models } from "react-native-appwrite";

interface Habit {
  user_id: string;
  title: string;
  description: string;
  frequency: string;
  streak_count: number;
  last_completed: string;
  created_at: string;
}

export type HabitType = Models.Row & Habit
