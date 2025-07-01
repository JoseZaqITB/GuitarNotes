import { useState, useEffect } from "react";
import * as fs from "expo-file-system";
import jsonFile from "../data/songs.json"; // just use it for createJsonFIle function

export const songListFileName = "songs.json";
const songListURI = `${fs.documentDirectory}${songListFileName}`;

const useSongList = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readFile = async () => {
      let listSong = [];
      try {
        listSong = await GetListSongAsync();
      } catch (err) {
        console.log(err);
        setError(err);
      } finally {
        setLoading(false);
      }
      setData(listSong);
    };

    readFile();
  }, []);
  // functions
  async function findSong(songId) {
    if (data) {
      return data.find((song) => song.id.toString() === songId);
    }
    return null;
  }

  return { data, error, loading, findSong };
};

//methods
/*Create  random id for a song */
function CreateRandomId(title) {
  return Math.random().toString(36).substr(2, 9).concat(title);
}

export async function GetListSongAsync() {
  return fs
    .readAsStringAsync(songListURI)
    .then((fileContent) => JSON.parse(fileContent));
}
export async function WriteSongListAsync(newSongList) {
  // verify if each object has id, title, artist, lyrics and tag keys
  const keys = ["id", "title", "artist", "lyrics", "chords", "tag"];
  const hasAllKeys = newSongList.every((song) =>
    keys.every((key) => key in song),
  );
  //write to file
  if (hasAllKeys)
    return fs.writeAsStringAsync(songListURI, JSON.stringify(newSongList));
  else throw new Error("missing keys in object");
}

export async function CreateDefaultSongList() {
  const dirInfo = await fs.getInfoAsync(songListURI);
  if (!dirInfo.exists)
    return WriteSongListAsync(jsonFile).catch((e) => console.log(e));
  console.log("already created");
  return null;
}
// create an empty songList
function createEmptySongList() {
  const songList = [];
  return WriteSongListAsync(songList);
}
// add & remove list
/**
 * @description add song in device
 * @param {string} title
 * @param {string} artist
 * @param {string} lyrics
 * @param {Object} chords
 * @param {string[]} tag
 * @returns
 */
export async function AddSongAsync(title, artist, lyrics, chords, tag) {
  try {
    const newSong = {
      id: CreateRandomId(title),
      title,
      artist,
      lyrics,
      chords,
      tag,
    };
    const songList = await GetListSongAsync();
    if (!songList) createEmptySongList();
    await WriteSongListAsync([...songList, newSong]);
    return newSong;
  } catch (error) {
    throw error;
  }
}

export async function DeleteSongByidAsync(id) {
  try {
    const songList = await GetListSongAsync();
    const updatedSongList = songList.filter((song) => song.id !== id);
    await WriteSongListAsync(updatedSongList);
    return updatedSongList;
  } catch (error) {
    throw error; // Re-throw to handle it at a higher level if needed
  }
}
/**
 * update a song by id
 * @param {number} id
 * @param {string} title
 * @param {string} artist
 * @param {string} lyrics
 * @param {string} chords
 * @param {string} tag
 * @returns
 */
export async function UpdateSongAsync(id, title, artist, lyrics, chords, tag) {
  const newSong = { id, title, artist, lyrics, chords, tag };
  const songList = await GetListSongAsync();
  const _newJsonFile = songList.map((song, _index) =>
    song.id === id ? newSong : song,
  );
  await WriteSongListAsync(_newJsonFile);
  return newSong;
}

export default useSongList;
