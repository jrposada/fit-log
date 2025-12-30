import { useNavigation } from '@react-navigation/native';
import { FunctionComponent } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type BackButtonProps = {
  variant?: 'primary' | 'secondary';
};

const BackButton: FunctionComponent<BackButtonProps> = ({
  variant = 'primary',
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <Pressable onPress={handleBackPress} style={styles.button}>
      <Text style={[styles.buttonText, styles[`buttonText--${variant}`]]}>
        ←
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '600',
  },
  'buttonText--primary': {
    color: '#fff',
  },
  'buttonText--secondary': {
    color: '#000',
  },
});

export default BackButton;
