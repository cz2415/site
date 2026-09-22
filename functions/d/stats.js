// /d/stats —— 下载统计页。无导航入口、noindex，地址仅自己使用。
// 汇总 KV 里最近 60 天的每日记录（dl:{date}），渲染为单文件 HTML。
// KV 未绑定（DL_STATS 缺失）时给出提示而不是报错。

const CUTOFF_DAYS = 60;

export async function onRequestGet(context) {
  const kv = context.env.DL_STATS;
  if (!kv) {
    return html('<p class="warn">尚未绑定 KV：请在 Pages 项目 → 设置 → 绑定 里添加 KV 命名空间，变量名 DL_STATS。</p>');
  }

  const cutoff = new Date(Date.now() - CUTOFF_DAYS * 864e5).toISOString().slice(0, 10);
  const listed = await kv.list({ prefix: "dl:" });

  let totalPortable = 0;
  let totalSetup = 0;
  let lastDownload = null;
  const days = [];
  const countries = {};
  const systems = {};

  for (const { name } of listed.keys) {
    const day = name.slice(3);
    if (day < cutoff) continue;
    const record = JSON.parse((await kv.get(name)) ?? "{}");
    const portable = record.portable ?? 0;
    const setup = record.setup ?? 0;
    totalPortable += portable;
    totalSetup += setup;
    days.push({ day, portable, setup });
    for (const [k, v] of Object.entries(record.cc ?? {})) countries[k] = (countries[k] ?? 0) + v;
    for (const [k, v] of Object.entries(record.os ?? {})) systems[k] = (systems[k] ?? 0) + v;
    if (record.last && (!lastDownload || record.last > lastDownload)) lastDownload = record.last;
  }

  days.sort((a, b) => b.day.localeCompare(a.day));

  const dailyRows = days.length
    ? days
        .map(
          (d) =>
            `<tr><td>${d.day}</td><td>${d.portable}</td><td>${d.setup}</td><td>${d.portable + d.setup}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="4" class="empty">还没有下载记录</td></tr>';

  const list = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `<li><b>${esc(k)}</b><span>${v}</span></li>`)
      .join("") || '<li class="empty">—</li>';

  const body = `
    <h1>Scratch Pad 下载统计</h1>
    <section class="cards">
      <div class="card"><span class="num">${totalPortable + totalSetup}</span><span class="label">总下载</span></div>
      <div class="card"><span class="num">${totalPortable}</span><span class="label">便携版</span></div>
      <div class="card"><span class="num">${totalSetup}</span><span class="label">安装版</span></div>
      <div class="card"><span class="num small">${esc(lastDownload ?? "—")}</span><span class="label">最近一次下载</span></div>
    </section>
    <section>
      <h2>访客国家</h2>
      <ul class="rank">${list(countries)}</ul>
      <h2>操作系统</h2>
      <ul class="rank">${list(systems)}</ul>
    </section>
    <section>
      <h2>每日明细（最近 ${CUTOFF_DAYS} 天）</h2>
      <table>
        <thead><tr><th>日期</th><th>便携版</th><th>安装版</th><th>合计</th></tr></thead>
        <tbody>${dailyRows}</tbody>
      </table>
    </section>`;

  return html(body);
}

function html(inner) {
  return new Response(
    `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>下载统计 · Scratch Pad</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  body {
    background: #191919; color: #eaeaea;
    font: 15px/1.6 "Segoe UI", system-ui, sans-serif;
    max-width: 640px; margin: 0 auto; padding: 40px 20px 80px;
  }
  h1 { font-size: 22px; margin-bottom: 20px; }
  h2 { font-size: 14px; color: #9a9a9a; margin: 28px 0 10px; text-transform: uppercase; letter-spacing: 0.06em; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; }
  .card { background: #222; border: 1px solid #333; border-radius: 10px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 4px; }
  .num { font-size: 24px; font-weight: 650; }
  .num.small { font-size: 13px; font-weight: 400; color: #bdbdbd; word-break: break-all; }
  .label { font-size: 12px; color: #8b8b8b; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid #2c2c2c; }
  th { color: #9a9a9a; font-weight: 500; font-size: 12.5px; }
  .rank { list-style: none; padding: 0; }
  .rank li { display: flex; justify-content: space-between; padding: 6px 10px;
             background: #222; border: 1px solid #333; border-radius: 8px; margin-bottom: 6px; }
  .warn { color: #ffb84d; }
  .empty { color: #6f6f6f; text-align: center; }
</style>
</head>
<body>${inner}</body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
