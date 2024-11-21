import { useState } from "react";

export default function useChordify({ lyrics: _lyrics, chords: _chords }) {
  // states
  const [lyrics, setLyrics] = useState(_lyrics);
  const [chords, setChords] = useState(
    _chords ? _chords : _lyrics.replace(/[^\s\n]/g, " "),
  ); // replace any letter, comma or dot by \s
  console.log(chords);
  // add a new chord
  /* let updatedChords = _chords; */
  // read lyrics ( or read a chord instead?)
  function getLyricLines() {
    return lyrics.split("\n");
  }

  function getChordLines() {
    return chords.split("\n");
  }
  /* 
  const lyricLines = getLyricLines();
  const chordLines = getChordLines();

  let chordIndex = 0;
  var lyricsAndChords = "";
  lyricLines.forEach((lyricLine) => {
    lyricsAndChords +=
      "\x1b[31m" + chordLines[chordIndex] + "\n\x1b[0m" + lyricLine + "\n";
    chordIndex++;
  });

  console.log("lyricsAndChords: ");
  console.log(lyricsAndChords);
 */
  // delete a chord ( it can delete wrong, because of index could start in the middle of a chord)
  /*  updatedChords = removeStringByIndex(updatedChords, 46);
  console.log("delete scene: ");
  console.log(updatedChords); */

  // allows to insert a substring in a string at a given position
  function insertByIndex(string, index) {
    const newStr = lyrics.slice(0, index) + string + lyrics.slice(index);
    setLyrics(newStr);
  }

  // remove a string by position
  function removeStringByIndex(str, index) {
    const line = str.slice(index).replace(/\w+/, "");
    return str.slice(0, index) + line;
  }

  return {
    getChordLines,
    getLyricLines,
    chords,
    lyrics,
  };
}
