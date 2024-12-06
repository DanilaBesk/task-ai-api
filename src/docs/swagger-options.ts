import { CONFIG } from '#config';
import { common } from '#/docs/common.json';
import { user } from '#/docs/user.json';
import { auth } from '#/docs/auth.json';
import { ai } from '#/docs/ai.json';
import { errors } from '#/docs/errors.json';
import { AIModels } from '#/ai-models/openai';

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
      ai: {
        ...ai,
        schemas: {
          AIModel: {
            type: 'string',
            enum: Object.keys(AIModels),
            example: Object.entries(AIModels)[0][0]
          }
        }
      },
      errors,
      common
    }
  },
  apis: ['./src/routes/*.ts']
};
