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

 */
  // delete a chord ( it can delete wrong, because of index could start in the middle of a chord)
  /*  updatedChords = removeStringByIndex(updatedChords, 46);

  // allows to insert a substring in a string at a given position
  /**
   * @param {number} index
   * @param {string} string
   * @param {string} substring
   * @returns {string}
   */
  function insertByIndex(string, substring, index) {
    // REPLACE (not add) the string in the position using the needed space
    const newChordStartIndex = index - Math.floor(substring.length / 2);
    const restStringStartIndex = index + Math.round(substring.length / 2); // +1 because the index is included when slicing the string

    const newStr =
      string.slice(0, newChordStartIndex) +
      substring +
      string.slice(restStringStartIndex);
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
      if (chordIndex === line && isPositionValid(chordLine, chord, position)) {
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

/**
 * @description Analize if there is a chord already placed in the position given, otherwise return true.
 * @param {string} line
 * @param {number} position
 * @param {string} chord
 * @returns {boolean}
 **/
function isPositionValid(line, chord, position) {
  let returnValue = true;
  // see if the position to add the chord has occupied its neighbors
  const startPosition = position - Math.floor(chord.length / 2);
  returnValue = chord
    .split("")
    .every(
      (c, index) =>
        line.at(startPosition + index) === "" ||
        line.at(startPosition + index) === " ",
    );
  console.log(returnValue);
  return returnValue;
}
