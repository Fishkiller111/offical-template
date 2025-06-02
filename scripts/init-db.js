#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 开始初始化数据库...');

// 检查 .env 文件是否存在
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env 文件不存在，请先创建并配置数据库连接');
  process.exit(1);
}

// 读取环境变量
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL 环境变量未设置');
  process.exit(1);
}

console.log(`📡 连接数据库: ${DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);

try {
  // 生成 Prisma 客户端
  console.log('📦 生成 Prisma 客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 推送数据库结构
  console.log('🗄️  推送数据库结构...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log('✅ 数据库初始化完成！');
  console.log('🎯 你现在可以运行以下命令：');
  console.log('   pnpm dev          - 启动开发服务器');
  console.log('   pnpm db:studio    - 打开数据库管理界面');
  console.log('   pnpm db:reset     - 重置数据库');

} catch (error) {
  console.error('❌ 数据库初始化失败:', error.message);
  process.exit(1);
} 