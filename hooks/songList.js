import { useState, useEffect } from "react";
import * as fs from "expo-file-system";

export const songListFileName = "songs.json";
const songListURI = `${fs.documentDirectory}${songListFileName}`;

const useSongList = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readFile = async () => {
      try {
        const listSong = await GetListSongAsync();
        setData(listSong);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    readFile();
  }, []);
  // functions
  async function findSong(title, author) {
    if (data)
      return data.find(
        (song) => song.title === title && song.artist === author,
      );
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

export default useSongList;
