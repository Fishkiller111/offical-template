# CSS 重构文档

## 概述

本次重构将项目中分散在各个页面的CSS样式统一整理到全局CSS文件中，提高了代码的可维护性和一致性。

## 主要改进

### 1. 统一的CSS变量管理

- **位置**: `assets/css/global.css`
- **改进**: 将所有CSS变量（颜色、间距等）统一定义，支持亮色/暗色主题切换
- **好处**:
  - 主题切换更加一致
  - 颜色管理更加集中
  - 避免变量重复定义

### 2. 全局工具类

创建了一系列实用的工具类：

#### 按钮样式

- `.btn-primary` - 主要按钮样式
- `.btn-secondary` - 次要按钮样式

#### 卡片样式

- `.card-default` - 统一的卡片样式

#### 输入框样式

- `.input-default` - 统一的输入框样式
- `.form-label` - 表单标签样式
- `.form-error` - 错误提示样式

#### 导航样式

- `.navbar-default` - 导航栏背景样式
- `.nav-link` - 导航链接样式

#### 布局样式

- `.container-default` - 响应式容器
- `.section-padding` - 节按钮距
- `.grid-responsive-*` - 响应式网格布局

#### 文本样式

- `.text-heading-1/2/3` - 标题样式
- `.text-body` - 正文样式

#### 动画和效果

- `.animate-fade-up` - 淡入向上动画
- `.scroll-reveal` - 滚动揭示动画
- `.hover-scale` - 悬停缩放效果
- `.hover-glow` - 悬停发光效果

### 3. 页面样式优化

#### `pages/index.vue`

- **移除**: 重复的CSS变量定义、动画关键帧、渐变样式
- **优化**: 使用全局工具类替换重复的tailwind类组合
- **减少**: 文件大小约60%的CSS代码

#### `pages/auth.vue`

- **优化**: 表单样式使用统一的工具类
- **改进**: 错误提示和加载状态的样式一致性

#### `pages/api-docs.vue`

- **移除**: 重复的CSS变量和Swagger UI样式定义
- **统一**: Swagger UI主题样式管理

### 4. 配置更新

#### `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  css: ['~/assets/css/global.css'], // 添加全局CSS引用
  // ... 其他配置
})
```

## 使用指南

### 新增组件样式

1. 优先使用已定义的全局工具类
2. 如需新增样式，考虑是否可以抽象为通用工具类
3. 页面特定样式放在页面组件的 `<style scoped>` 中

### 主题定制

- 修改 `assets/css/global.css` 中的CSS变量
- 新增主题变量遵循命名约定：`--color-*`、`--bg-*`、`--text-*`

### 响应式设计

- 使用 `.grid-responsive-*` 类进行网格布局
- 使用 `.container-default` 作为页面容器
- 使用 `.section-padding` 统一节间距

## 维护建议

1. **避免重复**: 新增样式前检查是否已有类似的全局类
2. **保持一致**: 新组件优先使用现有工具类
3. **文档更新**: 新增全局类时更新此文档
4. **定期审查**: 定期检查页面中是否还有可以抽象的重复样式

## 性能提升

- **CSS体积减少**: 去除重复样式定义
- **加载优化**: 全局CSS在应用启动时一次性加载
- **缓存友好**: 全局样式文件可以更好地被浏览器缓存
- **构建优化**: 减少了CSS重复，构建体积更小

## 兼容性

- 保持所有现有功能不变
- 支持现有的主题切换机制
- 向后兼容原有的样式类名
