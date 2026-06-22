import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { dispatchSwarmTask } from './lib/dispatch-swarm-task';
import { evaluateToolCall } from './lib/evaluate-tool-call';
import { queryAgent } from './lib/query-agent';

export const nanoclaw = createPiece({
  displayName: 'NanoClaw',
  description:
    'AI swarm task engine — orchestrates Claws (skill agents) for safety evaluation, reasoning, content generation, and collaborative task execution via Gemini.',
  auth: PieceAuth.SecretText({
    displayName: 'NanoClaw API Key',
    description:
      'Bearer token for your NanoClaw service (stored in GCP Secret Manager as nanoclaw-api-key).',
    required: true,
  }),
  minimumSupportedRelease: '0.36.1',
  logoUrl: '/logo.svg',
  authors: ['metaengage'],
  actions: [dispatchSwarmTask, evaluateToolCall, queryAgent],
  triggers: [],
});
