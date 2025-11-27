import {
  SessionsPutRequest,
  SessionsPutResponse,
} from '@shared/models/session';
import { assert } from '@shared/utils/assert';

import { DbRecord } from '../../services/aws/db-record';
import { SessionsService } from '../../services/sessions-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  SessionsPutResponse,
  unknown,
  unknown,
  SessionsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const sessionPutData = request.body;
  const { userId } = request.user;

  const record: DbRecord<'session'> = {
    completedAt: sessionPutData.completedAt,
    updatedAt: new Date().toISOString(),
    workoutDescription: sessionPutData.workoutDescription,
    workoutName: sessionPutData.workoutName,
    PK: 'session',
    SK:
      (sessionPutData.id as DbRecord<'session'>['SK']) ??
      assert(sessionPutData.workoutId, {
        msg: 'Workout ID is required when creating new sessions.',
      }) ??
      SessionsService.instance.newSk(userId, sessionPutData.workoutId!),
  };
  void (await SessionsService.instance.put(record));

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        session: {
          completedAt: record.completedAt,
          id: record.SK,
          workoutDescription: record.workoutDescription,
          workoutName: record.workoutName,
        },
      },
    },
  };
});

export { handler };
