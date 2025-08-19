import { render, screen } from "@testing-library/react-native";
import MyText from "../components/MyText";
describe("<MyText />", () => {
  it("renders children tests", () => {
    render(<MyText>Test</MyText>);
    expect(screen.getByText("Test")).toBeTruthy();
  });

  it("renders style props", () => {
    render(<MyText style={{ color: "red" }}>styled text</MyText>);
    const myText = screen.getByText("styled text");
    expect(myText.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "red" })]),
    );
  });
});
