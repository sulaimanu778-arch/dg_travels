export const TILES_CSS = `
@keyframes dkUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
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
`
