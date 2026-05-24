import {
  DEFAULT_HOLD_RADIUS,
  Hold,
  HOLD_TYPES,
  HoldType,
  SplinePoint,
} from '@jrposada/fit-log-shared/models/climb/climb';
import { FunctionComponent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import Button from '../../../../../library/button';
import IconButton from '../../../../../library/icon-button';
import InteractiveImage from '../../../../../library/interactive-image';
import Stack from '../../../../../library/stack';
import { closestSegmentToPoint } from './catmull-rom';
import ClimbImageOverlay from './climb-image-overlay';

type EditMode = 'holds' | 'spline' | 'knife';

type Selection = {
  type: 'hold' | 'spline';
  index: number;
} | null;

interface ClimbImageProps {
  source: ImageSourcePropType;
  holds: Hold[];
  spline: SplinePoint[];
  style?: StyleProp<ViewStyle>;
  selection: Selection;
  onSelectionChange: (selection: Selection) => void;
  editable: boolean;
  onHoldAdd: (hold: Hold) => void;
  onHoldRemove: (index: number) => void;
  onHoldTypeChange: (index: number, type: HoldType) => void;
  onSplinePointAdd: (point: SplinePoint) => void;
  onSplinePointInsert: (afterIndex: number, point: SplinePoint) => void;
  onSplinePointRemove: (index: number) => void;
}

const SPLINE_POINT_HIT_RADIUS = 0.05;
const SPLINE_CURVE_HIT_RADIUS = 0.04;


const HoldTypePicker: FunctionComponent<{
  currentType: HoldType;
  onSelect: (type: HoldType) => void;
  t: (key: string) => string;
}> = ({ currentType, onSelect, t }) => (
  <Stack
    direction="horizontal"
    gap="sm"
    align="center"
    justify="center"
    paddingHorizontal="xl"
    paddingVertical="sm"
  >
    {HOLD_TYPES.map((type) => (
      <Button
        key={type}
        variant={currentType === type ? 'primary' : 'outline'}
        title={t(`climbing.hold_type_${type.replace('-', '_')}`)}
        size="sm"
        onPress={() => onSelect(type)}
      />
    ))}
  </Stack>
);

const ClimbImageToolbar: FunctionComponent<{
  editSubMode: EditMode;
  onChangeMode: (mode: EditMode) => void;
  hasSelection: boolean;
  onDelete: () => void;
  t: (key: string) => string;
}> = ({ editSubMode, onChangeMode, hasSelection, onDelete, t }) => (
  <Stack
    direction="horizontal"
    gap="sm"
    align="center"
    justify="center"
    paddingHorizontal="xl"
    paddingVertical="sm"
  >
    <Button
      variant={editSubMode === 'holds' ? 'primary' : 'outline'}
      title={t('climbing.edit_mode_holds')}
      size="sm"
      onPress={() => onChangeMode('holds')}
    />
    <Button
      variant={editSubMode === 'spline' ? 'primary' : 'outline'}
      title={t('climbing.edit_mode_spline')}
      size="sm"
      onPress={() => onChangeMode('spline')}
    />
    <Button
      variant={editSubMode === 'knife' ? 'primary' : 'outline'}
      title={t('climbing.edit_mode_knife')}
      size="sm"
      onPress={() => onChangeMode('knife')}
    />
    <IconButton
      variant="destructive"
      icon="🗑️"
      size="sm"
      onPress={onDelete}
      disabled={!hasSelection}
    />
  </Stack>
);

const ClimbImage: FunctionComponent<ClimbImageProps> = ({
  source,
  holds,
  spline,
  style,
  selection,
  onSelectionChange,
  editable = false,
  onHoldAdd,
  onHoldRemove,
  onHoldTypeChange,
  onSplinePointAdd,
  onSplinePointInsert,
  onSplinePointRemove,
}) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState<EditMode>('holds');

  const handleTap = useCallback(
    (point: { x: number; y: number }) => {
      if (editMode === 'knife') {
        if (spline.length < 2) return;
        const hit = closestSegmentToPoint(spline, point);
        if (hit && hit.distance <= SPLINE_CURVE_HIT_RADIUS) {
          onSplinePointInsert(hit.segmentIndex, point);
        }
        return;
      }

      if (editMode === 'spline') {
        for (let i = 0; i < spline.length; i++) {
          const dx = point.x - spline[i]!.x;
          const dy = point.y - spline[i]!.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= SPLINE_POINT_HIT_RADIUS) {
            if (selection?.type === 'spline' && selection.index === i) {
              return;
            }
            onSelectionChange({ type: 'spline', index: i });
            return;
          }
        }

        // Tap empty space
        if (selection) {
          onSelectionChange(null);
        } else {
          onSplinePointAdd?.(point);
        }
        return;
      }

      // Holds mode
      for (let i = 0; i < holds.length; i++) {
        const hitRadius = Math.max(holds[i]!.radius, 0.05);
        const dx = point.x - holds[i]!.x;
        const dy = point.y - holds[i]!.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= hitRadius) {
          if (selection?.type === 'hold' && selection.index === i) {
            return;
          }
          onSelectionChange({ type: 'hold', index: i });
          return;
        }
      }

      // Tap empty space
      if (selection) {
        onSelectionChange(null);
      } else {
        onHoldAdd?.({ ...point, radius: DEFAULT_HOLD_RADIUS, type: 'normal' });
      }
    },
    [
      editMode,
      holds,
      spline,
      selection,
      onSelectionChange,
      onHoldAdd,
      onSplinePointAdd,
      onSplinePointInsert,
    ]
  );

  const handleDeleteSelected = useCallback(() => {
    if (!selection) return;
    if (selection.type === 'hold') {
      onHoldRemove(selection.index);
    } else {
      onSplinePointRemove(selection.index);
    }
    onSelectionChange(null);
  }, [selection, onHoldRemove, onSplinePointRemove, onSelectionChange]);

  return (
    <>
      {editable && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ClimbImageToolbar
            editSubMode={editMode}
            onChangeMode={setEditMode}
            hasSelection={!!selection}
            onDelete={handleDeleteSelected}
            t={t}
          />
          {selection?.type === 'hold' && (
            <HoldTypePicker
              currentType={holds[selection.index]?.type ?? 'normal'}
              onSelect={(type) => onHoldTypeChange(selection.index, type)}
              t={t}
            />
          )}
        </Animated.View>
      )}
      <InteractiveImage
        source={source}
        style={style}
        onTap={editable ? handleTap : undefined}
      >
        <ClimbImageOverlay
          holds={holds}
          spline={spline}
          editable={editable}
          editMode={editMode}
          selectedIndex={selection?.index ?? null}
          selectedType={selection?.type ?? null}
        />
      </InteractiveImage>
    </>
  );
};

export default ClimbImage;
export type { ClimbImageProps, EditMode, Selection };
