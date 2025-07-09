// info
import { colors, defaultStyles } from "../../style/defaultStyles";
// editor
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
// main
import PagerView from "react-native-pager-view";
import arrowBackIcon from "../../assets/arrow_back.png";
import { router, useNavigation } from "expo-router";
import { useEffect, useReducer, useRef, useState } from "react";
import { AddSongAsync, UpdateSongAsync } from "../../hooks/songList";
import MyText from "../../components/MyText";
import ChordEditor from "../../components/ChordEditor";
import ConfirmModal from "../../components/ConfirmModal";
import { getChords, storeChords } from "../../stores/songStorage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// or useReducer purposes
function reducer(state, action) {
  switch (action.type) {
    case "TYPE":
      return {
        undoStack: [...state.undoStack, state.lyricLinesNChords],
        lyricLinesNChords: action.payload,
        redoStack: [],
      };
    case "UNDO":
      return {
        undoStack: state.undoStack.slice(0, -1),
        lyricLinesNChords: state.undoStack[state.undoStack.length - 1],
        redoStack: [...state.redoStack, state.lyricLinesNChords],
      };
    case "REDO":
      return {
        undoStack: [...state.undoStack, state.lyricLinesNChords],
        lyricLinesNChords: state.redoStack[state.redoStack.length - 1],
        redoStack: state.redoStack.slice(0, -1),
      };
    default:
      return state;
  }
}
export default function CreateView({ song = {} }) {
  // add save button
  const navigation = useNavigation();
  const [showBackPopUp, setShowBackPopUp] = useState(false);
  const [title, setTitle] = useState(song.title || "");
  const [artist, setArtist] = useState(song.artist || "");
  const [tag, setTag] = useState(song.tag || "");
  const [state, dispatch] = useReducer(reducer, {
    undoStack: [],
    lyricLinesNChords: {
      lyrics: song.lyrics || "",
      chords: song.chords || {},
    },
    redoStack: [],
  });
  const [liveLyrics, setLiveLyrics] = useState(song.lyrics || "");
  const [liveChords, setLiveChords] = useState(song.chords || {});
  const debounceTimer = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isChordEdition, setIsChordEdition] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedLines, setSelectedLines] = useState({});
  // set a saveButton to the header and updated each time a state is updated
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        currentPage === 1 ? (
          <View style={styles.headerButtonsContainer}>
            <Pressable onPress={() => setIsChordEdition(!isChordEdition)}>
              <FontAwesome5
                name="edit"
                size={24}
                color={colors.light.textPrimary}
              />
            </Pressable>
            <View style={{ width: 16 }} />
            <Pressable onPress={handleSaveSong}>
              <FontAwesome5
                name="save"
                size={24}
                color={colors.light.textPrimary}
              />
            </Pressable>
          </View>
        ) : (
          <View style={styles.headerButtonsContainer}>
            <Pressable onPress={handleSaveSong}>
              <FontAwesome5
                name="save"
                size={24}
                color={colors.light.textPrimary}
              />
            </Pressable>
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
    state.lyricLinesNChords,
    currentPage,
    isChordEdition,
  ]);
  useEffect(() => {
    return () => {
      // eslint-disable-next-line no-undef
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);
  useEffect(() => {
    setLiveLyrics(state.lyricLinesNChords.lyrics);
  }, [state]);
  useEffect(() => {
    storeChords(state.lyricLinesNChords.chords);
  }, [state.lyricLinesNChords.chords]);

  const handleUpdateChords = (chords) => {
    storeChords(chords);
    const newLyricsLinesNChords = { ...state.lyricLinesNChords };
    newLyricsLinesNChords.chords = chords;
    setLiveChords(chords);
    dispatch({ type: "TYPE", payload: newLyricsLinesNChords });
  };
  const handleGoBack = () => {
    setShowBackPopUp(true);
  };
  const handleSaveSong = async () => {
    const lyrics = state.lyricLinesNChords.lyrics;
    // make sure all fields are filled
    if (!title.trim() || !lyrics.trim()) {
      Alert.Alert.alert("Please fill at least title and lyrics");
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
    const chords = await getChords();
    if (song.id) {
      UpdateSongAsync(song.id, title, artist, lyrics, chords, tag)
        .then(() => {
          Alert.alert(`Song Updated!\n${title}\n${artist}`);
          router.navigate("/", { relativeToDirectory: false });
        })
        .catch((err) => Alert.alert(err));
    } else {
      // save the song and show errors
      AddSongAsync(title, artist, lyrics, chords, tag)
        .then((song) => {
          Alert.alert(`New Song Added!\n${song.title}\n${song.artist}`);
          router.navigate("/", { relativeToDirectory: false });
        })
        .catch((err) => Alert.alert(err));
    }
  };
  const handleOnChangeText = (text) => {
    function updateChordsFromDiff(oldText, newText, oldChords) {
      const updatedChords = {};

      // Find the range where the change occurred
      let start = 0;
      while (
        start < oldText.length &&
        start < newText.length &&
        oldText[start] === newText[start]
      ) {
        start++;
      }

      let endOld = oldText.length - 1;
      let endNew = newText.length - 1;
      while (
        endOld >= start &&
        endNew >= start &&
        oldText[endOld] === newText[endNew]
      ) {
        endOld--;
        endNew--;
      }

      const removedCount = endOld - start + 1;
      const addedCount = endNew - start + 1;
      const shift = addedCount - removedCount;

      for (const [posStr, chord] of Object.entries(oldChords)) {
        const pos = Number(posStr);

        if (pos < start) {
          // chord is before the edit — keep as is
          updatedChords[pos] = chord;
        } else if (pos > endOld) {
          // chord is after the change — shift
          updatedChords[pos + shift] = chord;
        }
        // Chords within the changed/deleted range are discarded
      }
      return updatedChords;
    }
    const newLyricLinesNChords = { ...state.lyricLinesNChords };
    const oldText = liveLyrics;
    const newText = text;
    const newChords = updateChordsFromDiff(oldText, newText, liveChords);
    // save changes
    setLiveLyrics(text);
    setLiveChords(newChords);
    // Debounce: reset timer
    // eslint-disable-next-line no-undef
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    // eslint-disable-next-line no-undef
    debounceTimer.current = setTimeout(() => {
      newLyricLinesNChords.chords = newChords;
      newLyricLinesNChords.lyrics = text;
      dispatch({ type: "TYPE", payload: newLyricLinesNChords });
    }, 500); // 500ms delay before committing changes
  };
  const handleDelete = (index) => {
    //
    function removeAndShiftChords(chords, lyricLines, selectedLines) {
      let charOffset = 0;
      let removedRanges = []; // [{start, end, length}]
      let lineOffsets = []; // store char start of each line

      // Step 1: calculate line start offsets and deleted line ranges
      lyricLines.forEach((line, index) => {
        lineOffsets.push(charOffset);

        const lineLength = line.length + 1; // +1 for newline or space
        if (selectedLines[index]) {
          removedRanges.push({
            start: charOffset,
            end: charOffset + line.length,
            length: lineLength,
          });
        }

        charOffset += lineLength;
      });

      // Step 2: filter chords not in removed ranges and prepare for shifting
      const remainingChords = {};
      for (const [posStr, chord] of Object.entries(chords)) {
        const pos = parseInt(posStr);

        // Check if this chord is in any deleted line range
        const isDeleted = removedRanges.some(
          ({ start, end }) => pos >= start && pos <= end,
        );
        if (isDeleted) continue;

        // Calculate shift: how much content was removed before this chord
        const shift = removedRanges
          .filter(({ end }) => end < pos)
          .reduce((sum, { length }) => sum + length, 0);

        remainingChords[pos - shift] = chord;
      }

      return remainingChords;
    }
    //
    const newLyricLinesNChords = { ...state.lyricLinesNChords };
    newLyricLinesNChords.lyrics = newLyricLinesNChords.lyrics.filter(
      (lines, lineIndex) => !selectedLines[lineIndex],
    );
    newLyricLinesNChords.chords = removeAndShiftChords(
      state.lyricLinesNChords.chords,
      state.lyricLinesNChords.lyrics,
      selectedLines,
    );
    dispatch({ type: "TYPE", payload: newLyricLinesNChords });
    handleCancelSelection();
  };
  const handleCancelSelection = () => {
    setSelectedLines([]);
    setIsSelectionMode(false);
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
            lyrics={liveLyrics}
            chords={state.lyricLinesNChords.chords}
            updateChords={handleUpdateChords}
          />
        ) : (
          <View style={styles.textEditionContainer}>
            <TextInput
              placeholder="A full fish soul with an empty song..."
              value={liveLyrics}
              style={styles.textInput}
              onChangeText={(text) => {
                handleOnChangeText(text);
              }}
              multiline
            />
            <View style={styles.undoRedoContainer}>
              {isSelectionMode ? (
                <>
                  <Pressable onPress={handleDelete}>
                    <FontAwesome5
                      name="trash"
                      size={20}
                      color={colors.light.textPrimary}
                    />
                  </Pressable>
                  <Pressable onPress={handleCancelSelection}>
                    <FontAwesome5
                      name="times"
                      size={20}
                      color={colors.light.textPrimary}
                    />
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    disabled={state.undoStack.length <= 0}
                    onPress={() => dispatch({ type: "UNDO" })}
                  >
                    <FontAwesome5
                      name="undo-alt"
                      size={20}
                      color={colors.light.textPrimary}
                    />
                  </Pressable>
                  <Pressable
                    disabled={state.redoStack.length <= 0}
                    onPress={() => dispatch({ type: "REDO" })}
                  >
                    <FontAwesome5
                      name="redo-alt"
                      size={20}
                      color={colors.light.textPrimary}
                    />
                  </Pressable>
                </>
              )}
            </View>
          </View>
        )}
      </PagerView>
    </>
  );
}
const monoSpaceFamily = Platform.OS === "android" ? "monospace" : "courier"; // choose monospace font by OS

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
    paddingHorizontal: 8,
    fontFamily: "",
    flex: 1,
  },
  editableInput: {
    fontFamily: monoSpaceFamily,
    paddingVertical: 8,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  undoRedoContainer: {
    alignContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "center",
    flexDirection: "row",
    gap: 16,
    padding: 8,
  },
  textEditionContainer: {
    justifyContent: "space-between",
  },
  lineBtnSelection: {
    borderTopWidth: 1,
    borderColor: colors.light.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lineBtnSelected: {
    borderWidth: 1,
    borderColor: "#900D09",
  },
  timeIconBtn: {
    minWidth: "10%",
    maxWidth: 32,
    alignItems: "center",
  },
  lineBtn: {},
  chordWrapper: {
    position: "absolute",
    top: -10,
    left: 0,

    paddingTop: 2,
    margin: 0,
  },
  chordText: {
    fontFamily: monoSpaceFamily,
    ...defaultStyles.middleText,
    color: colors.light.textSecondary,
  },
});
const titleStyle = StyleSheet.flatten(styles.title, styles.text);
