import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { NOTES } from "../utils/chords";

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

export const storeCurrentChordList = async (value) => {
  try {
    if (typeof value === "object") {
      await AsyncStorage.setItem("currentChordList", JSON.stringify(value));
    } else throw new Error("it must be an object or array");
  } catch (e) {
    Alert.alert("songStorage: " + e);
  }
};

export const getCurrentChordList = async () => {
  try {
    const value = await AsyncStorage.getItem("currentChordList");
    if (value !== null) {
      return JSON.parse(value);
    } else return NOTES.filter((note) => !note.includes("#"));
  } catch (e) {
    Alert.alert("songStorage: " + e);
  }
};
