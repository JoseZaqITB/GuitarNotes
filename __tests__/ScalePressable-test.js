import { fireEvent, render, screen } from "@testing-library/react-native";
import ScalePressable from "../components/ScalePressable";
import { Text } from "react-native";
import { it, describe, expect, jest } from "@jest/globals";

describe("<ScalePressable />", () => {
  it("render children", () => {
    render(
      <ScalePressable>
        <Text>Test</Text>
      </ScalePressable>,
    );
    expect(screen.getByText("Test")).toBeTruthy();
  });

  it("uses the given styles", () => {
    const style = { flex: 1, flexDirection: "row" };
    render(
      <ScalePressable style={style}>
        <Text>Styled Text</Text>
      </ScalePressable>,
    );
    const component = screen.getByRole("button");
    // OJO!: possible error here, stlye goes to
    // the first children ( a view containgin all) and not in the pressable
    expect(component.children[0].props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flex: 1, flexDirection: "row" }),
      ]),
    );
  });

  it("onPress works fine", () => {
    const onPress = jest.fn();
    render(
      <ScalePressable onPress={onPress}>
        <Text>Press In Test</Text>
      </ScalePressable>,
    );
    const pressable = screen.getByRole("button");
    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalled();
  });
});
