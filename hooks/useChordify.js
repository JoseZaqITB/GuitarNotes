import { useEffect, useState } from "react";

const emptyChar = "\u2007"; // each line must have this max chars
export default function useChordify(lyrics, _chords) {
  // states
  const [chordString, setChordString] = useState(
    toLines(lyrics)
      .map((line) => emptyChar.repeat(line.length))
      .join("\n"),
  );
  const [chords, setChords] = useState(_chords ? _chords : {});
  // useEffect
  useEffect(() => {
    if (chords === _chords) {
      const organizedChords = { ...chords };
      const updatedChordString = updateChordString(
        organizedChords,
        chordString,
      );
      setChordString(updatedChordString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let newChordString = chordString;
    if (lyrics) {
      newChordString = toLines(lyrics)
        .map((line) => emptyChar.repeat(line.length))
        .join("\n");
    }
    if (_chords) {
      const updatedChordString = updateChordString(_chords, newChordString);
      setChords(_chords);
      setChordString(updatedChordString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lyrics, _chords]);

  const updateChordString = (chords, chordString) => {
    let chordStr = chordString.split("");
    Object.entries(chords).forEach((keyValue) =>
      keyValue[1]
        .split("")
        .forEach(
          (char, index) => (chordStr[Number(keyValue[0]) + index] = char),
        ),
    );
    return chordStr.join("");
  };
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
  // replace a string by position
  function replaceStringByIndex(string, oldSubstr, newSubstr, position) {
    const newSubLine =
      string
        .slice(position, Number(position + oldSubstr.length))
        .replace(/\w/g, newSubstr) +
      string.slice(Number(position + oldSubstr.length));
    return string.slice(0, position) + newSubLine;
  }
  // get chord by index line and position in line
  function getChordbyPosition(position) {
    const groupedChords = { ...chords }; // change object distribution to find quick by position, at end restart the original order
    return groupedChords[position] ? groupedChords[position] : emptyChar;
  }
  // inserts per state
  function addChord(chord, position) {
    const chordInPos = chordString[position];
    let newChordString = "";
    const newChords = { ...chords };
    if (chordInPos) {
      // remove chord in text
      newChordString = replaceStringByIndex(
        chordString,
        chordInPos,
        chord,
        position,
      );
      // add new chord in chord list
      newChords[position] = chord;
    } else if (isPositionValid(chordString, chord, position)) {
      // add new chord in chord list
      newChords[position] = chord;
      // add new chord in the chord text
      newChordString = insertStringByIndex(chordString, chord, position);
    } else {
      // is an invalid position for adding a chord
      return;
    }
    // update changes
    setChords(newChords);
    setChordString(newChordString);
  }
  return {
    lyrics: lyrics,
    chordString,
    chords,
    addChord,
    getChordbyPosition,
  };
}

// read lyrics ( or read a chord instead?)
export function toLines(lyrics) {
  if (lyrics) return lyrics.split("\n");
  return [];
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
        line.at(startPosition + index) === emptyChar,
    );
  return returnValue;
}

function groupByChords(chords) {
  const organizedChords = {};
  Object.entries(chords).forEach((keyValue) => {
    if (organizedChords[keyValue[1]])
      organizedChords[keyValue[1]].push(keyValue[0]);
    else organizedChords[keyValue[1]] = [keyValue[0]];
  });
  return organizedChords;
}

const groupByPosition = (chords) => {
  const organizedChords = {};
  Object.entries(chords).forEach((keyValue) =>
    keyValue[1].forEach((pos) => (organizedChords[pos] = keyValue[0])),
  );
  return organizedChords;
};
