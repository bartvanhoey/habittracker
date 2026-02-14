import {
  COMPLETIONS_TABLE_ID,
  DATABASE_ID,
  db,
  HABITS_TABLE_ID,
} from "@/lib/appwrite";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Button, Surface } from "react-native-paper";


import LocalStorageService from "@/services/LocalStorageService";
import { HabitType } from "@/types/habit-type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppwriteException, ID, Query } from "react-native-appwrite";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "expo-router";
import { useBumpVersion } from "@/lib/bump-version-provider";
import { HabitCompletionType } from "@/types/habit-completion-type";
import { useUser  } from "@/hooks/useUser";

// const usePageLoadEffect = (effect: () => void) => {
//   if (Platform.OS === "web") {
//     useEffect(effect, []);
//   } else {
//     useFocusEffect(useCallback(effect, []));
//   }
// };

export default function HomeScreen() {
  
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [isHabitAdded, setIsHabitAdded] = useState<boolean>(false);
  const [habitCompletionIds, setHabitCompletionIds] = useState<string[]>([]);
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const { habitVersion } = useBumpVersion();
  const {user, logout } = useUser();

  const fetchHabits = async () => {
    if (!user) {
      return;
    }

    try {
      const habits = await db.listRows<HabitType>({
        databaseId: DATABASE_ID,
        tableId: HABITS_TABLE_ID,
        queries: [Query.equal("user_id", user.$id ?? "")],
      });
      setHabits(habits.rows);
      console.log({ habits });
    } catch (err) {
      // console.log(err);
    }
  };

  const fetchTodayCompletions = async () => {
    if (!user) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0);

    try {
      const completions = await db.listRows<HabitCompletionType>({
        databaseId: DATABASE_ID,
        tableId: COMPLETIONS_TABLE_ID,
        queries: [
          Query.equal("user_id", user.$id ?? ""),
          Query.greaterThanEqual("completed_at", today.toISOString()),
        ],
      });
      const habitCompletions = completions.rows;
      setHabitCompletionIds(habitCompletions.map((x) => x.habit_id));
      console.log({ habitCompletions });
    } catch (err) {
      // console.log(err);
    }
  };

  if (Platform.OS === "web") {
    useEffect(() => {
      if (!user) return;
      fetchHabits();
      fetchTodayCompletions();
    }, [user, habitVersion]);
  } else {
    useFocusEffect(
      useCallback(() => {
        if (!user) return;
        const fetchData = async () => {
          await fetchHabits();
          await fetchTodayCompletions();
        };
        fetchData();
      }, [user]),
    );
  }

  const isHabitCompleted = (id: string) => habitCompletionIds.includes(id);

  const handleDeleteHabit = async (id: string) => {
    // console.log(`handleDeleteHabit swiped${id}`);
    try {
      var response = await db.getRow<HabitType>(
        DATABASE_ID,
        HABITS_TABLE_ID,
        id,
      );
      // // console.log(response);
      await db.deleteRow(DATABASE_ID, HABITS_TABLE_ID, id);
      fetchHabits();
    } catch (err) {
      if (err instanceof AppwriteException) {
        console.info(err.message);
      }
      console.error("something went wrong");
    }
  };

  const handleCompleteHabit = async (id: string) => {
    await fetchTodayCompletions();
    const habitCompletionIdsIncludeHabitId = habitCompletionIds.includes(id);
    // console.log({ habitCompletionIdsIncludeHabitId });
    if (!user || habitCompletionIdsIncludeHabitId) {
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      await db.createRow<HabitCompletionType>({
        databaseId: DATABASE_ID,
        tableId: COMPLETIONS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          habit_id: id,
          user_id: user.$id,
          completed_at: currentDate,
        },
      });
      // console.log(habitCompletion);

      const habit = habits.find((h) => h.$id == id);
      if (!habit) {
        return;
      }

      const updatedHabit = await db.updateRow<HabitType>(
        DATABASE_ID,
        HABITS_TABLE_ID,
        habit.$id,
        {
          streak_count: habit.streak_count + 1,
          last_completed: currentDate,
        },
      );

      // console.log(updatedHabit);
    } catch (err) {
      if (err instanceof AppwriteException) {
        console.info(err.message);
      }
      console.error("something went wrong");
    }
  };

  const renderRightActions = (id: string) => {
    return (
      <View style={styles.swipeRightAction}>
        {isHabitCompleted(id) ? (
          <Text style={{ color: "#fff" }}>Completed</Text>
        ) : (
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={32}
            color={"#fff"}
          />
        )}
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.swipeLeftAction}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={32}
          color={"#fff"}
        />
      </View>
    );
  };

  // useEffect(() => {
  //   if (!user) return;
  //   fetchHabits();
  //   fetchTodayCompletions();
  //   const interval = setInterval(() => {
  //     fetchHabits();
  //     fetchTodayCompletions();
  //   }, 5000);
  //   return () => clearInterval(interval); // cleanup on unmount or user change
  // }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Habits</Text>
        <Button mode="text" onPress={logout} icon={"logout"}>
          Sign Out
        </Button>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No habits</Text>
          </View>
        ) : (
          habits.map((habit, key) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={() => renderRightActions(habit.$id)}
              onSwipeableOpen={async (direction) => {
                if (direction === "left") {
                  await handleDeleteHabit(habit.$id);
                } else if (direction === "right") {
                  await handleCompleteHabit(habit.$id);
                }
                swipeableRefs.current[habit.$id]?.close();
              }}>
              <Surface
                style={[
                  styles.card,
                  isHabitCompleted(habit.$id) && styles.cardCompleted,
                ]}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{habit.title}</Text>
                  <Text style={styles.cardDescription}>
                    {habit.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakBadge}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={18}
                        color={"#FF9800"}
                      />
                      <Text style={styles.streakText}>
                        {habit.streak_count} day streak
                      </Text>
                    </View>
                    <View style={styles.frequencyBadge}>
                      <Text style={styles.frequencyText}>
                        {habit.frequency.charAt(0).toUpperCase() +
                          habit.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardCompleted: {
    opacity: 0.6,
    backgroundColor: "green",
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666666",
  },
  swipeLeftAction: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeRightAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});
