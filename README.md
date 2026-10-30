# DG Travels (frontend, first slice)

Done: sign-up, login, password reset, trip search, seat hold.
Not yet: payment (Paystack), parcels, My bookings, dashboards, notifications.

## Run it
1. Install Node.js 20+ from nodejs.org.
2. In this folder run: `npm install`
3. Create a `.env` file and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or set them in Vercel) your Supabase URL and anon key.
4. Run: `npm run dev` and open the address it prints.

## Supabase settings
Authentication > URL Configuration: add your site address (e.g. http://localhost:5173) to Redirect URLs so password-reset links work.

## Safe keys
Only the anon key goes in `.env`. Never add the service_role key or a Paystack secret key to this project.
