import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FunctionComponent } from 'react';
import { Session } from '@shared/models/session';
import { useSessionsDelete } from '../../core/hooks/sessions/use-sessions-delete';

type SessionActionsProps = {
  session: Session;
};

const SessionActions: FunctionComponent<SessionActionsProps> = ({
  session,
}) => {
  const { mutate: sendSessionsDelete } = useSessionsDelete();

  const deleteSession = () => {
    sendSessionsDelete(session.id);
  };

  return (
    <>
      <IconButton onClick={deleteSession} color="error">
        <Delete />
      </IconButton>
    </>
  );
};

export default SessionActions;
export type { SessionActionsProps };
