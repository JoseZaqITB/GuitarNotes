import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import useChordify, { toLyricLines } from "../hooks/useChordify";
import MyText from "./MyText";
import { useState } from "react";

export default function ChordEditor({ lyrics }) {
  // vars
  const chordify = useChordify(toLyricLines(lyrics));
  const [currentChord, setCurrentChord] = useState("Cm7");

  let chordIndex = 0;
  let lyricsAndChords = [];
  chordify.lyricsLines.forEach((lyricLine) => {
    lyricsAndChords.push(chordify.chordLines[chordIndex]);
    lyricsAndChords.push(lyricLine);
    chordIndex++;
  });
  //
  const handleSelection = (position, index) => {
    chordify.addChordAtLine(index, currentChord, position);
  };
  return (
    <ScrollView style={styles.mainContainer}>
      {lyricsAndChords.map((lrcsAndChrds, index) =>
        index % 2 !== 0 ? (
          <TextInput
            key={index}
            style={styles.textInput}
            onSelectionChange={(e) =>
              handleSelection(
                e.nativeEvent.selection.start,
                -1 + (index + 1) / 2,
              )
            }
            autoFocus={false}
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
  );
}

// styles
const monoSpaceFamily = Platform.OS === "android" ? "monospace" : "courier"; // choose monospace font by OS
const styles = StyleSheet.create({
  chordText: {
    fontFamily: monoSpaceFamily,
    borderWidth: 1,
    borderColor: "red",
    ...defaultStyles.middleText,
  },
  mainContainer: {
    margin: 16,
  },
  textInput: {
    fontFamily: monoSpaceFamily,
    ...defaultStyles.middleText,
    color: colors.light.textPrimary,
    textAlignVertical: "top",
    borderWidth: 1,
  },
});
