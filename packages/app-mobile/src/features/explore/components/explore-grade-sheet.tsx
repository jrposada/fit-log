import {
  ClimbGrade,
  GRADE_OPTIONS,
} from '@jrposada/fit-log-shared/common/climbs/grades';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import Button from '../../../library/button';
import IconButton from '../../../library/icon-button';
import Modal from '../../../library/modal';
import Stack from '../../../library/stack';
import { Typography } from '../../../library/typography';
import GradeBadge from '../../climbing/components/common/grade-badge';
import { styles } from './explore-grade-sheet.styles';

interface ExploreGradeSheetProps {
  visible: boolean;
  onClose: () => void;
  selected: ClimbGrade[];
  onChange: (grades: ClimbGrade[]) => void;
}

const ExploreGradeSheet: FunctionComponent<ExploreGradeSheetProps> = ({
  visible,
  onClose,
  selected,
  onChange,
}) => {
  const { t } = useTranslation();

  const toggleGrade = (grade: ClimbGrade) => {
    onChange(
      selected.includes(grade)
        ? selected.filter((g) => g !== grade)
        : [...selected, grade]
    );
  };

  return (
    <Modal.Root visible={visible} onClose={onClose}>
      <Modal.Header>
        <Stack direction="horizontal" align="center" justify="between">
          <Typography size="title">{t('explore.grade_sheet_title')}</Typography>
          <IconButton icon="close" variant="ghost" onPress={onClose} />
        </Stack>
      </Modal.Header>
      <Modal.Body>
        <ScrollView style={styles.scroll}>
          <View style={styles.grid}>
            {GRADE_OPTIONS.map((grade) => (
              <GradeBadge
                key={grade}
                grade={grade}
                variant={selected.includes(grade) ? 'filled' : 'ghost'}
                onPress={() => toggleGrade(grade)}
              />
            ))}
          </View>
        </ScrollView>
      </Modal.Body>
      <Modal.Footer>
        <Stack direction="horizontal" gap="md">
          <Button
            title={t('actions.clear')}
            variant="outline"
            fullWidth
            onPress={() => onChange([])}
          />
          <Button
            title={t('actions.close')}
            variant="primary"
            fullWidth
            onPress={onClose}
          />
        </Stack>
      </Modal.Footer>
    </Modal.Root>
  );
};

export default ExploreGradeSheet;
