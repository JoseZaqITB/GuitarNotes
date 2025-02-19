import { useEffect, useState } from "react";

const emptyChar = "\u2007"; // each line must have this max chars
export default function useChordify(lyrics, _chords) {
  // states
  const [chordLines, setChordLines] = useState(
    toLines(lyrics).map((line) => emptyChar.repeat(line.length)),
  );
  const [chords, setChords] = useState(_chords ? _chords : {});
  const [lyricsAndChords, setLyricsAndChords] = useState("");
  // useEffect
  useEffect(() => {
    if (chords === _chords) {
      const organizedChords = groupByPosition(chords);
      const updatedChordLines = updateChordLines(organizedChords, chordLines);
      setChordLines(updatedChordLines);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // updade lyricsAndChords each time Chord/lyrics-line changes
  useEffect(() => {
    let chordIndex = 0;
    let newLyricsAndChords = [];
    const lyricsLines = toLines(lyrics);
    lyricsLines.forEach((lyricLine) => {
      newLyricsAndChords.push(chordLines[chordIndex]);
      newLyricsAndChords.push(lyricLine);
      chordIndex++;
    });
    setLyricsAndChords(newLyricsAndChords.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chordLines]);

  useEffect(() => {
    let newChordLines = [];
    if (lyrics) {
      newChordLines = toLines(lyrics).map((line) =>
        emptyChar.repeat(line.length),
      );
    }
    if (_chords) {
      const organizedChords = groupByPosition(_chords);
      const updatedChordLines = updateChordLines(
        organizedChords,
        newChordLines,
      );
      setChords(_chords);
      setChordLines(updatedChordLines);
    }
  }, [lyrics, _chords]);

  const updateChordLines = (chords, chordLines) => {
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
  // get chord by index line and position in line
  function getChordAtLine(lineIndex, chord, position) {
    let returnValue = emptyChar;
    let totalCharByIndex = 0;
    const groupedChords = groupByPosition(chords); // change object distribution to find quick by position, at end restart the original order

    chordLines.forEach((chordLine, chordIndex) => {
      // see if the position to add the chord has occupied its neighbors and himself
      const actualPosition =
        position - Math.floor(chord.length / 2) + totalCharByIndex;
      totalCharByIndex += chordLine.length + 1;
      if (chordIndex === lineIndex) {
        if (groupedChords[actualPosition]) {
          returnValue = groupedChords[actualPosition];
          return;
        }
      }
    });
    return returnValue;
  }
  // inserts per state
  function addChordAtLine(lineIndex, chord, position) {
    const newChords = groupByPosition(chords); // change object distribution to find quick by position, at end restart the original order
    let totalCharByIndex = 0;
    const newChordLines = chordLines.map((chordLine, chordIndex) => {
      // see if the position to add the chord has occupied its neighbors and himself
      const actualPosition =
        position - Math.floor(chord.length / 2) + totalCharByIndex;
      totalCharByIndex += chordLine.length + 1;
      if (chordIndex === lineIndex) {
        if (newChords[actualPosition]) {
          const oldChord = newChords[actualPosition];
          const removedChordLine = removeStringByIndex(
            chordLine,
            oldChord,
            position,
          );
          newChords[actualPosition] = chord;
          return insertStringByIndex(removedChordLine, chord, position);
        }
        if (isPositionValid(chordLine, chord, position)) {
          newChords[actualPosition] = chord;
          return insertStringByIndex(chordLine, chord, position);
        } else return chordLine;
      } else return chordLine;
    });
    setChords(groupByChords(newChords));
    setChordLines(newChordLines);
  }
  return {
    lyrics: lyrics,
    chordLines: chordLines.join("\n"),
    lyricsAndChords,
    chords,
    addChordAtLine,
    getChordAtLine,
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
