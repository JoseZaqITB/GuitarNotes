import { Platform, ScrollView, StyleSheet, TextInput } from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import useChordify from "../hooks/useChordify";
import MyText from "./MyText";
import { useEffect, useState } from "react";
import SongEditView from "./SongEditView";

export default function ChordEditor({ lyrics, chords, setChords }) {
  // vars
  const {
    lyricsAndChords,
    chords: updatedChords,
    addChordAtLine,
  } = useChordify(lyrics, chords);
  const [currentChord, setCurrentChord] = useState("A");
  //
  const handleSelection = (position, index) => {
    addChordAtLine(index, currentChord, position);
  };
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChords(updatedChords), [updatedChords]);
  return (
    <>
      <SongEditView
        updateChord={(updatedChord) => setCurrentChord(updatedChord)}
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
