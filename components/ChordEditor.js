import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import useChordify from "../hooks/useChordify";
import MyText from "./MyText";
import { useEffect, useReducer, useState } from "react";
import ChordBoard from "./ChordBoard";

function reducer(state, action) {
  switch (action.type) {
    case "UNDO":
      return {
        undoStack: state.undoStack.slice(0, -1),
        current: [
          state.undoStack[state.undoStack.length - 1],
          ...state.current.slice(0, -1),
        ],
        redoStack: [
          ...state.redoStack,
          state.current[state.current.length - 1],
        ],
      };
    case "TAP":
      const oldChord = {
        index: action.payload.index,
        chord: action.payload.oldChord,
        position: action.payload.position,
      };
      const newChord = {
        index: action.payload.index,
        chord: action.payload.newChord,
        position: action.payload.position,
      };
      return {
        undoStack: [...state.undoStack, oldChord],
        current: [...state.current, newChord],
        redoStack: [],
      };
    case "REDO":
      return {
        undoStack: [...state.undoStack, state.current[0]],
        current: [
          ...state.current.slice(1),
          state.redoStack[state.redoStack.length - 1],
        ],
        redoStack: state.redoStack.slice(0, -1),
      };
    default:
      throw new Error("Unknown action");
  }
}
export default function ChordEditor({ lyrics, chords, setChords }) {
  // vars
  const {
    lyricsAndChords,
    chords: updatedChords,
    addChordAtLine,
    getChordAtLine,
  } = useChordify(lyrics, chords);
  const [currentChord, setCurrentChord] = useState("A");
  //
  const [state, dispatch] = useReducer(reducer, {
    undoStack: [],
    current: [],
    redoStack: [],
  });
  const handleSelection = (position, chordIndex, lyricsAndChordsIndex) => {
    addChordAtLine(chordIndex, currentChord, position);
    dispatch({
      type: "TAP",
      payload: {
        index: chordIndex,
        oldChord: getChordAtLine(chordIndex, currentChord, position),
        newChord: currentChord,
        position,
      },
    });
  };
  const handleRedo = () => {
    console.log(state);

    const redoChord = state.redoStack[state.redoStack.length - 1];
    addChordAtLine(redoChord.index, redoChord.chord, redoChord.position);
    dispatch({ type: "REDO" });
  };
  const handleUndo = () => {
    console.log(state);

    const undoChord = state.undoStack[state.undoStack.length - 1];
    addChordAtLine(undoChord.index, undoChord.chord, undoChord.position);
    dispatch({ type: "UNDO" });
  };
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChords(updatedChords), [updatedChords]);
  return (
    <>
      <ChordBoard
        updateChord={(updatedChord) => setCurrentChord(updatedChord)}
        currentChord={currentChord}
      />
      <ScrollView style={styles.mainContainer}>
        {lyricsAndChords.split("\n").map((lrcsAndChrds, index) =>
          index % 2 !== 0 ? (
            <TextInput
              key={index}
              style={styles.textInput}
              onSelectionChange={(e) =>
                handleSelection(
                  e.nativeEvent.selection.start,
                  -1 +
                    (index + 1) /
                      2 /* index is not the real index for lyrics maps, it's just the peers index  */,
                  index,
                )
              }
              selection={0} // define a value avoiding placed the caret at the end of the text when first tapped. and be able to add a chord since the first tap
              selectTextOnFocus={false}
              showSoftInputOnFocus={false}
              contextMenuHidden
              caretHidden
              value={lrcsAndChrds}
            />
          ) : (
            <MyText key={Math.random() * 100} style={styles.chordText}>
              {lrcsAndChrds}
            </MyText>
          ),
        )}
      </ScrollView>
      <Pressable
        style={{ position: "absolute", bottom: 0, left: 64 }}
        disabled={state.undoStack.length === 0}
        onPress={handleUndo}
      >
        <MyText>Undo</MyText>
      </Pressable>
      <Pressable
        style={{ position: "absolute", bottom: 0, left: 120 }}
        disabled={state.redoStack.length === 0}
        onPress={handleRedo}
      >
        <MyText>Redo</MyText>
      </Pressable>
    </>
  );
}

// styles
const monoSpaceFamily = Platform.OS === "android" ? "monospace" : "courier"; // choose monospace font by OS
const styles = StyleSheet.create({
  chordText: {
    fontFamily: monoSpaceFamily,
    ...defaultStyles.smallText,
  },
  mainContainer: {
    margin: 16,
  },
  textInput: {
    fontFamily: monoSpaceFamily,
    ...defaultStyles.smallText,
    color: colors.light.textPrimary,
    textAlignVertical: "top",
  },
});
