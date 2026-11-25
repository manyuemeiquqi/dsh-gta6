# dsh-theme-vice

DeepSeek Harness 的 Vice City 主题：官方 GTA VI 主视觉、通缉星级、右栏画报、开场动画。

配色、排版与交互全部由 CSS 与手写 SVG 实现，运行时无第三方依赖。

> 素材归属见 [NOTICE.md](NOTICE.md)。界面美术来自 Rockstar 官方宣传物料，著作权归
> Rockstar Games 与 Take-Two Interactive，不在 MIT 许可范围内。

## 效果

**会话**

- 顶部标题区换成官方主视觉横幅，替代默认的「探索未至之境」字样
- 用户消息做成简报卡：霓虹描边与右缘信号条
- 代码块使用改写的 Shiki 配色，行内代码保持可读对比度
- 工具调用行按动作着色：思考紫、读取青、搜索蓝、编辑绿、命令琥珀、规划玫红
- Agent 运行中，工具行色带扫光

**通缉星级**

右侧边栏顶部与状态条上的六颗星，跟随 Agent 真实状态：开始生成时亮到 6 星，结束即归零。
判定只读宿主自己的「停止生成」控件，不扫描消息内容。

**右栏画报**

「Vice City」标签页：主视觉卡片、雷达与电台、速度表、格子旗分隔、VCPD 警灯、
载具与海滩画报。Agent 运行中警灯闪烁、速度表指针摆动。

**桌面宠物**

右下角的 Jason 与 Lucia，取自 Rockstar 官方主视觉插画（不是实拍截图——插画的轮廓和表情在小尺寸下
才立得住）。空闲时轻轻摇晃并每隔一会儿在两张姿态间切换，Agent 开始工作时来回浮动，结束瞬间跳两下，
久无操作会犯困；鼠标移上去会抬头看你。可以拖动到任意位置，靠近屏幕边缘会自动吸附，位置记在本地；
点一下会说一句台词。

**开场动画**

首次加载时五块主视觉碎片拼合、标识放大、扫描线扫过，约 3 秒后消散。

**其他**

- 浅色 / 深色各一套配色，跟随系统
- 侧栏标识替换为 VI 标识与字标
- 全部动效遵循 `prefers-reduced-motion`，系统开启减少动态效果时自动静止

## 环境要求

- DeepSeek Harness `>= 0.2.0 < 0.3.0`
- Node.js `>= 24.9.0`（仅构建期需要）

## 安装

```bash
dsh plugin --profile <profile> add github:manyuemeiquqi/dsh-theme-vice
```

装好后在 profile 的 `package.json` 里确认已列入 bundles：

```json
{
  "dependencies": { "dsh-theme-vice": "github:manyuemeiquqi/dsh-theme-vice" },
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

改过代码后重新 `npm run build` 并重载插件；只重载页面不会清掉已缓存的模块。

## 配置

设置 → 插件 → Vice City 主题：

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `enabled` | `1` | 启用配色替换与界面装饰 |
| `background` | `1` | 显示主视觉横幅、右栏画报与空状态场景 |
| `opacity` | `72` | 背景不透明度（0–100） |
| `blur` | `0` | 背景模糊（0–24px） |
| `glow` | `1` | 标题、边框与按钮的霓虹光晕 |
| `motion` | `1` | 消息进场动画与工具行扫光 |
| `intro` | `1` | 开场动画 |
| `pet` | `1` | 右下角桌面宠物（Jason 与 Lucia） |

## 开发

```bash
npm install
npm run build   # 生成 index.js、client.js
npm run check   # build + 语法检查
```

`index.js` 与 `client.js` 是构建产物，随仓库一起提交，不要手改。

## 目录

```text
src/
  host/index.cjs            # 宿主入口与配置 schema
  shared/constants.js       # 插件 id、素材路径、默认值
  client/
    index.js                # 客户端入口，只负责组装与生命周期
    core/
      art.js                # 原创 SVG：棕榈、天际线、雷达、星点、颗粒
      config-store.js       # 配置订阅与乐观写入
      styles.js             # 样式注入
    features/
      theme/                # token 覆盖、外壳表面、排版
      conversation/         # 正文、代码块、行内代码、用户气泡
      tools/                # 工具调用行按动作着色
      wanted/               # 通缉星级与运行状态判定
      panel/                # 右栏 Vice City 画报
      pet/                  # 桌面宠物（拖动、状态联动、台词）
      brand/                # 侧栏标识替换
      scene/                # 主视觉横幅与空状态场景
      intro/                # 开场动画
      motion/               # 进场动效
scripts/build.mjs           # esbuild 打包（IIFE，CSS 走 text loader）
lib/assets/                 # 官方宣传素材，见 NOTICE.md
```

## 约定

- CSS 一律带 `vice-` 命名空间或 `body[data-vice-*]` 作用域，不污染全局元素。
- 选择器优先挂宿主的 `data-*` 语义标记（`data-process-activity`、`data-message-bubble`
  等），不绑哈希类名——那份类名每次发版都变。
- 需要加内边距又要保持布局时，用 `padding` + 等量负 `margin` 抵消，不改动原有盒模型。
- 每个 feature 的清理函数必须完整释放监听器、Observer 与注入的样式。
- 不扫描页面文字推断状态；只读宿主自己的控件与本插件的配置。

许可证见 [LICENSE](LICENSE)。
