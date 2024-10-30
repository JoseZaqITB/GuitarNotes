// info
import { colors, defaultStyles } from "../style/defaultStyles";
// editor
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
// main
import PagerView from "react-native-pager-view";
import saveIcon from "../assets/saveIcon.png";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { AddSongAsync } from "../hooks/songList";
import LabelInput from "./LabelInput";

export default function SongEditor({ song }) {
  // add save button
  const navigation = useNavigation();
  const [title, setTitle] = useState(song.title || "");
  const [artist, setArtist] = useState(song.artist || "");
  const [tag, setTag] = useState(song.tag || "");
  const [lyrics, setLyrics] = useState(song.lyrics || "");
  // set a saveButton to the header and updated each time a state is updated
  useEffect(() => {
    navigation.setOptions({ headerRight: () => <SaveButton /> });
  }, [navigation, title, artist, tag, lyrics]);

  const handleSaveSong = () => {
    // make sure all fields are filled
    if (!title.trim() || !lyrics.trim()) {
      alert("Please fill at least title and lyrics");
      return;
    }
    if (!artist.trim()) {
      setArtist("Unknown");
    }
    if (!tag.trim()) {
      setTag("Unknown");
    }
    // capitalize title, artist, and tag // TODO
    // save the song and show errors
    AddSongAsync(title, artist, lyrics, tag)
      .then(() => {
        alert(`New Song Added!\n${title}\n${artist}`);
        router.push("/", { relativeToDirectory: false });
      })
      .catch((err) => alert(err));
  };
  const SaveButton = () => {
    return (
      <Pressable onPress={handleSaveSong}>
        <Image source={saveIcon} />
      </Pressable>
    );
  };

  // song info

  function SongInfo() {
    return (
      <View style={styles.mainContainer}>
        <LabelInput
          name={"Title"}
          defaultValue={title}
          placeholder={"My best Song"}
          state={setTitle}
        />
        <LabelInput
          name={"artist"}
          defaultValue={artist}
          placeholder={"Mysel-Fish Band"}
          state={setArtist}
        />
        <LabelInput
          name={"Tag"}
          defaultValue={tag}
          placeholder={"Indie"}
          state={setTag}
        />
      </View>
    );
  }
  //

  return (
    <PagerView initialPage={0} style={{ flex: 1 }}>
      <SongInfo />
      <ScrollView style={styles.lyricsContainer}>
        <TextInput
          defaultValue={lyrics}
          placeholder="A full fish soul with an empty song..."
          style={styles.textInput}
          onChangeText={setLyrics}
          multiline
        />
      </ScrollView>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 64, // adjust center problem because of the header height
  },
  text: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
    margin: 4,
  },
  customInput: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
    width: "100%",
    marginHorizontal: 8,
  },
  title: {
    fontWeight: "bold",
    ...defaultStyles.title,
  },
  lyricsContainer: {
    flex: 0.9,
    paddingHorizontal: 8,
  },
  textInput: {
    ...defaultStyles.middleText,
    color: colors.light.textPrimary,
    textAlignVertical: "top",
    minHeight: "100%", // right?. when no text, text keeps in size of container
  },
});
