import {
  createAction,
  Property,
} from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';

export const queryAgent = createAction({
  name: 'query_agent',
  displayName: 'Query Agent',
  description:
    'Send a query to a NanoClaw agent group and get an AI-powered response via Gemini.',
  props: {
    baseUrl: Property.ShortText({
      displayName: 'NanoClaw URL',
      description: 'Base URL of the NanoClaw service.',
      required: true,
      defaultValue: 'https://nanoclaw-624976754326.us-central1.run.app',
    }),
    agentGroupId: Property.ShortText({
      displayName: 'Agent Group ID',
      description: 'Identifier for the agent group to query.',
      required: true,
      defaultValue: 'default',
    }),
    query: Property.LongText({
      displayName: 'Query',
      description: 'The prompt or question to send to the agent.',
      required: true,
    }),
    systemPrompt: Property.LongText({
      displayName: 'System Prompt',
      description: 'Optional system prompt to guide the agent behavior.',
      required: false,
    }),
    context: Property.Json({
      displayName: 'Context',
      description: 'Additional context to pass to the agent.',
      required: false,
      defaultValue: {},
    }),
    maxTokens: Property.Number({
      displayName: 'Max Tokens',
      description: 'Maximum tokens in the response.',
      required: false,
      defaultValue: 1024,
    }),
  },
  async run(context) {
    const { baseUrl, agentGroupId, query, systemPrompt, maxTokens } =
      context.propsValue;
    const auth = context.auth as string;

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/api/v1/agents/${agentGroupId}/query`,
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: {
        query,
        systemPrompt: systemPrompt ?? undefined,
        context: context.propsValue.context ?? {},
        maxTokens: maxTokens ?? 1024,
      },
    });

    return response.body;
  },
});
