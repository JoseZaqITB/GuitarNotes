import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ChordImage from "../assets/chord.png";
import PenImage from "../assets/pen.png";
import React from "react";
import MyText from "../components/MyText";
import { colors, defaultStyles } from "../style/defaultStyles";

export default function SongEditView({ lyrics }) {
  const [isLyricsEditState, setIsLyricsEditState] = React.useState(false);
  const [showAllChords, setShowAllChords] = React.useState(false);
  const [currentChord, setcurrentChord] = React.useState(false);
  const switchChangeEditState = () => {
    setIsLyricsEditState(!isLyricsEditState);
    setShowAllChords(false);
  };
  const switchShowAllChords = () => {
    setShowAllChords(!showAllChords);
  };
  const displayedChords = ["C", "D", "E", "F", "G", "A", "B"];
  const allChords = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
    "Cm",
    "Dm",
    "Em",
    "Fm",
    "Gm",
    "Am",
    "Bm",
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        {isLyricsEditState && (
          <View style={styles.chordsContainer}>
            {displayedChords.map((value) => (
              <Pressable style={styles.chordButton}>
                <MyText style={styles.text}>{value}</MyText>
              </Pressable>
            ))}
          </View>
        )}
        <Pressable onPress={() => switchChangeEditState()}>
          <Image
            source={isLyricsEditState ? PenImage : ChordImage}
            style={{ width: 36, height: 36 }}
          />
        </Pressable>
      </View>
      {isLyricsEditState && (
        <View>
          <View style={styles.allChordsContainer}>
            {showAllChords &&
              allChords.map((value) => (
                <Pressable style={styles.chordButton}>
                  <MyText style={styles.text}>{value}</MyText>
                </Pressable>
              ))}
          </View>
          <Pressable onPress={() => switchShowAllChords()}>
            <MyText
              style={{
                ...styles.text,
                textAlign: "center",
              }}
            >
              {showAllChords ? "^" : "v"}
            </MyText>
          </Pressable>
        </View>
      )}
      <ScrollView style={styles.lyricsContainer}>
        <TextInput defaultValue={lyrics} style={styles.textInput} multiline />
      </ScrollView>
    </View>
  );
}

const buttonSize = 36;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  chordsContainer: {
    flex: 1,
    flexDirection: "row",
  },

  chordButton: {
    width: buttonSize,
    height: buttonSize,
    marginHorizontal: 4,
  },
  text: {
    ...defaultStyles.text,
    margin: 4,
  },
  allChordsContainer: {
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",

    maxHeight: buttonSize * 6,
  },
  lyricsContainer: {
    flex: 0.9,
    padding: 8,
  },
  textInput: {
    ...defaultStyles.middleText,
    color: colors.light.textPrimary,
  },
});
