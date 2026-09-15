import { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { I18nProvider } from "../../shared/i18n/I18nProvider";
import { DialogProvider } from "../../shared/dialog/DialogProvider";
import { createHardcodedSpecialistRepository } from "../../features/consultation/api/hardcodedSpecialistRepository";
import { DemoEntryScreen } from "./DemoEntryScreen";

jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en" }],
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

function renderEntry() {
  const mockNavigate = jest.fn();

  const navigation = {
    navigate: mockNavigate,
  } as unknown as ComponentProps<typeof DemoEntryScreen>["navigation"];

  const target = render(
    <I18nProvider>
      <DialogProvider>
        <DemoEntryScreen
          navigation={navigation}
          route={{ key: "demo", name: "Demo" }}
        />
      </DialogProvider>
    </I18nProvider>,
  );

  fireEvent.press(screen.getByText("Infinite scroll"));

  return { target, mockNavigate };
}

describe("DemoEntryScreen specialist count", () => {
  it.each([0, 1, 12, 13, 50, 10_000])(
    "should enter infinite mode with exactly %i specialists",
    (count) => {
      // Arrange
      const { mockNavigate } = renderEntry();

      // Act
      fireEvent.changeText(
        screen.getByLabelText("Number of specialists"),
        String(count),
      );

      fireEvent.press(screen.getByTestId("enter-consultation"));

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(1);

      expect(mockNavigate).toHaveBeenCalledWith("Consultation", {
        mode: "infinite",
        count,
        scenario: "success",
        sessionId: expect.any(String),
      });
    },
  );

  it.each([
    "",
    "   ",
    "-1",
    "1.5",
    "abc",
    "12abc",
    "1e3",
    "10,000",
    "10001",
    "Infinity",
  ])("should show an inline error and prevent entry for %j", (value) => {
    // Arrange
    const { mockNavigate } = renderEntry();

    // Act
    fireEvent.changeText(screen.getByLabelText("Number of specialists"), value);
    fireEvent.press(screen.getByTestId("enter-consultation"));

    // Assert
    expect(mockNavigate).not.toHaveBeenCalled();

    expect(
      screen.getByText("Please enter a whole number from 0 to 10,000."),
    ).toHaveStyle({ color: "#B42318" });
  });

  it("should validate on blur and clear the error when corrected", () => {
    // Arrange
    const { mockNavigate } = renderEntry();
    const input = screen.getByLabelText("Number of specialists");
    fireEvent.changeText(input, "-5");

    expect(
      screen.queryByText("Please enter a whole number from 0 to 10,000."),
    ).toBeNull();

    // Act
    fireEvent(input, "blur");

    // Assert
    expect(
      screen.getByText("Please enter a whole number from 0 to 10,000."),
    ).toBeOnTheScreen();

    // Act
    fireEvent.changeText(input, " 50 ");
    fireEvent.press(screen.getByTestId("enter-consultation"));

    // Assert
    expect(
      screen.queryByText("Please enter a whole number from 0 to 10,000."),
    ).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith(
      "Consultation",
      expect.objectContaining({ count: 50 }),
    );
  });

  it.each(["12", "invalid"])(
    "should reset next-page failure when the count becomes %j",
    (value) => {
      // Arrange
      const { mockNavigate } = renderEntry();
      const input = screen.getByLabelText("Number of specialists");
      fireEvent.changeText(input, "13");
      fireEvent.press(screen.getByText("Next page fails"));

      // Act
      fireEvent.changeText(input, value);

      // Assert
      expect(screen.queryByText("Next page fails")).toBeNull();
      expect(screen.getByRole("radio", { name: "Success" })).toBeChecked();

      // Act
      fireEvent.changeText(input, "13");
      fireEvent.press(screen.getByText("Next page fails"));
      fireEvent.press(screen.getByTestId("enter-consultation"));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(
        "Consultation",
        expect.objectContaining({ count: 13, scenario: "next-error" }),
      );
    },
  );

  it("should translate an existing validation error when the locale changes", () => {
    // Arrange
    renderEntry();
    fireEvent.changeText(screen.getByLabelText("Number of specialists"), "");
    fireEvent.press(screen.getByTestId("enter-consultation"));

    // Act
    fireEvent.press(screen.getByText("繁體中文"));

    // Assert
    expect(screen.getByText("請輸入 0～10,000 的整數。")).toHaveStyle({
      color: "#B42318",
    });

    expect(screen.getByLabelText("專家總筆數")).toHaveDisplayValue("");

    expect(
      screen.queryByText("Please enter a whole number from 0 to 10,000."),
    ).toBeNull();
  });

  it("should keep plain presets independent of invalid infinite input", () => {
    // Arrange
    const { mockNavigate } = renderEntry();
    fireEvent.changeText(screen.getByLabelText("Number of specialists"), "bad");
    fireEvent.press(screen.getByTestId("enter-consultation"));

    // Act
    fireEvent.press(screen.getByText("All at once"));
    fireEvent.press(screen.getByText("120 specialists"));
    fireEvent.press(screen.getByTestId("enter-consultation"));

    // Assert
    expect(
      screen.queryByText("Please enter a whole number from 0 to 10,000."),
    ).toBeNull();

    expect(mockNavigate).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith(
      "Consultation",
      expect.objectContaining({ mode: "plain", count: 120 }),
    );

    // Act
    fireEvent.press(screen.getByText("Infinite scroll"));

    // Assert
    expect(screen.getByLabelText("Number of specialists")).toHaveDisplayValue(
      "bad",
    );
  });

  it("should still show one Coming soon dialog when input is invalid and the feature is disabled", () => {
    // Arrange
    const { mockNavigate } = renderEntry();
    fireEvent.changeText(screen.getByLabelText("Number of specialists"), "bad");
    fireEvent(screen.getByRole("switch"), "valueChange", false);

    // Act
    fireEvent.press(screen.getByTestId("double-press"));

    // Assert
    expect(screen.getAllByText("Coming soon")).toHaveLength(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should paginate the entered total with a partial final page", async () => {
    // Arrange
    const { mockNavigate } = renderEntry();
    fireEvent.changeText(screen.getByLabelText("Number of specialists"), "50");
    fireEvent.press(screen.getByTestId("enter-consultation"));

    const target = createHardcodedSpecialistRepository({
      ...mockNavigate.mock.calls[0][1],
      delayMs: 0,
    });

    const pageSizes: number[] = [];
    let cursor: string | null = null;

    // Act
    do {
      const page = await target.getPage({ cursor, limit: 12 });
      pageSizes.push(page.items.length);
      cursor = page.nextCursor;
    } while (cursor !== null);

    // Assert
    expect(pageSizes).toEqual([12, 12, 12, 12, 2]);
  });
});
