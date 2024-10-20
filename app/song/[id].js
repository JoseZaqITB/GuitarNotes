import { Animated, Image, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import confIcon from "../../assets/conf.png";
import arrowIcon from "../../assets/arrow.png";
import MyText from "../../components/MyText";
import * as fs from "expo-file-system";

import FloatingButton from "../../components/FloatingButton";
import React, { useEffect, useRef, useState } from "react";
import ConfigModal from "../../components/ConfigModal";
import { colors, defaultStyles } from "../../style/defaultStyles";
import useSongList from "../../hooks/songList";

export default function SongView() {
  // vars
  const ref = React.useRef(0);
  const { id } = useLocalSearchParams();
  const songList = useSongList();
  const titleAndAuthor = id.split("-");
  const [song, setSong] = useState("");
  // use states for scrolling
  const scrollY = useRef(new Animated.Value(0)).current; // Animated value for Y-axis
  const [showConfigMenu, setShowConfigMenu] = React.useState(false);
  const [scrollHeight, setScrollHeight] = useState(480);
  const [autoscroll, setAutoscroll] = useState(false);
  const [scrollAnimation, setScrollAnimation] = useState(undefined);
  // functions for scrolling
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
        toValue: scrollHeight, // Target scroll position
        duration: 10000, // Duration in milliseconds
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
        ref.current.scrollTo({ y: value, animated: false });
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
    setScrollHeight(height); // Store the height in state
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

  return (
    <>
      <ScrollView
        ref={ref}
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
      >
        <View style={styles.headerContainer}>
          <MyText style={styles.headerText}>{song?.title}</MyText>
          <MyText>{song?.artist}</MyText>
        </View>
        <MyText style={styles.lyricText}>{formatLyrics(song?.lyrics)}</MyText>
      </ScrollView>

      <FloatingButton
        style={{ right: 20, bottom: 20 + 64 + 16 }}
        onPress={handleConfigButton}
      >
        <Image source={confIcon} />
      </FloatingButton>
      <FloatingButton
        style={{ right: 20, bottom: 20 }}
        onPress={handleAutoscrollButton}
      >
        <Image source={arrowIcon} />
      </FloatingButton>
      {showConfigMenu && <ConfigModal />}
    </>
  );
}

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
    lineHeight: 24,
    margin: 8,
  },
});

// functions
async function getListSong() {
  const songJsonFile = fs.documentDirectory + "songs.json";
  return await fs
    .readAsStringAsync(songJsonFile)
    .then((value) => JSON.parse(value));
}
async function getsong(title, author) {
  return await getListSong().then((value) =>
    value.find((song) => song.title === title && song.artist === author),
  );
}

function formatLyrics(lyrics) {
  const regexforCommas = /\,/g;
  const regexforDots = /\.\s*/g;
  return lyrics?.replace(regexforCommas, ",\n").replace(regexforDots, ".\n\n");
}
