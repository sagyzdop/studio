# Hackathon Project – AI-Powered BI Dashboard

## Overview

This project is a web app built for the **Shai.Pro Hackathon**.
It allows users to interact with corporate databases in **natural language** and instantly visualize the results.

The system converts user queries into SQL, executes them against a **Cloudflare D1 database**, and displays the results in **real-time charts** with **Chart.js**. Saved queries can be turned into a personalized dashboard and shared as images.


## Tech Stack

* **Frontend:** Next.js (React), Chart.js, WebSockets
* **Backend:** FastAPI (Python), WebSocket for live chart updates
* **Database:** Cloudflare D1
* **Auth:** Firebase Authentication (with role-based access control for Admins)
* **Deployment:** Firebase Hosting + local FastAPI server


## Features

### 🔹 Chat Menu

* AI chatflow realised on hackathon.shai.pro .
* Flow:

  1. User enters a natural-language prompt (e.g., *“Average cost per product category”*).
  2. Open source LLM - Llama 4 Scout FP8, generates an SQL query, using knowledge base which consists of txt file embedded using open source model - all-MiniLM-L6-v2 on Hugging Face.
  3. SQL is transformed from txt to json and executed against Cloudflare D1, which is connected using dify marketplace tool - Cloudflare D1 Executor - and account id, database id, and API key.
  4. Backend returns results in JSON, which is then transformed into txt.
  5. AI provides:

     * Natural Language response, which includes insights from query results.
     * Executed SQL query.

* **Content Area 1**: Live chart visualization powered by Chart.js.
* WebSocket connection ensures **real-time updates**.
* Buttons under the chart:

  * **Add to Dashboard** → Save SQL query into database.
  * **Share** → Export chart as image (`toBase64Image()`).


### 🔹 Dashboard Menu

* Displays multiple blocks with saved charts.
* **+ Add Block** → redirects to Chat menu.
* Each block:
  * Renders a Chart.js chart
  * Has its own **Share** button
* Top-right corner:

  * **Refresh** → re-executes SQL for all saved blocks.
  * **Export** → saves the entire dashboard as a single image.

---

### 🔹 Knowledge Menu (Admin only)

* Visible only for users with `admin` role.
* Two sections:

  * **Instructions** (placeholder text).
  * **Embedded AI chatbot** (iframe).

---

### 🔹 User Profile

* Modal window for profile management.
* Login/Logout functionality.
* Supports role-based access (user vs admin).

---

### 🔹 About Modal

* Simple modal (same size as profile modal).
* Contains:

  * Info about the project
  * Team members (4 people)

---

## Database Schema

Cloudflare D1 tables required:

![zhurek_stationery.png](./assets/zhurek_stationery.png)

## Running Locally

```bash
git clone https://github.com/sagyzdop/studio.git
cd hackathon-app
docker compose up -d
```

---

## Team

* 👨‍💻 Bakhtiyar – Backend & Frontend
* 👨‍💻 Arlan 2 – AI Engineer
* 👨‍💻 Bekzat 3 – AI Engineer
* 👨‍💻 Miras 4 – Data Engineer

---

## Next Steps

* Enhance AI chatbot accuracy
* Add chart customization (filters, types)
* Improve dashboard export options

---

## Limitations

* read limitations.pdf
