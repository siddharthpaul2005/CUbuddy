# 🎓 Campus Event Management App — Requirements Document

**Frontend:** React Native
**Backend:** TBD (recommendations below)
**Status:** Draft v0.1

---

## 1. Overview

A mobile application for discovering, tracking, and registering for campus/club events. The app has two sides:

- **Student Side** — browse today's, past, and upcoming events; register; download posters.
- **Admin Side** — create/manage events, clubs, and registrations (inferred requirement, detailed in Section 3).

---

## 2. Student Side

### 2.1 Home Page — Today's Events

Displays all events happening **today**. Each event card/screen includes:

| Element | Details |
|---|---|
| **Poster** | Event image with a **Download** button (save to device gallery) |
| **Description** | Club name, Organized by, Date, Venue |
| **Rewards** | Prizes / certificates / perks for participation |
| **Register Link** | External or in-app link/button to register |

### 2.2 Past Events

Shows events from the **last 4 days**.

- **Sort/filter by recency:**
  - Yesterday
  - 2 days ago
  - 3 days ago
  - 4 days ago
- Each past event retains **all features of the Home Page card** (poster + download, description, rewards, register link — register link may be disabled/hidden if registration has closed).

> 💡 Suggestion: Use a horizontal chip/tab selector ("Yesterday | 2d ago | 3d ago | 4d ago") above a vertical list, so users can jump straight to a day instead of scrolling.

### 2.3 Future Events

Shows **upcoming events for the next 15 days**.

- Same card structure as Home Page (poster + download, description, rewards, register link).
- Consider grouping by date (e.g., "Tomorrow", "This Week", "Next Week") rather than a flat list of 15 days, for easier scanning.

### 2.4 Filters (Global)

Available across Past / Future / possibly Home:

- **Sort by Club** (e.g., Coding Club, Dance Club, Robotics Club…)
- **Sort by Event Type** (e.g., Technical, Cultural, Sports, Workshop, Seminar)
- Optional additions to consider:
  - Sort by Date (ascending/descending)
  - Search by event name / keyword
  - Filter by "Registration still open"

---

## 3. Admin Side (Suggested)

Since events, posters, rewards, and registration links need to be created and maintained somewhere, an admin panel/app is required. Suggested modules:

### 3.1 Authentication & Roles
- Admin login (email/password or SSO)
- Optional role tiers: **Super Admin** (full access) vs **Club Admin** (can only manage their own club's events)

### 3.2 Event Management (CRUD)
- Create/Edit/Delete event
- Fields: Poster image upload, Club name, Organizer, Date & Time, Venue, Description, Rewards, Registration link, Event type/category
- Auto-classification into **Today / Past / Future** based on date (no manual bucket assignment needed)
- Poster image upload with auto-resize/compression for mobile performance

### 3.3 Club Management
- Add/Edit/Delete clubs
- Assign club admins
- Club profile: logo, description, social links

### 3.4 Registration Management
- View list of registered students per event (if registration is handled in-app rather than via external link)
- Export registrations (CSV) for attendance / reward distribution

### 3.5 Analytics Dashboard (optional, nice-to-have)
- Event views vs. registrations
- Most active clubs
- Poster download counts

### 3.6 Notifications (optional, nice-to-have)
- Push notification when a new event is posted, or a reminder 1 hour before an event starts

---

## 4. Suggested Tech Stack

### 4.1 Frontend
- **React Native** (confirmed) — consider **Expo** for faster iteration, OTA updates, and easy image handling/downloading (`expo-file-system` + `expo-media-library` for the poster download feature).

### 4.2 Backend Options

| Option | Best if... | Notes |
|---|---|---|
| **Firebase (Firestore + Storage + Auth)** | You want to move fast, minimal backend code, small-to-medium team | Great fit for this use case: Firestore for event/club data, Firebase Storage for posters, Firebase Auth for admin login, easy real-time updates (e.g., "today's events" refresh instantly) |
| **Supabase** | You want a Firebase alternative with SQL (Postgres) instead of NoSQL | Open source, built-in auth, storage, and auto-generated REST/GraphQL APIs; easier if you prefer relational data (events ↔ clubs ↔ registrations) |
| **Node.js + Express + PostgreSQL/MongoDB** | You want full control, custom business logic, or plan to scale significantly | More setup work (hosting, auth, image storage via S3/Cloudinary), but maximum flexibility |
| **Appwrite** | Self-hosted alternative to Firebase | Good if data privacy / self-hosting matters for your college's data |

**Recommendation for this project:** Start with **Firebase** or **Supabase** — the requirements (date-based event buckets, image upload/download, simple registration links, admin CRUD) map very cleanly onto their built-in features, and you avoid building auth/storage/hosting from scratch. Move to a custom Node.js backend later only if you need complex logic (e.g., in-app registration with seat limits, payment integration, or heavy analytics).

---

## 5. Suggested Data Model (high level)

```
Club
 ├─ id, name, logoUrl, description

Event
 ├─ id, title, clubId (→ Club), organizedBy
 ├─ posterUrl, description, rewards
 ├─ date, time, venue
 ├─ eventType (Technical / Cultural / Sports / Workshop / ...)
 ├─ registrationLink (or isInAppRegistration: true/false)
 ├─ createdBy (admin/club admin id)

Registration (if handling registration in-app)
 ├─ id, eventId (→ Event), studentId/name/email, registeredAt

Admin
 ├─ id, name, email, role (superAdmin / clubAdmin), clubId (nullable)
```

---

## 6. Open Questions to Resolve Next

- Will registration happen **in-app** (with a form + database) or purely via **external links** (Google Forms, etc.)?
- Do students need accounts/login, or is browsing anonymous?
- Should past events auto-delete after 4 days, or just move out of the "Past" filter view (kept in DB for records/analytics)?
- Push notifications — required for v1 or later phase?

---

## Contributors

- Himanshu
- Siddharth