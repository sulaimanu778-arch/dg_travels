
export const DARK_CSS = `
.dk {
  min-height: 100vh;
  background: #101426;
  color: #f4f5ff;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.dk * {
  box-sizing: border-box;
}

.dk a {
  color: inherit;
  text-decoration: none;
}

.dk-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 245px;
  padding: 28px 18px;
  background: #171d35;
  border-right: 1px solid #303653;
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.dk-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 900;
  margin: 0 0 42px 8px;
}

.dk-logo-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #8877ff, #5141b8);
  color: white;
  font-weight: 900;
}

.dk-side-label {
  color: #858ba9;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.5px;
  margin: 15px 10px 12px;
}

.dk-side-link {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 12px;
  border-radius: 11px;
  color: #b8bfd9 !important;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 5px;
}

.dk-side-link span {
  width: 23px;
  text-align: center;
  font-size: 17px;
}

.dk-side-link.active,
.dk-side-link:hover {
  background: #302d59;
  color: #fff !important;
}

.dk-sidebar-bottom {
  margin-top: auto;
  border-top: 1px solid #303653;
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
}

.dk-side-user small {
  color: #939bb9;
  font-size: 11px;
  margin-top: 4px;
}

.dk-av,
.dk-top-avatar {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #8b7cff, #5545bd);
  color: #fff;
  font-size: 18px;
  font-weight: 900;
}

.dk-side-logout {
  width: 100%;
  padding: 12px;
  border: 1px solid #3c4261;
  border-radius: 10px;
  background: #222943;
  color: #e5e7ff;
  font-weight: 800;
  text-align: left;
}

.dk-main {
  margin-left: 245px;
  max-width: 1600px;
  padding: 28px 36px 60px;
}

.dk-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 27px;
}

.dk-topbar strong {
  display: block;
  font-size: 20px;
  margin-top: 5px;
}

.dk-hi {
  color: #aeb6d3;
  font-size: 13px;
  line-height: 1.6;
}

.dk-top-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.dk-welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 235px;
  padding: 35px;
  border-radius: 23px;
  background: linear-gradient(120deg, #292957, #51418b);
  border: 1px solid #6255a5;
  box-shadow: 0 9px 28px rgba(0,0,0,.2);
  overflow: hidden;
}

.dk-eyebrow,
.dk-feature-tag {
  color: #c2b9ff;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

.dk-welcome h1 {
  font-size: clamp(23px, 3vw, 34px);
  margin: 13px 0 10px;
  color: #fff;
}

.dk-welcome p,
.dk-feature p {
  max-width: 510px;
  color: #d0d1ed;
  font-size: 14px;
  line-height: 1.8;
}

.dk-welcome-art {
  font-size: clamp(65px, 10vw, 115px);
  padding: 15px;
  filter: drop-shadow(0 12px 14px rgba(0,0,0,.3));
}

.dk-primary-btn,
.dk-feature-btn {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  padding: 12px 19px;
  margin-top: 12px;
  border-radius: 10px;
  background: #8978ff;
  color: #fff !important;
  font-size: 13px;
  font-weight: 900;
}

.dk-search-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 19px 22px;
  margin: 22px 0 30px;
  border: 1px solid #343d61;
  border-radius: 16px;
  background: #202640;
}

.dk-search-panel > div {
  display: flex;
  align-items: center;
  gap: 13px;
}

.dk-search-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #343064;
  color: #c5baff;
  font-size: 27px;
}

.dk-search-panel strong,
.dk-search-panel small {
  display: block;
}

.dk-search-panel strong {
  font-size: 14px;
}

.dk-search-panel small {
  margin-top: 5px;
  color: #aeb6d3;
  font-size: 11px;
}

.dk-search-button {
  padding: 12px 17px;
  border-radius: 10px;
  background: #7666df;
  color: #fff !important;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.dk-section {
  margin: 30px 0;
}

.dk-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 17px;
}

.dk-section-heading h2 {
  margin: 0;
  font-size: 20px;
  color: #fff;
}

.dk-section-heading p {
  color: #aeb6d3;
  font-size: 12px;
  margin: 6px 0 0;
}

.dk-tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
}

.dk-tile {
  min-height: 155px;
  padding: 20px 17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 17px;
  background: #202640;
  border: 1px solid #343d61;
  color: #f5f5ff !important;
  box-shadow: 0 5px 16px rgba(0,0,0,.15);
  transition: transform .2s ease, border-color .2s ease;
}

.dk-tile:hover {
  transform: translateY(-3px);
  border-color: #8172e8;
}

.dk-ico {
  width: 49px;
  height: 49px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  margin-bottom: 14px;
  font-size: 25px;
}

.dk-tile strong {
  font-size: 13px;
}

.dk-tile-arrow {
  margin-top: 9px;
  color: #a99bff;
  font-size: 11px;
  font-weight: 800;
}

.dk-admin-icon {
  background: linear-gradient(145deg, #10242e, #0a7b52);
}

.dk-feature {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 27px 30px;
  border-radius: 19px;
  background: linear-gradient(120deg, #252d52, #303d70);
  border: 1px solid #465486;
}

.dk-feature h2 {
  color: white;
  font-size: 23px;
  margin: 12px 0 7px;
}

.dk-feature-art {
  font-size: 75px;
  flex-shrink: 0;
}

.dk-feature-btn {
  background: #f0b84b;
  color: #211a35 !important;
}

.dk-view-all {
  color: #afa2ff !important;
  font-size: 12px;
  font-weight: 800;
}

.dk-rec {
  display: grid;
  gap: 13px;
}

.dk-card {
  display: block;
  padding: 18px;
  border: 1px solid #343d61;
  border-left: 5px solid #8877ff;
  border-radius: 15px;
  background: #202640;
  color: #fff !important;
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
  color: #b7bdd7;
  font-size: 12px;
  margin-bottom: 13px;
}

.dk-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #343d61;
  color: #b7bdd7;
  font-size: 12px;
}

.dk-foot b {
  color: #82d8ff;
  font-size: 16px;
}

.dk-empty {
  padding: 22px;
  border-radius: 15px;
  background: #202640;
  border: 1px dashed #596187;
  color: #c5c9df;
  line-height: 1.7;
}

.dk-support-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  padding: 15px 17px;
  margin-top: 25px;
  border: 1px solid #343d61;
  border-radius: 13px;
  background: #202640;
  color: #c9d4ed !important;
  font-size: 12px;
  font-weight: 800;
}

.dk-support-status > span {
  color: #6de0ad;
}

.dk-support-status small {
  margin-left: auto;
  color: #9fa8c8;
  font-weight: 500;
}

.dk-operator {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 18px;
  padding: 19px;
  border-radius: 16px;
  background: linear-gradient(120deg, #173d3d, #19334b);
  border: 1px solid #35645e;
}

.dk-operator-icon {
  font-size: 33px;
}

.dk-operator strong,
.dk-operator small {
  display: block;
}

.dk-operator strong {
  color: #f7d77c;
  font-size: 14px;
}

.dk-operator small {
  color: #c7d7e7;
  font-size: 12px;
  margin-top: 5px;
  line-height: 1.5;
}

.dk-operator > b {
  margin-left: auto;
  color: #f7d77c;
  font-size: 22px;
}

.dk-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 18px 0;
  border-top: 1px solid #343d61;
  color: #aeb6d3;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.dk-footer button {
  padding: 9px 14px;
  border: 0;
  border-radius: 9px;
  background: #7565db;
  color: #fff;
  font-weight: 800;
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
    padding-bottom: 100px;
  }

  .dk-sidebar {
    display: none;
  }

  .dk-main {
    margin-left: 0;
    padding: 20px 15px 35px;
  }

  .dk-topbar {
    margin-bottom: 18px;
  }

  .dk-topbar strong {
    font-size: 17px;
  }

  .dk-welcome {
    min-height: 0;
    padding: 23px 19px;
    border-radius: 18px;
  }

  .dk-welcome h1 {
    font-size: 24px;
  }

  .dk-welcome p {
    font-size: 12px;
  }

  .dk-welcome-art {
    font-size: 53px;
    padding: 0;
  }

  .dk-search-panel {
    align-items: flex-start;
    flex-direction: column;
    padding: 17px;
  }

  .dk-search-button {
    width: 100%;
    text-align: center;
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
    font-size: 48px;
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
}

@media (max-width: 380px) {
  .dk-main {
    padding-left: 11px;
    padding-right: 11px;
  }

  .dk-welcome-art {
    font-size: 40px;
  }

  .dk-welcome h1 {
    font-size: 21px;
  }

  .dk-tile {
    padding: 12px;
  }

  .dk-feature-art {
    font-size: 37px;
  }
}
`
