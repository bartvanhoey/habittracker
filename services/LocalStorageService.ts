import AsyncStorage from "@react-native-async-storage/async-storage";

const LocalStorageService = {
  setItem: async (key: string, value: string) => {
    try {
      const storedValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, storedValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;

      // Try parsing JSON, fallback to string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  clearStorage: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },

  getIsHabitAdded: async (): Promise<boolean> => {
    try {
      return await LocalStorageService.getItem("habitAdded");
    } catch (error) {
      console.error("Error checking habitAdded:", error);
      return false;
    }
  },

  setIsHabitAddedToTrue: async (): Promise<void> => {
    try {
      await LocalStorageService.setItem("habitAdded", "true");
    } catch (error) {
      console.error("Error checking habitAdded:", error);
    }
  },

  setIsHabitAddedToFalse: async (): Promise<void> => {
    try {
      await LocalStorageService.setItem("habitAdded", "false");
    } catch (error) {
      console.error("Error checking habitAdded:", error);
    }
  },
};

export default LocalStorageService;
