import { ClimbGrade } from '@shared/models/climb/climb';
import { GRADE_OPTIONS } from '@shared/models/climb/climb-constants';
import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Typography } from '../../../../library/typography';
import { styles } from './form-grade-chips.styles';

interface FormGradeChipsProps {
  name: string;
}

const FormGradeChips: FunctionComponent<FormGradeChipsProps> = ({ name }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <View style={styles.container}>
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {GRADE_OPTIONS.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.chip,
                    selectedGrades.includes(grade) && styles.chipSelected,
                  ]}
                  onPress={() => toggleGrade(grade)}
                >
                  <Typography
                    size="callout"
                    color={
                      selectedGrades.includes(grade) ? 'inverse' : 'primary'
                    }
                  >
                    {grade}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          );
        }}
      />
    </View>
  );
};

export default FormGradeChips;
