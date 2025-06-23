import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import confIcon from "../../assets/conf.png";
import arrowIcon from "../../assets/arrow.png";
import MyText from "../../components/MyText";
import React, { useEffect, useRef, useState } from "react";
import ConfigModal from "../../components/ConfigModal";
import { colors, defaultStyles } from "../../style/defaultStyles";
import useSongList from "../../hooks/songList";

export default function SongView() {
  // vars
  const scrollViewRef = React.useRef(0);
  const { id } = useLocalSearchParams();
  const songList = useSongList();
  const titleAndAuthor = id.split("-");
  const [song, setSong] = useState("");
  const [currentBtn, setCurrentBtn] = useState("none");
  let chordIndex = -2; // -1 per whitespaces and -1 per char = -2
  // use states for scrolling
  const scrollY = useRef(new Animated.Value(0)).current; // Animated value for Y-axis
  const [showConfigMenu, setShowConfigMenu] = React.useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(480);
  const [lyricSize, setLyricSize] = useState(320);
  const [autoscroll, setAutoscroll] = useState(false);
  const [scrollAnimation, setScrollAnimation] = useState(undefined);
  const [scrollDuration, setScrollDuration] = useState(50000);
  // define the distance to scroll
  const scrollDistance =
    lyricSize > scrollViewHeight ? lyricSize - scrollViewHeight : lyricSize;
  // functions for scrolling
  const handleButton = (btnName) => {
    switch (btnName) {
      case "settings":
        handleConfigButton();
        break;
      case "autoscroll":
        handleAutoscrollButton();
      default:
        break;
    }
    if (currentBtn !== btnName) setCurrentBtn(btnName);
    else setCurrentBtn("none");
  };
  const handleAutoscrollButton = () => {
    setAutoscroll(!autoscroll);
  };
  const handleConfigButton = () => {
    setShowConfigMenu(!showConfigMenu);
  };
  const handleAnimatedScroll = () => {
    if (scrollAnimation === undefined) {
      // crear objeto de animation
      const animatedScroll = Animated.timing(scrollY, {
        toValue: scrollDistance, // Target scroll position
        duration: scrollDuration, // Duration in milliseconds
        useNativeDriver: true, // Optimize performance
      });
      // empezar animation de scroll
      animatedScroll.start(({ finished }) => {
        finishAutoScroll();
        if (finished) scrollY.setValue(0);
      });
      // agregar listener a animation

      setScrollAnimation(animatedScroll);
      scrollY.addListener(({ value }) => {
        scrollViewRef.current.scrollTo({ y: value, animated: false });
      });
    } else {
      finishAutoScroll();
    }
  };

  const finishAutoScroll = () => {
    scrollAnimation?.stop();
    scrollY.removeAllListeners();
    setScrollAnimation(undefined);
  };

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout; // Destructure height from the layout
    setScrollViewHeight(height); // Store the height in state
  };
  // use effects
  useEffect(() => {
    // manage autoscroll
    if (autoscroll) handleAnimatedScroll();
    else finishAutoScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoscroll]);
  // initialize song
  useEffect(() => {
    if (songList.data) {
      songList
        .findSong(titleAndAuthor[0], titleAndAuthor[1])
        .then((song) => setSong(song));
    }
  }, [songList, titleAndAuthor]);
  useEffect(() => {
    // update distance to scroll
    // when unomunts clean all listeners
    return () => {
      finishAutoScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollViewHeight, lyricSize]);

  if (typeof song === "undefined") return <></>;
  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onScroll={(event) => {
          if (scrollAnimation === undefined) {
            scrollY.setValue(event.nativeEvent.contentOffset.y);
          }
        }}
        onScrollBeginDrag={() => {
          if (autoscroll) finishAutoScroll();
        }}
        onScrollEndDrag={() => {
          if (autoscroll) handleAnimatedScroll();
        }}
        onLayout={handleLayout}
        onContentSizeChange={(width, height) => setLyricSize(height)}
      >
        <View style={styles.headerContainer}>
          <MyText style={styles.headerText}>{song?.title}</MyText>
          <MyText>{song?.artist}</MyText>
        </View>
        <View style={styles.lyricsAndChordContainer}>
          {song?.lyrics?.split("\n").map((row, rowIndex) => {
            return (
              <View key={row + rowIndex} style={styles.lyricRowContainer}>
                {row.split(" ").map((word, wordIndex) => {
                  chordIndex++;
                  return (
                    <View
                      style={styles.lyricWordContainer}
                      key={wordIndex + word}
                    >
                      {word.split("").map((char) => {
                        chordIndex++;
                        if (song?.chords[chordIndex])
                          return (
                            <View
                              style={styles.lyricCharContainer}
                              key={chordIndex}
                            >
                              <MyText style={styles.lyricText}>{char}</MyText>
                              <View style={styles.chordWrapper}>
                                <MyText style={styles.chordText}>
                                  {song?.chords[chordIndex]}
                                </MyText>
                              </View>
                            </View>
                          );
                        else
                          return (
                            <View
                              style={styles.lyricCharContainer}
                              key={chordIndex}
                            >
                              <MyText style={styles.lyricText}>{char}</MyText>
                            </View>
                          );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.floatingBtnContainer}>
        <Pressable
          style={{
            backgroundColor:
              currentBtn === "settings"
                ? colors.light.textSecondary
                : undefined,
            borderRadius: 14,
            elevation: 8,
            margin: 8,
            padding: 4,
          }}
          onPress={() => handleButton("settings")}
        >
          <Image style={styles.floatingBtn} source={confIcon} />
        </Pressable>
        <Pressable
          style={{
            backgroundColor:
              currentBtn === "autoscroll"
                ? colors.light.textSecondary
                : undefined,
            borderRadius: 14,
            elevation: 8,
            margin: 8,
            padding: 4,
          }}
          onPress={() => handleButton("autoscroll")}
        >
          <Image style={styles.floatingBtn} source={arrowIcon} />
        </Pressable>
      </View>

      <ConfigModal
        visible={showConfigMenu}
        title={titleAndAuthor[0]}
        author={titleAndAuthor[1]}
        id={song.id}
        scrollDuration={scrollDuration}
        setScrollDuration={setScrollDuration}
        onClose={() => handleButton("settings")}
      />
    </>
  );
}

const monoSpaceFamily = Platform.OS === "android" ? "monospace" : "courier"; // choose monospace font by OS
const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.light.textPrimary,
    margin: 4,
    padding: 4,
  },
  headerText: {
    ...defaultStyles.title,
  },
  lyricText: {
    ...defaultStyles.middleText,
    lineHeight: 48,
    marginHorizontal: 0,
    fontWeight: "bold",
    fontFamily: monoSpaceFamily,
  },

  chordWrapper: {
    position: "absolute",
    top: -20,
    left: 0,

    padding: 0,
    margin: 0,
    minWidth: 80,
  },
  chordText: {
    ...defaultStyles.middleText,
    fontWeight: "bold",
    fontFamily: monoSpaceFamily,
    lineHeight: 48,
  },
  lyricsAndChordContainer: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lyricCharContainer: {
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  lyricWordContainer: {
    flexDirection: "row",
    marginHorizontal: 8,
    marginVertical: 0,
  },
  lyricRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  floatingBtn: {
    width: 24,
    height: 24,
  },
  floatingBtnContainer: {
    position: "absolute",
    flexDirection: "column",
    bottom: 0,
    right: 0,
    padding: 16,
  },
});
