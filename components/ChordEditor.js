import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
        chord: action.payload.oldChord,
        position: action.payload.position,
      };
      const newChord = {
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
    chords: updatedChords,
    chordString,
    addChord,
    getChordbyPosition,
  } = useChordify(lyrics, chords);
  const [currentChord, setCurrentChord] = useState("A");
  //
  const [state, dispatch] = useReducer(reducer, {
    undoStack: [],
    current: [],
    redoStack: [],
  });
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
    const redoChord = state.redoStack[state.redoStack.length - 1];
    addChord(redoChord.chord, redoChord.position);
    dispatch({ type: "REDO" });
  };
  const handleUndo = () => {
    const undoChord = state.undoStack[state.undoStack.length - 1];
    addChord(undoChord.chord, undoChord.position);
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
        <MyText style={styles.chordText}>{chordString}</MyText>
        <TextInput
          onSelectionChange={(e) =>
            handleSelection(e.nativeEvent.selection.start)
          }
          autoFocus
          selectTextOnFocus={false}
          showSoftInputOnFocus={false}
          contextMenuHidden
          caretHidden
          multiline
          scrollEnabled={false}
        >
          <Text style={styles.textInput}>{lyrics}</Text>
        </TextInput>
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
    position: "absolute",
    top: -20,
    left: 0,
    lineHeight: 48,
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
});
