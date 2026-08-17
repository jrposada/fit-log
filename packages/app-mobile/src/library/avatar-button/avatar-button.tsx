import { FunctionComponent } from 'react';
import { Pressable, Text } from 'react-native';

import {
  sizeStyles,
  styles,
  variantStyles,
} from '../icon-button/icon-button.styles';
import { ink } from '../theme';

type AvatarButtonProps = {
  name?: string;
  email?: string;
  onPress: () => void;
};

const getInitials = (name?: string, email?: string): string => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const first = parts[0]![0] ?? '';
      const second = parts[parts.length - 1]![0] ?? '';
      return `${first}${second}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  if (email) {
    const localPart = email.split('@')[0]!;
    return localPart.slice(0, 2).toUpperCase();
  }

  return '?';
};

const AvatarButton: FunctionComponent<AvatarButtonProps> = ({
  name,
  email,
  onPress,
}) => {
  const initials = getInitials(name, email);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        styles.rounded,
        sizeStyles.sm,
        variantStyles.primary,
      ]}
    >
      <Text style={avatarLabelStyle}>{initials}</Text>
    </Pressable>
  );
};

const avatarLabelStyle = {
  fontSize: 12,
  fontWeight: '700' as const,
  color: ink.inverse,
};

export default AvatarButton;
