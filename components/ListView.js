import ListItem from "./ListItem";
import { ScrollView, StyleSheet, View } from "react-native";
import { Fragment, useEffect, useState } from "react";
import { GetListSongAsync } from "../hooks/songList";

export default function ListView({ gap }) {
  const [songList, setSongList] = useState([]);
  useEffect(() => {
    GetListSongAsync()
      .then((songList) => {
        const noTempSongList = songList.filter((song) => song.id !== 0);
        setSongList(noTempSongList);
      })
      .catch((error) => console.log(error));
  }, [setSongList]);
  return (
    <ScrollView style={styles.scrollContainer}>
      {songList.map((song, index) => (
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
