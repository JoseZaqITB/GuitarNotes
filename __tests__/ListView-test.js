import { render, screen, waitFor } from "@testing-library/react-native";
import ListView from "../components/ListView";
import { beforeEach, expect, it, jest } from "@jest/globals";
import * as songList from "../hooks/songList";
const mockGetListSongAsync = jest.fn(() => {
  console.log("oli");
  return new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      resolve([
        { id: 1, title: "Song A", artist: "Artist A" },
        { id: 2, title: "Song B", artist: "Artist B" },
      ]);
    }, 100);
  });
});

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (fn) => fn(),
}));
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useFocusEffect: (fn) => fn(), // just call it immediately
  };
});

describe("<ListView />", () => {
  beforeEach(() => {
    /* jest.mock("../hooks/songList", () => ({
      GetListSongAsync: mockGetListSongAsync,
    })); */
    jest
      .spyOn(songList, "GetListSongAsync")
      .mockImplementation(mockGetListSongAsync);
  });
  it("it renders", async () => {
    render(<ListView />);
  });

  it("It stablish the given gap", async () => {
    const gap = 32;
    render(<ListView gap={gap} testID="list-view" />);
    await waitFor(() => {
      expect(screen.queryByRole("button")).toBeTruthy();
    });
  });
});
