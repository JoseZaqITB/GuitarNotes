import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import MyText from "../components/MyText";
import { colors, defaultStyles } from "../style/defaultStyles";

export default function SongEditView({ updateChord }) {
  const [showAllChords, setShowAllChords] = useState(false);
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
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.chordsContainer}>
          <TouchableOpacity
            style={styles.chordButton}
            onPress={() => updateChord("\u2007")}
          >
            <MyText style={styles.text}>🚫</MyText>
          </TouchableOpacity>
          {displayedChords.map((value, index) => (
            <TouchableOpacity
              key={index + value}
              style={styles.chordButton}
              onPress={() => updateChord(value)}
            >
              <MyText style={styles.text}>{value}</MyText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.allChordsContainer}>
          {showAllChords &&
            allChords.map((value, index) => (
              <TouchableOpacity
                key={index + value}
                style={styles.chordButton}
                onPress={() => updateChord(value)}
              >
                <MyText style={styles.text}>{value}</MyText>
              </TouchableOpacity>
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
    </View>
  );
}

const buttonSize = 36;

const styles = StyleSheet.create({
  headerContainer: {
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
    paddingHorizontal: 8,
  },
  textInput: {
    ...defaultStyles.middleText,
    color: colors.light.textPrimary,
    textAlignVertical: "top",
    minHeight: "100%", // right?. when no text, text keeps in size of container
  },
});
