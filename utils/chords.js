// 12 chromatic notes
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// chords and its short version
const CHORD_TYPES_SHORT = {
  major: "", // e.g. C (default is major, no suffix)
  minor: "m", // Cm
  diminished: "dim", // Cdim
  augmented: "aug", // Caug
  major7: "maj7", // Cmaj7
  minor7: "m7", // Cm7
  dominant7: "7", // C7
  diminished7: "dim7", // Cdim7
  halfDiminished7: "m7♭5", // Cm7♭5 (or ø7)
  sus2: "sus2", // Csus2
  sus4: "sus4", // Csus4
};

// generate all chords and all_chorts short
const ALL_CHORDS_SHORT = {};
const ALL_CHORDS_SHORT_BY_TYPE = {};

for (let i = 0; i < NOTES.length; i++) {
  const root = NOTES[i];
  for (const [chordType, shortTypeVersion] of Object.entries(
    CHORD_TYPES_SHORT,
  )) {
    const name = `${root}${shortTypeVersion}`;
    ALL_CHORDS_SHORT[`${root}${chordType}`] = name;
    if (ALL_CHORDS_SHORT_BY_TYPE[chordType])
      ALL_CHORDS_SHORT_BY_TYPE[chordType].push(name);
    else ALL_CHORDS_SHORT_BY_TYPE[chordType] = [name];
  }
}
export { CHORD_TYPES_SHORT, NOTES, ALL_CHORDS_SHORT, ALL_CHORDS_SHORT_BY_TYPE };
