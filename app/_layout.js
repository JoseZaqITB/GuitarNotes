import { Stack } from "expo-router";
import { colors } from "../style/defaultStyles";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { CreateDefaultSongList } from "../hooks/songList";
import isFirstTimeLaunch from "../stores/settingsStorage";
import { ActivityIndicator } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  // store song list json file in the phone
  useEffect(() => {
    // set android nav bar ( 3 buttons at the bottom) to same color as app
    NavigationBar.setBackgroundColorAsync(colors.light.primary);
    //
    if (isFirstTimeLaunch()) {
      CreateDefaultSongList()
        .then(() => setLoading(false))
        .catch((e) => console.log(e));
      return;
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.light.primary}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        style="auto"
        backgroundColor={colors.light.primary}
        translucent
      />
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
