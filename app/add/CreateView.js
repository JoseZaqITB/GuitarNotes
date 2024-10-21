import PagerView from "react-native-pager-view";
import SongEditView from "../../components/SongEditView";
import SongInfo from "../../components/SongInfo";

export default function CreateView() {
  //use effects

  return (
    <PagerView initialPage={0} style={{ flex: 1 }}>
      <SongInfo />
      <SongEditView lyrics={null} />
    </PagerView>
  );
}
