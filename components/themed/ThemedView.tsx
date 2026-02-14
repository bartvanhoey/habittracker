import {
  View,
  useColorScheme,
  ViewStyle,
  StyleProp,
  ViewProps,
} from "react-native";
import React from "react";

import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

type ThemedViewProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  safe?: boolean;
  children?: React.ReactNode;
};

const ThemedView = ({ style, safe = false, ...props }: ThemedViewProps) => {
  
  const colorScheme = useColorScheme();
  // const theme = Colors[colorScheme as "light" | "dark"] ?? Colors.light;
  // strictly typed version
  const theme =
    Colors[colorScheme === "dark" ? "dark" : "light"] ?? Colors.light;

  // console.log("Current color scheme:", colorScheme);
  // console.log("Current theme:", theme);

  // No need to pass children explicitly,
  // as they will be included in props and rendered by default

  if (!safe) {
    return (
      <View
        style={[
          {
            backgroundColor: theme.backgroundColor,
            // alignItems: "center",
          },
          style,
        ]}
        {...props}
      />
    );
  }
  
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          backgroundColor: theme.backgroundColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          // paddingLeft: insets.left,
          // paddingRight: insets.right,
          // alignItems: "center",
        },
        style,
      ]}
      {...props}
    />
  );
};

// return (
//   <View
//     style={[
//       {
//         backgroundColor: theme.background,
//       style,
//     ]}
//     {...props}
//   >
//     {children} // This will render any child components passed to ThemedView
//   </View>

export default ThemedView;
