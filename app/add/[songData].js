import { useEffect, useState } from "react";
import { GetListSongAsync } from "../../hooks/songList";
import { useLocalSearchParams } from "expo-router";
import SongEditor from "../../components/SongEditor";
import { ActivityIndicator } from "react-native";
export default function UpdateSongView() {
  // vars
  const { songData } = useLocalSearchParams();
  const songId = songData;
  const [song, setSong] = useState(undefined);
  //use effects
  useEffect(() => {
    GetListSongAsync().then((songList) => {
      const song = songList.find((song) => song.id.toString() === songId);
      setSong(song);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (song === undefined)
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  // return view
  return <SongEditor song={song} />;
}
