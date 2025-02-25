import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import {UserContextProvider} from '@/app/context/useAuthContext'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // === throws error when opened in mobile
  // const navigation = useNavigation()

  return (
    <ThemeProvider value={DefaultTheme}>
      <UserContextProvider >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name='login' options={{headerShown : false}} />
        <Stack.Screen name='index' options={{headerShown : false}} />
        <Stack.Screen name='signup' options={{headerShown : false}} />
        {/* <Stack.Screen name='home' options={{headerShown : false}} /> */}
        <Stack.Screen name='play' options={{headerShown : false}} />
        <Stack.Screen name='result' options={{headerShown : false}} />
        <Stack.Screen name='otpVerification' options={{headerShown : false}} />
        <Stack.Screen name='quizCategory' options={{headerShown : true,title : "Sports Quiz",
           headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 16 }}
              // onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
        }} />
        <Stack.Screen name='register' options={{headerShown : true,title : "Register",
           headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 16 }}
              // onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
        }} />
        <Stack.Screen name='wallet' options={{headerShown : true,title : "wallet",
           headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 16 }}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
        }} />
        <Stack.Screen name='leaderboard' options={{headerShown : true,title : "Leaderboard",
           headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 16 }}
              // onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
        }} />
      </Stack>
      <StatusBar style="auto" />


      </UserContextProvider>
    </ThemeProvider>
  );
}
