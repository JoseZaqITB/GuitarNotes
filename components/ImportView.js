import { Image, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import importImg from "../assets/import.png";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { defaultStyles } from "../style/defaultStyles";
import { router } from "expo-router";
import { WriteSongListAsync, GetListSongAsync } from "../hooks/songList";

export default function ImportView() {
  const handlePicking = () => {
    DocumentPicker.getDocumentAsync()
      .then((document) => FileSystem.readAsStringAsync(document.assets[0].uri))
      .then((newTextSong) => AddTemporarySongToList(newTextSong))
      .then((tempSong) => GoToUpdateSongView(tempSong.title, tempSong.artist));
  };

  return (
    <View>
      <Pressable onPress={handlePicking}>
        <Image source={importImg} />
      </Pressable>
      <MyText style={title}>Import</MyText>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    textAlign: "center",
    textTransform: "capitalize",
  },
});

const title = StyleSheet.compose(styles.text, defaultStyles.title);
// functions
async function AddTemporarySongToList(newSong) {
  const listSong = await GetListSongAsync();
  const title = "temp";
  const artist = title;
  // verify if temp-song already exists
  const _newSong = { title: title, artist: artist, lyrics: newSong };
  let _newJsonFile = [...listSong, _newSong];
  const indexSong = listSong.findIndex((song) => song.title === title);
  if (indexSong < 0) {
    await WriteSongListAsync(_newJsonFile);
    return _newSong;
  } else {
    _newJsonFile = listSong.map((song, index) =>
      index === indexSong ? _newSong : song,
    );
    await WriteSongListAsync(_newJsonFile);
    return listSong[indexSong];
  }
}
const GoToUpdateSongView = (title, artist) => {
  router.push(`/add/${title}-${artist}`);
};
