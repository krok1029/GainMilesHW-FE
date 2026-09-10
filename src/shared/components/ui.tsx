import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const colors = {
  ink: "#141414",
  muted: "#626262",
  gold: "#EACA66",
  cream: "#FFF9E6",
  line: "#EBE8E0",
  white: "#FFFFFF",
};

export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  testID,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        { opacity: disabled ? 0.45 : pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.buttonLabel, secondary && { color: colors.ink }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function Section({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{title}</Text>
      {children}
    </View>
  );
}

export function Choices<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.choices}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          accessibilityRole="radio"
          accessibilityState={{ checked: option.value === value }}
          onPress={() => onChange(option.value)}
          style={[styles.choice, value === option.value && styles.selected]}
        >
          <Text
            style={[
              styles.choiceLabel,
              value === option.value && { fontWeight: "700" },
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonLabel: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  secondary: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: colors.line,
  },

  section: { gap: 12 },

  label: { color: colors.ink, fontSize: 14, fontWeight: "600" },

  choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  choice: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },

  selected: { borderColor: colors.gold, backgroundColor: colors.cream },

  choiceLabel: { color: colors.ink, fontSize: 13 },
});
