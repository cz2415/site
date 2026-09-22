// /d/portable、/d/setup —— 下载计数跳转层。
// 记录当天的便携/安装版次数、访客国家、操作系统，然后 302 到 GitHub 最新版附件，
// 所以 GitHub release 自带的下载计数照常累加，两边互不影响。
//
// KV 通过 Pages 项目设置里的绑定接入（变量名 DL_STATS）。
// 绑定缺失或计数失败时降级为直接跳转，绝不影响下载本身。

const TARGETS = {
  portable:
    "https://github.com/cz2415/scratch-pad-app/releases/latest/download/Scratch-Pad-x64-portable.exe",
  setup:
    "https://github.com/cz2415/scratch-pad-app/releases/latest/download/Scratch-Pad-x64-setup.exe",
};

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

/** 把一次下载并进当天的记录：dl:{YYYY-MM-DD} → JSON。 */
async function countDownload({ env, request }, kind) {
  const kv = env.DL_STATS;
  if (!kv) return;

  const day = new Date().toISOString().slice(0, 10);
  const key = `dl:${day}`;
  const record = JSON.parse((await kv.get(key)) ?? "{}");

  record[kind] = (record[kind] ?? 0) + 1;

  const country = request.cf?.country;
  if (country) record.cc = { ...record.cc, [country]: (record.cc?.[country] ?? 0) + 1 };

  const os = osFrom(request.headers.get("user-agent"));
  record.os = { ...record.os, [os]: (record.os?.[os] ?? 0) + 1 };

  record.last = new Date().toISOString();
  await kv.put(key, JSON.stringify(record));
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
