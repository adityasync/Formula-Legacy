# 🚀 Free Deployment Guide for F1PEDIA

This guide outlines how to deploy the full stack (Frontend, Backend, Database) for **$0/month** using reliable free-tier services.

## Architecture

| Service | Provider | Free Tier Limits |
|---------|----------|------------------|
| **Frontend** | **Vercel** | Unlimited static bandwidth, standard build times |
| **Backend** | **Render** | 512MB RAM, spins down after 15m inactivity |
| **Database** | **Neon** | 0.5 GB storage, Serverless Postgres |

---

## Phase 1: Database (Neon)

1. Go to [Neon.tech](https://neon.tech) and sign up.
2. Create a new project named `f1pedia`.
3. Copy the **Connection String** (e.g., `postgres://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb...`).
   - **Note:** Save this for Phase 2 & 3.
psql 'postgresql://neondb_owner:npg_leJb70vWxBUE@ep-nameless-lab-ahe99c77-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
---

## Phase 2: Backend (Render)

1. Push your latest code to GitHub.
2. Go to [Render.com](https://render.com) and sign up.
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository `Formula-Legacy`.
5. **Configuration:**
   - **Root Directory:** `backend`
   - **Runtime:** `Docker`
   - **Region:** Choose one close to you (or close to your Neon DB region).
   - **Instance Type:** `Free`
6. **Environment Variables:**
   Add these secret variables:
   - `SPRING_DATASOURCE_URL`: Paste your Neon connection string (ensure it starts with `jdbc:postgresql://` and includes `?sslmode=require` at the end).
     - *Example:* `jdbc:postgresql://ep-xyz.neon.tech/neondb?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: Your Neon username.
   - `SPRING_DATASOURCE_PASSWORD`: Your Neon password.
7. Click **Create Web Service**.
   - *Wait ~5-10 mins for the build.*
   - Once deployed, copy your backend URL (e.g., `https://f1pedia-backend.onrender.com`).

---

## Phase 3: Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com) and sign up.
2. Click **Add New...** -> **Project**.
3. Import your `Formula-Legacy` repository.
4. **Configure Project:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend` (Click Edit)
5. **Environment Variables:**
   - `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://f1pedia-backend.onrender.com`).
6. Click **Deploy**.

---

## Phase 4: Data Initialization (ETL)

Since we are using a fresh cloud database, we need to populate it.

1. **Local ETL Run:**
   You can run the ETL script locally but point it to your **Neon** database.
   
   Update your local environment or modify `load_data.py` (temporarily) to use the Neon connection string.
   
   ```bash
   # Example command if script supports env vars
   export DB_URL="postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require"
   python etl/load_data.py
   ```

---

## 🔒 Security Note

- **Never commit your `.env` files** or real passwords to GitHub.
- Use the **Environment Variables** settings in Render/Vercel to store secrets securely.

---

## ✅ You're Live!

Visit your Vercel URL to see your F1PEDIA app running live on the web!
