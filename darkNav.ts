
export const NAV_CSS = `
.dk-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: rgba(16,43,53,.98);
  border-top: 1px solid rgba(245,184,23,.3);
  box-shadow: 0 -5px 22px rgba(0,0,0,.12);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  backdrop-filter: blur(14px);
}
.dk-navin {
  display: flex;
  max-width: 640px;
  height: 68px;
  margin: 0 auto;
}
.dk-navin a {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 0;
  color: #a9bac0;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
}
.dk-navin a span {
  font-size: 23px;
  line-height: 1.2;
}
.dk-navin a.on {
  color: #f5b817;
}
.dk-navin a.on::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  border-radius: 0 0 5px 5px;
  background: #f5b817;
}
.dk-navin a:active {
  opacity: .75;
}
`
