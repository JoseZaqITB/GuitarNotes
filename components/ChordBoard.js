import {
  Pressable,
  StyleSheet,
  View,
  Animated,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import MyText from "./MyText";
import { colors, defaultStyles } from "../style/defaultStyles";
import { ALL_CHORDS_SHORT_BY_TYPE, NOTES } from "../utils/chords";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ChordBoard({ updateChord, currentChord }) {
  // vars
  const boardHeight = useRef(new Animated.Value(0)).current;
  const [showAllChords, setShowAllChords] = useState(false);
  const [displayedChords, setDisplayedChords] = useState(
    NOTES.filter((note) => !note.includes("#")),
  ); // TEMP)
  const screenHeight = useWindowDimensions().height;
  // animations
  const switchShowAllChords = () => {
    // animate
    Animated.timing(boardHeight, {
      toValue: showAllChords ? 0 : screenHeight * 0.75,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    //openChordBoard();
    // update state
    setShowAllChords(!showAllChords);
  };
  // handle press buttons
  const [currentChordID, setCurrentChordID] = useState(null);
  const handleChangeChord = (chord) => {
    if (currentChordID != null) {
      setDisplayedChords((displayedChords) => {
        displayedChords[currentChordID] = chord;
        return displayedChords;
      });
    }
    updateChord(chord);
  };

  const handlePressChord = (chordID, chord) => {
    setCurrentChordID(chordID);
    updateChord(chord);
  };
  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.chordsContainer}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor:
                  pressed || currentChord === "\u2007"
                    ? "#900d09"
                    : "transparent",
              },
              styles.iconBtn,
              styles.chordButton,
            ]}
            onPress={() => updateChord("\u2007")}
          >
            <FontAwesome5
              name={"eraser"}
              size={16}
              color={colors.light.textPrimary}
            />
          </Pressable>
          {displayedChords.map((value, index) => (
            <Pressable
              key={index + value}
              onPress={() => handlePressChord(index, value)}
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
        <Animated.View
          style={{
            ...styles.allChordsContainer,
            height: boardHeight,
            maxHeight: screenHeight * 0.75,
            borderBottomWidth: showAllChords ? 2 : 0,
          }}
        >
          <ScrollView>
            {Object.entries(ALL_CHORDS_SHORT_BY_TYPE).map(([type, chords]) => (
              <View style={styles.chordTypeWrapper} key={type + chords}>
                <MyText style={styles.chordTypeLabel}>{type}</MyText>
                <View style={styles.chordWrapper}>
                  {chords.map((value, index) => (
                    <Pressable
                      key={index + value}
                      style={({ pressed }) => [
                        {
                          backgroundColor:
                            pressed || currentChord === value
                              ? colors.light.primary
                              : "transparent",
                        },
                        styles.chordButton,
                      ]}
                      onPress={() => handleChangeChord(value)}
                    >
                      <MyText style={styles.text}>{value}</MyText>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
        <Pressable
          onPress={() => switchShowAllChords()}
          style={styles.showChordsBtn}
        >
          <FontAwesome5
            name={showAllChords ? "caret-up" : "caret-down"}
            size={24}
            color={colors.light.textPrimary}
          />
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
    minWidth: buttonSize,
    minHeight: buttonSize,
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
    borderTopWidth: 2,
    borderColor: colors.light.textSecondary,
    backgroundColor: colors.light.textSecondary,
  },
  chordTypeLabel: {
    ...defaultStyles.middleText,
    textTransform: "capitalize",
  },
  showChordsBtn: {
    alignItems: "center",
  },
  chordTypeWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  chordWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
