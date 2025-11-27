import {
  SessionsPutRequest,
  sessionsPutRequestSchema,
  SessionsPutResponse,
} from '@shared/models/session';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import { DbRecord } from '../../../services/aws/db-record';
import { SessionsService } from '../../../services/sessions-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<SessionsPutResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { sessionPutData } = validateEvent(req);
    const { userId } = authorizerContext;

    if (!sessionPutData.id) {
    }

    const record: DbRecord<'session'> = {
      PK: 'session',
      SK:
        (sessionPutData.id as DbRecord<'session'>['SK']) ??
        assert(sessionPutData.workoutId, {
          msg: 'Workout ID is required when creating new sessions.',
        }) ??
        SessionsService.instance.newSk(userId, sessionPutData.workoutId!),
      completedAt: sessionPutData.completedAt,
      updatedAt: new Date().toISOString(),
      workoutDescription: sessionPutData.workoutDescription,
      workoutName: sessionPutData.workoutName,
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
  }
);

function validateEvent(req: Request): {
  sessionPutData: SessionsPutRequest;
} {
  if (!req.body) {
    throw new Error('Invalid request');
  }

  try {
    const sessionPutData = sessionsPutRequestSchema.parse(req.body);
    return { sessionPutData };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
