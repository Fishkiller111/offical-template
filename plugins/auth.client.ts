export default defineNuxtPlugin(() => {
  const { initAuth } = useAuth()
  
  // 在客户端初始化认证状态
  initAuth()
}) 