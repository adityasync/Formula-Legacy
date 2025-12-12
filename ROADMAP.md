A full-stack, data-driven Formula 1 history & analytics platform powered by **Spring Boot**, **PostgreSQL**, **React**, **Python ETL**, and **ML-based predictions**.
The project visualizes **team evolution**, **driver careers**, **race analytics**, **qualifying vs race pace**, **strategy data**, and includes **8-bit driver cards** and **subtle racing-themed SFX**.

Strictly use a pyenv for using/running python script

imagegeneration style:
"8-bit pixel art portrait of a Formula 1 driver(driver_name), trading card style, arcade colors, retro shading"

---

# 🏎️ **1. Design Overview — Racing-Themed UI**

This project follows a **strict, immersive Formula 1 visual identity**.
No cyberpunk, neon, futuristic, or sci-fi styles — the UI must feel like a **digital F1 media guide**, a **team garage dashboard**, or an **official broadcast package**.

### 🎨 **Core Design Principles**

* **F1-inspired color palette:**

  * F1 Red `#E10600`
  * Racing Black `#0B0B0B`
  * Charcoal `#222428`
  * Off-White `#F6F5F3`
  * Warm Gray `#9B9B9B`

* **Motorsport typography:**

  * *Oswald / Anton* for bold, condensed headlines (like car liveries & timing screens)
  * *Inter* for clean body text
  * *IBM Plex Mono* for numbers, lap times, timings

* **Iconography & Visual Elements:**

  * Checkered pattern dividers
  * Circuit outline SVG graphics
  * Pit-lane textures (slight grain only, no neon)
  * Section headers inspired by race broadcast overlays

### 🎮 **Interactive Elements (Racing Immersion)**

* **Grid-position animations** when showing driver results
* **Lap-by-lap timeline bars** inspired by F1 timing graphics
* **Transfer flow diagrams** resembling 2020s broadcast motion packages
* **Season slider** styled like a steering-wheel LED indicator

### 📢 **Sound Effects (SFX)**

Use **only realistic racing audio**, never arcade or cyber sounds.

Recommended audio cues:

* Starting lights countdown **beeps**
* Engine **rev & idle loop** (short, subtle)
* Pit stop **wheel gun click**
* Gearshift **blip**
* Short **crowd cheer** on highlights

**Rules:**

* SFX must be subtle, non-intrusive
* Never autoplay without user action
* Must include a **mute button** + volume slider

### 🎭 **Driver 8-bit Cards**

* Pixel-art portraits (AI-generated or programmatically converted)
* Consistent palette, trading-card layout
* Clean, retro arcade feel — but still aligned with F1 branding
* These are design-safe and unique for your project

**This design direction ensures the entire platform feels like an authentic motorsport data product.**

---

# 🧱 **2. System Architecture**

```
Python ETL → PostgreSQL (F1 Data Warehouse)
                     ↑
                     │
        Spring Boot API (Analytics Engine)
                     ↓
             React/Tailwind Frontend
                     ↓
     ML Service (Python or ONNX Prediction)
```

---

# 🗂️ **3. Datasets Included**

```
circuits.csv
constructors.csv
constructor_results.csv
constructor_standings.csv
drivers.csv
driver_standings.csv
lap_times.csv
pit_stops.csv
qualifying.csv
races.csv
results.csv
seasons.csv
sprint_results.csv
status.csv
```

These collectively represent **every driver**, **team**, **race**, **lap**, **pit stop**, and **championship** since 1950.

---

# 🚀 **4. Roadmap (Milestones)**

---

## **Milestone 0 — Project Setup & Repository Structure**

### Tasks

* Create mono-repo (`backend/`, `frontend/`, `etl/`, `ml/`, `docs/`, `assets/`)
* Add Docker (Postgres + backend)
* Basic README with project intro & racing-themed design overview

### Deliverables

* Project skeleton
* Docker environment
* Documentation base

---

## **Milestone 1 — Database Schema & ETL Pipeline**

### Tasks

* Map CSVs to Postgres relational schema
* Create core + derived tables:

  * `drivers`, `constructors`, `races`, `results`, `qualifying`, `lap_times`, etc.
  * `entries` (driver-team-season)
  * `driver_team_events` (transfers)
* Write ETL scripts to load cleanup & normalize
* Add validation (counts, null checks, sample join tests)

### Deliverables

* Schema DDL
* ETL scripts
* Populated database

---

## **Milestone 2 — Spring Boot Backend API**

### Tasks

* Implement JPA entities + repositories + services
* Create REST endpoints:

```
/api/teams
/api/teams/{id}
/api/teams/{id}/roster?season=
/api/teams/{id}/history
/api/drivers
/api/drivers/{id}
/api/drivers/{id}/career
/api/seasons/{year}/entries
/api/transfers
/api/analytics
/api/predict
```

* Add caching for heavy analytics
* Swagger documentation

### Deliverables

* Functional backend
* API documentation

---

## **Milestone 3 — Frontend (React + Tailwind)**

### Tasks

* Implement global theme using F1 visual identity

* Build pages:

  * Home (season highlights)
  * Teams → Team Evolution Timeline
  * Drivers → Career Stats + 8-bit cards
  * Seasons → Race Calendar
  * Circuits → Pace & lap-time analytics
  * Transfers → Driver movement flow map
  * Analytics → DNF, pit stops, quali-to-race delta
  * Prediction page

* Components:

  * DriverCard8Bit
  * TeamTimeline
  * RosterGrid
  * TransferSankey
  * LapTimeChart
  * PitStopChart
  * DNFChart

### Deliverables

* Completed UI with mock data
* Ready for API integration

---

## **Milestone 4 — Media Layer (Pixel Art + Racing SFX)**

### Tasks

* Generate 8-bit driver portraits

  * Option A: AI pixel-art model
  * Option B: Pillow pixelation script
* Prepare SFX pack:

  ```
  engine_rev.ogg
  start_beep.ogg
  pit_click.ogg
  gear_shift.ogg
  cheer.ogg
  ```
* Integrate SFX using Howler.js
* Add SFX settings panel: mute toggle + volume slider

### Deliverables

* Final avatar assets
* SFX integrated with UI

---

## **Milestone 5 — Advanced Analytics**

### Tasks

* Implement SQL queries:

  * Pace consistency
  * Pit stop efficiency ranking
  * Constructor evolution by era
  * Overtake index
  * Qualifying vs race performance
  * DNF cause percentages
* Add analytics endpoints
* Build dashboard UI

### Deliverables

* Analytics suite
* Visual dashboards

---

## **Milestone 6 — Machine Learning Module**

### Tasks

* Feature engineering from standings, results, quali, pit stops
* Train models:

  * Podium prediction
  * Points likelihood
  * Finishing position classification
* Export via ONNX or Flask API
* Integrate via `/api/predict`

### Deliverables

* ML notebook
* Prediction engine
* UI visualization for predictions

---

## **Milestone 7 — Deployment & Final Polish**

### Tasks

* Add CI/CD (GitHub Actions)
* Optimize backend caching + frontend loading
* Deploy via Render / DigitalOcean / AWS
* Final documentation and portfolio write-up

### Deliverables

* Production deployment
* Final `README` + `roadmap.md`
* Resume & portfolio assets

---

# 🏆 **Bonus: Resume-Ready Description**

> Built a complete F1 historical analytics platform using Spring Boot, PostgreSQL, React, and Python ETL. Designed around a pure Formula 1 racing theme with retro 8-bit driver cards and immersive SFX. Implemented team evolution timelines, driver career visualizations, circuit analytics, strategy insights, and machine-learning-powered race outcome predictions.


