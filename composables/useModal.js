import { ref, nextTick } from 'vue'

// 全局弹窗状态
const modalState = ref({
  show: false,
  type: 'info',
  title: '提示',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
  allowBackdropClose: true,
  resolve: null,
  reject: null
})

export const useModal = () => {
  // 显示弹窗的基础方法
  const showModal = (options) => {
    return new Promise((resolve, reject) => {
      modalState.value = {
        show: true,
        type: options.type || 'info',
        title: options.title || '提示',
        message: options.message || '',
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        allowBackdropClose: options.allowBackdropClose !== false,
        resolve,
        reject
      }
    })
  }

  // 关闭弹窗
  const closeModal = () => {
    modalState.value.show = false
    nextTick(() => {
      modalState.value.resolve = null
      modalState.value.reject = null
    })
  }

  // 确认操作
  const confirmModal = () => {
    if (modalState.value.resolve) {
      modalState.value.resolve(true)
    }
    closeModal()
  }

  // 取消操作
  const cancelModal = () => {
    if (modalState.value.resolve) {
      modalState.value.resolve(false)
    }
    closeModal()
  }

  // 便捷方法：确认对话框
  const confirm = (message, options = {}) => {
    return showModal({
      type: 'confirm',
      title: options.title || '确认',
      message,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      allowBackdropClose: options.allowBackdropClose !== false
    })
  }

  // 便捷方法：警告对话框
  const warning = (message, options = {}) => {
    return showModal({
      type: 'warning',
      title: options.title || '警告',
      message,
      confirmText: options.confirmText || '知道了',
      allowBackdropClose: options.allowBackdropClose !== false
    })
  }

  // 便捷方法：错误对话框
  const error = (message, options = {}) => {
    return showModal({
      type: 'error',
      title: options.title || '错误',
      message,
      confirmText: options.confirmText || '知道了',
      allowBackdropClose: options.allowBackdropClose !== false
    })
  }

  // 便捷方法：信息对话框
  const info = (message, options = {}) => {
    return showModal({
      type: 'info',
      title: options.title || '提示',
      message,
      confirmText: options.confirmText || '知道了',
      allowBackdropClose: options.allowBackdropClose !== false
    })
  }

  // 便捷方法：成功对话框
  const success = (message, options = {}) => {
    return showModal({
      type: 'success',
      title: options.title || '成功',
      message,
      confirmText: options.confirmText || '好的',
      allowBackdropClose: options.allowBackdropClose !== false
    })
  }

  return {
    modalState,
    showModal,
    closeModal,
    confirmModal,
    cancelModal,
    confirm,
    warning,
    error,
    info,
    success
  }
} 