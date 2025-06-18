export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)
    
    if (!form) {
      throw createError({
        statusCode: 400,
        statusMessage: '没有找到文件'
      })
    }

    const fileData = form.find(item => item.name === 'file')
    const userData = form.find(item => item.name === 'user')
    
    if (!fileData) {
      throw createError({
        statusCode: 400,
        statusMessage: '文件字段缺失'
      })
    }

    const config = useRuntimeConfig()
    
    console.log('收到文件上传请求:', {
      filename: fileData.filename,
      size: fileData.data.length,
      user: userData?.data?.toString()
    })
    
    // 准备FormData发送到Dify
    const formData = new FormData()
    const blob = new Blob([fileData.data], { type: fileData.type })
    formData.append('file', blob, fileData.filename)
    formData.append('user', userData?.data?.toString() || 'anonymous')

    // 调用Dify文件上传API
    const response = await fetch(`${config.difyBaseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.difyApiKey}`,
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify文件上传错误:', errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Dify文件上传错误: ${errorText}`
      })
    }

    const result = await response.json()
    console.log('文件上传成功:', result)
    
    return result

  } catch (error: any) {
    console.error('文件上传失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '文件上传失败'
    })
  }
}) 