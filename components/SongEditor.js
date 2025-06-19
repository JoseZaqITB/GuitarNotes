// info
import { colors, defaultStyles } from "../style/defaultStyles";
// editor
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
// main
import PagerView from "react-native-pager-view";
import arrowBackIcon from "../assets/arrow_back.png";
import { router, useNavigation } from "expo-router";
import { useEffect, useMemo, useReducer, useState } from "react";
import { AddSongAsync, UpdateSongAsync } from "../hooks/songList";
import MyText from "./MyText";
import ChordEditor from "./ChordEditor";
import ConfirmModal from "./ConfirmModal";
import { getChords, storeChords } from "../stores/songStorage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { emptyChar, parseChordString } from "../hooks/useChordify";

// or useReducer purposes
function reducer(state, action) {
  switch (action.type) {
    case "TYPE":
      return {
        undoStack: [...state.undoStack, state.lyricLines],
        lyricLines: action.payload,
        redoStack: [],
      };
    case "UNDO":
      return {
        undoStack: state.undoStack.slice(0, -1),
        lyricLines: state.undoStack[state.undoStack.length - 1],
        redoStack: [...state.redoStack, state.lyricLines],
      };
    case "REDO":
      return {
        undoStack: [...state.undoStack, state.lyricLines],
        lyricLines: state.redoStack[state.redoStack.length - 1],
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
  const [chords, setChords] = useState(song.chords || {});
  const [state, dispatch] = useReducer(reducer, {
    undoStack: [],
    lyricLines: song.lyrics.split(/\n/) || "",
    redoStack: [],
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [isChordEdition, setIsChordEdition] = useState(false);
  const [editableInput, setEditableInput] = useState(-1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedLines, setSelectedLines] = useState({});
  const chordString = useMemo(() => {
    const emptyChordString = state.lyricLines
      .map((line) => emptyChar.repeat(line.length))
      .join("\n");
    return parseChordString(chords, emptyChordString).split("\n");
  }, [state.lyricLines, chords]);
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
            <FontAwesome5
              name="save"
              size={24}
              color={colors.light.textPrimary}
            />
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
    state.lyricLines,
    currentPage,
    isChordEdition,
  ]);
  useEffect(() => {
    storeChords(chords);
  }, [chords]);

  const handleUpdateChords = (chords) => {
    storeChords(chords);
    setChords(chords);
  };
  const handleGoBack = () => {
    setShowBackPopUp(true);
  };
  const handleSaveSong = async () => {
    const lyrics = state.lyricLines.join("\n");
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
    // if is song passed, update the song
    const chords = await getChords();
    if (song.id) {
      UpdateSongAsync(song.id, title, artist, lyrics, chords, tag)
        .then(() => {
          alert(`Song Updated!\n${title}\n${artist}`);
          router.navigate("/", { relativeToDirectory: false });
        })
        .catch((err) => alert(err));
    } else {
      // save the song and show errors
      AddSongAsync(title, artist, lyrics, chords, tag)
        .then((song) => {
          alert(`New Song Added!\n${song.title}\n${song.artist}`);
          router.navigate("/", { relativeToDirectory: false });
        })
        .catch((err) => alert(err));
    }
  };
  const handleOnChangeText = (text, index) => {
    const newLyricLines = [...state.lyricLines];
    newLyricLines[index] = text;
    newLyricLines[index] = text.padEnd(state.lyricLines[index].length, " ");
    dispatch({ type: "TYPE", payload: newLyricLines });
  };
  const handleLongPress = (index) => {
    setIsSelectionMode(true);
    setSelectedLines((prev) => ({ ...prev, [index]: true }));
  };
  const handlePress = (index) => {
    if (isSelectionMode)
      dispatch({
        type: "TYPE",
        payload: { ...state.lyricLines, [index]: true },
      });
    else setEditableInput(index);
  };
  const handleDelete = (index) => {
    //
    function removeAndShiftChords(chords, lyricLines, selectedLines) {
      const lineIndices = Object.keys(selectedLines)
        .map(Number)
        .sort((a, b) => a - b);

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
    setChords(
      removeAndShiftChords(song.chords, state.lyricLines, selectedLines),
    );
    //
    const newLyricLines = state.lyricLines.filter(
      (lines, lineIndex) => !selectedLines[lineIndex],
    );
    dispatch({ type: "TYPE", payload: newLyricLines });
    handleCancelSelection();
  };
  const handleUnselect = (index) => {
    setSelectedLines((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
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
            lyrics={state.lyricLines.join("\n")}
            chords={chords}
            updateChords={handleUpdateChords}
          />
        ) : (
          <View style={styles.textEditionContainer}>
            <ScrollView>
              {state.lyricLines.map((line, lineIndex) => (
                <Pressable
                  key={lineIndex}
                  onPress={() => handlePress(lineIndex)}
                  onLongPress={() => handleLongPress(lineIndex)}
                  style={
                    isSelectionMode
                      ? selectedLines[lineIndex]
                        ? {
                            ...styles.lineBtnSelection,
                            ...styles.lineBtnSelected,
                          }
                        : styles.lineBtnSelection
                      : styles.lineBtn
                  }
                >
                  {editableInput === lineIndex && (
                    <MyText style={styles.chordText}>
                      {chordString[lineIndex]}
                    </MyText>
                  )}
                  <TextInput
                    value={line}
                    placeholder="A full fish soul with an empty song..."
                    style={
                      editableInput === lineIndex
                        ? { ...styles.textInput, ...styles.editableInput }
                        : styles.textInput
                    }
                    onChangeText={(text) => {
                      handleOnChangeText(text, lineIndex);
                    }}
                    multiline
                    readOnly={editableInput !== lineIndex}
                  />
                  {isSelectionMode && selectedLines[lineIndex] && (
                    <Pressable
                      onPress={() => handleUnselect(lineIndex)}
                      style={styles.timeIconBtn}
                    >
                      <FontAwesome5 name="times" size={16} color={"#900D09"} />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.undoRedoContainer}>
              {isSelectionMode ? (
                <>
                  <Pressable onPress={handleDelete}>
                    <FontAwesome5
                      name="trash"
                      size={16}
                      color={colors.light.textPrimary}
                    />
                  </Pressable>
                  <Pressable onPress={handleCancelSelection}>
                    <FontAwesome5
                      name="times"
                      size={16}
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
                      size={16}
                      color={colors.light.textPrimary}
                    />
                  </Pressable>
                  <Pressable
                    disabled={state.redoStack.length <= 0}
                    onPress={() => dispatch({ type: "REDO" })}
                  >
                    <FontAwesome5
                      name="redo-alt"
                      size={16}
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
    flexShrink: 1,
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
    gap: 8,
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

  chordText: {
    position: "absolute",
    top: -10,
    left: 0,
    fontFamily: monoSpaceFamily,
    ...defaultStyles.middleText,
    color: colors.light.textSecondary,
  },
});
const titleStyle = StyleSheet.flatten(styles.title, styles.text);
