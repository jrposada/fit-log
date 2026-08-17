import { FunctionComponent, PropsWithChildren, useState } from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { IconName } from '../icon';
import Icon from '../icon/icon';
import { ink } from '../theme';
import { styles } from './collapsible-section.styles';

export interface CollapsibleSectionProps {
  title: string;
  count?: number;
  icon?: IconName;
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

  const label = [title, count !== undefined ? `(${count})` : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <View style={[styles.base, style]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.titleGroup}>
          {icon && <Icon icon={icon} size="sm" color={ink.secondary} />}
          <Text style={styles.title}>{label}</Text>
        </View>
        <Icon
          icon={isExpanded ? 'expand-less' : 'expand-more'}
          size="sm"
          color={ink.secondary}
        />
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

export default CollapsibleSection;
