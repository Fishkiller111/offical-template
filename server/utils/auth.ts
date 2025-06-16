import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: number
  email: string
}

// 生成JWT token
export function generateToken(payload: JWTPayload): string {
  return (jwt as any).sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// 验证JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return (jwt as any).verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// 加密密码
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// 验证密码
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 从请求头中提取token
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// 验证用户认证中间件
export async function requireAuth(event: any): Promise<JWTPayload | null> {
  const authHeader = getHeader(event, 'authorization')
  const token = extractTokenFromHeader(authHeader)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required'
    })
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  return payload
} 