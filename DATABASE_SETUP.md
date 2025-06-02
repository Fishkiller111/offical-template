# 数据库设置指南

## 快速开始 (PostgreSQL)

项目已配置为使用PostgreSQL数据库，支持自动创建和初始化。

### 1. 配置数据库连接

确保 `.env` 文件中有正确的 PostgreSQL 连接字符串：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/webai_db?schema=public"

# JWT
JWT_SECRET="your_jwt_secret_key_change_this_in_production"
JWT_EXPIRES_IN="7d"
```

### 2. 自动初始化数据库

```bash
# 一键初始化数据库（自动创建表结构）
pnpm db:init
```

这个命令会：

- 🔍 检查环境变量配置
- 📦 生成 Prisma 客户端
- 🗄️ 自动创建数据库表结构
- ✅ 完成所有必要的设置

### 3. 开发命令

```bash
# 启动开发服务器
pnpm dev

# 打开数据库管理界面
pnpm db:studio

# 重置数据库（清空所有数据）
pnpm db:reset

# 手动推送数据库结构变更
pnpm db:push

# 创建迁移文件
pnpm db:migrate
```

## PostgreSQL 安装 (如果需要本地数据库)

### macOS (使用 Homebrew)

```bash
brew install postgresql
brew services start postgresql

# 创建数据库
createdb webai_db
```

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE webai_db;
CREATE USER webai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE webai_db TO webai_user;
\q
```

### Windows

下载并安装 PostgreSQL: https://www.postgresql.org/download/windows/

### Docker (推荐用于开发)

```bash
# 使用 Docker 快速启动 PostgreSQL
docker run --name postgres-webai \
  -e POSTGRES_DB=webai_db \
  -e POSTGRES_USER=webai_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15

# 更新 .env 文件
DATABASE_URL="postgresql://webai_user:your_password@localhost:5432/webai_db?schema=public"
```

## 云数据库配置

### Railway

```bash
# 从 Railway 获取连接字符串
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
```

### Supabase

```bash
# 从 Supabase 获取连接字符串
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

### Neon

```bash
# 从 Neon 获取连接字符串
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

## API 端点

### 注册用户

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

### 用户登录

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

### 获取当前用户信息

```
GET /api/auth/me
Authorization: Bearer your_jwt_token
```

## 功能特性

- ✅ 用户注册和登录
- ✅ JWT 认证
- ✅ 密码加密 (bcryptjs)
- ✅ 输入验证
- ✅ 错误处理
- ✅ TypeScript 支持
- ✅ Prisma ORM
- ✅ PostgreSQL 数据库
- ✅ 自动数据库初始化
- ✅ 数据库迁移管理

## 安全特性

- 密码使用 bcryptjs 加密（salt rounds: 12）
- JWT token 有效期配置
- 输入验证和清理
- 错误消息统一处理
- SQL 注入防护（Prisma ORM）

## 故障排除

### 连接错误

```bash
# 检查数据库连接
pnpm db:studio

# 如果连接失败，检查：
# 1. DATABASE_URL 是否正确
# 2. 数据库服务是否运行
# 3. 防火墙设置
# 4. 网络连接
```

### 重置所有数据

```bash
# 完全重置数据库
pnpm db:reset

# 重新初始化
pnpm db:init
```
