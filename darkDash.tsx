
export const DARK_CSS = `
.dk {
  min-height: 100vh;
  padding: 24px 16px 120px;
  background: #f8f9f6;
  color: #102b35;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.dk a {
  color: inherit;
  text-decoration: none;
}

/* Welcome section */
.dk-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 25px 22px;
  border-radius: 22px;
  background: linear-gradient(135deg, #102b35, #075b50);
  color: #fff;
  box-shadow: 0 8px 22px rgba(16,43,53,.16);
  border: 1px solid rgba(245,184,23,.25);
}

.dk-av {
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #ffd65a, #e5a900);
  color: #102b35;
  font-size: 27px;
  font-weight: 900;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
}

.dk-hi {
  color: #e1eee9;
  font-size: 14px;
  line-height: 1.6;
}

.dk-name {
  font-size: 28px;
  font-weight: 900;
  margin: 4px 0;
  color: #fff;
  letter-spacing: -.5px;
}

/* Search bar */
.dk-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 22px 0 14px;
  border-radius: 17px;
  background: #fff;
  color: #102b35;
  border: 1px solid #e5e8e2;
  box-shadow: 0 4px 14px rgba(16,43,53,.07);
  font-size: 16px;
  font-weight: 600;
}

/* Support status */
.dk-pill {
  display: block;
  padding: 14px;
  border-radius: 13px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}

.dk-pill.open {
  background: #e7f5ec;
  color: #08734c;
  border: 1px solid #c9e9d5;
}

.dk-pill.shut {
  background: #fff5d9;
  color: #946500;
  border: 1px solid #f3dfaa;
}

/* Section headings */
.dk h2 {
  font-size: 20px;
  font-weight: 900;
  margin: 28px 0 15px;
  color: #102b35;
  letter-spacing: -.3px;
}

/* Service cards */
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
  background: #fff;
  color: #102b35;
  font-weight: 800;
  font-size: 15px;
  border: 1px solid #e8e9e3;
  border-bottom: 4px solid #f5b817;
  box-shadow: 0 4px 12px rgba(16,43,53,.055);
  transition: transform .2s ease, box-shadow .2s ease;
}

.dk-tile:active {
  transform: scale(.97);
}

/* Service icons */
.dk-ico {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  margin-bottom: 14px;
  font-size: 27px;
  box-shadow: 0 4px 10px rgba(0,0,0,.10);
}

/* Waybill promotion */
.dk-promo {
  display: block;
  margin-top: 23px;
  padding: 24px 20px;
  border-radius: 19px;
  background: linear-gradient(120deg, #08734c, #075b50);
  color: #fff;
  border: 1px solid rgba(245,184,23,.35);
  box-shadow: 0 7px 18px rgba(8,115,76,.13);
}

/* Account section */
.dk-acct {
  margin-top: 28px;
  padding: 17px;
  color: #52636a;
  font-size: 13px;
  line-height: 1.7;
  overflow-wrap: anywhere;
  border-top: 1px solid #e5e9e4;
}

.dk-out {
  margin-top: 12px;
  padding: 12px 22px;
  border: 0;
  border-radius: 11px;
  background: #f5b817;
  color: #102b35;
  font-weight: 900;
  font-size: 14px;
}

/* Recent bookings */
.dk-rec {
  display: grid;
  gap: 13px;
}

.dk-card {
  display: block;
  padding: 18px;
  border: 1px solid #e4e9e3;
  border-left: 5px solid #f5b817;
  border-radius: 17px;
  background: #fff;
  color: #102b35;
  box-shadow: 0 4px 12px rgba(16,43,53,.055);
  transition: transform .2s ease;
}

.dk-card:active {
  transform: scale(.98);
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
  color: #102b35;
}

.dk-badge {
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  background: #fff3ce;
  color: #946500;
}

.dk-card small {
  display: block;
  color: #63737a;
  font-size: 12px;
  margin-bottom: 13px;
}

.dk-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #edf0eb;
  color: #63737a;
  font-size: 12px;
}

.dk-foot b {
  color: #08734c;
  font-size: 17px;
}

.dk-empty {
  padding: 22px;
  border-radius: 16px;
  background: #fff;
  border: 1px dashed #d4d9ce;
  color: #63737a;
  line-height: 1.7;
}

/* Tablet and desktop */
@media(min-width:700px) {
  .dk {
    max-width: 850px;
    margin: auto;
    padding-top: 35px;
  }

  .dk-tiles {
    grid-template-columns: repeat(3,minmax(0,1fr));
  }
}

/* Small mobile screens */
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
