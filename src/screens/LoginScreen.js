import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FiestaApp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
});
