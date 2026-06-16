# INFINITE — Managed by MEDELITE
### Facility Assessment Report Generator

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![CMS API](https://img.shields.io/badge/CMS-Provider%20Data%20Catalog-005EA2?style=for-the-badge&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> A lightweight healthcare intelligence web application that automates nursing facility evaluation for Medelite Directors — replacing manual database searches with a single CCN lookup.

**🔗 Live Demo:** [medelite-assessment.vercel.app](https://medelite-assessment.vercel.app)  
**📁 Repository:** [github.com/Ruthless9890/medelite-assessment](https://github.com/Ruthless9890/medelite-assessment)

---

## Overview

Medelite Directors currently evaluate skilled nursing facilities by manually searching through public CMS databases and copying data into Word documents. This tool eliminates that process entirely.

Enter a facility's **CMS Certification Number (CCN)** → the app instantly fetches live government data, combines it with internal operational inputs, and generates a polished **PDF** or editable **Word document** — in seconds.

---

## Features

### ✅ Core MVP

| Feature | Description |
|---|---|
| **Dynamic CCN Lookup** | Fetches live data from the CMS Provider Data Catalog API for any valid facility |
| **Facility Name Override** | Replace the official CMS name with an internal Medelite name on the output |
| **Manual Operational Inputs** | EMR system, current census, patient type, Medelite history fields |
| **PDF Export** | One-click download of a polished, print-ready branded PDF |
| **Medicare Hyperlink** | Clickable link to the facility's Medicare Care Compare profile in the PDF |
| **INFINITE Branding** | Hardcoded corporate brand header — never overwritten by facility data |
| **Live Deployment** | Hosted on Vercel with a public URL |

### 🚀 Bonus Features

| Feature | Description |
|---|---|
| **12 Hospitalization/ED Metrics** | Full suite of STR and LT hospitalization/ED metrics with state and national averages |
| **Word Document Export** | Editable `.docx` download with full report data and clickable Medicare hyperlink |
| **Performance Cards** | Color-coded metric cards showing facility performance vs. national average |
| **Advanced Error Handling** | CCN format validation, friendly API error messages, network failure handling |
| **Responsive Design** | Fully responsive layout for desktop and tablet |

---

## Tech Stack

```text
Frontend:   React 18 + Vite 5
Styling:    Pure CSS with CSS Variables
PDF:        jsPDF
DOCX:       docx + file-saver
API:        CMS Provider Data Catalog (data.cms.gov)
Proxy:      Vercel Serverless Function (CORS handling)
Deployment: Vercel
```

---

## Architecture

```text
src/
├── components/
│   ├── SearchPanel.jsx     # CCN input with live validation
│   ├── ManualInputs.jsx    # Operational details form
│   ├── ReportView.jsx      # Full report + PDF/DOCX export
│   ├── MetricCards.jsx     # Color-coded performance cards
│   └── StarRating.jsx      # Reusable star rating display
├── hooks/
│   └── useCMS.js           # CMS API data fetching hook
├── App.jsx                 # Root component + state management
└── index.css               # Global styles + design system
api/
└── cms.js                  # Vercel serverless CORS proxy
```

---

## CMS Data Sources

| Dataset | ID | Description |
|---|---|---|
| Provider Information | `4pq5-n9py` | Facility details, star ratings, bed count |
| Medicare Claims Quality Measures | `ijh5-nb2v` | Hospitalization & ED visit metrics |
| State/US Averages | `xcdc-v8bm` | State and national benchmarks |

---

## Engineering Decisions

**Why React + Vite over Next.js?**
This is a client-side tool with no SEO requirements. React + Vite gives instant hot reload during development and a lean production bundle — Next.js would add unnecessary complexity.

**Why a Vercel Serverless Function for the API?**
The CMS API enforces CORS restrictions on browser requests. Rather than relying on third-party proxies, I built a lightweight Vercel serverless function that proxies requests server-side — more reliable, faster, and production-grade.

**Why metric cards instead of charts?**
Charts work best for time-series data. Since each metric has a single current value compared against two benchmarks, color-coded cards communicate performance status more clearly than a bar chart would.

**Why rectangles instead of star characters in the PDF?**
jsPDF's built-in fonts don't support Unicode star characters without embedding a custom font file. Colored rating squares are cleaner and avoid adding font files to the bundle.

**Why lazy validation on CCN input?**
Showing errors before the user has finished typing is poor UX. Errors trigger on first submit, then update live as the user corrects their input — the same pattern used by Stripe and Figma.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Ruthless9890/medelite-assessment.git
cd medelite-assessment

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Test with CCN:** `686123` — Kendall Lakes Healthcare and Rehab Center, Miami FL

---

## Validation Test Cases

| Input | Expected Result |
|---|---|
| Empty CCN | "Please enter a CCN" |
| `abcdef` | "CCN must contain numbers only" |
| `123` | "CCN must be exactly 6 digits" |
| `000000` | "No facility found" error |
| `686123` | Loads Kendall Lakes Healthcare, Miami FL |
| `105447` | Loads different facility successfully |

---

## Assumptions & Notes

- **Data currency:** The CMS Provider Data Catalog updates quarterly. Star ratings and metrics reflect the most recent CMS data, which may differ from older internal snapshots.
- **CORS handling:** CMS blocks direct browser requests. In development, a public CORS proxy is used. In production, a Vercel serverless function handles this cleanly.
- **CCN format:** Validated as exactly 6 numeric digits per CMS specification.
- **AI assistance:** AI tools were used during development as encouraged in the brief. All code has been reviewed, understood, and can be explained line-by-line.

---

## License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026 Ragavan Arivazhagan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

*Built for the Medelite Healthcare Data Automation & QA Analytics Internship Assessment*  
*Data sourced from the CMS Provider Data Catalog — a public domain U.S. government resource*