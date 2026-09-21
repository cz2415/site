/**
 * 国际化词条。
 *
 * 设计约定：
 * - 词条是「结构等价」的：zh 与 en 的键完全一致，缺失键在开发期会回退到 zh。
 * - 带大写后缀的键（如 sl.key.ctrlS）是快捷键之类的固定标记，两语言共用同一份。
 * - 数据数组（features / commands / shortcuts）用同序数组表达，索引一一对应，
 *   避免在 HTML 里重复一遍结构。
 */
export const messages = {
  zh: {
    "meta.title": "Scratch Pad — 打开即写，写完即走",
    "meta.description":
      "Scratch Pad 是一款轻量、键盘优先、本地优先的桌面富文本编辑器——高频操作皆有键位且可查可改。打开即写，写完即走。",

    "brand.name": "Scratch Pad",
    "brand.tagline": "桌面速记编辑器",

    "nav.features": "特性",
    "nav.commands": "命令",
    "nav.shortcuts": "快捷键",
    "nav.format": "文件格式",
    "nav.roadmap": "路线图",
    "nav.download": "下载",

    "lang.switch": "切换语言",
    "lang.zh": "中文",
    "lang.en": "EN",

    "hero.badge": "Tauri 2 · Vue 3 · Tiptap 3",
    "hero.title1": "打开即写，",
    "hero.title2": "写完即走。",
    "hero.lead":
      "一款轻量、键盘优先、本地优先的桌面富文本编辑器。保存、打开、切换标签、加粗、导出——高频动作全部落在键盘上。没有账号、没有云同步、没有项目管理——只有一个光标在等你。",
    "hero.ctaPrimary": "下载 Windows 版",
    "hero.ctaSecondary": "查看特性",
    "hero.note": "v0.1.0 · Windows 系统 WebView2 · 安装包体积小、冷启动快",
    "hero.stat1.value": "0",
    "hero.stat1.label": "账号与登录",
    "hero.stat2.value": "0",
    "hero.stat2.label": "后台网络请求",
    "hero.stat3.value": "8",
    "hero.stat3.label": "支持的图片格式",
    "hero.windowTitle": "scratch-pad",

    "philosophy.kicker": "核心理念",
    "philosophy.title": "Open. Edit. Leave.",
    "philosophy.lead":
      "Scratch Pad 不试图成为你的第二大脑。它只解决一件事：让一个念头从脑子里到屏幕上的距离最短。",
    "philosophy.p1.title": "不做项目管理",
    "philosophy.p1.desc":
      "没有工作区、没有看板、没有层级目录。新建即空白文档，关掉即释放。",
    "philosophy.p2.title": "不劫持你的文件",
    "philosophy.p2.desc":
      "文档以标准 HTML 导出，在任何编辑器里都能打开。原生格式只是更快的容器，不是牢笼。",
    "philosophy.p3.title": "不打扰你的手",
    "philosophy.p3.desc":
      "所有高频操作都落在键盘上。鼠标是可选配件，不是必需品。",

    "features.kicker": "特性",
    "features.title": "为「快」而做的取舍",
    "features.lead": "每一个功能都经过同一道筛子：它是否让打开、编辑或离开变得更快？",

    "f1.title": "真正的桌面应用",
    "f1.desc":
      "基于 Tauri 2 与系统 WebView2，不是套壳网页。Rust 负责文件与系统能力，安装包与内存占用都保持在轻量水位。",
    "f2.title": "多标签同时开工",
    "f2.desc":
      "中键关闭、右键菜单、Ctrl+Tab 循环、Ctrl+1…9 直跳。每个标签保有自己的撤销历史、光标与滚动位置，切回来就像没离开过。",
    "f3.title": "斜杠命令，不离开键盘",
    "f3.desc":
      "在空行敲一个 /，标题、列表、表格、代码块、图片、标注块随打随选。支持中英文关键词与拼音式模糊匹配。",
    "f4.title": "图片随手拖进来",
    "f4.desc":
      "拖拽即插入。悬浮即出现工具栏：缩放、三向对齐、左右上下翻转、双向旋转 90°、点击查看大图。",
    "f5.title": "块级编辑",
    "f5.desc":
      "抓左侧手柄即可整块搬家，落点有清晰的横线指示。块菜单可转换类型、上色、创建副本——九种文字色与九种底色。",
    "f6.title": "原生 .scratch 格式",
    "f6.desc":
      "Magic + 版本号 + 分区 + CRC32 校验，正文经 MessagePack + Zstd 压缩，写入走临时文件改名。快、小、且不怕断电。",
    "f7.title": "全键盘操作",
    "f7.desc":
      "保存、打开、新建、切换标签、加粗、斜体、下划线、删除线、导出——高频动作全部落在 Ctrl 组合键上，窗口级统一注册，不触发 WebView 默认行为。Ctrl+Shift+P 唤起命令面板，全部键位随时可查。",
    "f8.title": "本地优先，断网可用",
    "f8.desc":
      "打开、编辑、保存、关闭全链路不依赖网络。没有任何后台请求，你的文字只存在于你的磁盘上。",
    "f9.title": "极简模式",
    "f9.desc":
      "标题栏与标签在不需要时隐去，鼠标靠近才浮现。屏幕上只剩下字——这才是一个编辑器该有的样子。",

    "commands.kicker": "斜杠命令",
    "commands.title": "一个斜杠，抵达任何块",
    "commands.lead": "以下命令均可在任意空行输入 / 后检索，中英文关键词皆可命中。",
    "commands.g1": "文本",
    "commands.g2": "列表",
    "commands.g3": "块",
    "commands.tableExtra": "3×3",
    "commands.headingsExtra": "H4–H6",
    "commands.hint": "支持 ← → 进入 / 退出子菜单，↑ ↓ 选择，Enter 确认，Esc 取消。",

    "shortcuts.kicker": "快捷键",
    "shortcuts.title": "手不用离开键盘",
    "shortcuts.lead": "所有 Ctrl 系快捷键在窗口级统一注册，不会触发 WebView 的默认行为。",
    "shortcuts.groupFile": "文件",
    "shortcuts.groupTabs": "标签",
    "shortcuts.groupFormat": "格式",
    "shortcuts.file.newTab": "新建标签",
    "shortcuts.file.open": "打开文档",
    "shortcuts.file.save": "保存",
    "shortcuts.file.saveAs": "另存为",
    "shortcuts.file.export": "导出 HTML",
    "shortcuts.tabs.next": "下一个标签",
    "shortcuts.tabs.prev": "上一个标签",
    "shortcuts.tabs.jump": "跳到第 n 个标签",
    "shortcuts.tabs.last": "跳到最后一个标签",
    "shortcuts.tabs.close": "关闭当前标签",
    "shortcuts.format.bold": "加粗",
    "shortcuts.format.italic": "斜体",
    "shortcuts.format.underline": "下划线",
    "shortcuts.format.strike": "删除线",

    "format.kicker": "文件格式",
    "format.title": ".scratch 是怎么装下你的文档的",
    "format.lead":
      "原生格式面向体积、读写速度与数据完整性设计，不承担通用交换格式的职责。",
    "format.col.field": "分区",
    "format.col.size": "长度",
    "format.col.desc": "说明",
    "format.magic": "文件标识",
    "format.magicDesc": "固定为 SCRT，用于秒判文件是否属于本应用",
    "format.version": "格式版本",
    "format.versionDesc": "小端无符号整数，高于当前版本时拒绝打开而非猜测解析",
    "format.flags": "标志位",
    "format.flagsDesc": "第 0 位预留给加密，v1 恒为 0",
    "format.metaLen": "元数据长度",
    "format.metaDesc": "元数据分区字节数",
    "format.contentLen": "正文长度",
    "format.contentDesc": "正文分区字节数",
    "format.metaPart": "元数据分区",
    "format.metaPartDesc": "MessagePack + Zstd。标题、创建时间、更新时间和 ULID 文档 ID",
    "format.contentPart": "正文分区",
    "format.contentPartDesc": "MessagePack + Zstd。带 schema 版本的编辑器快照",
    "format.crc": "校验和",
    "format.crcDesc": "CRC32，覆盖前面全部字节。任何一位翻转都会被拦下",
    "format.guarantee1.title": "原子写入",
    "format.guarantee1.desc":
      "先写同目录临时文件并落盘，再改名顶替。写入过程中崩溃，原文件依然完整，最坏只残留一个 .tmp。",
    "format.guarantee2.title": "分区独立压缩",
    "format.guarantee2.desc":
      "元数据与正文各自压缩。不加载正文也能读出标题与时间，列表页因此几乎零成本。",
    "format.guarantee3.title": "绝不猜测",
    "format.guarantee3.desc":
      "长度不足、标识不符、版本超前、校验失败——任何不一致都直接报错，不做尽力而为的解析。",
    "format.escape.title": "文档不会被锁死",
    "format.escape.desc":
      "原生保存与导入导出是两条独立路径。导出为 HTML 可以在任何浏览器、任何编辑器里打开。",
    "format.escape.tag1": "导入 HTML",
    "format.escape.tag2": "导出 HTML",
    "format.escape.tag3": "不静默丢失内容",

    "roadmap.kicker": "路线图",
    "roadmap.title": "正在做什么，以及不做什么",
    "roadmap.lead": "以下阶段按实际需求推进，不预先承诺时间。",
    "roadmap.stage": "阶段",
    "roadmap.status.done": "已完成",
    "roadmap.status.active": "进行中",
    "roadmap.status.planned": "计划中",
    "roadmap.s1.title": "编辑器内核",
    "roadmap.s1.desc":
      "Tauri + Vue + Tiptap，基本富文本、本地文件、多标签、块级编辑、图片处理。",
    "roadmap.s2.title": "桌面体验",
    "roadmap.s2.desc": "命令面板、侧边栏、最近文件、全局搜索、主题、设置、原生窗口行为。",
    "roadmap.s3.title": "命令面板与键位自定义",
    "roadmap.s3.desc":
      "命令面板可检索全部命令；键位查看与自定义；快捷键冲突检测。",
    "roadmap.s4.title": "AI 增强",
    "roadmap.s4.desc":
      "Ctrl+K 唤起 AI 命令，Provider 抽象（OpenAI / DeepSeek / GLM / Claude / 自定义兼容接口），修改一律先预览再应用。",
    "roadmap.s5.title": "导出与扩展",
    "roadmap.s5.desc": "Markdown、DOCX、PDF 导出链路，以及按真实需求决定的高级能力。",
    "roadmap.notTitle": "明确不做",
    "roadmap.not1": "用户账号与登录",
    "roadmap.not2": "多人实时协作",
    "roadmap.not3": "评论与审批流",
    "roadmap.not4": "云端知识库",
    "roadmap.not5": "插件市场",
    "roadmap.not6": "后台上传用户文档",

    "cta.title": "下一个念头，不必等它想清楚",
    "cta.desc":
      "本地优先、无账号墙、无后台请求。下载一个安装包，双击即可使用。",
    "cta.button": "下载 Windows 版",
    "cta.secondary": "阅读开发约定",

    "footer.product": "产品",
    "footer.resources": "资源",
    "footer.about": "关于",
    "footer.license": "授权方式",
    "footer.licenseValue": "免费试用 · 商业授权另行提供",
    "footer.format": "原生格式",
    "footer.formatValue": ".scratch v1",
    "footer.platform": "平台",
    "footer.platformValue": "Windows 优先 · macOS / Linux 计划中",
    "footer.copyright": "Scratch Pad. 本地优先的桌面速记编辑器。",
    "footer.builtWith": "Tauri 2 · Vue 3 · Tiptap 3 · Rust",
  },

  en: {
    "meta.title": "Scratch Pad — Open. Edit. Leave.",
    "meta.description":
      "Scratch Pad is a lightweight, keyboard-first, local-first desktop rich text editor — every frequent action has a shortcut, and every shortcut is visible and remappable. Open it, write, walk away.",

    "brand.name": "Scratch Pad",
    "brand.tagline": "Desktop scratch editor",

    "nav.features": "Features",
    "nav.commands": "Commands",
    "nav.shortcuts": "Shortcuts",
    "nav.format": "File format",
    "nav.roadmap": "Roadmap",
    "nav.download": "Download",

    "lang.switch": "Switch language",
    "lang.zh": "中文",
    "lang.en": "EN",

    "hero.badge": "Tauri 2 · Vue 3 · Tiptap 3",
    "hero.title1": "Open. Edit.",
    "hero.title2": "Leave.",
    "hero.lead":
      "A lightweight, keyboard-first, local-first desktop rich text editor. Save, open, switch tabs, bold, export — every frequent action lives on the keyboard. No account, no cloud sync, no project management — just a cursor waiting for you.",
    "hero.ctaPrimary": "Download for Windows",
    "hero.ctaSecondary": "See features",
    "hero.note": "v0.1.0 · Uses system WebView2 · Small installer, fast cold start",
    "hero.stat1.value": "0",
    "hero.stat1.label": "Accounts required",
    "hero.stat2.value": "0",
    "hero.stat2.label": "Background requests",
    "hero.stat3.value": "8",
    "hero.stat3.label": "Image formats",
    "hero.windowTitle": "scratch-pad",

    "philosophy.kicker": "Philosophy",
    "philosophy.title": "Open. Edit. Leave.",
    "philosophy.lead":
      "Scratch Pad does not try to be your second brain. It solves exactly one problem: shortening the distance between a thought and your screen.",
    "philosophy.p1.title": "No project management",
    "philosophy.p1.desc":
      "No workspaces, no boards, no nested trees. A new tab is a blank page; closing it releases everything.",
    "philosophy.p2.title": "Your files stay yours",
    "philosophy.p2.desc":
      "Documents export to standard HTML and open anywhere. The native format is a faster container, not a cage.",
    "philosophy.p3.title": "Your hands stay on the keys",
    "philosophy.p3.desc":
      "Every frequent action lives on the keyboard. The mouse is an optional accessory, not a requirement.",

    "features.kicker": "Features",
    "features.title": "Trade-offs made for speed",
    "features.lead":
      "Every feature passes the same filter: does it make opening, editing, or leaving faster?",

    "f1.title": "A real desktop app",
    "f1.desc":
      "Built on Tauri 2 and the system WebView2 — not a wrapped web page. Rust owns files and system capabilities, keeping both installer size and memory footprint low.",
    "f2.title": "Multiple tabs at once",
    "f2.desc":
      "Middle-click to close, right-click for the menu, Ctrl+Tab to cycle, Ctrl+1…9 to jump. Each tab keeps its own undo history, caret and scroll position — returning feels like you never left.",
    "f3.title": "Slash commands, hands on keys",
    "f3.desc":
      "Type / on an empty line for headings, lists, tables, code blocks, images and callouts. Searchable by English or Chinese keywords.",
    "f4.title": "Drop images straight in",
    "f4.desc":
      "Drag and drop to insert. Hover for the toolbar: resize, three-way alignment, flip both axes, rotate 90° either way, click to open full size.",
    "f5.title": "Block-level editing",
    "f5.desc":
      "Grab the left handle to move a whole block, with a clear drop line showing where it lands. Convert types, apply colour, duplicate — nine text colours and nine backgrounds.",
    "f6.title": "Native .scratch format",
    "f6.desc":
      "Magic, version, partitioned sections and a CRC32 checksum; body compressed with MessagePack + Zstd; writes go through a temp file rename. Fast, small, power-loss safe.",
    "f7.title": "Keyboard-complete",
    "f7.desc":
      "Save, open, new, switch tabs, bold, italic, underline, strike, export — every frequent action has a Ctrl binding, registered once at window level and never triggering WebView defaults. Ctrl+Shift+P opens the command palette; the full keymap is one keystroke away.",
    "f8.title": "Local-first, works offline",
    "f8.desc":
      "Open, edit, save and close never touch the network. There are no background requests — your words exist only on your disk.",
    "f9.title": "Minimal mode",
    "f9.desc":
      "The title bar and tabs fade away until your pointer approaches. What remains is text — which is what an editor should look like.",

    "commands.kicker": "Slash commands",
    "commands.title": "One slash to reach any block",
    "commands.lead":
      "Type / on any empty line and search. Both English and Chinese keywords match.",
    "commands.g1": "Text",
    "commands.g2": "Lists",
    "commands.g3": "Blocks",
    "commands.tableExtra": "3×3",
    "commands.headingsExtra": "H4–H6",
    "commands.hint":
      "Use ← → to enter or leave a submenu, ↑ ↓ to move, Enter to confirm, Esc to cancel.",

    "shortcuts.kicker": "Shortcuts",
    "shortcuts.title": "Your hands never leave the keyboard",
    "shortcuts.lead":
      "All Ctrl shortcuts are registered once at window level and never trigger WebView defaults.",
    "shortcuts.groupFile": "File",
    "shortcuts.groupTabs": "Tabs",
    "shortcuts.groupFormat": "Format",
    "shortcuts.file.newTab": "New tab",
    "shortcuts.file.open": "Open document",
    "shortcuts.file.save": "Save",
    "shortcuts.file.saveAs": "Save as",
    "shortcuts.file.export": "Export HTML",
    "shortcuts.tabs.next": "Next tab",
    "shortcuts.tabs.prev": "Previous tab",
    "shortcuts.tabs.jump": "Jump to tab n",
    "shortcuts.tabs.last": "Jump to last tab",
    "shortcuts.tabs.close": "Close current tab",
    "shortcuts.format.bold": "Bold",
    "shortcuts.format.italic": "Italic",
    "shortcuts.format.underline": "Underline",
    "shortcuts.format.strike": "Strikethrough",

    "format.kicker": "File format",
    "format.title": "How .scratch holds your document",
    "format.lead":
      "The native format is designed for size, read/write speed and data integrity — not as a general interchange format.",
    "format.col.field": "Section",
    "format.col.size": "Size",
    "format.col.desc": "Description",
    "format.magic": "Magic",
    "format.magicDesc": "Always SCRT — identifies the file as belonging to this app",
    "format.version": "Format version",
    "format.versionDesc":
      "Little-endian unsigned integer. A newer version is refused rather than guessed at",
    "format.flags": "Flags",
    "format.flagsDesc": "Bit 0 reserved for encryption; always 0 in v1",
    "format.metaLen": "Meta length",
    "format.metaDesc": "Byte length of the metadata section",
    "format.contentLen": "Content length",
    "format.contentDesc": "Byte length of the content section",
    "format.metaPart": "Metadata section",
    "format.metaPartDesc":
      "MessagePack + Zstd. Title, created/updated timestamps and a ULID document ID",
    "format.contentPart": "Content section",
    "format.contentPartDesc":
      "MessagePack + Zstd. A schema-versioned snapshot of the editor document",
    "format.crc": "Checksum",
    "format.crcDesc":
      "CRC32 over every preceding byte. A single flipped bit will be caught",
    "format.guarantee1.title": "Atomic writes",
    "format.guarantee1.desc":
      "Writes land in a temp file in the same directory, are flushed, then renamed into place. Crash mid-write and the original survives — at worst a .tmp remains.",
    "format.guarantee2.title": "Independent compression",
    "format.guarantee2.desc":
      "Metadata and content are compressed separately, so titles and timestamps can be read without loading the body — making list views nearly free.",
    "format.guarantee3.title": "Never guesses",
    "format.guarantee3.desc":
      "Short read, bad magic, future version, failed checksum — any inconsistency is an error. No best-effort parsing.",
    "format.escape.title": "Your documents are never locked in",
    "format.escape.desc":
      "Native saving and import/export are two independent paths. HTML export opens in any browser and any editor.",
    "format.escape.tag1": "Import HTML",
    "format.escape.tag2": "Export HTML",
    "format.escape.tag3": "No silent data loss",

    "roadmap.kicker": "Roadmap",
    "roadmap.title": "What we are building, and what we are not",
    "roadmap.lead": "Stages proceed on real need. No dates are promised in advance.",
    "roadmap.stage": "Stage",
    "roadmap.status.done": "Done",
    "roadmap.status.active": "In progress",
    "roadmap.status.planned": "Planned",
    "roadmap.s1.title": "Editor core",
    "roadmap.s1.desc":
      "Tauri + Vue + Tiptap, basic rich text, local files, multi-tab, block editing, image handling.",
    "roadmap.s2.title": "Desktop experience",
    "roadmap.s2.desc":
      "Command palette, sidebar, recent files, global search, themes, settings, native window behaviour.",
    "roadmap.s3.title": "Command palette & remapping",
    "roadmap.s3.desc":
      "A searchable command palette, a keymap viewer with remapping, and shortcut conflict detection.",
    "roadmap.s4.title": "AI augmentation",
    "roadmap.s4.desc":
      "Ctrl+K opens an AI command with a provider abstraction (OpenAI / DeepSeek / GLM / Claude / custom OpenAI-compatible). Every change is previewed before it is applied.",
    "roadmap.s5.title": "Export and extensions",
    "roadmap.s5.desc":
      "Markdown, DOCX and PDF export pipelines, plus advanced capabilities decided by actual demand.",
    "roadmap.notTitle": "Explicitly out of scope",
    "roadmap.not1": "User accounts and sign-in",
    "roadmap.not2": "Real-time collaboration",
    "roadmap.not3": "Comments and approval flows",
    "roadmap.not4": "Cloud knowledge base",
    "roadmap.not5": "Plugin marketplace",
    "roadmap.not6": "Uploading documents in the background",

    "cta.title": "The next thought shouldn't have to wait",
    "cta.desc":
      "Local-first, no account wall, no background requests. Download the installer and double-click.",
    "cta.button": "Download for Windows",
    "cta.secondary": "Read the conventions",

    "footer.product": "Product",
    "footer.resources": "Resources",
    "footer.about": "About",
    "footer.license": "Licensing",
    "footer.licenseValue": "Free trial · commercial licence available",
    "footer.format": "Native format",
    "footer.formatValue": ".scratch v1",
    "footer.platform": "Platforms",
    "footer.platformValue": "Windows first · macOS / Linux planned",
    "footer.copyright": "Scratch Pad. A local-first desktop scratch editor.",
    "footer.builtWith": "Tauri 2 · Vue 3 · Tiptap 3 · Rust",
  },
};

/** 支持的语言，顺序即切换按钮顺序 */
export const locales = ["zh", "en"];

/** 语言到 <html lang> 的映射 */
export const langTag = { zh: "zh-CN", en: "en" };

/**
 * 取词条。缺失时回退到中文，再缺失时原样返回 key（便于开发期发现遗漏）。
 */
export function translate(locale, key) {
  const dict = messages[locale] ?? messages.zh;
  if (key in dict) return dict[key];
  if (key in messages.zh) return messages.zh[key];
  return key;
}
