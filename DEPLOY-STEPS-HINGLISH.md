# Montu Baruah Portal — Free Hosting Steps (₹0)

## Zip me kya mila (checked 10 Nov 2026)
- React + Vite frontend + Express Node backend (`server.ts`, 1506 lines)
- Admin panel, services, orders, help-requests, articles, Razorpay payment
- Frontend `api.ts` me API same site se mangta hai (`/api`) — isliye sirf Netlify static hosting se pura portal NAHI chalega. Netlify pe sirf design dikhega, login / order / payment kaam nahi karega.
- Build test pass hua: `npm run build` OK, production server `/` 200, `/api/settings` OK, `/api/orders` bina login ke 401 (sahi hai).

## Best free option: Render (Free plan, ₹0)
- Free domain milega: `https://montu-baruah-portal.onrender.com`
- Frontend + backend ek hi jagah chalega, koi code change nahi chahiye (ek chhota fix kar diya hai: PORT wala — Render apna PORT deta hai, purana code 3000 fix tha, ab `process.env.PORT` use karta hai).
- Koi card nahi chahiye free plan ke liye.

### Free plan ki 2 limits — pehle se jaan lo
1. **Neend (sleep):** 15 minute koi na khole to server so jata hai. Pehli baar kholne pe ~50 second lag sakta hai. Uske baad normal chalega.
2. **Data reset:** Orders / settings / uploads `data/db.json` me save hote hain. Render free pe disk permanent nahi hai — restart / redeploy pe purana data reset ho sakta hai. Isliye admin se roz ka backup lena. Paid disk ($7/month) lene pe hi data permanent hoga — abhi free ke liye ye accept karna hoga.

## Is pack me kya hai
- `project/` — deploy-ready code. `.env` HATA diya hai (usme purana admin password tha, kabhi upload mat karna).
- `project/render.yaml` — Render ko build/start command batata hai.
- `project/.gitignore` — `.env`, `node_modules`, `dist`, `data` upload nahi honge.
- `project/.env.example` — kaunsi keys chahiye, iski list hai.

## Zaroori: 2 cheezein pehle se jaan lo
1. **Razorpay keys nakli hain:** Zip ke `.env` me `RAZORPAY_KEY_ID / SECRET` example wale hain (placeholder). Real online payment tab tak nahi chalega jab tak Razorpay dashboard se real Key ID + Secret Render me na dalo. Manual UPI payment (montubaruah@upi + QR/screenshot) bina Razorpay ke bhi chalega.
2. **Admin password naya rakhna:** Zip wale purane admin password ko dobara use MAT karna. Render me naya strong password dalna, pehli login ke baad admin panel se change karna.

## Deploy steps (tablet se, browser me)

### Step 1 — GitHub repo banao (5 min)
1. github.com kholo, Gmail `baruahmontu11@gmail.com` se login / signup karo.
2. New repository: naam `montu-baruah-portal`, Public rakho.
3. `project/` folder ke andar ki saari files upload karo (Add file > Upload files). `project` folder khud upload mat karo — uske andar wali files seedha repo root me honi chahiye (jahan `package.json`, `server.ts`, `render.yaml` dikhe).

### Step 2 — Render pe free account (Gmail se)
1. render.com kholo > Sign Up > Continue with Google > wahi Gmail `baruahmontu11@gmail.com` chuno.
2. Dashboard > New + > Web Service > apna GitHub repo `montu-baruah-portal` connect karo.
3. Settings:
   - Name: `montu-baruah-portal`
   - Region: Singapore (India ke paas, fast)
   - Branch: main
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: **Free**
4. Environment Variables (Add):
   - `NODE_ENV` = `production`
   - `ADMIN_USERNAME` = apna naya admin username (jaise `montuadmin`)
   - `ADMIN_BOOTSTRAP_PASSWORD` = naya strong password (pehli login ke liye hi hai)
   - `RAZORPAY_KEY_ID` = abhi khaali chhodo, ya real key ho to dalo
   - `RAZORPAY_KEY_SECRET` = abhi khaali chhodo, ya real secret ho to dalo
5. Create Web Service dabao. Pehla deploy 3-5 minute lagega.

### Step 3 — Check karo
1. Render URL kholo: `https://montu-baruah-portal.onrender.com`
2. Site khulni chahiye. `/admin` pe login karo, turant password change karo.
3. Uske baad Render dashboard se `ADMIN_BOOTSTRAP_PASSWORD` variable hata do (security ke liye).

## Netlify ka kya?
Netlify ka free domain (`*.netlify.app`) accha hai, lekin is portal ke liye backend chahiye. Isliye Netlify akele kaam nahi karega. Agar kabhi sirf static site ho (bina login/order ke), to Netlify Drop se free me host ho jayega. Is portal ke liye Render sahi hai.

## Hostinger band karne se pehle
- Hostinger ka plan cancel karne se pehle Render wali site poori check kar lo (form, WhatsApp button, admin login).
- Domain hai `montubaruah.com` jaisa kuch Hostinger pe to wo alag se renew/cancel hota hai — hosting band karne se domain turant khatam nahi hota, par check kar lena.
