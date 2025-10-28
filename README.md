基于 Node.js + Vue 3 + TypeScript + Uniapp 的乡村基础教育智能评估

## 项目结构

```
project/
├── API/                    # 后端服务 (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   └── app.ts          # 应用入口
│   ├── package.json
│   └── tsconfig.json
├── admin/                  # 后台管理系统 (Vue 3 + TypeScript)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── hyzh-app/               # 移动端应用 (Uniapp + TypeScript)
│   ├── src/
│   ├── pages/
│   ├── static/
│   ├── package.json
│   └── manifest.json
├── hyzh-platform/          # 前台页面 (Vue 3 + TypeScript)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 技术栈

- **后端**: Node.js + Express + TypeScript + MySQL
- **管理后台**: Vue 3 + TypeScript + Element Plus
- **前台页面**: Vue 3 + TypeScript
- **移动端**: Uniapp + TypeScrip

## 启动方式

### 1. 后端服务启动 (API)

```bash
# 进入后端目录
cd API

# 安装依赖
npm install

### 2. 管理后台启动 (admin)

```bash
# 进入管理后台目录
cd admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 前台页面启动 (hyzh-platform)

```bash
# 进入前台页面目录
cd hyzh-platform

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. 移动端启动 (hyzh-app)

```bash
# 进入移动端目录
cd hyzh-app

# 安装依赖
npm install

# 启动微信小程序开发
npm run serve

```

### 5. 一键启动所有服务

```bash
# 安装并发工具
npm install -g concurrently

# 启动所有服务
concurrently \
  "cd API && node server" \
  "cd admin && npm run dev" \
  "cd hyzh-platform && npm run dev" \
  "cd hyzh-app && npm run serve"
```

## 环境要求

- **Node.js**: 20+
- **npm**: 8+
- **数据库**: MySQL 8.0+


## 开发顺序

1. 先启动后端服务 (API)
2. 再按需启动前端项目
3. 确保数据库服务正常运行
4. 各前端项目共享同一套后端 API
