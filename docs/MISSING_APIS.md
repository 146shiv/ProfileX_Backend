# ProfileX – Missing & Mismatched APIs for Frontend–Backend Integration

**Purpose:** List all APIs that are **missing** in the backend or **mismatched** with frontend expectations so the frontend can connect to the ProfileX backend.

**Last Updated:** March 5, 2025

---

## 1. Summary

| Category        | Status |
|----------------|--------|
| Auth           | Partial: login uses **username** (frontend uses **email**); **logout** and **refresh token** missing |
| Registration   | Mismatch: backend expects **username** + **fullName**; frontend sends **name** + **email** + **password** |
| Vehicle cards  | Partial: **update**, **delete**, **list all** (multiple cards), **increment download** missing |
| Other card types| Missing: **business card**, **brand card** APIs not implemented |
| Analytics      | Missing: no endpoints for views/downloads or analytics data |

---

## 2. Auth APIs

### 2.1 Login – Request body mismatch

| Item    | Backend (current)     | Frontend expectation      | Action |
|--------|------------------------|----------------------------|--------|
| Method | POST                   | POST                       | OK     |
| Path   | `/api/v1/auth/login`   | Same                       | OK     |
| Body   | `username`, `password` | `email`, `password`        | Fix    |

**Options:**

- **A (Backend change):** Add support for login by `email` (e.g. accept either `username` or `email` and resolve user).
- **B (Frontend change):** Send `username` instead of `email` (and ensure username is collected or derived, e.g. from email).

**Recommendation:** Add email-based login in backend so frontend can keep email + password.

---

### 2.2 Register – Request body mismatch

| Item    | Backend (current)              | Frontend expectation   | Action |
|--------|---------------------------------|------------------------|--------|
| Method | POST                             | POST                   | OK     |
| Path   | `/api/v1/auth/register`          | Same                   | OK     |
| Body   | `username`, `fullName`, `email`, `password` | `name`, `email`, `password` | Fix |

**Options:**

- **A (Backend change):** Accept `name` and map to `fullName`; derive `username` from email (e.g. part before `@`) or make `username` optional and auto-generate.
- **B (Frontend change):** Send `username` (e.g. from email) and `fullName` (from name) in addition to `email` and `password`.

**Recommendation:** Backend accepts `name` and `email`; set `fullName = name` and `username = email` (or derived) to minimize frontend changes.

---

### 2.3 Logout – Missing

| Item    | Backend (current) | Frontend need      |
|--------|--------------------|--------------------|
| Method | —                  | POST (or GET)      |
| Path   | —                  | e.g. `/api/v1/auth/logout` |

**Required behavior:**

- Invalidate refresh token (if stored in DB) and/or clear server-side session if any.
- Client will clear cookies / tokens and redirect to login.

**Action:** Implement `POST /api/v1/auth/logout` (and optionally accept refresh token in body or cookie and invalidate it).

---

### 2.4 Refresh token – Missing

| Item    | Backend (current) | Frontend need        |
|--------|--------------------|----------------------|
| Method | —                  | POST                 |
| Path   | —                  | e.g. `/api/v1/auth/refresh` |

**Required behavior:**

- Accept refresh token (cookie or body); verify and issue new access (and optionally refresh) token.

**Action:** Implement `POST /api/v1/auth/refresh` so the frontend can renew sessions without re-login.

---

## 3. Vehicle card APIs

### 3.1 Update vehicle card – Missing

| Item    | Backend (current) | Frontend need |
|--------|--------------------|---------------|
| Method | —                  | PUT or PATCH  |
| Path   | —                  | e.g. `/api/v1/vehicle-card/:CardId` |
| Auth   | —                  | JWT required  |

**Request body:** Same (or subset) as create: `name`, `designation`, `vehicleNumber`, `vehicleType`, `registrationNumber`, `mobileNumber`, optional `address`.  
**Response:** Updated vehicle card (same envelope as create).

**Action:** Add `PUT /api/v1/vehicle-card/:CardId` (or PATCH) with ownership check (`card.userId === req.user._id`).

---

### 3.2 Delete vehicle card – Missing

| Item    | Backend (current) | Frontend need |
|--------|--------------------|---------------|
| Method | —                  | DELETE        |
| Path   | —                  | e.g. `/api/v1/vehicle-card/:CardId` |
| Auth   | —                  | JWT required  |

**Action:** Add `DELETE /api/v1/vehicle-card/:CardId`; ensure card belongs to `req.user`.

---

### 3.3 List all my vehicle cards – Partial

| Item    | Backend (current)              | Frontend need        |
|--------|---------------------------------|----------------------|
| Method | GET                             | GET                  |
| Path   | `/api/v1/vehicle-card/my`       | Same or list endpoint|
| Response | Single card (object or null)  | List of cards        |

**Current:** Backend returns **one** card per user (`findOne`).  
**Frontend:** Dashboard expects a **list** of cards (e.g. for multiple cards in future).

**Options:**

