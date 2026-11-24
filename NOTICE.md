# 素材与归属说明

## 视觉素材

本插件不附带任何图片、视频、音频或字体文件。界面上看到的所有图形都由以下方式在运行时生成：

- **CSS 渐变与遮罩**：太阳、天空、地平线、透视网格、光晕
- **手写 SVG**：棕榈剪影、城市天际线、装饰星点（`src/client/core/art.js`）
- **SVG 滤镜**：颗粒噪点，由 `feTurbulence` 在浏览器内实时生成

这些几何与配色为本项目原创，随代码一起以 MIT 许可证发布。

## 风格说明

主题采用 1980 年代迈阿密霓虹 / 日落风格（"synthwave" 一类通用的视觉语言）。
该风格本身属于公有领域的视觉惯例，不来源于任何单一作品。

本插件与 Rockstar Games、Take-Two Interactive 或 DeepSeek 均无关联，未获其背书或赞助，
也不包含任何游戏代码、角色形象、宣传素材或音乐。

## 依赖

运行时无第三方依赖。构建期使用 [esbuild](https://esbuild.github.io/)（MIT）与
`@deepseek-ai/schemastery`（随 DeepSeek Harness 提供）。
