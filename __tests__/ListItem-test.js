import { fireEvent, render, screen } from "@testing-library/react-native";
import ListItem from "../components/ListItem";
import { expect, jest } from "@jest/globals";
import * as expoRouter from "expo-router";
describe("<ListItem />", () => {
  it("renders correctly (title and author is shown)", () => {
    render(<ListItem title="Test" author="JS BOT" songId={1} />);
    expect(screen.getByText("Test")).toBeTruthy();
    expect(screen.getByText("JS BOT")).toBeTruthy();
  });

  it("must trigger a function when pressed", () => {
    const pushMock = jest.fn();
    jest.spyOn(expoRouter, "useRouter").mockReturnValue({ push: pushMock }); // mock useRouter
    render(<ListItem title="Test" author="JS BOT" songId={1} />);
    const button = screen.getByRole("button");
    fireEvent.press(button);
    expect(pushMock).toHaveBeenCalledWith("/song/1");
  });
});
