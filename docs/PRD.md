# ProfileX – Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** March 5, 2025  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Vision

ProfileX is a digital profile and business-card platform that lets users create, manage, and share digital cards (e.g. vehicle cards, business cards, brand cards) via QR codes. Scanning a QR code opens a shareable digital card with the user’s details, and card owners get a simple dashboard to create, update, and track their cards.

### 1.2 Goals

- Enable users to **create and manage** multiple types of digital cards (vehicle, business, brand).
- Provide **QR-based sharing**: generate QR codes that link to a public card view.
- Support **auth**: secure signup, login, and session handling.
- Offer a **dashboard** to view, download, and delete cards.
- (Future) Provide **analytics** (views, downloads) for card engagement.

### 1.3 Target Users

- **Individual users** who want a digital vehicle/business/brand identity.
- **Small businesses** or professionals who need shareable digital cards.
- **End recipients** who scan QR codes to view card details (no account required).

---

## 2. System Context

### 2.1 High-Level Flow

1. **Backend** creates a card and returns `cardId`.
2. **Frontend** builds the public card URL and can generate a QR code (or backend returns QR).
3. **Scan** opens the URL (e.g. `/vehicle-card/:cardId`).
4. **Frontend** calls a **GET** API with `cardId`.
5. **API** returns card data; frontend renders the card.

### 2.2 Architecture

| Layer        | Stack / Description                                      |
|-------------|-----------------------------------------------------------|
| **Frontend**| React, Vite, React Router, Tailwind, shadcn-style UI      |
| **Backend** | Node.js, Express (ES modules)                             |
| **Database**| MongoDB (Mongoose)                                        |
| **Auth**    | JWT (access + refresh), httpOnly cookies or Bearer header |

---

## 3. User Roles & Capabilities

| Role            | Capabilities                                                                 |
|-----------------|-------------------------------------------------------------------------------|
| **Guest**       | View landing; sign up; log in; view public card via scan URL (no auth).      |
| **Logged-in**   | Create / update / delete own cards; view dashboard; download QR; (future) analytics. |
| **Scanner**     | Open scan URL and view card details (no login).                              |

---

## 4. Features & Requirements

### 4.1 Authentication

- **Sign up**  
  - User provides: name, email, password (frontend).  
  - Backend expects: `username`, `fullName`, `email`, `password`.  
  - Outcome: account created; user can log in.

- **Login**  
  - User provides: email, password (frontend).  
  - Backend currently: `username`, `password`.  
  - Outcome: session via JWT (cookies and/or body); user context available in app.

- **Logout**  
  - Clear tokens on client; optional backend endpoint to invalidate refresh token.

- **Session**  
  - Access token (and optionally refresh token) in httpOnly cookies or `Authorization: Bearer`; protected routes require valid JWT.

### 4.2 Card Types (Conceptual)

| Type      | Purpose                          | Backend Status   |
|-----------|----------------------------------|-------------------|
| Vehicle   | Driver/vehicle identity card     | Implemented       |
| Business  | Professional/business card       | Not implemented   |
| Brand     | Brand/company card               | Not implemented   |

### 4.3 Vehicle Card (Current Backend Scope)

- **Create**  
  - Fields: name, designation, vehicle number, vehicle type, registration number, mobile number (optional: address).  
  - One vehicle number per card; unique per system (or per user as per product rules).  
  - Requires authentication.

- **My card**  
  - GET “my” vehicle card for the logged-in user (single card per user in current design).

- **Download QR**  
  - GET QR code (e.g. data URL) for the card’s public URL; card must belong to the user.

- **Scan / public view**  
  - GET card by `cardId`; no auth; returns card details for display.

### 4.4 Dashboard (Frontend)

- List user’s cards (currently mock; backend only has “my” single vehicle card).
- Actions: download (QR), delete card.
- “Latest card” / primary card for quick download (when multiple cards exist in future).

### 4.5 Card Creation Flow (Frontend)

- User selects card type (e.g. vehicle, business, brand).
- Form for that type; submit → create card (currently vehicle only on backend).
- Success screen with option to download QR or go to dashboard.

### 4.6 Public Card View (Frontend)

- Route like `/vehicle-card/:cardId` (or generic `/card/:cardId`).
- Frontend calls backend GET scan API with `cardId` and renders card (no login).

### 4.7 Analytics (Frontend – Planned)

- Page exists; backend does not yet expose view counts, download counts, or time-series data.

---

## 5. User Flows (Summary)

1. **Registration**  
   Landing → Sign up (name, email, password) → Backend register (align with username/fullName) → Redirect to login or dashboard.

2. **Login**  
   Landing/Login → Email + password (or username once aligned) → Backend login → Tokens set → Dashboard.

3. **Create vehicle card**  
   Dashboard → New card → Vehicle → Fill form → Submit → Backend create → Success → Download QR or view in dashboard.

4. **View own card**  
   Dashboard → “My card” or list → View / Download QR.

5. **Scan card**  
   Scan QR → Open URL → Frontend calls GET scan API → Show card.

6. **Delete card**  
   Dashboard → Delete (not yet in backend).

7. **Update card**  
   Dashboard → Edit card (not yet in backend).

---

## 6. Non-Functional Requirements

- **Security:** Passwords hashed (bcrypt); JWT for API auth; CORS and cookie options for production.
- **Availability:** Backend and DB deployed; frontend can be static (e.g. Vercel).
- **UX:** Responsive UI; clear errors; loading states for API calls.
- **Compatibility:** Frontend may run on `localhost:5173` or production URL; backend allows configurable origins (`CORS_ORIGIN`, `FRONTEND_URL`).

---

## 7. Out of Scope (Current Phase)

- Social login (Google, etc.).
- Multi-card-type backend (business, brand) – planned.
- Full analytics API and dashboard.
- Card templates/themes (backend).
- Team/org accounts.

---

## 8. Success Metrics (Proposed)

- User signups and logins.
- Number of cards created (by type).
- Scan/view count per card (when analytics exists).
- QR download count (when tracked).

---

## 9. References

- Backend: `src/app.js`, `src/routes/*`, `src/controllers/*`, `src/models/*`
- Frontend: App context (auth + cards), CreateCard, Dashboard, CardView, Analytics
- Existing note: `prd.md` (backend → cardId, frontend → URL/QR, scan → GET API)

---

*This PRD should be updated when new card types, analytics, or major flows are added.*
