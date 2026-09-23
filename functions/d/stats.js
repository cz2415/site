// /d/stats —— 下载统计页。无导航入口、noindex，地址仅自己使用。
// 数据来自 D1 的 events 表（变量名 DL_DB），全部 SQL 聚合，按北京时间展示。
// DL_DB 未绑定或查询出错时给出友好提示页而不是裸 500。

const CUTOFF_DAYS = 60;
const TREND_DAYS = 14;
const RECENT_LIMIT = 30;
const BEIJING_OFFSET_MS = 8 * 3600e3;

export async function onRequestGet(context) {
  const db = context.env.DL_DB;
  if (!db) {
    return html('<p class="warn">尚未绑定 D1：请在 Pages 项目 → 设置 → 绑定 里添加 D1 数据库，变量名 DL_DB。</p>');
  }

  try {
    return html(await render(db));
  } catch (error) {
    console.error("stats failed:", error);
    return html(`<p class="warn">查询出错：${esc(error.message)}</p>`);
  }
}

async function render(db) {
  const now = Date.now();
  const todayStart = Date.parse(beijingDay(now) + "T00:00:00+08:00");
  const cutoff60 = now - CUTOFF_DAYS * 864e5;
  const cutoffTrend = now - TREND_DAYS * 864e5;

  const [totals, today, last, recent, series, countries, systems, refs] = await Promise.all([
    db.prepare("SELECT kind, COUNT(*) AS n FROM events GROUP BY kind").all(),
    db.prepare("SELECT COUNT(*) AS n FROM events WHERE ts >= ?").bind(todayStart).all(),
    db.prepare("SELECT MAX(ts) AS t FROM events").all(),
    db.prepare("SELECT ts, kind, country, os, ua, ref, bot FROM events ORDER BY ts DESC LIMIT ?").bind(RECENT_LIMIT).all(),
    db.prepare("SELECT ts, kind FROM events WHERE ts >= ?").bind(cutoff60).all(),
    db.prepare("SELECT country, COUNT(*) AS n FROM events WHERE country != '' GROUP BY country ORDER BY n DESC LIMIT 8").all(),
    db.prepare("SELECT os, COUNT(*) AS n FROM events GROUP BY os ORDER BY n DESC LIMIT 8").all(),
    db.prepare("SELECT ref, COUNT(*) AS n FROM events GROUP BY ref ORDER BY n DESC LIMIT 5").all(),
  ]);

  const byKind = Object.fromEntries(totals.results.map((r) => [r.kind, r.n]));
  const totalPortable = byKind.portable ?? 0;
  const totalSetup = byKind.setup ?? 0;

  // 最近 60 天按北京自然日聚合，供每日明细表使用
  const daily = {};
  for (const row of series.results) {
    const day = beijingDay(row.ts);
    daily[day] ??= { portable: 0, setup: 0 };
    daily[day][row.kind] += 1;
  }
  const dailyRows = Object.entries(daily)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([day, v]) => ({ day, ...v }));

  const trend = buildTrend(series.results, cutoffTrend, now);
  const lastDownload = last.results[0]?.t ?? null;

  const dailyRowsHtml = dailyRows.length
    ? dailyRows
        .map(
          (d) =>
            `<tr><td>${d.day}</td><td>${d.portable}</td><td>${d.setup}</td><td>${d.portable + d.setup}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="4" class="empty">还没有下载记录</td></tr>';

  const recentRows = recent.results.length
    ? recent.results.map(recentRow).join("")
    : '<tr><td colspan="6" class="empty">还没有下载记录</td></tr>';

  const rank = (obj, emptyLabel) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `<li><b>${esc(k || emptyLabel)}</b><span>${v}</span></li>`)
      .join("") || '<li class="empty">—</li>';

  return `
    <h1>Scratch Pad 下载统计</h1>
    <section class="cards">
      <div class="card"><span class="num">${totalPortable + totalSetup}</span><span class="label">总下载</span></div>
      <div class="card"><span class="num">${totalPortable}</span><span class="label">便携版</span></div>
      <div class="card"><span class="num">${totalSetup}</span><span class="label">安装版</span></div>
      <div class="card"><span class="num">${today.results[0]?.n ?? 0}</span><span class="label">今日下载</span></div>
      <div class="card"><span class="num small">${esc(formatTime(lastDownload))}</span><span class="label">最近一次下载</span></div>
    </section>
    <section>
      <h2>最近下载明细（${recent.results.length} 条）</h2>
      <table>
        <thead><tr><th>时间</th><th>版本</th><th>国家</th><th>系统</th><th>来源</th><th>备注</th></tr></thead>
        <tbody>${recentRows}</tbody>
      </table>
    </section>
    <section>
      <h2>最近 ${TREND_DAYS} 天趋势</h2>
      ${trendSvg(trend)}
    </section>
    <section>
      <h2>来源统计</h2>
      <ul class="rank">${rank(Object.fromEntries(refs.results.map((r) => [r.ref, r.n])), "直接访问")}</ul>
      <h2>访客国家</h2>
      <ul class="rank">${rank(Object.fromEntries(countries.results.map((r) => [r.country, r.n])), "未知")}</ul>
      <h2>操作系统</h2>
      <ul class="rank">${rank(Object.fromEntries(systems.results.map((r) => [r.os, r.n])), "未知")}</ul>
    </section>
    <section>
      <h2>每日明细（最近 ${CUTOFF_DAYS} 天）</h2>
      <table>
        <thead><tr><th>日期</th><th>便携版</th><th>安装版</th><th>合计</th></tr></thead>
        <tbody>${dailyRowsHtml}</tbody>
      </table>
    </section>`;
}

function recentRow(row) {
  const kind = row.kind === "portable" ? "便携版" : "安装版";
  const bot = row.bot
    ? `<span class="tag" title="${esc(row.ua)}">疑似机器人</span>`
    : '<span class="dim">—</span>';
  return `<tr>
    <td>${formatTime(row.ts)}</td>
    <td>${kind}</td>
    <td>${esc(row.country || "—")}</td>
    <td>${esc(row.os || "—")}</td>
    <td>${esc(row.ref || "直接访问")}</td>
    <td>${bot}</td>
  </tr>`;
}

/** 最近 N 天的每日计数（北京时间），缺失的天补 0。 */
function buildTrend(rows, cutoff, now) {
  const counts = {};
  for (const row of rows) {
    if (row.ts < cutoff) continue;
    const day = beijingDay(row.ts);
    counts[day] = (counts[day] ?? 0) + 1;
  }
  const days = [];
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const day = beijingDay(now - i * 864e5);
    days.push({ day, n: counts[day] ?? 0 });
  }
  return days;
}

function trendSvg(days) {
  const width = 560;
  const height = 150;
  const top = 14;
  const bottom = 26;
  const inner = height - top - bottom;
  const max = Math.max(1, ...days.map((d) => d.n));
  const slot = width / days.length;
  const barWidth = slot * 0.6;

  const bars = days
    .map((d, i) => {
      const h = Math.round((d.n / max) * inner);
      const x = (i * slot + (slot - barWidth) / 2).toFixed(1);
      const y = top + inner - h;
      const label = days.length > 10 && i % 3 !== 0 ? "" : `<text x="${(i * slot + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle">${d.day.slice(5)}</text>`;
      return `${d.n ? `<text x="${(i * slot + slot / 2).toFixed(1)}" y="${y - 4}" text-anchor="middle" class="val">${d.n}</text>` : ""}
        <rect x="${x}" y="${y}" width="${barWidth.toFixed(1)}" height="${h}" rx="3"><title>${d.day}：${d.n} 次</title></rect>${label}`;
    })
    .join("");

  return `<svg class="trend" viewBox="0 0 ${width} ${height}" role="img" aria-label="最近 ${TREND_DAYS} 天下载趋势">${bars}</svg>`;
}

/** 毫秒时间戳 → 北京日期字符串（YYYY-MM-DD）。 */
function beijingDay(ts) {
  return new Date(ts + BEIJING_OFFSET_MS).toISOString().slice(0, 10);
}

/** 毫秒时间戳 → 北京时间可读格式（2026-09-22 20:13:09）。 */
function formatTime(ts) {
  if (!ts) return "—";
  return (
    new Date(ts + BEIJING_OFFSET_MS).toISOString().slice(0, 19).replace("T", " ") +
    "（北京时间）"
  );
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
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
    max-width: 720px; margin: 0 auto; padding: 40px 20px 80px;
  }
  h1 { font-size: 22px; margin-bottom: 20px; }
  h2 { font-size: 14px; color: #9a9a9a; margin: 28px 0 10px; text-transform: uppercase; letter-spacing: 0.06em; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
  .card { background: #222; border: 1px solid #333; border-radius: 10px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 4px; }
  .num { font-size: 24px; font-weight: 650; }
  .num.small { font-size: 13px; font-weight: 400; color: #bdbdbd; word-break: break-all; }
  .label { font-size: 12px; color: #8b8b8b; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid #2c2c2c; white-space: nowrap; }
  th { color: #9a9a9a; font-weight: 500; font-size: 12.5px; }
  .rank { list-style: none; padding: 0; }
  .rank li { display: flex; justify-content: space-between; padding: 6px 10px;
             background: #222; border: 1px solid #333; border-radius: 8px; margin-bottom: 6px; }
  svg.trend { width: 100%; height: auto; background: #222; border: 1px solid #333; border-radius: 10px; }
  svg.trend rect { fill: #4cc2ff; }
  svg.trend text { fill: #8b8b8b; font-size: 10px; }
  svg.trend text.val { fill: #eaeaea; font-size: 11px; font-weight: 600; }
  .tag { color: #ffb84d; border: 1px solid #ffb84d; border-radius: 6px; padding: 1px 8px; font-size: 12px; }
  .dim { color: #6f6f6f; }
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
