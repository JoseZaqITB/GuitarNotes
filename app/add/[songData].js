import PagerView from "react-native-pager-view";
import SongEditView from "../../components/SongEditView";
import { useEffect, useState } from "react";
import useSongList from "../../hooks/songList";
import { useLocalSearchParams } from "expo-router";
import SongInfo from "../../components/SongInfo";

export default function UpdateSongView() {
  // vars
  const { songData } = useLocalSearchParams();
  const titleAndAuthor = songData.split("-");
  const [song, setSong] = useState();
  const songList = useSongList();
  //use effects
  useEffect(() => {
    songList.findSong(titleAndAuthor[0], titleAndAuthor[1]).then((song) => {
      setSong(song);
    });
  }, [songList, titleAndAuthor]);
  // return view
  return (
    <PagerView initialPage={0} style={{ flex: 1 }}>
      <SongInfo title={titleAndAuthor[0]} author={titleAndAuthor[1]} tag={""} />
      <SongEditView lyrics={song?.lyrics} />
    </PagerView>
  );
}
