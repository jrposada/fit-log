import { ClimbHistory } from '@shared/models/climb-history/climb-history';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Button from '../../../../library/button';
import Section from '../../../../library/section';
import { surfaces } from '../../../../library/theme';
import { Typography } from '../../../../library/typography';

type ClimbDetailStatusCardProps = {
  userStatus: ClimbHistory | undefined;
  isHistoryPending: boolean;
  isProjectPending: boolean;
  onLogSend: () => void;
  onToggleProject: () => void;
};

const ClimbDetailStatusCard: FunctionComponent<ClimbDetailStatusCardProps> = ({
  userStatus,
  isHistoryPending,
  isProjectPending,
  onLogSend,
  onToggleProject,
}) => {
  const { t } = useTranslation();

  return (
    <Section spacing="lg">
      <View
        style={{
          backgroundColor: surfaces.base,
          borderRadius: 12,
          padding: 16,
          gap: 12,
        }}
      >
        <Typography size="callout" weight="semibold">
          {t('climbing.browse_your_status')}:
        </Typography>
        <Typography size="callout" color="secondary">
          {userStatus?.status === 'send' || userStatus?.status === 'flash'
            ? `✓ ${t('climbing.browse_status_sent')}`
            : userStatus?.status === 'attempt'
              ? t('climbing.browse_status_attempted', {
                  count: userStatus.tries.reduce(
                    (sum, tr) => sum + (tr.attempts || 0),
                    0
                  ),
                })
              : t('climbing.browse_status_not_tried')}
          {userStatus?.isProject
            ? ` · 🎯 ${t('climbing.browse_status_project')}`
            : ''}
        </Typography>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          {userStatus?.status !== 'send' && userStatus?.status !== 'flash' && (
            <Button
              variant="primary"
              title={`✓ ${t('climbing.browse_log_send')}`}
              onPress={onLogSend}
              disabled={isHistoryPending}
            />
          )}
          {userStatus?.status !== 'send' && userStatus?.status !== 'flash' && (
            <Button
              variant="outline"
              title={
                userStatus?.isProject
                  ? t('climbing.unproject_action')
                  : `+ ${t('climbing.project_action')}`
              }
              onPress={onToggleProject}
              disabled={isProjectPending}
            />
          )}
        </View>
      </View>
    </Section>
  );
};

export default ClimbDetailStatusCard;
