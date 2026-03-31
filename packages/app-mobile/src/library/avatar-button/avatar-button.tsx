import { FunctionComponent } from 'react';

import IconButton from '../icon-button';

type AvatarButtonProps = {
  name?: string;
  email?: string;
  onPress: () => void;
};

const getInitials = (name?: string, email?: string): string => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  if (email) {
    const localPart = email.split('@')[0];
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
    <IconButton
      icon={initials}
      onPress={onPress}
      size="sm"
      backgroundColor="rgba(255, 255, 255, 0.2)"
      color="#fff"
    />
  );
};

export default AvatarButton;
