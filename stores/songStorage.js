import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const storeChords = async (value) => {
  try {
    if (typeof value === "object") {
      await AsyncStorage.setItem("chords", JSON.stringify(value));
    } else await AsyncStorage.setItem("chords", value);
  } catch (e) {
    Alert.alert("songStorage: " + e);
  }
};

export const getChords = async () => {
  try {
    const value = await AsyncStorage.getItem("chords");
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    Alert.alert("songStorage: " + e);
  }
};

export const storeLyrics = async (value) => {
  try {
    await AsyncStorage.setItem("lyrics", value);
  } catch (e) {
    Alert.alert("songStorage: " + e);
  }
};

export const getLyrics = async () => {
  try {
    const value = await AsyncStorage.getItem("lyrics");
    if (value !== null) {
      return "";
    }
  } catch (e) {
    Alert.alert("songStorage: " + e);
  }
};
