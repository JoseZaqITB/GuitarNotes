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
import { storeChords } from "../stores/songStorage";

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
export default function ChordEditor({ lyrics, chords }) {
  // vars
  const {
    chordString,
    addChord,
    getChordbyPosition,
    chords: _chords,
  } = useChordify(lyrics, chords);
  const [currentChord, setCurrentChord] = useState(" ");
  //
  const [state, dispatch] = useReducer(reducer, {
    undoStack: [],
    oldStack: [],
    newStack: [],
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
    console.log(_chords);
    console.log(chordString);
    if (_chords) storeChords(_chords);
  }, [chordString, _chords]);
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
        disabled={state.undoStack.length <= 0}
        onPress={handleUndo}
      >
        <MyText>Undo</MyText>
      </Pressable>
      <Pressable
        style={{ position: "absolute", bottom: 0, left: 120 }}
        disabled={state.redoStack.length <= 0}
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
