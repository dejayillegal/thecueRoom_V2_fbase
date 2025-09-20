import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LinkingOptions } from '@react-navigation/native';
import { theme } from '../theme';
import { LandingScreen } from '../screens/Landing';
import { LoginScreen } from '../screens/Login';
import { FeedScreen } from '../screens/Feed';
import { PostComposerScreen } from '../screens/PostComposer';
import { MemeStudioScreen } from '../screens/MemeStudio';
import { PlaylistsScreen } from '../screens/Playlists';
import { GigRadarScreen } from '../screens/GigRadar';
import { ProfileScreen } from '../screens/Profile';
import { AdminScreen } from '../screens/Admin';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['thecueroom://'],
  config: {
    screens: {
      Landing: 'landing',
      Login: 'login',
      Feed: 'feed',
      PostComposer: 'compose',
      MemeStudio: 'meme-studio',
      Playlists: 'playlists',
      GigRadar: 'gig-radar',
      Profile: 'profile',
      Admin: 'admin',
    },
  },
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    primary: theme.colors.lime,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: 'rgba(209, 255, 61, 0.25)',
    notification: theme.colors.purple,
  },
};

export function NavigationRoot() {
  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.lime,
          headerTitleStyle: {
            fontFamily: theme.fonts.medium,
            color: theme.colors.text,
            letterSpacing: 0.5,
          },
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Magic Link Login' }} />
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Community Feed' }} />
        <Stack.Screen name="PostComposer" component={PostComposerScreen} options={{ title: 'Post Composer' }} />
        <Stack.Screen name="MemeStudio" component={MemeStudioScreen} options={{ title: 'Meme Studio' }} />
        <Stack.Screen name="Playlists" component={PlaylistsScreen} options={{ title: 'Playlists' }} />
        <Stack.Screen name="GigRadar" component={GigRadarScreen} options={{ title: 'Gig Radar' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Console' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
