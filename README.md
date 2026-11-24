# dsh-theme-vice

DeepSeek Harness 的霓虹日落主题：日落配色、城市画报、启动动画和消息动效。

**所有视觉都是本仓库原创的 CSS 与手写 SVG**，不包含任何第三方图片、游戏素材或音乐。
包体里没有一个二进制媒体文件。

## 效果

- 全局配色替换（浅色 / 深色各一套，跟随系统）
- 空状态日落明信片：太阳、天际线、透视网格、棕榈剪影、颗粒噪点
- 原生右栏「Neon Coast」面板，复用同一套场景
- 首次加载的日落升起动画
- 消息进场的错峰 reveal
- 遵循 `prefers-reduced-motion`

## 安装

```bash
dsh plugin --profile <name> add dsh-theme-vice
```

或在 profile 的 `package.json` 里加入依赖与 bundle：

```json
{
  "dependencies": { "dsh-theme-vice": "^0.1.0" },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-theme-vice"
      ]
    }
  }
}
```

## 配置

宿主 schema 暴露以下开关（设置 → 插件）：

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `enabled` | `1` | 启用配色替换与界面装饰 |
| `background` | `1` | 显示空状态日落场景 |
| `opacity` | `72` | 背景不透明度（0–100） |
| `blur` | `0` | 背景模糊（0–24px） |
| `glow` | `1` | 标题、边框与按钮的霓虹光晕 |
| `motion` | `1` | 消息进场动画 |
| `intro` | `1` | 启动动画 |

## 开发

```bash
npm install
npm run build   # 生成 index.js、client.js
npm run check   # build + 语法检查
```

改 `src/` 后必须重新 `npm run build`，再在 DSH 里重载插件。
`index.js` 与 `client.js` 是构建产物，不要手改。

## 目录

```text
src/
  host/index.cjs            # 宿主入口与配置 schema
  shared/constants.js       # 插件 id、默认值、状态枚举
  client/
    index.js                # 客户端入口，只负责组装
    core/
      art.js                # 原创 SVG 几何（棕榈、天际线、颗粒）
      config-store.js       # 配置订阅与乐观写入
      styles.js             # 样式注入
    features/
      theme/                # token 覆盖、shell 表面、排版
      scene/                # 空状态日落明信片
      panel/                # 右栏 Neon Coast 面板
      intro/                # 启动动画
      motion/               # reveal 动效
scripts/build.mjs           # esbuild 打包
```

## 约定

- CSS 一律带 `vice-` 命名空间或 `body[data-vice-*]` 作用域，不污染全局元素。
- 每个 feature 的清理函数必须完整释放监听器、Observer 与注入的样式。
- 不扫描页面文字推断状态；只读本插件自己的配置。

许可证见 [LICENSE](LICENSE)，素材归属说明见 [NOTICE.md](NOTICE.md)。
