/**
 * 官网交互入口。
 *
 * 三件事：
 * 1. i18n：按词条表渲染所有文案，语言存 localStorage、同步 <html lang> 与 title。
 * 2. 结构化区块：特性 / 命令 / 快捷键 / 格式表 / 路线图的「结构」在这里定义一次，
 *    文案全部走 i18n，中英切换时只重渲染文本，不重排 DOM。
 * 3. 轻交互：顶栏滚动态、滚动进场、语言滑块位置。
 */
import { langTag, locales, translate } from "./i18n.js";

// ---------------------------------------------------------------------------
// 静态结构定义
// ---------------------------------------------------------------------------

/** 统一的描边图标（lucide 风格，24 视窗），与桌面应用的图标语言保持一致 */
function icon(inner) {
  return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"' +
    ` stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`
  );
}

/** 特性卡片：id 段决定图标与文案键 */
const FEATURES = [
  {
    key: "f1",
    icon: icon(
      '<rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" />' +
        '<path d="M7 13h4" /><path d="M7 16h7" />',
    ),
  },
  {
    key: "f2",
    icon: icon(
      '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />' +
        '<path d="M9 4v2" />',
    ),
  },
  {
    key: "f3",
    icon: icon('<path d="M5 19 15 5" /><path d="M17 11h4" /><path d="M19 9v4" /><path d="M5 12h5" />'),
  },
  {
    key: "f4",
    icon: icon(
      '<rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="1.8" />' +
        '<path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />',
    ),
  },
  {
    key: "f5",
    icon: icon(
      '<circle cx="6" cy="6" r="1.2" /><circle cx="6" cy="12" r="1.2" />' +
        '<circle cx="6" cy="18" r="1.2" /><path d="M11 6h9" /><path d="M11 12h9" /><path d="M11 18h6" />',
    ),
  },
  {
    key: "f6",
    icon: icon(
      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />' +
        '<path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h3" />',
    ),
  },
  {
    key: "f7",
    icon: icon(
      '<rect x="2" y="5" width="20" height="14" rx="2" />' +
        '<path d="M6 9h.01" /><path d="M10 9h.01" /><path d="M14 9h.01" /><path d="M18 9h.01" />' +
        '<path d="M6 13h.01" /><path d="M10 13h.01" /><path d="M14 13h.01" /><path d="M18 13h.01" />' +
        '<path d="M8 16.5h8" />',
    ),
  },
  {
    key: "f8",
    icon: icon(
      '<path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3.5 2" /><path d="M21 4v5h-5" />',
    ),
  },
  {
    key: "f9",
    icon: icon(
      '<circle cx="12" cy="12" r="3" /><path d="M3 7V5a2 2 0 0 1 2-2h2" />' +
        '<path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" />' +
        '<path d="M7 21H5a2 2 0 0 1-2-2v-2" />',
    ),
  },
];

/**
 * 斜杠命令。与桌面应用 `slash/items.ts` 的分组一一对应。
 * extra 是「标题之外还有信息」时才显示的补充说明（如表格 3×3）。
 */
const COMMAND_GROUPS = [
  {
    labelKey: "commands.g1",
    items: [
      { titleKey: "cmd.paragraph", fallback: { zh: "正文", en: "Paragraph" }, extraKey: null },
      { titleKey: "cmd.h1", fallback: { zh: "标题 1", en: "Heading 1" }, extraKey: null },
      { titleKey: "cmd.h2", fallback: { zh: "标题 2", en: "Heading 2" }, extraKey: null },
      { titleKey: "cmd.h3", fallback: { zh: "标题 3", en: "Heading 3" }, extraKey: null },
      {
        titleKey: "cmd.otherHeadings",
        fallback: { zh: "其他标题", en: "Other headings" },
        extraKey: "commands.headingsExtra",
      },
    ],
  },
  {
    labelKey: "commands.g2",
    items: [
      { titleKey: "cmd.bulletList", fallback: { zh: "无序列表", en: "Bullet list" }, extraKey: null },
      { titleKey: "cmd.orderedList", fallback: { zh: "有序列表", en: "Ordered list" }, extraKey: null },
      { titleKey: "cmd.divider", fallback: { zh: "分隔线", en: "Divider" }, extraKey: null },
    ],
  },
  {
    labelKey: "commands.g3",
    items: [
      { titleKey: "cmd.image", fallback: { zh: "图片", en: "Image" }, extraKey: null },
      { titleKey: "cmd.callout", fallback: { zh: "标注块", en: "Callout" }, extraKey: null },
      { titleKey: "cmd.blockquote", fallback: { zh: "引用", en: "Quote" }, extraKey: null },
      { titleKey: "cmd.codeBlock", fallback: { zh: "代码块", en: "Code block" }, extraKey: null },
      { titleKey: "cmd.table", fallback: { zh: "表格", en: "Table" }, extraKey: "commands.tableExtra" },
    ],
  },
];

