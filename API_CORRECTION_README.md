# Frontend API Configuration & Client Centralization

This document explains the issue with hardcoded API endpoints, how it was corrected, and the new architecture for managing environment variables and client-side requests.

---

## 1. The Core Issue (Why `localhost:8080` was baked in)

In Next.js, variables prefixed with `NEXT_PUBLIC_` are meant to be exposed to the browser. However, **Next.js compiles/injects these variables at build time** (i.e. when `npm run build` runs inside the Docker container).

- When building Docker images locally or on Render, if `NEXT_PUBLIC_API_URL` is not passed as a build argument (or if it's only specified as a runtime container environment variable in `docker-compose.yml` or `render.yaml`), Next.js replaces `process.env.NEXT_PUBLIC_API_URL` with `undefined`.
- The code had a fallback: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'`.
- Because of this, the final bundle sent to users' browsers had `'http://localhost:8080'` permanently hardcoded.
- When accessed from external devices or hosted domains, this resulted in `net::ERR_CONNECTION_REFUSED`.

---

## 2. The Architectural Fix

To make the API URL truly configurable at runtime without rebuilding the Docker container, we implemented two systems:

### A. Dynamic Runtime Configuration Injection
Instead of relying on build-time variables, we fetch the server's environment variables dynamically when the page loads in the browser.

1. **Server-Side Config Endpoint** (`frontend/pages/api/config.js`):
   A Next.js server-side endpoint that reads the environment variables from the server at request time and responds with a JavaScript content type defining `window.__ENV__`:
   ```javascript
   window.__ENV__ = {
     NEXT_PUBLIC_API_URL: "https://meta-clash-backend.onrender.com",
     NEXT_PUBLIC_WS_URL: "wss://meta-clash-backend.onrender.com/api/ws"
   };
   ```

2. **Synchronous Script Injection** (`frontend/pages/_app.js`):
   We inject this script in the browser head before React hydrates the page:
   ```javascript
   <Script src="/api/config" strategy="beforeInteractive" />
   ```
   This ensures `window.__ENV__` is populated before any of our page components load or make API/WS requests.

3. **Helper Wrapper** (`frontend/lib/config.js`):
   Provides dynamic fallbacks:
   ```javascript
   export const getApiUrl = () => {
     if (typeof window !== 'undefined' && window.__ENV__?.NEXT_PUBLIC_API_URL) {
       return window.__ENV__.NEXT_PUBLIC_API_URL;
     }
     return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
   };
   ```

### B. Consolidated API Request Wrapper (`frontend/lib/api.js`)
Rather than rewriting fetch logic on every page, we consolidated all REST requests into a central client helper (`api`):

- **Automatic URL Resolution**: Calls `getApiUrl()` internally.
- **Default Headers**: Injects `Content-Type: application/json` automatically.
- **Authorization Header**: Automatically reads the token from `localStorage` and appends it to requests if available.
- **Dynamic 401 Redirects**: If the server returns a `401 Unauthorized` (session expired), it automatically logs the user out and redirects them to the `/login` page.

---

## 3. How to Use the New Client

Instead of manual `fetch` calls, pages now import the centralized client.

### GET Requests
```javascript
import { api } from '../lib/api';

// Automatically appends Authorization header and parses JSON response
const data = await api.get(`/api/users/${userId}`);
```

### POST/PUT Requests
```javascript
import { api } from '../lib/api';

// Automatically stringifies body and handles HTTP errors
const data = await api.post('/api/auth/login', { username, password });
```

---

## 4. Database Match History Serialization Fix

When a game ends, the backend saves the match and its players to PostgreSQL. However, we encountered database crashes due to `UUID` validation constraint failures:
- **The Issue**: Bots and guest players (users who play without signing up) do not have registered account IDs in the `users` table. Instead, guest player IDs are assigned as temporary session keys (e.g. `p_ELVXW`) and bots are assigned simple random hex strings (e.g. `BOT-628`). Trying to insert these values into database fields that require standard `UUID` types (like `winner_id` or `match_players.user_id`) threw errors like `pq: invalid input syntax for type uuid: "p_ELVXW"`.
- **The Solution**: 
  - We added a compile-time safe UUID format validator helper (`isValidUUID`) to `backend/internal/lobby/manager.go`.
  - When preparing database matches, any player ID (including winner ID) that is NOT a valid 36-character UUID is mapped to an empty string `""`.
  - Our database wrapper stores empty strings as `NULL`. Since the database columns are nullable, this records bot wins and guest stats as `NULL` instead of throwing syntax errors.

---

## 5. Card Layout Clipping Fix on Mobile

- **The Issue**: On smaller screens and mobile devices, the card dimensions (`100px` width, `150px` height) could not fit the 1-column layout of the 4 attributes (Rank, Strength, Speed, IQ) along with the character image and card name, causing attributes to clip or become completely hidden.
- **The Solution**:
  - We updated `frontend/components/Card.js` to change the image section height to a balanced `50%`.
  - We replaced the vertical 1-column list of attributes with a **2x2 responsive grid**.
  - This layout displays attributes side-by-side (e.g. Rank & Strength in Row 1, Speed & IQ in Row 2), cutting the vertical height requirements by **50%** and ensuring all card details remain perfectly visible and premium on every display size without breaking card dimension rules.

