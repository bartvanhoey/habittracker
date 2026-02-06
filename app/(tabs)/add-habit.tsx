import { DATABASE_ID, db, HABITS_TABLE_ID } from "@/lib/appwrite";
import { HabitType } from "@/types/habit-type";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useAuth } from "../../lib/auth-context";

const FREQUENCIES = ["daily", "weekly", "monthly"];

type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    try {
      const habit = await db.createRow<HabitType>({
        databaseId: DATABASE_ID,
        tableId: HABITS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          user_id: user.$id,
          title: title,
          description: description,
          frequency: frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      });

      console.log({ habit });
      console.log("$createdAt: " + habit.$createdAt);
      console.log("$databaseId: " + habit.$databaseId);
      console.log("$id: " + habit.$id);
      console.log("$permissions: " + habit.$permissions);
      console.log("$sequence: " + habit.$sequence);
      console.log("$tableId: " + habit.$tableId);
      console.log("$updatedAt: " + habit.$updatedAt);
      console.log("created_at: " + habit.created_at);
      console.log("description: " + habit.description);
      console.log("frequency: " + habit.frequency);
      console.log("last_completed: " + habit.last_completed);
      console.log("streak_count: " + habit.streak_count);
      console.log("title: " + habit.title);
      console.log("user_id: " + habit.user_id);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Creating the habit went wrong");
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setTitle}
        style={styles.input}
        label={"Title"}
        mode="outlined"></TextInput>
      <TextInput
        onChangeText={setDescription}
        style={styles.input}
        label={"Description"}
        mode="outlined"></TextInput>
      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          value={frequency}
          onValueChange={(value) => setFrequency(value)}
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
        />
      </View>
      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}>
        Add Habit
      </Button>
      {(error || error !== undefined) && (
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
});
