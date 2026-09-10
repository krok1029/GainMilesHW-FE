import { fireEvent, render, screen } from "@testing-library/react-native";
import { Button } from "react-native";
import { DialogProvider, useDialog } from "./DialogProvider";
import { I18nProvider } from "../i18n/I18nProvider";
jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en" }],
}));
function TwoButtons() {
  const show = useDialog();
  return (
    <>
      <Button
        title="first"
        onPress={() => {
          show("coming-soon");
          show("coming-soon");
        }}
      />
      <Button title="second" onPress={() => show("coming-soon")} />
    </>
  );
}
describe("DialogProvider", () => {
  it("should render one dialog for rapid calls across buttons and reopen after close", () => {
    // Arrange
    render(
      <I18nProvider>
        <DialogProvider>
          <TwoButtons />
        </DialogProvider>
      </I18nProvider>,
    );
    // Act
    fireEvent.press(screen.getByText("first"));
    fireEvent.press(screen.getByText("second"));
    // Assert
    expect(screen.getAllByText("Coming soon")).toHaveLength(1);
    fireEvent.press(screen.getByText("Close"));
    expect(screen.queryByText("Coming soon")).toBeNull();
    fireEvent.press(screen.getByText("second"));
    expect(screen.getAllByText("Coming soon")).toHaveLength(1);
  });
});
