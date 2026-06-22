import {
  createAction,
  Property,
} from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';

export const dispatchSwarmTask = createAction({
  name: 'dispatch_swarm_task',
  displayName: 'Dispatch Swarm Task',
  description:
    'Send a complex task to NanoClaw and it assembles a swarm of Claws — each with a different skill — to complete it collaboratively.',
  props: {
    baseUrl: Property.ShortText({
      displayName: 'NanoClaw URL',
      description: 'Base URL of the NanoClaw service.',
      required: true,
      defaultValue: 'https://nanoclaw-624976754326.us-central1.run.app',
    }),
    task: Property.LongText({
      displayName: 'Task',
      description:
        'Describe the task you want the swarm to complete. NanoClaw will automatically decompose it and assign the right Claws.',
      required: true,
    }),
    context: Property.Json({
      displayName: 'Context',
      description: 'Additional context data to pass to the Claws (e.g. customer info, document text).',
      required: false,
      defaultValue: {},
    }),
    policy: Property.StaticDropdown({
      displayName: 'Safety Policy',
      description: 'How strict the Safety Claw should be when validating results.',
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
  },
  async run(context) {
    const { baseUrl, task, policy } = context.propsValue;
    const auth = context.auth as unknown as string;

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/api/v1/swarm/dispatch`,
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: {
        task,
        context: context.propsValue.context ?? {},
        policy: policy ?? 'standard',
      },
    });

    return response.body;
  },
});
