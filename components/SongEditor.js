// info
import { colors, defaultStyles } from "../style/defaultStyles";
// editor
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
// main
import PagerView from "react-native-pager-view";
import saveIcon from "../assets/save.png";
import penIcon from "../assets/pen.png";
import arrowBackIcon from "../assets/arrow_back.png";
import chordIcon from "../assets/chord.png";
import { router, useNavigation } from "expo-router";
import { useEffect, useReducer, useState } from "react";
import { AddSongAsync, UpdateSongAsync } from "../hooks/songList";
import MyText from "./MyText";
import ChordEditor from "./ChordEditor";
import ConfirmModal from "./ConfirmModal";

// or useReducer purposes
function reducer(state, action) {
  switch (action.type) {
    case "TYPE":
      return {
        undoStack: [...state.undoStack, state.lyrics],
        lyrics: action.payload,
        redoStack: [],
      };
    case "UNDO":
      return {
        undoStack: state.undoStack.slice(0, -1),
        lyrics: state.undoStack[state.undoStack.length - 1],
        redoStack: [...state.redoStack, state.lyrics],
      };
    case "REDO":
      return {
        undoStack: [...state.undoStack, state.lyrics],
        lyrics: state.redoStack[state.redoStack.length - 1],
        redoStack: state.redoStack.slice(0, -1),
      };
    default:
      return state;
  }
}

export default function SongEditor({ song = {} }) {
  // add save button
  const navigation = useNavigation();
  const [showBackPopUp, setShowBackPopUp] = useState(false);
  const [title, setTitle] = useState(song.title || "");
  const [artist, setArtist] = useState(song.artist || "");
  const [tag, setTag] = useState(song.tag || "");
  const [state, dispatch] = useReducer(reducer, {
    undoStack: [],
    lyrics: song.lyrics || "",
    redoStack: [],
  });

  const [chords, setChords] = useState(song.chords || {});
  const [currentPage, setCurrentPage] = useState(0);
  const [isChordEdition, setIsChordEdition] = useState(false);
  // set a saveButton to the header and updated each time a state is updated
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        currentPage === 1 ? (
          <View style={styles.headerButtonsContainer}>
            <ImgButton
              handler={() => setIsChordEdition(!isChordEdition)}
              icon={isChordEdition ? penIcon : chordIcon}
            />
            <View style={{ width: 16 }} />
            <ImgButton handler={handleSaveSong} icon={saveIcon} />
          </View>
        ) : (
          <View style={styles.headerButtonsContainer}>
            <ImgButton handler={handleSaveSong} icon={saveIcon} />
          </View>
        ),
      headerLeft: () => (
        <ImgButton handler={handleGoBack} icon={arrowBackIcon} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigation,
    title,
    artist,
    tag,
    state.lyrics,
    chords,
    currentPage,
    isChordEdition,
  ]);
  const handleGoBack = () => {
    setShowBackPopUp(true);
  };
  const handleSaveSong = () => {
    // make sure all fields are filled
    if (!title.trim() || !state.lyrics.trim()) {
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
    // if is song passed, update the song
    if (song.id) {
      UpdateSongAsync(song.id, title, artist, state.lyrics, chords, tag)
        .then(() => {
          alert(`Song Updated!\n${title}\n${artist}`);
          router.navigate("/", { relativeToDirectory: false });
        })
        .catch((err) => alert(err));
    } else {
      // save the song and show errors
      AddSongAsync(title, artist, state.lyrics, chords, tag)
        .then((song) => {
          alert(`New Song Added!\n${song.title}\n${song.artist}`);
          router.navigate("/", { relativeToDirectory: false });
        })
        .catch((err) => alert(err));
    }
  };
  const ImgButton = ({ icon, handler }) => {
    return (
      <Pressable onPress={handler}>
        <Image
          source={icon}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </Pressable>
    );
  };
  return (
    <>
      <ConfirmModal
        visible={showBackPopUp}
        message="Do you really wanna go back, without saving changes?"
        onConfirm={() => navigation.goBack()}
        onCancel={() => setShowBackPopUp(false)}
      />
      <PagerView
        initialPage={0}
        style={{ flex: 1 }}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <MyText style={titleStyle}>Title</MyText>
            <TextInput
              value={title}
              style={styles.customInput}
              placeholder={"My best Song"}
              placeholderTextColor={colors.light.textSecondary}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.inputContainer}>
            <MyText style={titleStyle}>Artist</MyText>
            <TextInput
              style={styles.customInput}
              value={artist}
              placeholder={"Mysel-Fish Band"}
              onChangeText={setArtist}
              placeholderTextColor={colors.light.textSecondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <MyText style={titleStyle}>Tag</MyText>
            <TextInput
              style={styles.customInput}
              value={tag}
              placeholder={"Indie"}
              onChangeText={setTag}
              placeholderTextColor={colors.light.textSecondary}
            />
          </View>
        </View>
        {isChordEdition ? (
          <ChordEditor
            lyrics={state.lyrics}
            chords={chords}
            setChords={(newChords) => setChords(newChords)}
          />
        ) : (
          <>
            <TextInput
              value={state.lyrics}
              placeholder="A full fish soul with an empty song..."
              style={styles.textInput}
              onChangeText={(text) => dispatch({ type: "TYPE", payload: text })}
              multiline
            />
            <Pressable
              style={{ position: "absolute", bottom: 0, left: 64 }}
              disabled={state.undoStack.length === 0}
              onPress={() => dispatch({ type: "UNDO" })}
            >
              <MyText>Undo</MyText>
            </Pressable>
            <Pressable
              style={{ position: "absolute", bottom: 0, left: 120 }}
              disabled={state.redoStack.length === 0}
              onPress={() => dispatch({ type: "REDO" })}
            >
              <MyText>Redo</MyText>
            </Pressable>
          </>
        )}
      </PagerView>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.light.textPrimary,
    margin: 16,
  },
  customInput: {
    ...defaultStyles.text,
    color: colors.light.textPrimary,
    width: "100%",
    marginHorizontal: 8,
  },
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
    padding: 16,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
const titleStyle = StyleSheet.flatten(styles.title, styles.text);
