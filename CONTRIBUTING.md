# 参与开发

[English](CONTRIBUTING.en.md)

## 环境

- Node.js `>= 24.9.0`
- DeepSeek Harness `>= 0.2.0 < 0.3.0`（运行插件需要）

```bash
npm install
npm run build   # 生成 index.js、client.js
npm run check   # build + 语法检查
```

`index.js` 与 `client.js` 是构建产物，随仓库提交。**不要手改这两个文件**——改 `src/` 之后重新构建。

改完要重载插件才生效，只刷新页面不会清掉已缓存的模块。

## 目录结构

```text
src/
  host/index.cjs            # 宿主入口与配置 schema
  shared/constants.js       # 插件 id、素材路径、默认值
  client/
    index.js                # 客户端入口，只负责组装与生命周期
    core/
      run-signal.js         # 运行状态：一个 observer，多订阅者
      session-state.js      # 会话数据：标题 / token / 模型
      art.js                # 原创 SVG：棕榈、天际线、雷达、星点
    features/
      theme/                # 设计 token 覆盖与配色
      conversation/         # 消息气泡与正文排版
      tools/                # 工具调用行的动作分色
      wanted/               # 通缉星级，订阅 run-signal
      panel/                # 右栏仪表盘，订阅 session-state
      pet/                  # 桌面宠物
      brand/                # 标识语替换
      scene/                # 主视觉横幅与空状态
      intro/                # 开场动画
      motion/               # 进场动画与扫光
market/index.json           # 应用内市场索引（format 1）
docs/shots/                 # README 截图
```

## 约定

- CSS 一律带 `vice-` 命名空间或 `body[data-vice-*]` 作用域，不污染全局元素。
- 选择器挂 `data-*` 语义标记，不绑哈希类名。宿主用的是 CSS Modules，类名带哈希，绑上去等于它一发版就废。
- 需要加内边距又要保持布局时，用 `padding` + 等量负 `margin` 抵消。
- 每个 feature 的清理函数必须完整释放监听器、Observer 与注入的样式。
- 不扫描页面文字推断状态；只读宿主自己的服务与控件。

## 性能

流式回复时页面一秒可能变上百次。所以：

- 整个文档只挂一个 MutationObserver，在 `core/run-signal.js` 里带防抖，需要状态的功能都订阅它，不要各自再监听一遍。
- 会话数据走 `session-state.js`，同样只订阅一次。

## 提 PR 之前

1. `npm run check` 通过
2. 在真实的 DSH 里装一遍，确认开关都能关掉、关掉之后界面恢复原样
3. 如果动了样式选择器，说明一下它挂的是哪个 `data-*` 标记

新增依赖之前先想一下：这个项目目前运行时零依赖，构建期只有 esbuild。
