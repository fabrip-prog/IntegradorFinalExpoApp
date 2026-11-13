import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FiestaListScreen from '../screens/FiestaListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FiestaFormScreen from '../screens/FiestaFormScreen';
import FiestaDetailScreen from '../screens/FiestaDetailScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: '#262630',
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarIcon: ({ focused }) => {
          let icono = '🏠';
          if (route.name === 'Mis fiestas') icono = '🎉';
          if (route.name === 'Perfil') icono = '👤';
          return (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
              {icono}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Mis fiestas" component={FiestaListScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FiestaForm"
        component={FiestaFormScreen}
        options={{ title: 'Nueva fiesta' }}
      />
      <Stack.Screen
        name="FiestaDetail"
        component={FiestaDetailScreen}
        options={{ title: 'Detalle de fiesta' }}
      />
    </Stack.Navigator>
  );
}
