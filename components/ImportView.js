import { Image, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import importImg from "../assets/import.png";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { defaultStyles } from "../style/defaultStyles";
import { router } from "expo-router";

export default function ImportView() {
  const handlePicking = () => {
    const songListURI = FileSystem.documentDirectory + "songs.json";
    DocumentPicker.getDocumentAsync()
      .then((document) => FileSystem.readAsStringAsync(document.assets[0].uri))
      .then((newTextSong) => AddTemporarySongToList(songListURI, newTextSong))
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
async function AddTemporarySongToList(songListURI, newSong) {
  var jsonFile = await FileSystem.readAsStringAsync(songListURI);
  jsonFile = JSON.parse(jsonFile, null);

  const title = "temp";
  const artist = title;
  // verify if temp-song already exists
  const indexSong = jsonFile.findIndex((song) => song.title === title);
  if (indexSong < 0) {
    const _newSong = { title: title, artist: artist, lyrics: newSong };
    const _newJsonFile = [...jsonFile, _newSong];
    await RewriteJsonFileAsync(songListURI, JSON.stringify(_newJsonFile));
    return _newSong;
  } else {
    jsonFile[indexSong].lyrics = newSong;
    await RewriteJsonFileAsync(songListURI, jsonFile);
    return jsonFile[indexSong];
  }
}
const GoToUpdateSongView = (title, artist) => {
  router.push(`/add/${title}-${artist}`);
};
const RewriteJsonFileAsync = async (uri, newSongList) => {
  //write to file
  return FileSystem.writeAsStringAsync(uri, JSON.stringify(newSongList));
};
