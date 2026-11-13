import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();

// Pantallas privadas: solo se ven con sesión iniciada (se amplía en la etapa 3)
export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Inicio" component={HomeScreen} />
    </Stack.Navigator>
  );
}
