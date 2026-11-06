
export const DARK_CSS = `
.dk {
  min-height: 100vh;
  background: #f5f7fa;
  color: #172b45;
  font-family: Inter, Arial, sans-serif;
  box-sizing: border-box;
}

.dk * {
  box-sizing: border-box;
}

.dk a {
  color: inherit;
  text-decoration: none;
}

.dk button {
  font: inherit;
  cursor: pointer;
}

.dk-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 250px;
  padding: 30px 19px;
  background: #ffffff;
  border-right: 1px solid #e7ebf0;
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.dk-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  color: #142b46 !important;
  margin: 0 0 43px 7px;
}

.dk-logo-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #142f4d;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
}

.dk-side-label {
  color: #9aa5b3;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin: 15px 10px 12px;
}

.dk-side-link {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 12px;
  border-radius: 9px;
  color: #68778a !important;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
  transition: .2s ease;
}

.dk-side-link svg {
  color: #8492a3;
  flex-shrink: 0;
}

.dk-side-link.active,
.dk-side-link:hover {
  background: #edf3f8;
  color: #173b60 !important;
}

.dk-side-link.active svg,
.dk-side-link:hover svg {
  color: #173b60;
}

.dk-sidebar-bottom {
  margin-top: auto;
  border-top: 1px solid #edf0f4;
  padding-top: 18px;
}

.dk-side-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.dk-side-user strong,
.dk-side-user small {
  display: block;
  overflow-wrap: anywhere;
}

.dk-side-user strong {
  font-size: 13px;
  color: #243b55;
}

.dk-side-user small {
  color: #98a3b1;
  font-size: 11px;
  margin-top: 4px;
}

.dk-av,
.dk-top-avatar {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e9eff5;
  color: #173b60;
  font-size: 17px;
  font-weight: 800;
}

.dk-side-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e5eaf0;
  border-radius: 9px;
  background: #fff;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
}

.dk-side-logout:hover {
  background: #f6f8fa;
  color: #173b60;
}

.dk-main {
  margin-left: 250px;
  max-width: 1650px;
  padding: 30px 40px 60px;
}

.dk-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.dk-topbar strong {
  display: block;
  font-size: 21px;
  color: #1a3049;
  margin-top: 6px;
  font-weight: 750;
}

.dk-hi {
  color: #8794a4;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.dk-top-avatar {
  width: 46px;
  height: 46px;
  background: #173b60;
  color: #fff;
}

.dk-welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  min-height: 235px;
  padding: 38px 42px;
  border-radius: 15px;
  background: #173b60;
  border: 1px solid #173b60;
  box-shadow: 0 8px 22px rgba(24, 52, 80, .09);
  overflow: hidden;
}

.dk-eyebrow,
.dk-feature-tag {
  color: #e8c77d;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.dk-welcome h1 {
  font-size: clamp(24px, 3vw, 34px);
  margin: 14px 0 10px;
  color: #fff;
  font-weight: 750;
}

.dk-welcome p,
.dk-feature p {
  max-width: 510px;
  color: #d5e0eb;
  font-size: 14px;
  line-height: 1.8;
}

.dk-welcome-art {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 50%;
  color: #e8c77d;
  background: rgba(255,255,255,.06);
}

.dk-primary-btn,
.dk-feature-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 13px 19px;
  margin-top: 13px;
  border-radius: 8px;
  background: #d7ad55;
  color: #142b46 !important;
  font-size: 12px;
  font-weight: 800;
  transition: .2s ease;
}

.dk-primary-btn:hover,
.dk-feature-btn:hover {
  background: #e6c477;
  transform: translateY(-1px);
}

.dk-search-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 23px;
  margin: 23px 0 34px;
  border: 1px solid #e6ebf0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(20,43,70,.035);
}

.dk-search-panel > div {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dk-search-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #edf3f8;
  color: #173b60;
}

.dk-search-panel strong,
.dk-search-panel small {
  display: block;
}

.dk-search-panel strong {
  color: #263d56;
  font-size: 14px;
}

.dk-search-panel small {
  margin-top: 5px;
  color: #8996a5;
  font-size: 11px;
}

.dk-search-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 17px;
  border-radius: 8px;
  background: #173b60;
  color: #fff !important;
  font-size: 12px;
  font-weight: 750;
  white-space: nowrap;
}

.dk-search-button:hover {
  background: #244f78;
}

.dk-section {
  margin: 32px 0;
}

.dk-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.dk-section-heading h2 {
  margin: 0;
  font-size: 19px;
  color: #1d344e;
  font-weight: 750;
}

.dk-section-heading p {
  color: #8996a5;
  font-size: 12px;
  margin: 6px 0 0;
}

.dk-tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.dk-tile {
  min-height: 155px;
  padding: 21px 19px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e6ebf0;
  color: #243b55 !important;
  box-shadow: 0 3px 12px rgba(20,43,70,.035);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.dk-tile:hover {
  transform: translateY(-3px);
  border-color: #d7ad55;
  box-shadow: 0 8px 22px rgba(20,43,70,.08);
}

.dk-ico {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  margin-bottom: 15px;
  background: #edf3f8;
  color: #173b60;
}

.dk-tile strong {
  font-size: 13px;
  font-weight: 750;
}

.dk-tile-arrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  color: #9b762e;
  font-size: 11px;
  font-weight: 750;
}

.dk-feature {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 29px 32px;
  border-radius: 13px;
  background: #fff;
  border: 1px solid #e6ebf0;
  box-shadow: 0 3px 12px rgba(20,43,70,.035);
}

.dk-feature-tag {
  color: #a47d35;
}

.dk-feature h2 {
  color: #1d344e;
  font-size: 23px;
  margin: 12px 0 7px;
}

.dk-feature p {
  color: #748397;
}

.dk-feature-art {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #edf3f8;
  color: #173b60;
}

.dk-feature-btn {
  background: #173b60;
  color: #fff !important;
}

.dk-feature-btn:hover {
  background: #244f78;
}

.dk-view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #9b762e !important;
  font-size: 12px;
  font-weight: 750;
}

.dk-rec {
  display: grid;
  gap: 13px;
}

.dk-card {
  display: block;
  padding: 18px;
  border: 1px solid #e6ebf0;
  border-left: 4px solid #d7ad55;
  border-radius: 11px;
  background: #fff;
  color: #263d56 !important;
  box-shadow: 0 2px 8px rgba(20,43,70,.025);
}

.dk-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 13px;
}

.dk-top strong {
  font-size: 14px;
  line-height: 1.5;
}

.dk-badge {
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
}

.dk-card small {
  display: block;
  color: #8390a0;
  font-size: 12px;
  margin-bottom: 13px;
}

.dk-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #edf0f4;
  color: #8390a0;
  font-size: 12px;
}

.dk-foot b {
  color: #173b60;
  font-size: 16px;
}

.dk-empty {
  padding: 22px;
  border-radius: 11px;
  background: #fff;
  border: 1px dashed #d6dee7;
  color: #718096;
  line-height: 1.7;
}

.dk-support-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  padding: 16px 18px;
  margin-top: 25px;
  border: 1px solid #e6ebf0;
  border-radius: 11px;
  background: #fff;
  color: #52657a !important;
  font-size: 12px;
  font-weight: 750;
}

.dk-support-status > span {
  color: #16865d;
}

.dk-support-status small {
  margin-left: auto;
  color: #97a2af;
  font-weight: 500;
}

.dk-operator {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 18px;
  padding: 19px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e6ebf0;
  box-shadow: 0 3px 12px rgba(20,43,70,.035);
}

.dk-operator-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #edf3f8;
  color: #173b60;
}

.dk-operator strong,
.dk-operator small {
  display: block;
}

.dk-operator strong {
  color: #263d56;
  font-size: 14px;
}

.dk-operator small {
  color: #8390a0;
  font-size: 12px;
  margin-top: 5px;
  line-height: 1.5;
}

.dk-operator > b {
  margin-left: auto;
  color: #a47d35;
  display: flex;
}

.dk-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 18px 0;
  border-top: 1px solid #e5eaf0;
  color: #8996a5;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.dk-footer button {
  padding: 9px 14px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  background: #fff;
  color: #52657a;
  font-size: 11px;
  font-weight: 750;
}

.dk-footer button:hover {
  background: #edf3f8;
}

.dk-nav {
  display: none;
}

@media (max-width: 1050px) {
  .dk-main {
    padding-left: 25px;
    padding-right: 25px;
  }

  .dk-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .dk {
    padding-bottom: 90px;
  }

  .dk-sidebar {
    display: none;
  }

  .dk-main {
    margin-left: 0;
    padding: 20px 15px 35px;
  }

  .dk-topbar {
    margin-bottom: 19px;
  }

  .dk-topbar strong {
    font-size: 17px;
  }

  .dk-welcome {
    min-height: 0;
    padding: 25px 20px;
    border-radius: 12px;
  }

  .dk-welcome h1 {
    font-size: 24px;
  }

  .dk-welcome p {
    font-size: 12px;
  }

  .dk-welcome-art {
    width: 70px;
    height: 70px;
  }

  .dk-welcome-art svg {
    width: 42px;
    height: 42px;
  }

  .dk-search-panel {
    align-items: flex-start;
    flex-direction: column;
    padding: 17px;
  }

  .dk-search-button {
    width: 100%;
    justify-content: center;
  }

  .dk-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 11px;
  }

  .dk-tile {
    min-height: 135px;
    padding: 15px;
  }

  .dk-feature {
    padding: 21px 18px;
  }

  .dk-feature h2 {
    font-size: 19px;
  }

  .dk-feature p {
    font-size: 12px;
  }

  .dk-feature-art {
    width: 65px;
    height: 65px;
  }

  .dk-feature-art svg {
    width: 38px;
    height: 38px;
  }

  .dk-support-status small {
    width: 100%;
    margin-left: 23px;
  }

  .dk-operator {
    padding: 15px;
  }

  .dk-section-heading h2 {
    font-size: 18px;
  }

  .dk-nav {
    display: block;
  }
}

@media (max-width: 380px) {
  .dk-main {
    padding-left: 11px;
    padding-right: 11px;
  }

  .dk-welcome-art {
    display: none;
  }

  .dk-welcome h1 {
    font-size: 21px;
  }

  .dk-tile {
    padding: 12px;
  }

  .dk-feature-art {
    display: none;
  }
}
`
  
