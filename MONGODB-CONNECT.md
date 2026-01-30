# Fix MongoDB Atlas connection issues

## Quick fix: “Could not connect” / “buffering timed out”

If you see **Could not connect to any servers** or **Operation `…` buffering timed out**, your IP is not allowed. Add it in Atlas:

1. Open **[MongoDB Atlas → Network Access](https://cloud.mongodb.com/v2#/security/network/access)**.
2. Click **Add IP Address** → **Add Current IP Address** (or **Allow Access from Anywhere** for dev).
3. Wait 1–2 minutes, then restart the app.

---

## Fix: querySrv ECONNREFUSED

If you see **`querySrv ECONNREFUSED _mongodb._tcp.cluster0.xxx.mongodb.net`**, your network or DNS is blocking the SRV lookup MongoDB Atlas uses. Use the **Standard connection string** instead of the SRV one.

## Steps

### 1. Get the Standard connection string from Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → **Database** → your cluster.
2. Click **Connect** → **Connect your application** (or **Drivers**).
3. Copy the **SRV** string shown (e.g. `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/`).
4. In Atlas, open **Database** → your cluster → **Connect** → **Connect using MongoDB Compass** (or **Mongo Shell**). There you’ll see the **host list** (e.g. `cluster0-shard-00-00.xxx.mongodb.net:27017`, …).
5. Or: in the **Drivers** step, look for **“Connection string”** / **“See all connection string options”** and choose the **standard (non-SRV)** format if shown.

Build the standard URI in this form (replace `USER`, `PASSWORD`, `HOSTS`, `DB`):

- **Single host:**  
  `mongodb://USER:PASSWORD@HOST:27017/DB?ssl=true&authSource=admin`
- **Replica set (multiple hosts):**  
  `mongodb://USER:PASSWORD@host1:27017,host2:27017,host3:27017/DB?ssl=true&replicaSet=atlas-XXXXX-shard-0&authSource=admin`

Use your Atlas **database user** and **password**. Encode special characters in the password (e.g. `@` → `%40`, `#` → `%23`).

### 2. Use it in `.env.local`

Set **one** of these (replace with your real values):

**Option A – SRV (only if it works on your network):**

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Option B – Standard (use when SRV fails with ECONNREFUSED):**

```env
MONGO_URI=mongodb://USER:PASSWORD%40@cluster0-shard-00-00.xxx.mongodb.net:27017,cluster0-shard-00-01.xxx.mongodb.net:27017,cluster0-shard-00-02.xxx.mongodb.net:27017/?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin
```

(Replace `PASSWORD%40` with your password; use `%40` for `@` inside the password.)

### 3. Network / firewall

- **Allow list:** Atlas → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (or add your current IP) for testing.
- Try from another network (e.g. mobile hotspot) to see if SRV works there.
- Temporarily disable VPN or strict firewall/antivirus to test.

### 4. Restart the app

After changing `.env.local`, restart the dev server:

```bash
npm run dev
```

Then try the app again.
