import { useEffect, useState } from "react";

const chordLineWidth = 48; // each line must have this max chars
export default function useChordify(lyrics, chords) {
  // states
  const [lyricsLines, setLyricsLines] = useState(toLines(lyrics));
  const [chordLines, setChordLines] = useState(
    toLines(lyrics).map((line) => " ".repeat(chordLineWidth)),
  );
  const [stateChords, setChords] = useState(chords ? chords : {});
  // useEffect
  useEffect(() => {
    const reorganizeChords = () => {
      const organizedChords = {};
      Object.entries(stateChords).forEach((keyValue) =>
        keyValue[1].forEach((pos) => (organizedChords[pos] = keyValue[0])),
      );
      return organizedChords;
    };
    const updateChordLines = (chords) => {
      let chordStr = chordLines.join("\n").split("");
      Object.entries(chords).forEach((keyValue) =>
        keyValue[1]
          .split("")
          .forEach(
            (char, index) => (chordStr[Number(keyValue[0]) + index] = char),
          ),
      );
      return chordStr.join("").split("\n");
    };
    if (stateChords === chords) {
      const organizedChords = reorganizeChords();
      const updatedChordLines = updateChordLines(organizedChords);
      setChords(organizedChords);
      setChordLines(updatedChordLines);
    }
  }, []);
  // allows to insert a substring in a string at a given position
  /**
   * @param {number} index
   * @param {string} string
   * @param {string} substring
   * @returns {string}
   */
  function insertStringByIndex(string, substring, index) {
    // REPLACE (not add) the string in the position using the needed space
    const newChordStartIndex = index - Math.floor(substring.length / 2);
    const restStringStartIndex = index + Math.round(substring.length / 2); // +1(rounding) because the index is included when slicing the string

    const newStr =
      string.slice(0, newChordStartIndex) +
      substring +
      string.slice(restStringStartIndex);
    return newStr;
  }

  // remove a string by position
  function removeStringByIndex(line, chord, position) {
    const newSubLine =
      line
        .slice(position, Number(position + chord.length))
        .replace(/\w/g, " ") + line.slice(Number(position + chord.length));
    return line.slice(0, position) + newSubLine;
  }

  // inserts per state
  function addChordAtLine(lineIndex, chord, position) {
    const newChordLines = chordLines.map((chordLine, chordIndex) => {
      // see if the position to add the chord has occupied its neighbors and himself
      const actualPosition =
        position -
        Math.floor(chord.length / 2) +
        (chordLineWidth + 1) * lineIndex; // +1 is the \n in each line -> position + lineWidth * NthLine
      if (chordIndex === lineIndex) {
        if (stateChords[actualPosition]) {
          const oldChord = stateChords[actualPosition];
          const removedChordLine = removeStringByIndex(
            chordLine,
            oldChord,
            position,
          );
          stateChords[actualPosition] = chord;
          setChords(stateChords);
          return insertStringByIndex(removedChordLine, chord, position);
        }
        if (isPositionValid(chordLine, chord, position)) {
          stateChords[actualPosition] = chord;
          setChords(stateChords);
          return insertStringByIndex(chordLine, chord, position);
        } else return chordLine;
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
export function toLines(lyrics) {
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
  return returnValue;
}
