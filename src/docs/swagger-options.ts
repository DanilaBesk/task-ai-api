import { CONFIG } from '#config';
import { common } from '#/docs/common.json';
import { user } from '#/docs/user.json';
import { auth } from '#/docs/auth.json';
import { ai } from '#/docs/ai.json';
import { errors } from '#/docs/errors.json';
import { AIModels } from '#/ai-models/openai';
import { MAX_PROMPT_LENGTH } from '#/constants/ai-action.constants';
import { AIActionService } from '#/services';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API для управления пользователями и AI генерации текста',
      contact: {
        name: 'Danila Beskorovaev',
        url: 'https://github.com/DanilaBesk',
        email: 'danilbeskorovaev546@gmail.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${CONFIG.APP_PORT}/api`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'JWT Authorization header using the Bearer scheme.',
          bearerFormat: 'JWT'
        }
      },
      user,
      auth,
      ai,
      errors,
      common
    },
    dinamicComponents: {
      ai: {
        variables: {
          maxPromptLength: MAX_PROMPT_LENGTH
        },
        schemas: {
          AIModelNames: {
            type: 'string',
            enum: Object.keys(AIModels),
            example: Object.keys(AIModels)[0]
          },
          AIModelsInfo: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  $ref: '#/dinamicComponents/ai/schemas/AIModelNames'
                },
                creditsPer100Tokens: {
                  type: 'number'
                }
              }
            },
            example: AIActionService.getAIModelsInfo()
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};
