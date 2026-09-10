import { useEffect, useState } from "react";
import { AppState, Platform, Pressable, Text, View } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "./app/navigation/types";
import { DemoEntryScreen } from "./app/screens/DemoEntryScreen";
import { ConsultationScreen } from "./features/consultation/screens/ConsultationScreen";
import { BookingScreen } from "./features/consultation/screens/BookingScreen";
import { DialogProvider } from "./shared/dialog/DialogProvider";
import { I18nProvider, useI18n } from "./shared/i18n/I18nProvider";
import { FeatureFlagProvider } from "./shared/featureFlags/FeatureFlagProvider";
const Stack = createNativeStackNavigator<RootStackParamList>();
function Navigation() {
  const { t } = useI18n();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: "#141414",
          headerStyle: { backgroundColor: "#FCFBF7" },
          contentStyle: { backgroundColor: "#FFF" },
          headerBackTitle: t.close,
        }}
      >
        <Stack.Screen
          name="Demo"
          component={DemoEntryScreen}
          options={{ title: "", headerShown: false }}
        />
        <Stack.Screen
          name="Consultation"
          component={ConsultationScreen}
          options={({ navigation }) => ({
            title: "",
            headerStyle: { backgroundColor: "#EEE4B6" },
            headerLeft: () => (
              <Pressable
                accessibilityLabel="Back"
                accessibilityRole="button"
                onPress={() => {}}
                style={{ padding: 12 }}
              >
                <Text style={{ fontSize: 24 }}>‹</Text>
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.popToTop()}
                style={{ padding: 12 }}
              >
                <Text style={{ fontSize: 12 }}>{t.settings}</Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: t.bookingTitle }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 60_000,
            gcTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  useEffect(() => {
    if (Platform.OS === "web") return;
    const subscription = AppState.addEventListener("change", (status) =>
      focusManager.setFocused(status === "active"),
    );
    return () => subscription.remove();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#E9E6DE" }}>
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 520,
            alignSelf: "center",
            paddingTop: Platform.OS === "web" ? 0 : undefined,
          }}
        >
          <QueryClientProvider client={client}>
            <I18nProvider>
              <FeatureFlagProvider>
                <DialogProvider>
                  <Navigation />
                  <StatusBar style="dark" />
                </DialogProvider>
              </FeatureFlagProvider>
            </I18nProvider>
          </QueryClientProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
