import { Stack } from "expo-router";
import { colors } from "../style/defaultStyles";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { CreateDefaultSongList } from "../hooks/songList";

export default function MainLayout() {
  // use effects
  // store song list json file in the phone
  useEffect(() => {
    CreateDefaultSongList().catch((e) => console.log(e));
  }, []);
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
