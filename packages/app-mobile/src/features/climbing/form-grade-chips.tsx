import { ClimbGrade } from '@shared/models/climb/climb';
import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './form-grade-chips.styles';

const GRADE_OPTIONS: ClimbGrade[] = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
];

interface FormGradeChipsProps {
  name: string;
}

const FormGradeChips: FunctionComponent<FormGradeChipsProps> = ({ name }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <View style={styles.container}>
      <Text>{t('climbing.browse_filters')}</Text>
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
                  <Text
                    style={[
                      styles.chipText,
                      selectedGrades.includes(grade) && styles.chipTextSelected,
                    ]}
                  >
                    {grade}
                  </Text>
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
