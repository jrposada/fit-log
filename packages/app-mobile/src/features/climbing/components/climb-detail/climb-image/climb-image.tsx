import {
  DEFAULT_HOLD_RADIUS,
  Hold,
  SplinePoint,
} from '@shared/models/climb/climb';
import { FunctionComponent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import Button from '../../../../../library/button';
import IconButton from '../../../../../library/icon-button';
import InteractiveImage from '../../../../../library/interactive-image';
import ClimbImageOverlay from './climb-image-overlay';

type EditMode = 'holds' | 'spline';

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
  onSplinePointAdd: (point: SplinePoint) => void;
  onSplinePointRemove: (index: number) => void;
}

const SPLINE_POINT_HIT_RADIUS = 0.05;

const ClimbImageToolbar: FunctionComponent<{
  editSubMode: EditMode;
  onChangeMode: (mode: EditMode) => void;
  hasSelection: boolean;
  onDelete: () => void;
  t: (key: string) => string;
}> = ({ editSubMode, onChangeMode, hasSelection, onDelete, t }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      justifyContent: 'center',
    }}
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
    <IconButton
      variant="destructive"
      icon="🗑️"
      size="sm"
      onPress={onDelete}
      disabled={!hasSelection}
    />
  </View>
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
  onSplinePointAdd,
  onSplinePointRemove,
}) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState<EditMode>('holds');

  const handleTap = useCallback(
    (point: { x: number; y: number }) => {
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
        onHoldAdd?.({ ...point, radius: DEFAULT_HOLD_RADIUS });
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
