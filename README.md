# Scratch Pad 官方网站

静态官网，零依赖、零构建步骤。`index.html` 双击即可打开（用本地 http 服务打开体验更完整）。

## 目录

```
www/
├── index.html                  页面结构（文案全部由 data-i18n 标注，运行时填充）
├── css/styles.css              全部样式（设计令牌 + 亮暗双主题）
├── js/
│   ├── i18n.js                 中英词条表（158 键 × 2，结构等价）
│   └── app.js                  渲染与交互（i18n 引擎、结构化区块、滚动进场）
├── assets/
│   ├── favicon.svg
│   └── screenshots/            应用真实界面截图（亮 / 暗各一张）
└── .tools/cdp-shot.mjs         截图工具（见下）
```

## 本地预览

```bash
# 任选其一
npx serve .                    # 或
python -m http.server 8899
```

> 直接双击 `index.html` 也能用：脚本是原生 ES module，`file:` 协议下 Chrome/Edge 会拒绝加载
> 跨源模块。若一定要双击打开，请改用 http 服务。

## 中英文切换

- 右上角分段控件切换，选择记入 `localStorage`（键 `scratch-pad-site:locale`）。
- 也支持 URL 参数：`?lang=zh` / `?lang=en`，优先级高于本地存储。
- 切换时同步更新 `<html lang>`、`<title>`、导航、全部区块文案与命令/快捷键标签。

新增文案只需在 `js/i18n.js` 的 `zh` 与 `en` 里各加一条同键词条；结构等价是硬要求
（`zh` 与 `en` 的键集合必须完全一致），否则会出现半截翻译。

## 页面结构

| 区块 | 锚点 | 内容 |
| --- | --- | --- |
| Hero | `#top` | 定位语、下载入口、三条零值指标、应用窗口实拍 |
| 核心理念 | `#philosophy` | Open. Edit. Leave. 三条设计取舍 |
| 特性 | `#features` | 9 张特性卡（由 `app.js` 的 `FEATURES` 渲染） |
| 斜杠命令 | `#commands` | 文本 / 列表 / 块 三组，与 `slash/items.ts` 对应 |
| 快捷键 | `#shortcuts` | 文件 / 标签 / 格式 三组 `<kbd>` 胶囊 |
| 文件格式 | `#format` | `.scratch` 容器字节布局示意图 + 区段表 + 三条保证 |
| 路线图 | `#roadmap` | 五个阶段（含状态徽章）+ 明确不做清单 |
| 下载 | `#download` | 结尾 CTA |

## 设计约定

- 单一强调色 `#2383e2`（与桌面应用主题蓝一致），不做渐变堆砌。
- 发丝线分层，不用「大圆角 + 大阴影」的卡片堆；这是桌面编辑器官网，不是网页后台。
- 主题为**三态**：默认跟随系统 `prefers-color-scheme`，顶栏按钮可显式锁定亮 / 暗。
  选择写入 `localStorage`，并在 `<head>` 内联脚本中于首帧前恢复，避免主题闪一下。
  实现上只改写 CSS 令牌（`html[data-theme]`），不重建 DOM。
- 截图用 `<picture>` 按主题切换亮 / 暗两版，保证官网与截图观感统一。
- 无外部字体、无 CDN、无第三方 JS。整站 gzip 前 < 300 KB。

## 校验

`.tools/verify-site.mjs` 用无头浏览器做整页断言，覆盖：

- 中英文 × 亮暗四种组合下，各结构化区块的渲染数量一致且非空；
- 主题按钮的三态循环顺序（跟随系统 → 亮 → 暗 → 跟随系统）与 `localStorage` 持久化；
- 三种档位各显示不同图标；
- 页面正文不含已被移除的旧定位词（校验脚本内以正则断言）；CTA / 页脚不宣称开源；
- 控制台零报错。

```bash
node .tools/verify-site.mjs
```

退出码非 0 表示存在未通过项，逐条打印原因。

整页截图（可选，用于目视检查）：

```bash
node .tools/shot-site.mjs out.png zh light 1440 1000
CLIP=0,0,1440,560 node .tools/shot-site.mjs hero.png en dark   # 只截顶栏 + 首屏
```

## 截图如何更新

官网 hero 的应用截图由 `.tools/cdp-shot.mjs` 生成，它直连 Chrome DevTools Protocol：

```bash
node .tools/cdp-shot.mjs assets/screenshots/editor-light.png 1200 820 light
node .tools/cdp-shot.mjs assets/screenshots/editor-dark.png  1200 820 dark
```

前提：Scratch Pad 应用前端已在跑（`npm run tauri dev`，Vite 服务 `:1420`）。

脚本做三件事：新建标签页打开 `:1420` → 从 Vue 组件实例的 `ctx.editor` 拿到 Tiptap 实例、
把示例文档写入 → CDP 截屏（`deviceScaleFactor: 2`，`prefers-color-scheme` 由协议层模拟）。

若要改跑其它站点（例如截官网自身），把脚本里的 `TARGET_URL` 换成目标地址即可；
届时注入步骤会返回 `no-editor`，属预期，不影响截图。

> 注意：不要用 `agent-browser` 的多次 CLI 调用做「注入 + 截图」，它的守护进程在两次调用
> 之间会回到 `about:blank`，第二次调用必定落空。必须同一进程内连续完成。
