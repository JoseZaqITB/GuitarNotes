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
  async function findSong(title, author) {
    if (data) {
      return data.find(
        (song) => song.title === title && song.artist === author,
      );
    }
    return null;
  }

  return { data, error, loading, findSong };
};

export async function GetListSongAsync() {
  return fs
    .readAsStringAsync(songListURI)
    .then((fileContent) => JSON.parse(fileContent));
}
export async function WriteSongListAsync(newSongList) {
  //write to file
  return fs.writeAsStringAsync(songListURI, JSON.stringify(newSongList));
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
// add list
export async function AddSongAsync(title, artist, lyrics, tag) {
  const newSong = { title, artist, lyrics, tag };
  const songList = await GetListSongAsync();
  if (!songList) {
    createEmptySongList().catch((e) => alert(e));
  }
  WriteSongListAsync([...songList, newSong]);
  return newSong;
}

export async function UpdateSongAsync(index, title, artist, lyrics, tag) {
  const newSong = { title, artist, lyrics, tag };
  const songList = await GetListSongAsync();
  const _newJsonFile = songList.map((song, _index) =>
    _index === index ? newSong : song,
  );
  await WriteSongListAsync(_newJsonFile);
  return newSong;
}

export default useSongList;
