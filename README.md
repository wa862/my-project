这个模板应该可以帮助你开始在 Vite 中使用 Vue 3 进行开发。

推荐的 IDE 设置
VSCode + Volar（并禁用 Vetur）。

TS 中导入的类型支持.vue
默认情况下，TypeScript 无法处理导入的类型信息，因此我们将 CLI 替换为 for 类型检查。在编辑器中，我们需要 Volar 使 TypeScript 语言服务能够识别类型。.vuetscvue-tsc.vue

自定义配置
参见 Vite 配置参考。

项目设置
npm install
编译和热重载以进行开发
npm run dev
类型检查、编译和缩小以用于生产
npm run build
使用 Vitest 运行单元测试
npm run test:unit
使用 Playwright 运行端到端测试
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
使用 ESLint 的 Lint
npm run lint
