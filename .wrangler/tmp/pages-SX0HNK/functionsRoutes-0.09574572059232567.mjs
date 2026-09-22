import { onRequestGet as __d_stats_js_onRequestGet } from "D:\\chen\\code\\site\\functions\\d\\stats.js"
import { onRequestGet as __d___file___js_onRequestGet } from "D:\\chen\\code\\site\\functions\\d\\[[file]].js"

export const routes = [
    {
      routePath: "/d/stats",
      mountPath: "/d",
      method: "GET",
      middlewares: [],
      modules: [__d_stats_js_onRequestGet],
    },
  {
      routePath: "/d/:file*",
      mountPath: "/d",
      method: "GET",
      middlewares: [],
      modules: [__d___file___js_onRequestGet],
    },
  ]