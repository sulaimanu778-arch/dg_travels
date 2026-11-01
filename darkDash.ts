export const DARK_CSS = `
html:root{background:#0b1a22}
body{background:#0b1a22}
.dk{color:#e8eef0;padding-bottom:100px}
.dk h2{font-size:1.1rem;margin:24px 0 12px;color:#fff}
@keyframes dkUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.dk-hero{display:flex;align-items:center;gap:14px;padding:1.3rem;border-radius:24px;border-bottom:4px solid #f59e0b;background:radial-gradient(circle at 85% 20%,rgba(245,158,11,.3),transparent 45%),radial-gradient(circle at 10% 100%,rgba(15,157,110,.5),transparent 50%),linear-gradient(135deg,#10232f,#1b4a5a)}
.dk-av{width:60px;height:60px;border-radius:50%;background:#0f9d6e;display:grid;place-items:center;font-size:28px;font-weight:800;color:#fff;border:3px solid rgba(255,255,255,.6);flex-shrink:0}
.dk-hi{opacity:.85;font-size:14px}
.dk-name{font-size:26px;font-weight:800;word-break:break-word;color:#fff}
.dk-search{display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding:.9rem 1.1rem;border-radius:16px;background:#14262f;border:1px solid #243a45;color:#9fb3bc;text-decoration:none}
.dk-search b{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#f59e0b}
.dk-pill{display:block;text-align:center;margin-top:14px;padding:.55rem;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none}
.dk-pill.open{background:#0f3d2e;color:#6ee7b7}
.dk-pill.shut{background:#4a3410;color:#fcd34d}
.dk-rec{display:flex;gap:12px;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x mandatory}
.dk-card{flex:0 0 78%;scroll-snap-align:start;padding:.9rem;border-radius:16px;background:#14262f;border:1px solid #243a45;color:#e8eef0;text-decoration:none}
.dk-card small{display:block;margin-top:4px;color:#9fb3bc}
.dk-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.dk-badge{padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.dk-foot{display:flex;justify-content:space-between;margin-top:10px;padding-top:8px;border-top:1px solid #243a45;font-size:13px}
.dk-empty{padding:1rem;border-radius:16px;background:#14262f;border:1px dashed #3a5361;color:#9fb3bc}
.dk-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.dk-tile{display:flex;flex-direction:column;align-items:center;gap:8px;padding:.9rem .3rem;border-radius:16px;background:#14262f;border:1px solid #243a45;color:#e8eef0;text-decoration:none;text-align:center;font-size:12.5px;font-weight:700;line-height:1.25;animation:dkUp .45s ease both}
.dk-tile:active{transform:scale(.95)}
.dk-tile:nth-child(2){animation-delay:.08s}
.dk-tile:nth-child(3){animation-delay:.16s}
.dk-tile:nth-child(4){animation-delay:.24s}
.dk-ico{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:26px}
.dk-promo{display:block;margin-top:22px;padding:1.1rem 1.2rem;border-radius:18px;text-decoration:none;color:#fff;background:linear-gradient(135deg,#d97706,#ea580c)}
.dk-acct{margin-top:22px;text-align:center;color:#9fb3bc;font-size:13px}
.dk-out{margin-top:10px;padding:.45rem 1.2rem;border-radius:999px;border:1px solid #3a5361;background:transparent;color:#fca5a5;font-weight:600;font-size:14px;cursor:pointer}
.dk-nav{position:fixed;left:0;right:0;bottom:0;z
