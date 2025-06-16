import { Image, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import importImg from "../assets/import.png";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { defaultStyles } from "../style/defaultStyles";
import { router } from "expo-router";
import { UpdateSongAsync } from "../hooks/songList";
// check if a line is a chordLine
const chordRegex =
  /\b((DO|RE|MI|FA|SOL|LA|SI|C|D|E|F|G|A|B)(#|b)?(m|maj|min|dim|aug|sus|add)?[0-9]*(\/(DO|RE|MI|FA|SOL|LA|SI|C|D|E|F|G|A|B)(#|b)?)?)\b/;
export default function ImportView() {
  const handlePicking = () => {
    DocumentPicker.getDocumentAsync()
      .then((document) => FileSystem.readAsStringAsync(document.assets[0].uri))
      .then((newTextSong) => {
        const chordifySong = parseToChordifySong(newTextSong);
        return AddTemporarySongToList(chordifySong.lyrics, chordifySong.chords);
      })
      .then((tempSong) => GoToUpdateSongView(tempSong.title, tempSong.artist));
  };

  return (
    <View>
      <Pressable onPress={handlePicking}>
        <Image source={importImg} />
      </Pressable>
      <MyText style={title}>Import</MyText>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    textAlign: "center",
    textTransform: "capitalize",
  },
});

const title = StyleSheet.compose(styles.text, defaultStyles.title);
// functions
/**
 *
 * @param {string} textSong
 * @returns
 */
function parseToChordifySong(textSong) {
  let lyrics = "";
  let chords = {};
  let curChordPos = 0;
  // split text into lines
  const lines = textSong.split("\n");
  // functions
  const isChordLine = (lineWords) => {
    return (
      lineWords.length > 0 && lineWords.every((word) => chordRegex.test(word))
    );
  };
  const makeLinesEqualLength = (line1, line2) => {
    const maxLength = Math.max(line1.length, line2.length);
    const paddedLine1 = line1.padEnd(maxLength, " ");
    const paddedLine2 = line2.padEnd(maxLength, " ");
    return [paddedLine1, paddedLine2];
  };
  const parseToChordPosition = (chordLine) => {
    const chordPosPair = {};
    let regex = /\S+/g; // matches non-space sequences
    let match;

    while ((match = regex.exec(chordLine)) !== null) {
      chordPosPair[curChordPos + match.index] = match[0];
    }
    curChordPos += chordLine.length + 1; // +1 for the space character
    return chordPosPair;
  };
  const setDoubleChord = (chordLine) => {
    // put the pad lyric position at the same current chord position
    lyrics = lyrics.padEnd(lyrics.length + chordLine.length, " ");
    lyrics += "\n";
  };
  const setDoubleLyrics = (lyricLineOne, lyricLineTwo) => {
    // set current chord position at the same padEnd of lyrics
    curChordPos += lyricLineOne.length + lyricLineTwo.length + 2; // +2 for the newline characters
    lyrics += lyricLineOne + "\n" + lyricLineTwo + "\n";
  };
  // main loop
  for (let i = 0; i < lines.length; i++) {
    if (i + 1 >= lines.length) {
      const words = lines[i].split(/\s+/).filter(Boolean);
      const isOneChordLine = isChordLine(words);
      if (isOneChordLine) {
        chords = { ...chords, ...parseToChordPosition(lines[i]) };
      } else {
        lyrics += lines[i] + "\n";
      }
      return { lyrics, chords };
    }
    const lineOne = lines[i];
    const lineTwo = lines[i + 1];
    // split line into words
    const words = lineOne.split(/\s+/).filter(Boolean);
    //// add checking for lines + 1 /////
    const words2 = lineTwo.split(/\s+/).filter(Boolean);
    // check if is a chord line ( if there is not a chord word)
    const isOneChordLine = isChordLine(words);
    const isTwoChordLine = isChordLine(words2);
    // branches (lyric&chord pair, doubleChord, doubleLyric, inversePair)
    if (isOneChordLine) {
      if (!isTwoChordLine) {
        const [eqLineOne, eqLineTwo] = makeLinesEqualLength(lineOne, lineTwo);
        lyrics += eqLineTwo + "\n";
        chords = { ...chords, ...parseToChordPosition(eqLineOne) };
      } else {
        setDoubleChord(lineOne);
        if (i + 2 < lines.length) {
          const isThreeChordLine = isChordLine(lines[i + 2].split(/\s/));
          if (isThreeChordLine) {
            setDoubleChord(lineTwo);
          }
        }
        chords = {
          ...chords,
          ...parseToChordPosition(lineOne),
          ...parseToChordPosition(lineTwo),
        };
      }
      i++;
    } else {
      // if second line is a lyric, sum up the two lines, if not just add the first line
      if (!isTwoChordLine) {
        setDoubleLyrics(lineOne, lineTwo);
        i++;
      } else if (i + 2 < lines.length) {
        lyrics += lineOne + "\n";
        const lineThree = lines[i + 2].split(/\s/);
        if (lineThree.length <= 1 || isChordLine(lineThree)) {
          chords = { ...chords, ...parseToChordPosition(lineTwo) };
          i++;
        }
        curChordPos += lineOne.length + 1;
      }
    }
  }

  return { lyrics, chords };
}

async function AddTemporarySongToList(lyrics, chords) {
  const tempName = "temp";
  const tempId = 0;
  // update temp song
  try {
    return UpdateSongAsync(
      tempId,
      tempName,
      tempName,
      lyrics,
      chords,
      tempName,
    );
  } catch {
    throw new Error("Error trying to update temp song");
  }
}
const GoToUpdateSongView = (title, artist) => {
  router.push(`/add/${title}-${artist}`);
};
