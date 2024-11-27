import { useState } from "react";

export default function useChordify(_lyricsLines, _chordLines) {
  // states
  const [lyricsLines, setLyricsLines] = useState(_lyricsLines);
  const [chordLines, setChordLines] = useState(
    _chordLines
      ? _chordLines
      : _lyricsLines.map((line) => line.replace(/[^\s\n]/g, " ")),
  ); // replace any letter, comma or dot by \s
  // add a new chord
  /* let updatedChords = _chords; */

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
  function insertByIndex(string, substring, index) {
    // REPLACE (not add) the string in the position using the needed space
    const newStr =
      string.slice(0, index - substring.length) +
      substring +
      string.slice(index);
    return newStr;
  }

  // remove a string by position
  function removeStringByIndex(str, index) {
    const line = str.slice(index).replace(/\w+/, "");
    return str.slice(0, index) + line;
  }

  // inserts per state
  function addChordAtLine(line, chord, position) {
    const newChordLines = chordLines.map((chordLine, chordIndex) => {
      // see if the position to add the chord has occupied its neighbors and himself
      const isPosValid = isPositionValid(chordLine.at(position));
      if (chordIndex === line && isPosValid) {
        return insertByIndex(chordLine, chord, position);
      } else return chordLine;
    });
    setChordLines(newChordLines);
  }

  return {
    chordLines,
    lyricsLines,
    addChordAtLine,
  };
}

// read lyrics ( or read a chord instead?)
export function toLyricLines(lyrics) {
  return lyrics.split("\n");
}

export function toChordLines(chords) {
  return chords.split("\n");
}

function isPositionValid(stringPosition) {
  return stringPosition === "" || stringPosition === " ";
}
