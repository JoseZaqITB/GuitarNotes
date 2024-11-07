import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function isFirstTimeLaunch() {
  try {
    const value = await AsyncStorage.getItem("@isFirstTimeLaunch");
    if (value !== null) {
      return false;
    } else {
      await AsyncStorage.setItem("@isFirstTimeLaunch", "true");
      return true;
    }
  } catch (e) {
    alert(e);
  }
}
