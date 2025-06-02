export interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

// 全局状态
const authUser = () => useState<User | null>('auth.user', () => null)
const authToken = () => useState<string | null>('auth.token', () => null)

export const useAuth = () => {
  const user = authUser()
  const token = authToken()
  const isAuthenticated = computed(() => !!token.value)

  // 初始化认证状态
  const initAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        try {
          user.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          logout()
        }
      }
    }
  }

  // 登录
  const login = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    
    if (process.client) {
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  // 获取当前用户信息
  const getCurrentUser = async () => {
    if (!token.value) {
      throw new Error('No authentication token')
    }

    try {
      const { data } = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      user.value = data.user
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return data.user
    } catch (error) {
      console.error('Error fetching current user:', error)
      logout()
      throw error
    }
  }

  // 检查token是否有效
  const validateToken = async () => {
    if (!token.value) return false

    try {
      await getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    initAuth,
    login,
    logout,
    getCurrentUser,
    validateToken
  }
} 