/**
 * 快捷键。keys 是固定标记，两语言共用。
 * 键序列用数组表达，渲染时逐个包 <kbd>，用 "+" 连接。
 */
const SHORTCUT_GROUPS = [
  {
    titleKey: "shortcuts.groupFile",
    items: [
      { labelKey: "shortcuts.file.newTab", keys: ["Ctrl", "N"] },
      { labelKey: "shortcuts.file.open", keys: ["Ctrl", "O"] },
      { labelKey: "shortcuts.file.save", keys: ["Ctrl", "S"] },
      { labelKey: "shortcuts.file.saveAs", keys: ["Ctrl", "Shift", "S"] },
      { labelKey: "shortcuts.file.export", keys: ["Ctrl", "Shift", "E"] },
    ],
  },
  {
    titleKey: "shortcuts.groupTabs",
    items: [
      { labelKey: "shortcuts.tabs.next", keys: ["Ctrl", "Tab"] },
      { labelKey: "shortcuts.tabs.prev", keys: ["Ctrl", "Shift", "Tab"] },
      { labelKey: "shortcuts.tabs.jump", keys: ["Ctrl", "1…8"] },
      { labelKey: "shortcuts.tabs.last", keys: ["Ctrl", "9"] },
      { labelKey: "shortcuts.tabs.close", keys: ["Ctrl", "W"] },
    ],
  },
  {
    titleKey: "shortcuts.groupFormat",
    items: [
      { labelKey: "shortcuts.format.bold", keys: ["Ctrl", "B"] },
      { labelKey: "shortcuts.format.italic", keys: ["Ctrl", "I"] },
      { labelKey: "shortcuts.format.underline", keys: ["Ctrl", "U"] },
      { labelKey: "shortcuts.format.strike", keys: ["Ctrl", "Shift", "D"] },
    ],
  },
];

/** .scratch 容器分区表：顺序即磁盘上的字节顺序 */
const FORMAT_ROWS = [
  { nameKey: "format.magic", size: "4 B", descKey: "format.magicDesc" },
  { nameKey: "format.version", size: "2 B", descKey: "format.versionDesc" },
  { nameKey: "format.flags", size: "2 B", descKey: "format.flagsDesc" },
  { nameKey: "format.metaLen", size: "8 B", descKey: "format.metaDesc" },
  { nameKey: "format.contentLen", size: "8 B", descKey: "format.contentDesc" },
  { nameKey: "format.metaPart", size: "var", descKey: "format.metaPartDesc" },
  { nameKey: "format.contentPart", size: "var", descKey: "format.contentPartDesc" },
  { nameKey: "format.crc", size: "4 B", descKey: "format.crcDesc" },
];

const GUARANTEES = ["format.guarantee1", "format.guarantee2", "format.guarantee3"];

/** 路线图：status 决定徽章样式与文案键 */
const ROADMAP = [
  { key: "roadmap.s1", status: "done" },
  { key: "roadmap.s2", status: "active" },
  { key: "roadmap.s3", status: "planned" },
  { key: "roadmap.s4", status: "planned" },
  { key: "roadmap.s5", status: "planned" },
];

const OUT_OF_SCOPE = [
  "roadmap.not1",
  "roadmap.not2",
  "roadmap.not3",
  "roadmap.not4",
  "roadmap.not5",
  "roadmap.not6",
];

/**
 * 命令条目的补充词条。放在这里而不是 i18n.js 里，是因为它们只在官网出现，
 * 属于展示层的文案，不必污染应用侧的词条表。
 */
