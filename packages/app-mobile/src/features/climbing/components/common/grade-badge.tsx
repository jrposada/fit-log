import { Climb } from '@shared/models/climb/climb';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent } from 'react';

import { Badge } from '../../../../library/badge';

type GradeBadgeProps = {
  grade: Climb['grade'];
  variant?: 'filled' | 'ghost';
};

const GradeBadge: FunctionComponent<GradeBadgeProps> = ({
  grade,
  variant = 'filled',
}) => {
  const gradeColor = beautifyGradeColor(grade);
  const isFilled = variant === 'filled';

  return (
    <Badge
      label={grade}
      size="md"
      variant="info"
      style={{ backgroundColor: isFilled ? gradeColor : 'transparent' }}
      textStyle={{ color: isFilled ? '#FFFFFF' : gradeColor }}
    />
  );
};

export default GradeBadge;
