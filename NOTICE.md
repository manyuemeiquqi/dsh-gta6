# 素材与归属说明

## 官方美术素材

本插件的视觉素材来自 Rockstar Games 官方发布的 GTA VI 宣传物料，经授权在本项目中使用。

| 文件 | 内容 |
| --- | --- |
| `poster_full-25ce00b5d601.jpg` | 官方主视觉（宣传图拼贴） |
| `poster_logo-8eb6649ac961.png` | 官方 VI 标识（透明底，已裁去留白） |
| `jason-lucia-rooftop.webp` | Jason 与 Lucia 屋顶场景 |
| `vice-city.webp` | 「VISIT LEONIDA」Vice City 明信片 |
| `cheetah.webp` | Grotti Cheetah 宣传截图 |
| `vice-beach-night.webp` | Vice Beach 夜景截图 |
| `leonida-street.webp` | Leonida 街头人物截图 |
| `nightlife.webp` | Vice City 夜生活截图（未在界面中使用） |

原始来源：<https://www.rockstargames.com/VI>，逐项来源见 `lib/assets/NOTICE.txt`。

这些素材的著作权归 Rockstar Games 与 Take-Two Interactive 所有，不在本项目的 MIT 许可证覆盖范围内。

## 原创部分

以下内容为本项目原创，随代码一起以 MIT 许可证发布：

- 全部代码、配置与构建脚本
- 界面结构、排版与配色方案
- 运行时绘制的几何图形：雷达盘、通缉星级、装饰星点（`src/client/core/art.js`）
- SVG 颗粒噪点滤镜
- 启动动画的分镜、时间轴与过渡设计

## 风格与归属

本插件与 Rockstar Games、Take-Two Interactive 或 DeepSeek 均无隶属关系，未获其背书或赞助。

## 依赖

运行时无第三方依赖。构建期使用 [esbuild](https://esbuild.github.io/)（MIT）与
`@deepseek-ai/schemastery`（随 DeepSeek Harness 提供）。
