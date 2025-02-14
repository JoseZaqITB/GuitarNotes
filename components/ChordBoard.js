import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import MyText from "./MyText";
import { colors, defaultStyles } from "../style/defaultStyles";

export default function ChordBoard({ updateChord, currentChord }) {
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
            <Pressable
              key={index + value}
              onPress={() => updateChord(value)}
              android_ripple
              style={({ pressed }) => [
                {
                  backgroundColor:
                    pressed || currentChord === value
                      ? colors.light.textSecondary
                      : "transparent",
                },
                styles.chordButton,
              ]}
            >
              <MyText style={styles.text}>{value}</MyText>
            </Pressable>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.allChordsContainer}>
          {showAllChords &&
            allChords.map((value, index) => (
              <Pressable
                key={index + value}
                style={({ pressed }) => [
                  {
                    backgroundColor:
                      pressed || currentChord === value
                        ? colors.light.textSecondary
                        : "transparent",
                  },
                  styles.chordButton,
                ]}
                onPress={() => updateChord(value)}
              >
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
    marginHorizontal: 2,
    marginVertical: 2,
    borderRadius: 4,
  },
  text: {
    ...defaultStyles.text,
    margin: "auto",
    fontWeight: "bold",
  },
  allChordsContainer: {
    display: "flex",
    flexDirection: "row",
    maxWidth: (buttonSize + 16) * 6,
    margin: "auto",
    justifyContent: "center",
    flexWrap: "wrap",
    borderTopWidth: 1,
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
