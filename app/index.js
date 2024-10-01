import ListView from "../components/ListView";
import AddView from "../components/AddView";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import PagerView from "react-native-pager-view";

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <PagerView style={{ flex: 1 }} initialPage={0}>
      <ListView gap={16} />
      <AddView />
    </PagerView>
  );
}
