import { StyleSheet } from 'react-native';

import {
  accent,
  ink,
  radii,
  shadows,
  spacing,
  surfaces,
} from '../../../../../library/theme';

export const JOYSTICK_RADIUS = 50;
const KNOB_SIZE = 30;

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: surfaces.overlay,
    borderRadius: radii.card,
    ...shadows.card,
  },
  joystickCircle: {
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    borderRadius: JOYSTICK_RADIUS,
    backgroundColor: surfaces.sunken,
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: accent.primary,
  },
  directionHint: {
    position: 'absolute',
    color: ink.tertiary,
  },
  hintUp: {
    top: spacing.xs,
  },
  hintDown: {
    bottom: spacing.xs,
  },
  hintLeft: {
    left: spacing.sm,
  },
  hintRight: {
    right: spacing.sm,
  },
  hints: {
    flex: 1,
    gap: spacing.xs,
  },
});
