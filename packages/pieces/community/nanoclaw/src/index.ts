import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { evaluateToolCall } from './lib/evaluate-tool-call';
import { queryAgent } from './lib/query-agent';

export const nanoclaw = createPiece({
  displayName: 'NanoClaw',
  description:
    'AI safety evaluation and agent orchestration powered by Gemini, part of the MetaEngage Cognitive Automation Mesh.',
  auth: PieceAuth.SecretText({
    displayName: 'NanoClaw API Key',
    description:
      'Bearer token for your NanoClaw service (stored in GCP Secret Manager as nanoclaw-api-key).',
    required: true,
  }),
  minimumSupportedRelease: '0.36.1',
  logoUrl: '/logo.svg',
  authors: ['metaengage'],
  actions: [evaluateToolCall, queryAgent],
  triggers: [],
});
