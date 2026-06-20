import {
  createAction,
  Property,
} from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';

export const evaluateToolCall = createAction({
  name: 'evaluate_tool_call',
  displayName: 'Evaluate Tool Call',
  description:
    'Run a safety evaluation on a tool call before execution using Gemini AI.',
  props: {
    baseUrl: Property.ShortText({
      displayName: 'NanoClaw URL',
      description: 'Base URL of the NanoClaw service.',
      required: true,
      defaultValue: 'https://nanoclaw-624976754326.us-central1.run.app',
    }),
    toolName: Property.ShortText({
      displayName: 'Tool Name',
      description: 'Name of the tool being called.',
      required: true,
    }),
    toolParameters: Property.Json({
      displayName: 'Tool Parameters',
      description: 'JSON parameters passed to the tool.',
      required: true,
      defaultValue: {},
    }),
    context: Property.Json({
      displayName: 'Context',
      description: 'Additional context about the session/caller.',
      required: false,
      defaultValue: {},
    }),
    policy: Property.StaticDropdown({
      displayName: 'Policy',
      description: 'Safety evaluation policy level.',
      required: false,
      defaultValue: 'standard',
      options: {
        options: [
          { label: 'Permissive — only block critical violations', value: 'permissive' },
          { label: 'Standard — block obvious risks', value: 'standard' },
          { label: 'Strict — block anything uncertain', value: 'strict' },
        ],
      },
    }),
    agentGroupId: Property.ShortText({
      displayName: 'Agent Group ID',
      description: 'Identifier for the agent group context.',
      required: false,
      defaultValue: 'default',
    }),
  },
  async run(context) {
    const { baseUrl, toolName, toolParameters, agentGroupId, policy } =
      context.propsValue;
    const auth = context.auth as unknown as string;

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/api/v1/evaluate`,
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: {
        agentGroupId,
        toolCall: { name: toolName, parameters: toolParameters },
        context: context.propsValue.context ?? {},
        policy: policy ?? 'standard',
      },
    });

    return response.body;
  },
});
