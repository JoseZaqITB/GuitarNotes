import ListItem from "./ListItem";
import dataJson from "../data/songs.json";
import { ScrollView, StyleSheet, View } from "react-native";
import { Fragment } from "react";

export default function ListView({ gap }) {
  return (
    <ScrollView style={styles.scrollContainer}>
      {dataJson.map((song, index) => (
        <Fragment key={`empty wrapper ${song.title} ${song.artist} ${index}`}>
          <ListItem
            title={song.title}
            author={song.artist}
            key={`${song.title} ${song.artist} ${index}`}
          />
          <View
            style={{ height: gap ? gap : 16 }}
            key={`spacer ${song.title} ${song.artist} ${index}`}
          />
        </Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