const EXTRA_MESSAGES = {
  zh: {
    "cmd.paragraph": "正文",
    "cmd.h1": "标题 1",
    "cmd.h2": "标题 2",
    "cmd.h3": "标题 3",
    "cmd.otherHeadings": "其他标题",
    "cmd.bulletList": "无序列表",
    "cmd.orderedList": "有序列表",
    "cmd.divider": "分隔线",
    "cmd.image": "图片",
    "cmd.callout": "标注块",
    "cmd.blockquote": "引用",
    "cmd.codeBlock": "代码块",
    "cmd.table": "表格",
    "hero.shotCaption": "真实运行界面 · 极简模式下标题栏随鼠标浮现",
    "alt.appWindow": "Scratch Pad 应用窗口截图",
    "theme.toggle.system": "主题：跟随系统（点击切换）",
    "theme.toggle.light": "主题：亮色（点击切换）",
    "theme.toggle.dark": "主题：暗色（点击切换）",
  },
  en: {
    "cmd.paragraph": "Paragraph",
    "cmd.h1": "Heading 1",
    "cmd.h2": "Heading 2",
    "cmd.h3": "Heading 3",
    "cmd.otherHeadings": "Other headings",
    "cmd.bulletList": "Bullet list",
    "cmd.orderedList": "Ordered list",
    "cmd.divider": "Divider",
    "cmd.image": "Image",
    "cmd.callout": "Callout",
    "cmd.blockquote": "Quote",
    "cmd.codeBlock": "Code block",
    "cmd.table": "Table",
    "hero.shotCaption": "The real interface · in minimal mode the title bar fades in on hover",
    "alt.appWindow": "Screenshot of the Scratch Pad application window",
    "theme.toggle.system": "Theme: follow system (click to change)",
    "theme.toggle.light": "Theme: light (click to change)",
    "theme.toggle.dark": "Theme: dark (click to change)",
  },
};

// ---------------------------------------------------------------------------
// i18n 记录与赋值
// ---------------------------------------------------------------------------

const STORAGE_KEY = "scratch-pad-site:locale";

/**
 * 把 i18n.js 的词条与展示层补充词条合并成一份查表函数。
 * 后者优先，避免为了官网几行文案去改应用侧词条表。
 */
function makeT(locale) {
  const extra = EXTRA_MESSAGES[locale] ?? {};
  return (key) => {
    if (key in extra) return extra[key];
    return translate(locale, key);
  };
}

/** 读取初始语言：URL 参数 > 本地存储 > 浏览器语言 > 中文 */
function resolveInitialLocale() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (locales.includes(fromUrl)) return fromUrl;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (locales.includes(saved)) return saved;
  } catch {
    // 隐私模式下 localStorage 不可用，继续走浏览器语言
  }

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("en")) return "en";
  return "zh";
}

let currentLocale = resolveInitialLocale();

/** 当前语言下的取词函数，供结构渲染复用 */
let t = makeT(currentLocale);

/**
 * 应用一次语言。
 *
 * - data-i18n / data-i18n-content / data-i18n-aria-label 三类标注自动填充
 * - 结构化区块重建内容（结构由本文件的常量决定，不依赖 DOM 初始状态）
 * - 同步 <html lang>、<title>、切换按钮状态
 */
function applyLocale(locale) {
  currentLocale = locale;
  t = makeT(locale);

  document.documentElement.dataset.locale = locale;
  document.documentElement.lang = langTag[locale] ?? "zh-CN";

  // 文本节点
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = t(el.dataset.i18n);
    if (value) el.textContent = value;
  });

  // content 属性（meta description）
  document.querySelectorAll("[data-i18n-content]").forEach((el) => {
    const value = t(el.dataset.i18nContent);
    if (value) el.setAttribute("content", value);
  });

  // aria-label 属性
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const value = t(el.dataset.i18nAriaLabel);
    if (value) el.setAttribute("aria-label", value);
  });

  // title 属性（用于无 aria 支持时的悬停提示）
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const value = t(el.dataset.i18nTitle);
    if (value) el.setAttribute("title", value);
  });

  renderFeatures();
  renderCommands();
  renderShortcuts();
  renderFormatTable();
  renderGuarantees();
  renderRoadmap();
  renderOutOfScope();

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const active = btn.dataset.langBtn === locale;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // 保存失败不影响本次会话
  }

  // 语言变化会改变文本长度，重新标记滚动进场元素
  observeReveals();
}

