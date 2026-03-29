import { FunctionComponent, PropsWithChildren, useState } from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { styles } from './collapsible-section.styles';

export interface CollapsibleSectionProps {
  title: string;
  count?: number;
  icon?: string;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  style?: StyleProp<ViewStyle>;
}

const CollapsibleSection: FunctionComponent<
  PropsWithChildren<CollapsibleSectionProps>
> = ({
  title,
  count,
  icon,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onToggle,
  style,
  children,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const label = [icon, title, count !== undefined ? `(${count})` : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <View style={[styles.base, style]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.expandIcon}>
          {isExpanded ? '\u25BC' : '\u25B6'}
        </Text>
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

export default CollapsibleSection;
