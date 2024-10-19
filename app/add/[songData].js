import { StyleSheet, TextInput, View } from "react-native";
import PagerView from "react-native-pager-view";
import MyText from "../../components/MyText";

import SongEditView from "../../components/SongEditView";
import { colors, defaultStyles } from "../../style/defaultStyles";
import { useEffect, useState } from "react";
import useSongList from "../../hooks/useSongList";
import { useLocalSearchParams } from "expo-router";

function CustomInput({ name }) {
  return (
    <View style={styles.inputContainer}>
      <MyText style={title}>{name}</MyText>
      <TextInput
        placeholder="My best Song"
        placeholderTextColor={colors.light.textSecondary}
        style={styles.text}
      />
    </View>
  );
}

function Metadata() {
  return (
    <View style={styles.mainContainer}>
      <CustomInput name={"Title"} />
      <CustomInput name={"Author"} />
      <CustomInput name={"Tag"} />
    </View>
  );
}

export default function UpdateSongView() {
  // vars
  const { songData } = useLocalSearchParams();
  const titleAndAuthor = songData.split("-");
  const [song, setSong] = useState();
  const songList = useSongList();
  //use effects
  useEffect(() => {
    songList.findSong(titleAndAuthor[0], titleAndAuthor[1]).then((song) => {
      setSong(song);
    });
  }, [songList, titleAndAuthor]);
  // return view
  return (
    <PagerView initialPage={0} style={{ flex: 1 }}>
      <Metadata />
      <SongEditView lyrics={song?.lyrics} />
    </PagerView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 64, // adjust center problem because of the header height
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.light.textPrimary,
    margin: 16,
  },
  text: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
    margin: 4,
  },
  title: {
    fontWeight: "bold",
    ...defaultStyles.title,
  },
});

const title = StyleSheet.compose(styles.text, styles.title);
