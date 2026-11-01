
export const DARK_CSS = `
.dk {
  min-height: 100vh;
  padding: 24px 16px 100px;
  background: #061b25;
  color: #ffffff;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
.dk-hero {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #064e3b, #092d49);
}
.dk-av {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #d6a928;
  color: #071b25;
  font-size: 24px;
  font-weight: bold;
}
.dk-hi { color: #cbd5e1; font-size: 14px; }
.dk-name { font-size: 25px; font-weight: 800; margin: 4px 0; }
.dk-search {
  display: flex;
  justify-content: space-between;
  padding: 17px;
  margin: 20px 0 12px;
  border-radius: 14px;
  background: #ffffff;
  color: #102b3b;
  text-decoration: none;
}
.dk-pill {
  display: block;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
}
.dk-pill.open { background: #064e3b; color: #a7f3d0; }
.dk-pill.shut { background: #49351a; color: #fcd34d; }
.dk h2 { font-size: 19px; margin: 25px 0 12px; }
.dk-tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.dk-tile {
  padding: 17px;
  border-radius: 16px;
  background: #102e3b;
  color: white;
  text-decoration: none;
  font-weight: bold;
}
.dk-ico {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  margin-bottom: 10px;
  font-size: 24px;
}
.dk-promo {
  display: block;
  margin-top: 22px;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(120deg, #087443, #b68b19);
  color: white;
  text-decoration: none;
}
.dk-acct {
  margin-top: 25px;
  padding: 15px;
  color: #cbd5e1;
  font-size: 13px;
  overflow-wrap: anywhere;
}
.dk-out {
  margin-top: 12px;
  padding: 10px 18px;
  border: 0;
  border-radius: 10px;
  background: #b68b19;
  color: #071b25;
  font-weight: bold;
}
@media (min-width: 700px) {
  .dk { max-width: 850px; margin: auto; padding-top: 35px; }
  .dk-tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
`
