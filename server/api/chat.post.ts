export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    
    console.log('收到聊天请求:', body)

    // 调用Dify聊天API
    const response = await fetch(`${config.difyBaseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.difyApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify API错误:', errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Dify API错误: ${errorText}`
      })
    }

    // 设置SSE响应头
    setHeader(event, 'Content-Type', 'text/event-stream')
    setHeader(event, 'Cache-Control', 'no-cache')
    setHeader(event, 'Connection', 'keep-alive')
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Headers', 'Cache-Control')

    // 流式转发Dify的响应
    const reader = response.body?.getReader()
    if (!reader) {
      throw createError({
        statusCode: 500,
        statusMessage: '无法读取响应流'
      })
    }

    const stream = new ReadableStream({
      start(controller) {
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) {
                controller.close()
                break
              }
              controller.enqueue(value)
            }
          } catch (error: any) {
            console.error('流读取错误:', error)
            controller.error(error)
          }
        }
        pump()
      }
    })

    return sendStream(event, stream)

  } catch (error: any) {
    console.error('聊天API失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '聊天请求失败'
    })
  }
}) 