import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import useChordify from "../hooks/useChordify";
import MyText from "./MyText";
import { useEffect, useReducer, useState } from "react";
import ChordBoard from "./ChordBoard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

function reducer(state, action) {
  switch (action.type) {
    case "UNDO":
      return {
        undoStack: state.undoStack.slice(0, -1),
        oldStack: [
          ...state.oldStack,
          state.undoStack[state.undoStack.length - 1],
        ],
        newStack: state.newStack.slice(0, -1),
        redoStack: [
          ...state.redoStack,
          state.newStack[state.newStack.length - 1],
        ],
      };
    case "TAP":
      const oldChord = {
        chord: action.payload.oldChord,
        position: action.payload.position,
      };
      const newChord = {
        chord: action.payload.newChord,
        position: action.payload.position,
      };
      return {
        undoStack: [...state.undoStack, oldChord],
        oldStack: [],
        newStack: [...state.newStack, newChord],
        redoStack: [],
      };
    case "REDO":
      return {
        undoStack: [
          ...state.undoStack,
          state.oldStack[state.oldStack.length - 1],
        ],
        oldStack: state.oldStack.slice(0, -1),
        newStack: [
          ...state.newStack,
          state.redoStack[state.redoStack.length - 1],
        ],
        redoStack: state.redoStack.slice(0, -1),
      };
    default:
      throw new Error("Unknown action");
  }
}
export default function ChordEditor({ lyrics, chords, updateChords }) {
  // vars
  const {
    chordString,
    addChord,
    getChordbyPosition,
    chords: _chords,
  } = useChordify(lyrics, chords);
  let chordIndex = -1; // -1 per whitespaces and -3 per croupchar = -4
  const [groupPosition, setGroupPosition] = useState({});
  const [currentChord, setCurrentChord] = useState(" ");
  const [splitLyrics, setSplitLyrics] = useState([[[""]]]);
  //
  const [state, dispatch] = useReducer(reducer, {
    undoStack: [],
    oldStack: [],
    newStack: [],
    redoStack: [],
  });
  const getChordPosByGroupPos = (groupIndex) => {
    // get the chord part of group range ( the position of the next 3 chars from groupPosition)
    console.log("oli");

    for (let i = 0; i < 3; i++) {
      const chord = groupPosition[groupIndex + i];
      console.log(chord);
      if (chord) return chord;
    }
    return -1;
  };
  const handleSelection = (position) => {
    addChord(currentChord, position);
    dispatch({
      type: "TAP",
      payload: {
        oldChord: getChordbyPosition(position),
        newChord: currentChord,
        position,
      },
    });
  };
  const handleRedo = () => {
    if (state.redoStack.length === 0) return;

    const redoChord = state.redoStack[state.redoStack.length - 1];
    addChord(redoChord.chord, redoChord.position);
    dispatch({ type: "REDO" });
  };
  const handleUndo = () => {
    if (state.undoStack.length === 0) return;

    const undoChord = state.undoStack[state.undoStack.length - 1];
    addChord(undoChord.chord, undoChord.position);
    dispatch({ type: "UNDO" });
  };

  // update chord string to storage when chord changes ( useful when save button is pressed)
  useEffect(() => {
    updateChords(_chords);
  }, [chordString, _chords]);
  useEffect(() => {
    const groupCharsBy3 = () => {
      // split text into rows
      let currentPosition = -2; // -1 per word
      const _groupPosition = {};
      const splitText = lyrics.split("\n").map((row, rowIndex) => {
        // divide the rows into words and group them by 3
        const rows = row.split(" ").map((word, wordIndex) => {
          currentPosition++;
          const chars = word.split("");
          // Group them by 3
          const charButtons = chars.reduce((acc, char, index) => {
            currentPosition++;
            const groupIndex = Math.floor(index / 3);
            if (!acc[groupIndex]) {
              _groupPosition["" + rowIndex + wordIndex + groupIndex] =
                currentPosition;
              acc[groupIndex] = char;
            } else {
              acc[groupIndex] += char; // this is like join() but done step-by-step
            }
            setGroupPosition(_groupPosition); // update groupPosition state
            return acc; // return grouped chars by 3
          }, []);
          return charButtons;
        });
        return rows;
      });
      return splitText;
    };
    setSplitLyrics(groupCharsBy3());
  }, [lyrics]);

  return (
    <>
      <ChordBoard
        updateChord={(updatedChord) => setCurrentChord(updatedChord)}
        currentChord={currentChord}
      />
      <ScrollView style={styles.mainContainer}>
        {splitLyrics.map((row, rowIndex) => {
          return (
            <View key={row + rowIndex} style={styles.lyricRowContainer}>
              {row.map((word, wordIndex) => {
                chordIndex++;
                return (
                  <View
                    style={styles.lyricWordContainer}
                    key={wordIndex + word}
                  >
                    {word.map((charGroup, groupIndex) => {
                      const currentChordIndex = chordIndex; // freeze this value for this iteration
                      chordIndex += charGroup.length;
                      return (
                        <Pressable
                          style={styles.groupCharContainer}
                          key={rowIndex + wordIndex + groupIndex}
                          onPress={() =>
                            handleSelection(
                              groupPosition[
                                "" + rowIndex + wordIndex + groupIndex
                              ],
                            )
                          }
                        >
                          <MyText style={styles.lyricText}>{charGroup}</MyText>
                          {charGroup.split("").map((c, charIndex) => {
                            if (_chords[currentChordIndex + charIndex])
                              return (
                                <MyText
                                  key={
                                    "" +
                                    rowIndex +
                                    wordIndex +
                                    groupIndex +
                                    charIndex
                                  }
                                  style={styles.chordText}
                                >
                                  {_chords[currentChordIndex + charIndex]}
                                </MyText>
                              );
                          })}
                        </Pressable>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.undoRedoContainer}>
        <Pressable disabled={state.undoStack.length <= 0} onPress={handleUndo}>
          <FontAwesome5
            name="undo-alt"
            size={16}
            color={colors.light.textPrimary}
          />
        </Pressable>
        <Pressable disabled={state.redoStack.length <= 0} onPress={handleRedo}>
          <FontAwesome5
            name="redo-alt"
            size={16}
            color={colors.light.textPrimary}
          />
        </Pressable>
      </View>
    </>
  );
}

// styles
const monoSpaceFamily = Platform.OS === "android" ? "monospace" : "courier"; // choose monospace font by OS
const styles = StyleSheet.create({
  lyricsAndChordContainer: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chordButton: {},
  lyricCharContainer: {
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  groupCharContainer: {
    flexDirection: "row",
  },
  lyricWordContainer: {
    flexDirection: "row",
    marginHorizontal: 8,
    marginVertical: 0,
  },
  lyricRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lyricText: {
    ...defaultStyles.smallText,
    lineHeight: 48,
    marginHorizontal: 0,
    fontFamily: monoSpaceFamily,
  },
  chordText: {
    position: "absolute",
    top: -20,
    left: 0,
    lineHeight: 48,
    fontWeight: "bold",
    fontFamily: monoSpaceFamily,
    ...defaultStyles.smallText,
  },
  mainContainer: {
    margin: 16,
  },
  textInput: {
    lineHeight: 48,
    fontFamily: monoSpaceFamily,
    ...defaultStyles.smallText,
    color: colors.light.textPrimary,
    textAlignVertical: "top",
  },
  undoRedoContainer: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },
});
