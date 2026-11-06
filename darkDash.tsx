
export const DARK_CSS = `
.dk {
  min-height: 100vh;
  padding: 24px 16px 120px;
  background: #101426;
  color: #f4f5ff;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.dk a {
  color: inherit;
  text-decoration: none;
}

.dk-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 25px 22px;
  border-radius: 22px;
  background: linear-gradient(135deg, #242b55, #493b83);
  color: #fff;
  box-shadow: 0 8px 25px rgba(0,0,0,.25);
  border: 1px solid #6255a5;
}

.dk-av {
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #8b7cff, #5545bd);
  color: #fff;
  font-size: 27px;
  font-weight: 900;
}

.dk-hi {
  color: #c9c9e9;
  font-size: 14px;
  line-height: 1.6;
}

.dk-name {
  font-size: 28px;
  font-weight: 900;
  margin: 4px 0;
  color: #fff;
}

.dk-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 22px 0 14px;
  border-radius: 17px;
  background: #202640;
  color: #fff;
  border: 1px solid #343d61;
  box-shadow: 0 4px 14px rgba(0,0,0,.2);
  font-size: 16px;
  font-weight: 600;
}

.dk-pill {
  display: block;
  padding: 14px;
  border-radius: 13px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}

.dk-pill.open {
  background: #153d38;
  color: #76e3b5;
  border: 1px solid #286c5b;
}

.dk-pill.shut {
  background: #40351f;
  color: #ffd47b;
  border: 1px solid #725b30;
}

.dk h2 {
  font-size: 20px;
  font-weight: 900;
  margin: 28px 0 15px;
  color: #fff;
}

.dk-tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 14px;
}

.dk-tile {
  padding: 19px 17px;
  min-height: 135px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 19px;
  background: #202640;
  color: #f5f5ff;
  font-weight: 800;
  font-size: 15px;
  border: 1px solid #343d61;
  box-shadow: 0 5px 16px rgba(0,0,0,.2);
  transition: transform .2s ease;
}

.dk-tile:active {
  transform: scale(.97);
}

.dk-ico {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  margin-bottom: 14px;
  font-size: 27px;
  box-shadow: 0 4px 10px rgba(0,0,0,.2);
}

.dk-promo {
  display: block;
  margin-top: 23px;
  padding: 24px 20px;
  border-radius: 19px;
  background: linear-gradient(120deg, #35316c, #51418b);
  color: #fff;
  border: 1px solid #7165b7;
  box-shadow: 0 7px 18px rgba(0,0,0,.2);
}

.dk-acct {
  margin-top: 28px;
  padding: 17px;
  color: #b7bdd7;
  font-size: 13px;
  line-height: 1.7;
  overflow-wrap: anywhere;
  border-top: 1px solid #343d61;
}

.dk-out {
  margin-top: 12px;
  padding: 12px 22px;
  border: 0;
  border-radius: 11px;
  background: #7565db;
  color: #fff;
  font-weight: 900;
  font-size: 14px;
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
  border-radius: 17px;
  background: #202640;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
}

.dk-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 13px;
}

.dk-top strong {
  font-size: 15px;
  line-height: 1.5;
  color: #fff;
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
  font-size: 17px;
}

.dk-empty {
  padding: 22px;
  border-radius: 16px;
  background: #202640;
  border: 1px dashed #596187;
  color: #c5c9df;
  line-height: 1.7;
}

@media(min-width:700px) {
  .dk {
    max-width: 1100px;
    margin: auto;
    padding-top: 35px;
  }

  .dk-tiles {
    grid-template-columns: repeat(4,minmax(0,1fr));
  }
}

@media(max-width:380px) {
  .dk {
    padding-left: 12px;
    padding-right: 12px;
  }

  .dk-hero {
    padding: 19px 15px;
  }

  .dk-name {
    font-size: 24px;
  }

  .dk-tile {
    padding: 15px 12px;
    font-size: 14px;
  }
}
`
