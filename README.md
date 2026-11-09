<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c0793861-02b9-410f-9246-366aa95a87aa

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from your Razorpay dashboard
   - `ADMIN_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` — used only to create the
     first admin account on first run (change the password from the admin
     panel afterward, then you can remove ADMIN_BOOTSTRAP_PASSWORD from `.env`)
3. Run the app in dev mode:
   `npm run dev`

## Deploying to production

1. `npm install`
2. `npm run build`
3. Set the same environment variables from `.env.example` on your hosting
   provider (Node.js hosting or a VPS — this app needs a persistent Node
   process, not static/shared hosting).
4. `npm start`
5. Make sure `data/` (which stores `db.json` and uploaded files) is on
   persistent disk, not ephemeral storage.
6. Log in to `/admin` with the username/password from step 3's bootstrap
   variables, then immediately change the password from the admin panel.