// ---------------------------------------------------------------------------
// 结构化区块渲染
// ---------------------------------------------------------------------------

function renderFeatures() {
  const grid = document.getElementById("featureGrid");
  if (!grid) return;
  grid.innerHTML = FEATURES.map(
    (f, i) => `
      <article class="feature reveal" style="transition-delay:${Math.min(i % 3, 2) * 60}ms">
        <span class="feature-icon" aria-hidden="true">${f.icon}</span>
        <h3>${t(`${f.key}.title`)}</h3>
        <p>${t(`${f.key}.desc`)}</p>
      </article>`,
  ).join("");
}

function renderCommands() {
  const wrap = document.getElementById("commandGroups");
  if (!wrap) return;
  wrap.innerHTML = COMMAND_GROUPS.map(
    (group) => `
      <section class="command-group reveal">
        <h3>${t(group.labelKey)}</h3>
        <ul class="command-list">
          ${group.items
            .map((item) => {
              const extra = item.extraKey ? t(item.extraKey) : "";
              return `<li>
                <span class="cmd-slash" aria-hidden="true">/</span>
                <span class="cmd-name">${t(item.titleKey)}</span>
                ${extra ? `<span class="cmd-extra">${extra}</span>` : ""}
              </li>`;
            })
            .join("")}
        </ul>
      </section>`,
  ).join("");
}

/** 把 ["Ctrl","Shift","S"] 渲染成 Ctrl + Shift + S 的按键胶囊序列 */
function renderKeys(keys) {
  return keys.map((k) => `<kbd>${k}</kbd>`).join(" + ");
}

function renderShortcuts() {
  const wrap = document.getElementById("shortcutColumns");
  if (!wrap) return;
  wrap.innerHTML = SHORTCUT_GROUPS.map(
    (group) => `
      <section class="shortcut-col reveal">
        <h3>${t(group.titleKey)}</h3>
        <ul class="shortcut-list">
          ${group.items
            .map(
              (item) => `<li>
                <span class="sc-label">${t(item.labelKey)}</span>
                <span class="sc-keys">${renderKeys(item.keys)}</span>
              </li>`,
            )
            .join("")}
        </ul>
      </section>`,
  ).join("");
}

function renderFormatTable() {
  const body = document.getElementById("formatRows");
  if (!body) return;
  body.innerHTML = FORMAT_ROWS.map(
    (row) => `<tr>
      <td>${t(row.nameKey)}</td>
      <td>${row.size}</td>
      <td>${t(row.descKey)}</td>
    </tr>`,
  ).join("");
}

function renderGuarantees() {
  const wrap = document.getElementById("guarantees");
  if (!wrap) return;
  wrap.innerHTML = GUARANTEES.map(
    (key, i) => `
      <article class="guarantee reveal">
        <p class="guarantee-num">${String(i + 1).padStart(2, "0")}</p>
        <h3>${t(`${key}.title`)}</h3>
        <p>${t(`${key}.desc`)}</p>
      </article>`,
  ).join("");
}

function renderRoadmap() {
  const list = document.getElementById("timeline");
  if (!list) return;
  list.innerHTML = ROADMAP.map(
    (stage, i) => `
      <li class="timeline-item reveal">
        <div class="timeline-head">
          <span class="timeline-stage">${t("roadmap.stage")} ${i + 1}</span>
          <span class="status status-${stage.status}">${t(`roadmap.status.${stage.status}`)}</span>
        </div>
        <div class="timeline-body">
          <h3>${t(`${stage.key}.title`)}</h3>
          <p>${t(`${stage.key}.desc`)}</p>
        </div>
      </li>`,
  ).join("");
}

function renderOutOfScope() {
  const list = document.getElementById("outOfScope");
  if (!list) return;
  list.innerHTML = OUT_OF_SCOPE.map((key) => `<li>${t(key)}</li>`).join("");
}

// ---------------------------------------------------------------------------
// 轻交互
// ---------------------------------------------------------------------------

