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
      .then((tempSong) => GoToUpdateSongView(tempSong.id));
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
  const chords = {};
  let curChordPos = 0;

  const lines = textSong.split("\n");

  const isChordLine = (words) =>
    words.length > 0 && words.every((word) => chordRegex.test(word));

  const padLinesToEqualLength = (line1, line2) => {
    const maxLength = Math.max(line1.length, line2.length);
    return [line1.padEnd(maxLength), line2.padEnd(maxLength)];
  };

  const parseChordLine = (line) => {
    const regex = /\S+/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      chords[curChordPos + match.index] = match[0];
    }
    curChordPos += line.length + 1;
  };

  const handleDoubleChord = (line) => {
    lyrics = lyrics.padEnd(lyrics.length + line.length, " ");
    lyrics += "\n";
  };

  const handleDoubleLyrics = (line1, line2) => {
    lyrics += line1 + "\n" + line2 + "\n";
    curChordPos += line1.length + line2.length + 2;
  };

  for (let i = 0; i < lines.length; i++) {
    const line1 = lines[i];
    const line2 = lines[i + 1] ?? "";
    const words1 = line1.trim().split(/\s+/);
    const words2 = line2.trim().split(/\s+/);

    const isLine1Chord = isChordLine(words1);
    const isLine2Chord = isChordLine(words2);

    if (isLine1Chord) {
      if (!isLine2Chord) {
        const [chordLine, lyricLine] = padLinesToEqualLength(line1, line2);
        parseChordLine(chordLine);
        lyrics += lyricLine + "\n";
        i++;
      } else {
        handleDoubleChord(line1);
        parseChordLine(line1);
        if (
          i + 2 < lines.length &&
          isChordLine(lines[i + 2].trim().split(/\s+/))
        ) {
          handleDoubleChord(line2);
          parseChordLine(line2);
        } else {
          parseChordLine(line2);
        }
        i++;
      }
    } else {
      if (!isLine2Chord) {
        handleDoubleLyrics(line1, line2);
        i++;
      } else if (i + 2 < lines.length) {
        lyrics += line1 + "\n";
        const lineThree = lines[i + 2].split(/\s/);
        if (lineThree.length <= 1 || isChordLine(lineThree)) {
          parseChordLine(line2);
          i++;
        }
        curChordPos += line1.length + 1;
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
const GoToUpdateSongView = (songId) => {
  router.push(`/add/${songId}`);
};
