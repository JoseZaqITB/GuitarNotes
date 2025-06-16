import { useEffect, useMemo, useState } from "react";

const emptyChar = "\u2007"; // each line must have this max chars
export default function useChordify(lyrics, _chords) {
  // vars
  const emptyChordString = useMemo(
    () =>
      toLines(lyrics)
        .map((line) => emptyChar.repeat(line.length))
        .join("\n"),
    [lyrics],
  );
  // states
  const [chordString, setChordString] = useState(emptyChordString);
  const [chords, setChords] = useState(_chords ? _chords : {});
  // useEffect
  useEffect(() => {
    if (chords === _chords) {
      const updatedChordString = updateChordString(chords, chordString);
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

  useEffect(() => {
    // update chordString when chords change
    const updatedChordString = updateChordString(chords, emptyChordString);
    setChordString(updatedChordString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chords]);

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
  // get chord by index line and position in line
  function getChordbyPosition(position) {
    const groupedChords = { ...chords }; // change object distribution to find quick by position, at end restart the original order
    return groupedChords[position] ? groupedChords[position] : emptyChar;
  }
  // inserts per state
  function addChord(chord, position) {
    const newChords = { ...chords };
    /* console.log(chords[position]);
    console.log(isReplaceValid(chord, position)); */
    if (chords[position] && isReplaceValid(chord, position)) {
      // eliminar si el acorde es el de borrar, sino añadir
      if (chord === emptyChar) {
        delete newChords[position];
      } else newChords[position] = chord;
    } else if (isPositionValid(chord, position)) {
      newChords[position] = chord;
    } else {
      return;
    }
    // update changes
    setChords(newChords);
  }
  /**
   * Permite saber si el acorde a colocar va a chocar con otro ya colocado
   * @param {string} chord
   * @param {string} position
   * @returns boolean
   */
  function isReplaceValid(chord, position) {
    const regex = /^\s*$/;
    if (chord.length > 1) {
      for (let i = 1; i < chord.length; i++) {
        const char = chordString.at(position + i);
        if (!regex.test(char)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @description Analize if there is a chord already placed in the position given, otherwise return true.
   * @param {number} position
   * @param {string} chord
   * @returns {boolean}
   **/
  function isPositionValid(chord, position) {
    const regex = /^\s*$/;
    let returnValue = true;
    returnValue = chord
      .split("")
      .every((c, index) => regex.test(chordString.at(position + index)));
    return returnValue;
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
