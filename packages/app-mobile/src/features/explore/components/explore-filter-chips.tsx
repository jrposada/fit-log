import { ClimbGrade } from '@jrposada/fit-log-shared/common/climbs/grades';
import { Location } from '@jrposada/fit-log-shared/models/locations/location';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { Icon } from '../../../library/icon';
import { accent } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import { styles } from './explore-filter-chips.styles';
import ExploreGradeSheet from './explore-grade-sheet';
import ExploreLocationSheet from './explore-location-sheet';

interface ExploreFilterChipsProps {
  grade: ClimbGrade[];
  onGradeChange: (grades: ClimbGrade[]) => void;
  locationId: string;
  onLocationChange: (locationId: string) => void;
  locations: Location[];
  isLoadingLocations: boolean;
  isOwnerFilterActive: boolean;
  onOwnerFilterChange: (isActive: boolean) => void;
}

const ExploreFilterChips: FunctionComponent<ExploreFilterChipsProps> = ({
  grade,
  onGradeChange,
  locationId,
  onLocationChange,
  locations,
  isLoadingLocations,
  isOwnerFilterActive,
  onOwnerFilterChange,
}) => {
  const { t } = useTranslation();
  const [isGradeSheetOpen, setGradeSheetOpen] = useState(false);
  const [isLocationSheetOpen, setLocationSheetOpen] = useState(false);

  const selectedLocation = locations.find((loc) => loc.id === locationId);

  const gradeLabel =
    grade.length > 0
      ? t('explore.filter_grade_selected', { count: grade.length })
      : t('explore.filter_grade');

  const locationLabel = selectedLocation?.name ?? t('explore.filter_location');

  return (
    <>
      <TouchableOpacity
        style={[styles.chip, grade.length > 0 && styles.chipActive]}
        onPress={() => setGradeSheetOpen(true)}
      >
        <Typography
          size="callout"
          weight="bold"
          color={grade.length > 0 ? 'accent' : 'primary'}
        >
          {gradeLabel}
        </Typography>
        {grade.length > 0 && (
          <TouchableOpacity onPress={() => onGradeChange([])} hitSlop={8}>
            <Icon icon="close" size="xs" color={accent.primary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chip, locationId && styles.chipActive]}
        onPress={() => setLocationSheetOpen(true)}
      >
        <Typography
          size="callout"
          weight="bold"
          color={locationId ? 'accent' : 'primary'}
        >
          {locationLabel}
        </Typography>
        {locationId && (
          <TouchableOpacity onPress={() => onLocationChange('')} hitSlop={8}>
            <Icon icon="close" size="xs" color={accent.primary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.chip, isOwnerFilterActive && styles.chipActive]}
        onPress={() => onOwnerFilterChange(!isOwnerFilterActive)}
      >
        <Typography
          size="callout"
          weight="bold"
          color={isOwnerFilterActive ? 'accent' : 'primary'}
        >
          {t('explore.filter_owner_mine')}
        </Typography>
      </TouchableOpacity>

      <ExploreGradeSheet
        visible={isGradeSheetOpen}
        onClose={() => setGradeSheetOpen(false)}
        selected={grade}
        onChange={onGradeChange}
      />

      <ExploreLocationSheet
        visible={isLocationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
        locations={locations}
        isLoading={isLoadingLocations}
        selectedLocationId={locationId}
        onChange={onLocationChange}
      />
    </>
  );
};

export default ExploreFilterChips;
