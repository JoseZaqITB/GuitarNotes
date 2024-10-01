import { Stack } from "expo-router";
import { colors } from "../style/defaultStyles";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" backgroundColor={colors.light.primary} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.light.primary,
          },
          contentStyle: {
            backgroundColor: colors.light.primary,
          },
          headerShadowVisible: false,
          headerTintColor: colors.light.textPrimary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "",
        }}
      />
    </SafeAreaView>
  );
}