/** 顶栏滚动态：离开首屏后加底色与发丝线 */
function initHeaderState() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const sync = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

/**
 * 滚动进场。
 *
 * 语言切换会重建区块 DOM，所以这里按需重建观察器；已在视口内的元素
 * 直接标记为可见，避免切换语言后内容「消失」。
 */
let revealObserver = null;

function observeReveals() {
  const targets = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  targets.forEach((el) => {
    // 已在视口内的直接显示，否则等观察器回调
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add("in-view");
    } else {
      revealObserver.observe(el);
    }
  });
}

/** 语言切换按钮 */
function initLangSwitch() {
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.langBtn;
      if (next && next !== currentLocale) applyLocale(next);
      // applyLocale 会用基础 key「theme.toggle」覆盖主题按钮的标签，
      // 需要按当前档位重新写入带后缀的完整文案
      syncThemeToggle();
    });
  });

  // 支持键盘与外部链接切语言：?lang=en
  window.addEventListener("popstate", () => {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (locales.includes(fromUrl) && fromUrl !== currentLocale) applyLocale(fromUrl);
    syncThemeToggle();
  });
}

// ---------------------------------------------------------------------------
// 主题
// ---------------------------------------------------------------------------

const THEME_KEY = "scratch-pad-site:theme";

/** 三态循环顺序：跟随系统 → 亮色 → 暗色 → 跟随系统 */
const THEME_CYCLE = ["system", "light", "dark"];

/**
 * 当前主题档位。
 * 与 <html data-theme> 的区别：'system' 档位下 data-theme 不存在，
 * 由 CSS 的 prefers-color-scheme 媒体查询接管。
 */
let currentTheme = "system";

/** 读取已保存的主题档位，非法值一律退回跟随系统 */
function resolveInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (THEME_CYCLE.includes(saved)) return saved;
  } catch {
    // 隐私模式下不可读，走系统偏好
  }
  return "system";
}

/** 取当前实际生效的亮/暗（system 档位需要问一次媒体查询） */
function effectiveTheme() {
  if (currentTheme !== "system") return currentTheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * 应用一次主题。
 *
 * system 档位删除 data-theme 属性，把控制权交回 CSS；
 * light/dark 档位写入属性以覆盖系统偏好。
 */
function applyTheme(theme, { persist = true } = {}) {
  currentTheme = theme;

  if (theme === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }

  if (persist) {
    try {
      if (theme === "system") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, theme);
    } catch {
      // 保存失败不影响本次会话
    }
  }

  syncThemeToggle();
}

/** 按钮的 aria-label / title 要反映「点击后得到什么」之外，也要说明当前档位 */
function syncThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const label = t(`theme.toggle.${currentTheme}`);
  btn.setAttribute("aria-label", label);
  btn.setAttribute("title", label);
  btn.dataset.themeState = currentTheme;
}

/** 主题切换按钮：点击在三个档位间循环 */
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(currentTheme) + 1) % THEME_CYCLE.length];
    applyTheme(next);
  });

  // 处于 system 档位时，跟随系统主题的实时变化刷新按钮文案
  window
    .matchMedia?.("(prefers-color-scheme: dark)")
    .addEventListener?.("change", () => {
      if (currentTheme === "system") syncThemeToggle();
    });

  syncThemeToggle();
}

/** 首屏下载分体按钮：主按钮直接下载便携版，箭头展开「安装版」等更多选项 */
function initDownloadSplit() {
  const wrap = document.querySelector("[data-download-split]");
  if (!wrap) return;

  const arrow = wrap.querySelector(".btn-split-arrow");
  const menu = wrap.querySelector(".btn-split-menu");

  const setOpen = (open) => {
    menu.hidden = !open;
    wrap.classList.toggle("open", open);
    arrow.setAttribute("aria-expanded", String(open));
  };

  arrow.addEventListener("click", () => setOpen(menu.hidden));

  // 点击页面其他位置或按 Esc 时收起
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

/** 首帧渲染 */
function init() {
  applyLocale(currentLocale);
  applyTheme(resolveInitialTheme(), { persist: false });
  initHeaderState();
  initLangSwitch();
  initThemeToggle();
  initDownloadSplit();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
