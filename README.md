# SQL Practice Lab — HKDSE ICT Elective A

An interactive, browser-based SQL learning tool for HKDSE ICT Elective A (Database module). No server required — runs entirely in the browser using [sql.js](https://sql.js.org/) (SQLite compiled to WebAssembly).

---

## Project Overview

This is a teaching tool for **HKDSE ICT Elective A — Databases**, covering the complete syllabus from basic relational concepts to SQL syntax and transactions. Students can write and execute SQL queries against a pre-loaded sample school database, work through interactive exercises, and learn database concepts through structured reading modules.

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | Vanilla HTML / CSS / JavaScript (no framework) |
| Database | sql.js 1.10.3 (SQLite in WebAssembly) |
| Fonts | General Sans + JetBrains Mono (FontShare CDN) |
| Styling | CSS Variables, CSS Grid/Flexbox, dual-theme (light/dark) |

---

## File Structure

| File | Size | Purpose |
|------|------|---------|
| `index.html` | 18 KB | Main HTML structure — 5 module views, dialogs, layout |
| `app.js` | 42 KB | Core application: SQL execution, DB management, event handlers, sample data |
| `sql-reference.js` | 29 KB | SQL reference sidebar, popup system, Concepts tab renderer |
| `concepts.js` | 64 KB | Module 1: Relational Database Concepts (syllabus 1.1–1.11) |
| `creating-db.js` | 58 KB | Module 2: Creating a Simple Relational Database (syllabus 2.1–2.11) |
| `rollback.js` | 37 KB | Module 3: Purposes of Rollback (syllabus 3.1–3.8) |
| `sql-syntax.js` | 123 KB | Module 4: SQL Syntax & Functions |
| `style.css` | 60 KB+ | All styles — design tokens, dual-theme, components (2752 lines) |
| `base.css` | 2 KB | Reset / base styles |

---

## Five Learning Modules

### Module 1 — Relational Database Concepts
Syllabus sections 1.1–1.11. Topics include:
- What is a Relational Database?
- Entity & Attribute
- Domain
- One-to-Many (1:M) Relationships
- Many-to-Many (M:N) Relationships → resolved via junction table
- Primary Key (PK) & Foreign Key (FK)
- Candidate Key & Index
- Integrity Rules (Entity, Referential, Domain)
- Interactive drag-and-drop exercises, MCQs, and a 20-question quiz

### Module 2 — Creating a Simple Relational Database
Syllabus sections 2.1–2.11. Topics include:
- Good Relational Design & avoiding data redundancy
- Updating data in one place (normalised design)
- Verifying updates with SELECT + JOIN
- Joining Two Tables (INNER JOIN / equi-join)
- Joining Three Tables (junction table pattern)
- Handling NULL values
- Filtering NULL with IS NULL / IS NOT NULL
- GROUP BY and aggregate functions (COUNT, AVG, SUM, etc.)
- LEFT JOIN and HAVING
- INSERT — parent/child table order
- Creating Enrollments

### Module 3 — Purposes of Rollback
Syllabus sections 3.1–3.8. Topics include:
- What is a Transaction / Rollback?
- BEGIN Transaction
- Rolling back a wrong UPDATE
- Rolling back a wrong DELETE
- Multi-step changes and atomicity
- COMMIT to save permanently
- Transaction safety best practices
- Preventing Partial Updates

### Module 4 — SQL Syntax & Functions
Comprehensive SQL reference covering:
- **DDL**: CREATE TABLE, DROP TABLE, ALTER TABLE (ADD/DROP)
- **DML**: INSERT INTO, UPDATE, DELETE
- **DQL / Queries**: SELECT, SELECT *, DISTINCT, WHERE, ORDER BY, LIMIT, Aliases (AS)
- **Operators**: Arithmetic, Comparison (=, <, >, <=, >=, <>), AND/OR/NOT, IN, BETWEEN, LIKE, IS NULL / IS NOT NULL
- **Aggregate Functions**: COUNT, SUM, AVG, MAX/MIN, GROUP BY, HAVING
- **String Functions**: LENGTH, UPPER/LOWER, SUBSTR, || (concatenation), TRIM, REPLACE
- **JOINs**: INNER JOIN (equi-join), NATURAL JOIN, LEFT OUTER JOIN
- **Sub-queries**: Sub-query in WHERE, Sub-query with comparison
- **Views**: CREATE VIEW, Query a View, DROP VIEW

### Module 5 — SQL Practice (Main Workspace)
Interactive SQL editor with:
- Full SQL execution against an in-browser SQLite database
- 20 progressive SQL exercises with hints and "Try this SQL" buttons
- SQL Reference sidebar (collapsible categories)
- Database Tables panel (view, insert, DDL/DML export)
- Query history with success/failure status
- Dark/light theme toggle

---

## Sample Database Schema

The lab ships with a pre-loaded **school database** containing 4 tables:

```
Classes        (PK: ClassID)
Students       (PK: StudentID, FK: ClassID → Classes)
Subjects       (PK: SubjectID)
Enrolments     (PK: EnrolmentID, FK: StudentID → Students, FK: SubjectID → Subjects)
```

The **Enrolments** table serves as a **junction (link) table**, resolving the M:N relationship between Students and Subjects.

---

## Core Features

| Feature | Description |
|---------|-------------|
| **SQL Editor** | Textarea with line numbers, Tab-to-indent, Ctrl+Enter to run; vertically resizable via drag handle |
| **Results Panel** | Renders query results as styled HTML tables with NULL highlighting |
| **Query History** | Tracks last 50 queries with success/failure indicators |
| **Tables Panel** | Lists all tables/views with column info, row count, View & Insert buttons |
| **DDL / DML Export** | Generates CREATE TABLE statements or INSERT statements for all data |
| **Save / Load** | Persists database to browser's `localStorage` (persistent across sessions); also keeps an in-memory copy for quick access |
| **Export / Import** | Downloads/uploads `.db` files (SQLite binary format); useful for transferring databases between devices |
| **Reset Database** | Restores the original sample data via confirmation dialog |
| **Insert Form** | Dynamic modal that builds form fields from table schema (PRAGMA) |
| **Dark / Light Theme** | Toggle via moon/sun icon; respects `prefers-color-scheme` initially |
| **Interactive Exercises** | MCQs with instant feedback, drag-and-drop matching, 20-question quiz |
| **Concept Quiz** | 20 questions covering all syllabus topics 1.1–1.11 |
| **SQL Reference Popup** | Click any reference item to see syntax, explanation, and working example |
| **"Try this SQL"** | One-click loads example SQL into the editor and executes it |

---

## Database Persistence (Save & Resume)

The lab supports two ways to persist your work across browser sessions:

### Save / Load (Recommended — Local Storage)
- **Save**: Click **Save** to write the current database state to `localStorage`.
  - Persists across browser restarts and page refreshes.
  - Automatically restored when you reopen the lab.
- **Load**: Click **Load** to restore from the last save.
  - Falls back to `localStorage` if no in-memory save exists.

### Export / Import (.db file)
- **Export**: Downloads the current database as `sql_practice_lab.db` (SQLite binary format).
  - Use this to transfer your work to another device or keep a backup.
- **Import**: Upload a previously exported `.db` file to resume from that state.
  - Supports full database restoration including all tables, data, and schema.

### Reset Database
- Click **Reset Sample Data** to wipe the current database and reload the original sample data.
- Requires confirmation via dialog before proceeding.

> **Workflow tip**: After making changes, always click **Save** (or **Export .db**) to persist your work before closing the browser.

---

## Design System

- **CSS Variables** drive all design tokens (color, spacing, typography, radius, shadow, transition)
- **Dual-theme**: Light mode uses a technical/data-oriented blue palette; dark mode uses a deep navy palette
- **Typography**: `clamp()`-based fluid type scale for responsive sizing
- **Icons**: All inline SVGs for consistent styling and theme compatibility
- **Fonts**: General Sans (UI text) + JetBrains Mono (code/SQL editor)

---

## How to Run

Simply open `index.html` in any modern browser. No build step, no server required.

> **Note**: Because sql.js loads the WebAssembly file from CDN, an internet connection is needed on first load.

---

## Browser Compatibility

Tested in modern browsers supporting:
- WebAssembly (all major browsers)
- CSS Grid & Flexbox
- `localStorage` (for save/load feature)
- ES6+ JavaScript
