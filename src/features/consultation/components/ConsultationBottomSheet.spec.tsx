import { render, screen } from "@testing-library/react-native";
import { ConsultationBottomSheet } from "./ConsultationBottomSheet";

jest.mock("react-native-reanimated", () => {
  const mock = jest.requireActual("react-native-reanimated/mock");

  // The bundled makeMutable mock returns a raw value without SharedValue methods.
  return {
    ...mock,
    makeMutable: mock.useSharedValue,
    useReducedMotion: () => false,
  };
});

jest.mock("./SpecialistList", () => {
  const { Text } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    PlainSpecialistList: () => <Text>Plain specialists</Text>,
    InfiniteSpecialistList: () => <Text>Infinite specialists</Text>,
  };
});

describe("ConsultationBottomSheet", () => {
  it.each([
    ["plain", "Plain specialists"],
    ["infinite", "Infinite specialists"],
  ] as const)(
    "should render %s mode with the real sheet in development",
    (mode, label) => {
      // Arrange
      const target = (
        <ConsultationBottomSheet
          mode={mode}
          containerHeight={600}
          initialTop={230}
          expandedTop={100}
        />
      );

      // Act
      render(target);

      // Assert
      expect(
        screen.getByText(label, { includeHiddenElements: true }),
      ).toBeOnTheScreen();
    },
  );
});
