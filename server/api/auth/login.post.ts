/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - 认证
 *     summary: 用户登录
 *     description: 使用邮箱和密码进行用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 邮箱或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { verifyPassword, generateToken } from '~/server/utils/auth'
import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔐 开始登录处理...')
    
    const body = await readBody(event)
    console.log('📨 接收到登录请求:', { email: body.email, hasPassword: !!body.password })
    
    const { email, password } = body

    // 验证输入
    if (!email || !password) {
      console.log('❌ 缺少必要参数')
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    console.log('🔍 正在查找用户...')
    
    // 测试数据库连接
    try {
      await prisma.$connect()
      console.log('✅ 数据库连接成功')
    } catch (dbError) {
      console.error('❌ 数据库连接失败:', dbError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection failed'
      })
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('👤 用户查找结果:', user ? `找到用户 ID: ${user.id}` : '用户不存在')

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    console.log('🔑 验证密码...')
    
    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('🔐 密码验证结果:', isValidPassword ? '正确' : '错误')
    
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    console.log('🎫 生成JWT token...')
    
    // 生成JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    // 返回用户信息（不包含密码）
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }

    console.log('✅ 登录成功!')

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    }
  } catch (error: any) {
    console.error('❌ 登录错误详情:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    })
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 