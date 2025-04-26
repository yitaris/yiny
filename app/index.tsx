import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

// Sign in
import SignIn from './(tabs)/signIn';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem('session');
        if (storedSession) {
          setSession(storedSession);
        }
      } catch (error) {
        console.error('Session kontrolü sırasında hata:', error);
      } finally {
        setLoading(false);
        SplashScreen.hideAsync();
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!session) {
    return <SignIn />;
  }

  return <Redirect href="/(tabs)/(pages)/home" />;
}