- **A:** Keep “my” as single card; frontend treats response as one-item list.
- **B:** Change backend to allow multiple vehicle cards per user and return array from `GET /api/v1/vehicle-card/my` (or add `GET /api/v1/vehicle-cards` returning array).

**Action:** If product requirement is “multiple vehicle cards per user,” implement list endpoint (and adjust create to allow multiple). Otherwise document that “my” returns a single card and frontend adapts.

---

### 3.4 Increment download count – Missing

| Item    | Backend (current) | Frontend need |
|--------|--------------------|---------------|
| Method | —                  | POST or PATCH |
| Path   | —                  | e.g. `/api/v1/vehicle-card/:CardId/download-count` or included in download flow |
| Auth   | —                  | JWT required  |

**Required behavior:** When user downloads QR, increment a `downloadCount` (or similar) on the card for analytics.

**Action:** Either add a field `downloadCount` on VehicleCard and increment in existing `GET /api/v1/vehicle-card/download/:CardId`, or add a dedicated `POST /api/v1/vehicle-card/:CardId/increment-download` and call it from frontend after download.

---

## 4. Other card types – Missing

Frontend supports **business** and **brand** card types; backend has **only vehicle card** APIs.

### 4.1 Business card

| Endpoint (to implement) | Method | Auth | Purpose |
|--------------------------|--------|------|---------|
| Create                   | POST   | JWT  | Create business card |
| Get my / List            | GET    | JWT  | Get current user’s business card(s) |
| Update                   | PUT/PATCH | JWT | Update business card |
| Delete                   | DELETE | JWT  | Delete business card |
| Download QR              | GET    | JWT  | Get QR for card |
| Scan (public)            | GET    | No   | Get card by ID for public view |

**Action:** Design BusinessCard model and add routes/controllers mirroring vehicle-card (or a generic “cards” API with `type`).

---

### 4.2 Brand card

Same set as business card: create, list/my, update, delete, download QR, scan (public).

**Action:** Design BrandCard model (or reuse generic card model with type) and add corresponding APIs.

---

## 5. Analytics APIs – Missing

Frontend has an **Analytics** page; backend has no analytics endpoints.

| Endpoint (to implement) | Method | Auth | Purpose |
|--------------------------|--------|------|---------|
| Card stats               | GET    | JWT  | Views, downloads (and trends if stored) per card or per user |
| Optional: record view    | POST   | No   | Increment view count when someone opens scan URL (could be in scan handler) |
| Optional: record download| —      | —    | Covered by “increment download” above |

**Action:** Add fields or collection for view/download counts; add `GET /api/v1/analytics/cards` (or per-card) and optionally record view in existing scan handler.

---

## 6. Implemented APIs (for reference)

These exist and can be used once request/response and auth are aligned:

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST   | `/api/v1/auth/register` | No | Register (needs body alignment) |
| POST   | `/api/v1/auth/login`     | No | Login (needs email/username alignment) |
| POST   | `/api/v1/vehicle-card`  | JWT | Create vehicle card |
| GET    | `/api/v1/vehicle-card/my` | JWT | Get my vehicle card (single) |
| GET    | `/api/v1/vehicle-card/download/:CardId` | JWT | Get QR for card |
| GET    | `/api/v1/vehicle-card/scan/:CardId` | No | Public card view by ID |

---

## 7. Response format

Backend uses a consistent envelope:

- **Success:** `{ statusCode, data, message, success: true }`
- **Error:** `ApiError` (e.g. 4xx/5xx with message and optional `errors` array)

Frontend should parse `data` for payload and handle `success` and status codes for errors.

---

## 8. CORS and credentials

Backend allows credentials and configurable origins (`CORS_ORIGIN`, `FRONTEND_URL`). Frontend must:

- Call backend using same origin or allowed origin.
- Send credentials (cookies) if using cookie-based auth (`credentials: 'include'`).
- Or send `Authorization: Bearer <accessToken>` if using header-based auth.

---

## 9. Checklist for backend (to connect frontend)

- [ ] **Auth:** Support login by email (or document username and update frontend).
- [ ] **Auth:** Align register body with frontend (name, email, password) or document and adapt frontend.
- [ ] **Auth:** Add `POST /api/v1/auth/logout`.
- [ ] **Auth:** Add `POST /api/v1/auth/refresh`.
- [ ] **Vehicle card:** Add `PUT` or `PATCH /api/v1/vehicle-card/:CardId` (update).
- [ ] **Vehicle card:** Add `DELETE /api/v1/vehicle-card/:CardId`.
- [ ] **Vehicle card:** Decide single vs multiple cards per user; if multiple, add list endpoint.
- [ ] **Vehicle card:** Add download count (in download handler or separate increment endpoint).
- [ ] **Other cards:** Implement business card APIs (create, my/list, update, delete, download, scan).
- [ ] **Other cards:** Implement brand card APIs (same set).
- [ ] **Analytics:** Add view/download storage and `GET` analytics endpoint(s).

---

*Update this document as backend adds or changes APIs.*
