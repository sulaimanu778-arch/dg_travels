import { CARDS_CSS } from './darkCards'
import { TILES_CSS } from './darkTiles'

const BASE = `
html:root{background:#0b1a22}
body{background:#0b1a22}
.dk{color:#e8eef0;padding-bottom:100px}
.dk h2{font-size:1.1rem;margin:24px 0 12px;color:#fff}
.dk-hero{display:flex;align-items:center;gap:14px;padding:1.3rem;border-radius:24px;border-bottom:4px solid #f59e0b;background:radial-gradient(circle at 85% 20%,rgba(245,158,11,.3),transparent 45%),radial-gradient(circle at 10% 100%,rgba(15,157,110,.5),transparent 50%),linear-gradient(135deg,#10232f,#1b4a5a)}
.dk-av{width:60px;height:60px;border-radius:50%;background:#0f9d6e;display:grid;place-items:center;font-size:28px;font-weight:800;color:#fff;border:3px solid rgba(255,255,255,.6);flex-shrink:0}
.dk-hi{opacity:.85;font-size:14px}
.dk-name{font-size:26px;font-weight:800;word-break:break-word;color:#fff}
.dk-search{display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding:.9rem 1.1rem;border-radius:16px;background:#14262f;border:1px solid #243a45;color:#9fb3bc;text-decoration:none}
.dk-search b{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#f59e0b}
.dk-pill{display:block;text-align:center;margin-top:14px;padding:.55rem;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none}
.dk-pill.open{background:#0f3d2e;color:#6ee7b7}
.dk-pill.shut{background:#4a3410;color:#fcd34d}
`

export const DARK_CSS = BASE + CARDS_CSS + TILES_CSS
