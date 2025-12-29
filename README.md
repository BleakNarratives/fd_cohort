
# 🦊 FanDuel Cohort Pro v4.5 (Exec Edition)

## Overview
FanDuel Cohort Pro is a high-fidelity analytics dashboard designed for professional edge detection in betting markets. It bridges the gap between local Python strategy scripts (`/fanduel_cohort`) and live market headers using the Gemini-3-Pro Scout Engine.

## Core Features
- **Hybrid Ingestion**: Toggle between **Live Scout** (Gemini + Google Search) and **Local Cohort** (Direct script simulation).
- **Edge Analytics**: Latency correction and sentiment overlay for line drift detection.
- **Cross-Platform Sync**: Universal link system for Android and Windows environments.
- **Executive Safety**: Hard-coded responsible play triggers and session telemetry.

## Structure
- `/components`: UI units (Terminal, Stats, Transitions).
- `/services`: API integration (Gemini, Local Bridge).
- `/storage`: (Conceptual) Linked to `/storage/emulated/0/root_2025/fanduel_cohort`.

## Quick Start
1. Ensure your API Key is set in the environment.
2. Place your `.py` scripts in the `/fanduel_cohort` directory.
3. Launch `index.html` and initiate **Scout Headers**.

---
*Confidential Property of Foxwood Academy*
