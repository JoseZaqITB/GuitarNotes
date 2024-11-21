import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { colors, defaultStyles } from "../style/defaultStyles";
import useChordify from "../hooks/useChordify";
import MyText from "./MyText";

export default function ChordEditor({ lyrics }) {
  // vars
  const chordify = useChordify({ lyrics: lyrics });
  // mix lyrcis and chords
  const lyricLines = chordify.getLyricLines();
  const chordLines = chordify.getChordLines();

  let chordIndex = 0;
  let lyricsAndChords = [];
  lyricLines.forEach((lyricLine) => {
    lyricsAndChords.push(chordLines[chordIndex]);
    lyricsAndChords.push(lyricLine);
    chordIndex++;
  });
  //
  const handleSelection = (position) => {
    console.log(position);
  };
  return (
    <ScrollView style={styles.mainContainer}>
      {lyricsAndChords.map((lrcsAndChrds, index) =>
        index % 2 !== 0 ? (
          <TextInput
            style={styles.textInput}
            onSelectionChange={(e) =>
              handleSelection(e.nativeEvent.selection.start)
            }
            selectTextOnFocus={false}
            showSoftInputOnFocus={false}
            caretHidden={true}
            value={lrcsAndChrds}
          />
        ) : (
          <MyText style={{ borderWidth: 1, borderColor: "red" }}>
            {lrcsAndChrds}
          </MyText>
        ),
      )}
    </ScrollView>
  );
}

// styles
const styles = StyleSheet.create({
  mainContainer: {
    margin: 16,
  },
  textInput: {
    ...defaultStyles.middleText,
    color: colors.light.textPrimary,
    textAlignVertical: "top",
    borderWidth: 1,
  },
});
