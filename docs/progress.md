# 进度

更新于 2026-11-27。

## 版本

| 版本 | 日期 | 内容 |
|---|---|---|
| 0.1.0 | 11-25 | 首次发布 |
| 0.1.1 | 11-25 | README 收紧 |
| 0.1.2 | 11-26 | README 重写，补英文版 |
| 0.1.3 | 11-27 | 一次性 star 提示条、空状态页入口、三处描述统一 |
| 0.1.4 | 11-27 | 删除两个 README 中已过时的 24h 门槛章节，同步 npm/GitHub/包内说明 |

npm `latest` 当前指向 0.1.4。

> 宿主内置 pnpm 只选发布满 24 小时的版本。新版发布后的头一天，
> `dsh plugin add dsh-gta6` 会装到上一版；显式写 `'dsh-gta6@^0.1.3'` 可立即安装。

**2026-11-27 实测修正**：在宿主 `@deepseek-ai/dsh@0.2.2-rc.5` 上，CLI 路径
`dsh plugin --profile <p> add dsh-gta6` **直接装到 0.1.3**（发布仅约 1.5 小时），
24h 门槛未生效；profile 的 pnpm-workspace.yaml 无 minimumReleaseAge，
dsh-app-boot/dsh CLI 源码里也没有设置点（门槛描述只出现在应用内插件市场相关包）。
旧观察（11-26 装出 0.1.0）应来自更早的宿主版本或应用内市场路径。
验证链：npm 安装 0.1.3 → `--dump-config` 出现 `# == dsh-gta6` 补丁条目 →
index.js/client.js 语法检查通过 → 素材文件齐全。测试环境 /tmp/dsh-verify（隔离 DSH_HOME）。
进一步核实：用户真实 profile（~/.dsh/profiles/web、desktop）的 pnpm-workspace.yaml 同样无门槛；
npmmirror 在 0.1.3 发布 11 秒后即同步；应用内「添加插件」对话框按包名直接从 npmjs/npmmirror 安装，两个源都有 0.1.3。
当前宿主没有官方默认市场索引，「发现」页由自定义索引驱动（仓库自带 market/index.json）。
**决定：掘金稿删掉 24h 门槛段落**，安装段改为「应用内添加插件对话框输入 dsh-gta6」+ CLI 两条路径，已推送（与标题修改同轮重审）。
README 的「装出来是旧版本？」章节已从中英两版删除（只删不改），随 0.1.4 发布同步到 npm、GitHub 和包内 README；market/index.json 与 package.json 描述本就不含门槛内容，无需改。
上方旧版门槛说明保留作历史参考（11-26 观察来自更早宿主版本）。

## GitHub 投稿

投稿媒介都在 GitHub 上，但性质分两类：插件目录是 PR 改条目文件，通用渠道是 issue 表单。后者不限于 DSH 生态，面向的是所有开源项目。

### 插件目录（PR）

