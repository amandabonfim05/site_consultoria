import 'dotenv/config';
import serverless from 'serverless-http';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createApp } from './app';

const app = createApp();
const serverlessHandler = serverless(app);

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {

  context.callbackWaitsForEmptyEventLoop = false;

  return serverlessHandler(event, context) as Promise<APIGatewayProxyResult>;
}
