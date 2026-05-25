import {
  ClimbGrade,
  GRADE_OPTIONS,
} from '@jrposada/fit-log-shared/common/climbs/grades';
import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import Section from '../../../../library/section';
import Stack from '../../../../library/stack';
import { Typography } from '../../../../library/typography';
import GradeBadge from './grade-badge';

interface FormGradeChipsProps {
  name: string;
}

const FormGradeChips: FunctionComponent<FormGradeChipsProps> = ({ name }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Section noPadding gap="sm">
      <Typography>{t('climbing.browse_filters')}</Typography>
      <Controller
        control={control}
        name={name}
        render={({ field: { value = [], onChange } }) => {
          const selectedGrades = value as ClimbGrade[];

          const toggleGrade = (grade: ClimbGrade) => {
            if (selectedGrades.includes(grade)) {
              onChange(selectedGrades.filter((g) => g !== grade));
            } else {
              onChange([...selectedGrades, grade]);
            }
          };

          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Stack direction="horizontal" gap="sm">
                {GRADE_OPTIONS.map((grade) => (
                  <GradeBadge
                    key={grade}
                    grade={grade}
                    variant={
                      selectedGrades.includes(grade) ? 'filled' : 'ghost'
                    }
                    onPress={() => toggleGrade(grade)}
                  />
                ))}
              </Stack>
            </ScrollView>
          );
        }}
      />
    </Section>
  );
};

export default FormGradeChips;