| 渠道 | 体量 | 方式 | 状态 |
|---|---|---|---|
| `awesome-dsh-plugin/awesome-dsh-plugin` | 25.6k | [PR #19009](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/19009) | 已合并 |
| `walkinglabs/awesome-deepseek-harness-plugins` | 57 | [PR #168](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/pull/168) | 已合并 |
| `billLiao/awesome-dsh-plugin` | 24 | [PR #41](https://github.com/billLiao/awesome-dsh-plugin/pull/41) | 已收录（PR 因自动同步而关闭） |
| `0xsline/awesome-deepseek-harness` | 1.4k | [PR #885](https://github.com/0xsline/awesome-deepseek-harness/pull/885) | 待审 |
| `Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins` | 572 | [PR #129](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/pull/129) | 待审 |
| `beancookie/awesome-dsh-plugin` | 198 | [PR #316](https://github.com/beancookie/awesome-dsh-plugin/pull/316) | 待审 |
| `kejixiaoliang/awesome-dsh-plugins` | 85 | [PR #237](https://github.com/kejixiaoliang/awesome-dsh-plugins/pull/237) | 待审 |
| `awesome-deepseekharness/awesome-deepseek-harness` | 47 | [PR #245](https://github.com/awesome-deepseekharness/awesome-deepseek-harness/pull/245) | 待审 |

### 通用渠道（issue）

| 渠道 | 体量 | 方式 | 状态 |
|---|---|---|---|
| HelloGitHub | 191k | [issue #4533](https://github.com/521xueweihan/HelloGitHub/issues/4533) | 待审 |
| 阮一峰《科技爱好者周刊》 | — | [issue #13768](https://github.com/ruanyf/weekly/issues/13768) | 待审 |
| GitHubDaily | 48.6k | [issue #1449](https://github.com/GitHubDaily/GitHubDaily/issues/1449) | 待审 |
| OpenGithubs/weekly（GitHub 精选开源项目周刊） | 1.9k | [issue #225](https://github.com/OpenGithubs/weekly/issues/225) | 待审 |

四家都走 issue，不进代码仓库，不涉及 fork、PR 或冲突。HelloGitHub 用固定表单，其余三家自由正文，标题按各自惯例带【开源自荐】。

活跃度核实（2026-11-27）：

- GitHubDaily 仓库代码 2025-12-31 后未推送，但维护者持续处理投稿 issue（最近关闭 11-18、11-26），投稿渠道活跃。
- OpenGithubs/weekly 代码 11-24 有推送，issue 区每日有新投稿，活跃。
- 「AI 工具月报」类：未找到仍在维护的独立 GitHub 刊物，HelloGitHub 月刊已覆盖此类受众，不另投。

#1449 与 #225 初投时只有深色截图，11-27 已按 promo.md 规则补上浅色图（`overview-light.jpg`），四家 issue 投稿现在都深浅两图齐全。

### 未投

| 渠道 | 原因 |
|---|---|
| `fendouai/awesome-deepseek-harness` | 条目在一个 8.4 MB 的 `data/plugins.json` 里，且 schema 要求 10 个必填字段，改动成本高、冲突风险大 |
| `bruc3van/awesome-dsh-plugin-pro` | 自荐位要求仓库 star > 10，CI 自动核验，当前 1 |
| `Dominic789654/awesome-deepseek-harness` | 投稿是改 2 MB 的 README，且按 star 排序，新项目沉底 |
| `Alex-Yanggg/awesome-DSH-plugin` | 2026-08-15 后无提交，已停更 |
| `libukai/awesome-deepseek-harness` | 386 star 但 2026-09-12 后无提交，已停更 |

## 站外平台

| 平台 | 状态 |
|---|---|
| Reddit `r/SideProject` | 已发帖，发后被 Reddit 自动垃圾过滤删除（`removed_by_category: reddit`），账号太新 |
| Reddit `r/coolgithubprojects` | 表单已填好，卡在 reCAPTCHA |
| Reddit 版主私信 | `reddit.com/mail/compose` 持续返回 Server error，未发 |
| 知乎 | 草稿已建但编辑器不接受自动化操作，正文见 [zhihu.md](zhihu.md)，需手动粘贴 |
| 掘金 | **已过审上线**：https://juejin.cn/post/7712756337687871514 。现行标题《给 DeepSeek Harness 换上 GTA 6 皮肤：Agent 一干活，通缉星级就亮》，标题修改版在重审（线上暂显旧题「开源自荐：dsh-gta6…」+「文章有更新」提示，重审过后自动切换；预览 /spost/ 同 id）。稿件见 [juejin.md](juejin.md)：主稿开场 + README 功能段 + 安装说明。初版技术长文被否，留档 [juejin-tech.md](juejin-tech.md)。走浏览器登录态调内部 API（article_draft/create/update → article/publish），分类「前端」，标签「前端/JavaScript/开源」。三张截图已验证可加载。注意：draft/update 只传部分字段会清掉分类，导致 publish 报 1002「至少添加一个分类」，更新必须带全 category_id/tag_ids |
| 小红书 / 微博 / X / V2EX | 未发，稿件见 [promo.md](promo.md) |

### 掘金博主渠道（2026-11-27 调研）

| 博主 | 活跃度 | 接触渠道 | 状态 |
|---|---|---|---|
| 逛逛GitHub（2766 订阅，周更 2–3 篇） | 活跃，4 天前刚发 GTA 6 移植 PC 项目盘点，题材高度对口 | 同名微信公众号；掘金私信（作者 id 1442202996186093） | 私信稿已备，待确认发送 |
| GitHubDaily 掘金专栏 | 与 GitHub 仓库同源 | GitHub issue（官方渠道） | 已投 #1449，不重复投 |
| 学习周刊 / GitHub 热榜日榜类 | 个人学习记录或自动榜单 | 无公开投稿入口 | 不投 |

## 收尾

- GitHub Contributors 面板有缓存，记录重写后最长 24 小时才刷新
- `~/Desktop/gta6/` 下仍留有改名前的 `dsh-theme-gta6`、`dsh-theme-vice` 两个目录，未清理

## 数据

- GitHub star：1
- npm 上周下载：393（统计区间 11-19 至 11-25）

下载量明显高于 star 的量级，说明有实际安装，只是 star 转化还没跟上。
