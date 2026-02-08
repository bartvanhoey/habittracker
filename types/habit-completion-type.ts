
import { Models } from "react-native-appwrite";

interface HabitCompletion {
  habit_id: string;
  user_id: string;
  completed_at: string;
}

export type HabitCompletionType = Models.Row & HabitCompletion


