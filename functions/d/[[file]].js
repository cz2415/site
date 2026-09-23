// /d/portable、/d/setup —— 下载计数跳转层。
// 每次下载向 D1 的 events 表插入一行（时间、版本、国家、系统、来源、UA、疑似机器人），
// 然后 302 到 GitHub 最新版附件，GitHub release 自带的下载计数照常累加，两边互不影响。
//
// D1 通过 Pages 项目设置里的绑定接入（变量名 DL_DB）。events 表在首次插入前自动创建，
// 不需要手动跑建表命令。绑定缺失或写入失败时降级为直接跳转，绝不影响下载本身。

const TARGETS = {
  portable:
    "https://github.com/cz2415/scratch-pad-app/releases/latest/download/Scratch-Pad-x64-portable.exe",
  setup:
    "https://github.com/cz2415/scratch-pad-app/releases/latest/download/Scratch-Pad-x64-setup.exe",
};

const BOT_PATTERN =
  /bot|crawl|spider|curl|wget|python|httpx|go-http|java\/|okhttp|axios|libwww|monitor|preview|facebookexternalhit|slackbot|discordapp|whatsapp|headless/i;

export async function onRequestGet(context) {
  const kind = String(context.params.file ?? "");
  const target = TARGETS[kind];
  if (!target) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    await countDownload(context, kind);
  } catch (error) {
    console.error("dl count failed:", error);
  }

  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "no-store" },
  });
}

/** 把一次下载作为一行明细插入 events 表。 */
async function countDownload({ env, request }, kind) {
  const db = env.DL_DB;
  if (!db) return;

  await ensureTable(db);

  const ua = (request.headers.get("user-agent") ?? "").slice(0, 200);
  let ref = "";
  try {
    ref = new URL(request.headers.get("referer") ?? "").hostname;
  } catch {
    // 非法或缺失的 Referer 视为直接访问
  }

  await db
    .prepare(
      "INSERT INTO events (ts, kind, country, os, ua, ref, bot) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      Date.now(),
      kind,
      request.cf?.country ?? "",
      osFrom(ua),
      ua,
      ref,
      isBot(ua) ? 1 : 0,
    )
    .run();
}

// events 表只需建一次；模块级缓存让每个运行实例最多尝试一次。
// 注意用 batch 而不是 exec：exec 按换行拆分语句，多行 DDL 会被截断。
let tableReady;

async function ensureTable(db) {
  tableReady ??= db
    .batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL,
        kind TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT '',
        os TEXT NOT NULL DEFAULT '',
        ua TEXT NOT NULL DEFAULT '',
        ref TEXT NOT NULL DEFAULT '',
        bot INTEGER NOT NULL DEFAULT 0
      )`),
      db.prepare(`CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts)`),
    ])
    .catch((error) => {
      tableReady = null;
      throw error;
    });
  return tableReady;
}

/** UA 为空或带爬虫特征即视为机器人（数据仅用于统计标注，不做拦截）。 */
function isBot(ua) {
  return ua === "" || BOT_PATTERN.test(ua);
}

function osFrom(userAgent) {
  const ua = userAgent ?? "";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iOS/i.test(ua)) return "iOS";
  if (/Macintosh|Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Other";
}
