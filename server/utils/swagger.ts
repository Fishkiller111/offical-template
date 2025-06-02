import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API 文档',
      version: '1.0.0',
      description: '这是项目的API接口文档',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发环境',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '用户ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '用户邮箱',
            },
            name: {
              type: 'string',
              description: '用户姓名',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: '用户邮箱',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              description: '用户密码',
              example: 'password123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: '用户邮箱',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: '用户密码（至少6位）',
              example: 'password123',
            },
            name: {
              type: 'string',
              description: '用户姓名',
              example: '张三',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '请求是否成功',
            },
            message: {
              type: 'string',
              description: '响应消息',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT认证令牌',
                },
              },
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '请求是否成功',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              description: '错误状态码',
            },
            statusMessage: {
              type: 'string',
              description: '错误信息',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server/api/**/*.ts'], // 扫描API文件路径
}

export const specs = swaggerJSDoc(swaggerOptions) 