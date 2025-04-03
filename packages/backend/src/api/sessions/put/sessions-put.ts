import {
  SessionsPutRequest,
  sessionsPutRequestSchema,
  SessionsPutResponse,
} from '@shared/models/session';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DbRecord } from '../../../services/aws/db-record';
import { SessionsService } from '../../../services/sessions-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<SessionsPutResponse>(
  async (event, authorizerContext) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { sessionPutData } = validateEvent(event);
    const { userId } = authorizerContext;

    if (!sessionPutData.id) {
    }

    const record: DbRecord<'session'> = {
      completedAt: new Date().toUTCString(),
      lastUpdated: new Date().toUTCString(),
      PK: 'session',
      SK:
        (sessionPutData.id as DbRecord<'session'>['SK']) ??
        assert(sessionPutData.workoutId, {
          msg: 'Workout ID is required when creating new sessions.',
        }) ??
        SessionsService.instance.newId(userId, sessionPutData.workoutId!),
    };
    void (await SessionsService.instance.put(record));

    return Promise.resolve({
      statusCode: 200,
      body: {
        success: true,
        data: {
          session: {
            completedAt: new Date(record.completedAt),
            id: record.SK,
          },
        },
      },
    });
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  sessionPutData: SessionsPutRequest;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);
    const sessionPutData = sessionsPutRequestSchema.parse(body);
    return { sessionPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
