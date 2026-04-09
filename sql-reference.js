/* ===== SQL Reference Data + Popup Logic + Concepts Tab ===== */

// ========== REFERENCE DATA ==========
const sqlReferenceData = [
  {
    category: 'DDL — Data Definition',
    items: [
      {
        name: 'CREATE TABLE',
        syntax: 'CREATE TABLE name (col type, ...);',
        explanation: 'Creates a new table in the database. You define columns with their data types and optional constraints such as PRIMARY KEY, NOT NULL, and FOREIGN KEY.',
        example: `CREATE TABLE Teachers (
  TeacherID INT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Department VARCHAR(30)
);`
      },
      {
        name: 'DROP TABLE',
        syntax: 'DROP TABLE name;',
        explanation: 'Permanently removes a table and all its data from the database. Use with caution — this action cannot be undone.',
        example: `DROP TABLE Teachers;`
      },
      {
        name: 'ALTER TABLE (ADD)',
        syntax: 'ALTER TABLE name ADD col type;',
        explanation: 'Adds a new column to an existing table. The new column will have NULL values for all existing rows.',
        example: `ALTER TABLE Students
ADD Phone VARCHAR(20);`
      },
      {
        name: 'ALTER TABLE (DROP)',
        syntax: 'ALTER TABLE name DROP COLUMN col;',
        explanation: 'Removes a column from an existing table. All data in that column will be lost.',
        example: `ALTER TABLE Students
DROP COLUMN Phone;`
      }
    ]
  },
  {
    category: 'DML — Data Manipulation',
    items: [
      {
        name: 'INSERT INTO',
        syntax: 'INSERT INTO table VALUES (...);',
        explanation: 'Adds a new row of data into a table. You can specify all columns or only selected columns.',
        example: `INSERT INTO Students
  (StudentID, Name, Age, Gender, ClassID)
VALUES
  (11, 'Li Mei', 16, 'F', 103);`
      },
      {
        name: 'UPDATE',
        syntax: 'UPDATE table SET col=val WHERE ...;',
        explanation: 'Modifies existing data in a table. Always use a WHERE clause to target specific rows, otherwise all rows will be updated.',
        example: `UPDATE Students
SET Age = 17
WHERE StudentID = 1;`
      },
      {
        name: 'DELETE',
        syntax: 'DELETE FROM table WHERE ...;',
        explanation: 'Removes rows from a table. Always use a WHERE clause to target specific rows, otherwise all rows will be deleted.',
        example: `DELETE FROM Students
WHERE StudentID = 11;`
      }
    ]
  },
  {
    category: 'DQL — Queries',
    items: [
      {
        name: 'SELECT',
        syntax: 'SELECT col1, col2 FROM table;',
        explanation: 'Retrieves data from one or more tables. Use * to select all columns, or list specific column names.',
        example: `SELECT Name, Age
FROM Students;`
      },
      {
        name: 'SELECT *',
        syntax: 'SELECT * FROM table;',
        explanation: 'Retrieves all columns from a table. Useful for exploration, but in practice you should list only the columns you need.',
        example: `SELECT * FROM Students;`
      },
      {
        name: 'DISTINCT',
        syntax: 'SELECT DISTINCT col FROM table;',
        explanation: 'Returns only unique (non-duplicate) values for the specified columns.',
        example: `SELECT DISTINCT Gender
FROM Students;`
      },
      {
        name: 'WHERE',
        syntax: 'SELECT ... WHERE condition;',
        explanation: 'Filters rows based on a condition. Only rows that satisfy the condition are included in the result.',
        example: `SELECT * FROM Students
WHERE Age >= 16;`
      },
      {
        name: 'ORDER BY',
        syntax: 'SELECT ... ORDER BY col [ASC|DESC];',
        explanation: 'Sorts the result set by one or more columns. ASC (ascending) is the default; use DESC for descending order.',
        example: `SELECT Name, Age
FROM Students
ORDER BY Age DESC;`
      },
      {
        name: 'LIMIT',
        syntax: 'SELECT ... LIMIT n;',
        explanation: 'Restricts the number of rows returned. Useful for getting top N results.',
        example: `SELECT Name, Age
FROM Students
ORDER BY Age DESC
LIMIT 3;`
      },
      {
        name: 'Aliases (AS)',
        syntax: 'SELECT col AS alias FROM table;',
        explanation: 'Gives a temporary name to a column or table in the result set. Makes output easier to read.',
        example: `SELECT Name AS StudentName,
       Age AS StudentAge
FROM Students;`
      }
    ]
  },
  {
    category: 'Operators',
    items: [
      {
        name: 'Arithmetic (+, -, *, /)',
        syntax: 'SELECT col + 10 FROM table;',
        explanation: 'Perform calculations on numeric data. Supported operators: + (add), - (subtract), * (multiply), / (divide).',
        example: `SELECT Name,
       Score,
       Score * 1.1 AS AdjustedScore
FROM Enrolments e
JOIN Students s ON e.StudentID = s.StudentID
WHERE e.SubjectID = 1;`
      },
      {
        name: 'Comparison (=, <, >, <=, >=, <>)',
        syntax: 'WHERE col = value',
        explanation: 'Compare values in WHERE clauses. <> means "not equal to". These work with numbers, text, and dates.',
        example: `SELECT Name FROM Students
WHERE Age <> 16;`
      },
      {
        name: 'AND / OR / NOT',
        syntax: 'WHERE cond1 AND cond2',
        explanation: 'Combine multiple conditions. AND requires all conditions true; OR requires at least one true; NOT negates a condition.',
        example: `SELECT * FROM Students
WHERE Age >= 16
  AND Gender = 'F';`
      },
      {
        name: 'IN',
        syntax: "WHERE col IN (v1, v2, ...)",
        explanation: 'Tests whether a value matches any value in a list. Shorthand for multiple OR conditions.',
        example: `SELECT * FROM Students
WHERE ClassID IN (101, 102);`
      },
      {
        name: 'BETWEEN',
        syntax: 'WHERE col BETWEEN a AND b',
        explanation: 'Tests whether a value falls within a range (inclusive of both endpoints).',
        example: `SELECT * FROM Students
WHERE Age BETWEEN 15 AND 17;`
      },
      {
        name: 'LIKE',
        syntax: "WHERE col LIKE 'pattern'",
        explanation: 'Pattern matching for text. Use % for any sequence of characters and _ for a single character.',
        example: `SELECT * FROM Students
WHERE Name LIKE 'C%';`
      },
      {
        name: 'IS NULL / IS NOT NULL',
        syntax: 'WHERE col IS NULL',
        explanation: 'Tests for NULL (missing) values. You cannot use = NULL — you must use IS NULL.',
        example: `SELECT Name FROM Students
WHERE Email IS NULL;`
      }
    ]
  },
  {
    category: 'Aggregate Functions',
    items: [
      {
        name: 'COUNT',
        syntax: 'SELECT COUNT(col) FROM table;',
        explanation: 'Counts the number of rows or non-NULL values. COUNT(*) counts all rows including NULLs.',
        example: `SELECT COUNT(*) AS TotalStudents
FROM Students;`
      },
      {
        name: 'SUM',
        syntax: 'SELECT SUM(col) FROM table;',
        explanation: 'Returns the total sum of a numeric column. NULL values are ignored.',
        example: `SELECT SUM(Score) AS TotalScore
FROM Enrolments
WHERE StudentID = 1;`
      },
      {
        name: 'AVG',
        syntax: 'SELECT AVG(col) FROM table;',
        explanation: 'Returns the average value of a numeric column. NULL values are ignored.',
        example: `SELECT AVG(Score) AS AvgScore
FROM Enrolments;`
      },
      {
        name: 'MAX / MIN',
        syntax: 'SELECT MAX(col), MIN(col) FROM table;',
        explanation: 'MAX returns the highest value; MIN returns the lowest. Works with numbers and text.',
        example: `SELECT MAX(Score) AS Highest,
       MIN(Score) AS Lowest
FROM Enrolments;`
      },
      {
        name: 'GROUP BY',
        syntax: 'SELECT col, AGG() ... GROUP BY col;',
        explanation: 'Groups rows sharing the same value(s), then applies aggregate functions to each group separately.',
        example: `SELECT ClassID,
       COUNT(*) AS NumStudents
FROM Students
GROUP BY ClassID;`
      },
      {
        name: 'HAVING',
        syntax: 'SELECT ... GROUP BY col HAVING condition;',
        explanation: 'Filters groups after GROUP BY. Similar to WHERE but works on aggregated results.',
        example: `SELECT ClassID,
       COUNT(*) AS NumStudents
FROM Students
GROUP BY ClassID
HAVING COUNT(*) > 2;`
      }
    ]
  },
  {
    category: 'String Functions',
    items: [
      {
        name: 'LENGTH',
        syntax: "SELECT LENGTH(col);",
        explanation: 'Returns the number of characters in a string.',
        example: `SELECT Name,
       LENGTH(Name) AS NameLength
FROM Students;`
      },
      {
        name: 'UPPER / LOWER',
        syntax: 'SELECT UPPER(col), LOWER(col);',
        explanation: 'UPPER converts text to uppercase; LOWER converts to lowercase.',
        example: `SELECT UPPER(Name) AS UpperName,
       LOWER(Name) AS LowerName
FROM Students;`
      },
      {
        name: 'SUBSTR',
        syntax: 'SELECT SUBSTR(col, start, length);',
        explanation: 'Extracts a portion of a string. Start position begins at 1.',
        example: `SELECT Name,
       SUBSTR(Name, 1, 4) AS Short
FROM Students;`
      },
      {
        name: '|| (Concatenation)',
        syntax: "SELECT col1 || ' ' || col2;",
        explanation: 'Joins strings together. In SQLite, the || operator is used for concatenation.',
        example: `SELECT Name || ' (' || Age || ')'
  AS StudentInfo
FROM Students;`
      },
      {
        name: 'TRIM',
        syntax: 'SELECT TRIM(col);',
        explanation: 'Removes leading and trailing spaces from a string. You can also use LTRIM/RTRIM for left/right only.',
        example: `SELECT TRIM('  Hello  ')
  AS Trimmed;`
      },
      {
        name: 'REPLACE',
        syntax: "SELECT REPLACE(col, 'old', 'new');",
        explanation: 'Replaces all occurrences of a substring with another string.',
        example: `SELECT REPLACE(Email,
  '@school.edu.hk',
  '@new.edu.hk') AS NewEmail
FROM Students
WHERE Email IS NOT NULL;`
      }
    ]
  },
  {
    category: 'JOINs',
    items: [
      {
        name: 'INNER JOIN (Equi-Join)',
        syntax: 'SELECT ... FROM A INNER JOIN B ON A.col = B.col;',
        explanation: 'Returns only rows with matching values in both tables. This is the most common join type.',
        example: `SELECT s.Name, c.ClassName
FROM Students s
INNER JOIN Classes c
  ON s.ClassID = c.ClassID;`
      },
      {
        name: 'NATURAL JOIN',
        syntax: 'SELECT ... FROM A NATURAL JOIN B;',
        explanation: 'Automatically joins tables on columns with the same name. No ON clause needed, but less explicit than INNER JOIN.',
        example: `SELECT *
FROM Students
NATURAL JOIN Classes;`
      },
      {
        name: 'LEFT OUTER JOIN',
        syntax: 'SELECT ... FROM A LEFT JOIN B ON ...;',
        explanation: 'Returns all rows from the left table and matched rows from the right table. Unmatched right-side columns show NULL.',
        example: `SELECT s.Name,
       sub.SubjectName,
       e.Score
FROM Students s
LEFT JOIN Enrolments e
  ON s.StudentID = e.StudentID
LEFT JOIN Subjects sub
  ON e.SubjectID = sub.SubjectID;`
      }
    ]
  },
  {
    category: 'Sub-queries',
    items: [
      {
        name: 'Sub-query in WHERE',
        syntax: 'SELECT ... WHERE col > (SELECT ...);',
        explanation: 'A query nested inside another query. The inner query runs first and its result is used by the outer query. HKDSE covers one sub-level.',
        example: `SELECT Name FROM Students
WHERE StudentID IN (
  SELECT StudentID
  FROM Enrolments
  WHERE Score > (
    SELECT AVG(Score)
    FROM Enrolments
  )
);`
      }
    ]
  },
  {
    category: 'Views',
    items: [
      {
        name: 'CREATE VIEW',
        syntax: 'CREATE VIEW name AS SELECT ...;',
        explanation: 'Creates a virtual table based on a SELECT query. Views simplify complex queries and can be queried like regular tables.',
        example: `CREATE VIEW TopStudents AS
SELECT DISTINCT s.StudentID, s.Name
FROM Students s
INNER JOIN Enrolments e
  ON s.StudentID = e.StudentID
WHERE e.Grade = 'A';`
      },
      {
        name: 'Query a View',
        syntax: 'SELECT * FROM view_name;',
        explanation: 'Once created, a view can be queried just like a table. The underlying SELECT runs each time you query the view.',
        example: `SELECT * FROM TopStudents;`
      },
      {
        name: 'DROP VIEW',
        syntax: 'DROP VIEW name;',
        explanation: 'Removes a view from the database. The original tables and data are not affected.',
        example: `DROP VIEW IF EXISTS TopStudents;`
      }
    ]
  }
];

// ========== CONCEPTS TAB DATA (Syllabus Topics) ==========
const conceptsTabData = [
  {
    topic: 'Data Definition (DDL)',
    description: 'DDL statements define and modify the structure of database objects like tables.',
    concepts: [
      {
        title: 'CREATE TABLE',
        review: 'Defines a new table with column names, data types, and constraints (PRIMARY KEY, NOT NULL, FOREIGN KEY). Each table must have a primary key that uniquely identifies each row.',
        sql: `CREATE TABLE Teachers (
  TeacherID INT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Department VARCHAR(30)
);`
      },
      {
        title: 'ALTER TABLE',
        review: 'Modifies an existing table by adding, removing, or changing columns. Use ADD to add a column and DROP COLUMN to remove one.',
        sql: `ALTER TABLE Students
ADD Phone VARCHAR(20);`
      },
      {
        title: 'DROP TABLE',
        review: 'Permanently removes a table and all its data. This cannot be undone. Use DROP TABLE IF EXISTS to avoid errors.',
        sql: `DROP TABLE IF EXISTS Teachers;`
      }
    ]
  },
  {
    topic: 'Data Manipulation (DML)',
    description: 'DML statements add, change, or remove data within existing tables.',
    concepts: [
      {
        title: 'INSERT INTO',
        review: 'Adds new rows to a table. You can insert values for all columns or specify only certain columns.',
        sql: `INSERT INTO Students
  (StudentID, Name, Age, Gender, ClassID)
VALUES (11, 'Li Mei', 16, 'F', 103);`
      },
      {
        title: 'UPDATE',
        review: 'Changes existing data. Always include a WHERE clause to update specific rows — without it, every row is updated.',
        sql: `UPDATE Students
SET Age = 17
WHERE StudentID = 1;`
      },
      {
        title: 'DELETE',
        review: 'Removes rows from a table. Use WHERE to target specific rows. Without WHERE, all rows are deleted.',
        sql: `DELETE FROM Students
WHERE StudentID = 11;`
      }
    ]
  },
  {
    topic: 'Queries & Sorting',
    description: 'SELECT statements retrieve and organise data from tables.',
    concepts: [
      {
        title: 'SELECT with WHERE',
        review: 'The WHERE clause filters rows based on conditions. Only rows meeting the condition appear in results.',
        sql: `SELECT Name, Age
FROM Students
WHERE Age >= 16;`
      },
      {
        title: 'ORDER BY',
        review: 'Sorts results by one or more columns. Default is ASC (ascending). Use DESC for descending.',
        sql: `SELECT Name, Age
FROM Students
ORDER BY Age DESC, Name ASC;`
      },
      {
        title: 'DISTINCT',
        review: 'Eliminates duplicate rows from results. Only unique combinations of the selected columns are returned.',
        sql: `SELECT DISTINCT Gender, ClassID
FROM Students;`
      },
      {
        title: 'Column Aliases (AS)',
        review: 'Gives a column a temporary name in the result set. Useful for making output readable.',
        sql: `SELECT Name AS "Student Name",
       Age AS "Student Age"
FROM Students;`
      }
    ]
  },
  {
    topic: 'Operators',
    description: 'Operators compare values, combine conditions, and perform pattern matching in SQL.',
    concepts: [
      {
        title: 'Arithmetic Operators',
        review: 'Use +, -, *, / in SELECT or WHERE clauses for calculations on numeric data.',
        sql: `SELECT Name, Score,
       Score * 1.1 AS BonusScore
FROM Enrolments e
JOIN Students s
  ON e.StudentID = s.StudentID;`
      },
      {
        title: 'Comparison Operators',
        review: 'Use =, <>, <, >, <=, >= to compare values. <> means "not equal to".',
        sql: `SELECT * FROM Students
WHERE Age <> 16;`
      },
      {
        title: 'Logical: AND, OR, NOT',
        review: 'AND requires all conditions to be true. OR requires at least one. NOT negates a condition.',
        sql: `SELECT * FROM Students
WHERE Age >= 16
  AND Gender = 'F';`
      },
      {
        title: 'IN and BETWEEN',
        review: 'IN checks if a value is in a list. BETWEEN checks if a value is within a range (inclusive).',
        sql: `SELECT * FROM Students
WHERE ClassID IN (101, 102)
  AND Age BETWEEN 15 AND 17;`
      },
      {
        title: 'LIKE (Pattern Matching)',
        review: '% matches any sequence of characters. _ matches exactly one character. Case-insensitive in SQLite.',
        sql: `SELECT * FROM Students
WHERE Name LIKE 'C%';`
      },
      {
        title: 'IS NULL / IS NOT NULL',
        review: 'NULL means "unknown" or "missing". Use IS NULL (not = NULL) to test for missing values.',
        sql: `SELECT Name FROM Students
WHERE Email IS NULL;`
      }
    ]
  },
  {
    topic: 'Aggregate Functions',
    description: 'Aggregate functions compute a single result from a set of rows.',
    concepts: [
      {
        title: 'COUNT, SUM, AVG, MAX, MIN',
        review: 'COUNT counts rows. SUM totals values. AVG computes the mean. MAX/MIN find the highest/lowest. All ignore NULLs except COUNT(*).',
        sql: `SELECT COUNT(*) AS Total,
       AVG(Score) AS AvgScore,
       MAX(Score) AS Highest,
       MIN(Score) AS Lowest,
       SUM(Score) AS TotalScore
FROM Enrolments;`
      },
      {
        title: 'GROUP BY',
        review: 'Groups rows with the same value(s) before applying aggregate functions. Each group produces one result row.',
        sql: `SELECT ClassID,
       COUNT(*) AS NumStudents,
       AVG(Age) AS AvgAge
FROM Students
GROUP BY ClassID;`
      },
      {
        title: 'HAVING',
        review: 'Filters groups after aggregation. WHERE filters individual rows before grouping; HAVING filters after.',
        sql: `SELECT SubjectID,
       AVG(Score) AS AvgScore
FROM Enrolments
GROUP BY SubjectID
HAVING AVG(Score) > 75;`
      }
    ]
  },
  {
    topic: 'String Functions',
    description: 'String functions manipulate text data within SQL queries.',
    concepts: [
      {
        title: 'LENGTH, UPPER, LOWER',
        review: 'LENGTH returns the number of characters. UPPER/LOWER convert text case.',
        sql: `SELECT Name,
       LENGTH(Name) AS Len,
       UPPER(Name) AS Up,
       LOWER(Name) AS Lo
FROM Students;`
      },
      {
        title: 'SUBSTR',
        review: 'Extracts a substring. SUBSTR(string, start, length) — positions begin at 1.',
        sql: `SELECT Name,
       SUBSTR(Name, 1, 4) AS Short
FROM Students;`
      },
      {
        title: 'Concatenation (||), TRIM, REPLACE',
        review: '|| joins strings together. TRIM removes leading/trailing spaces. REPLACE substitutes text.',
        sql: `SELECT Name || ' <' ||
  COALESCE(Email, 'N/A') || '>'
  AS ContactInfo
FROM Students;`
      }
    ]
  },
  {
    topic: 'JOINs (Multiple Tables)',
    description: 'JOINs combine rows from two or more tables based on related columns.',
    concepts: [
      {
        title: 'INNER JOIN (Equi-Join)',
        review: 'Returns only rows with matching values in both tables. The most common join type in SQL.',
        sql: `SELECT s.Name, c.ClassName,
       c.ClassTeacher
FROM Students s
INNER JOIN Classes c
  ON s.ClassID = c.ClassID;`
      },
      {
        title: 'NATURAL JOIN',
        review: 'Automatically matches columns with the same name. Simpler syntax but less explicit than INNER JOIN.',
        sql: `SELECT * FROM Students
NATURAL JOIN Classes;`
      },
      {
        title: 'LEFT OUTER JOIN',
        review: 'Returns ALL rows from the left table, plus matching rows from the right. Unmatched rows show NULL.',
        sql: `SELECT s.Name,
       sub.SubjectName,
       e.Score
FROM Students s
LEFT JOIN Enrolments e
  ON s.StudentID = e.StudentID
LEFT JOIN Subjects sub
  ON e.SubjectID = sub.SubjectID;`
      }
    ]
  },
  {
    topic: 'Sub-queries',
    description: 'A sub-query is a SELECT statement nested inside another query.',
    concepts: [
      {
        title: 'Sub-query in WHERE',
        review: 'The inner query executes first; its result is used by the outer query. HKDSE covers one level of nesting.',
        sql: `SELECT Name FROM Students
WHERE StudentID IN (
  SELECT StudentID
  FROM Enrolments
  WHERE Score > (
    SELECT AVG(Score)
    FROM Enrolments
  )
);`
      },
      {
        title: 'Sub-query with Comparison',
        review: 'Use a sub-query with >, <, = to compare against a single aggregated value.',
        sql: `SELECT Name, Age
FROM Students
WHERE Age > (
  SELECT AVG(Age) FROM Students
);`
      }
    ]
  },
  {
    topic: 'Views',
    description: 'Views are virtual tables created from SELECT queries, used to simplify complex queries.',
    concepts: [
      {
        title: 'CREATE VIEW',
        review: 'A view stores a query definition. When queried, the underlying SELECT runs automatically.',
        sql: `CREATE VIEW TopStudents AS
SELECT DISTINCT s.StudentID, s.Name
FROM Students s
INNER JOIN Enrolments e
  ON s.StudentID = e.StudentID
WHERE e.Grade = 'A';`
      },
      {
        title: 'Use and Drop a View',
        review: 'Query a view like a table with SELECT. Remove it with DROP VIEW. Original data is unaffected.',
        sql: `-- Query the view
SELECT * FROM TopStudents;

-- Drop the view when no longer needed
-- DROP VIEW TopStudents;`
      }
    ]
  }
];

// ========== RENDER LEFT SIDEBAR ==========
function renderRefSidebar() {
  const body = document.getElementById('refSidebarBody');
  if (!body) return;

  let html = '';
  sqlReferenceData.forEach((group, gi) => {
    html += `<div class="ref-group">
      <div class="ref-group-title" data-group="${gi}">${group.category}</div>
      <div class="ref-group-items" id="refGroup${gi}">`;
    group.items.forEach((item, ii) => {
      html += `<button class="ref-item" data-group="${gi}" data-item="${ii}">${item.name}</button>`;
    });
    html += `</div></div>`;
  });
  body.innerHTML = html;

  // Collapse / expand groups
  body.querySelectorAll('.ref-group-title').forEach(title => {
    title.addEventListener('click', () => {
      const items = document.getElementById(`refGroup${title.dataset.group}`);
      items.classList.toggle('collapsed');
      title.classList.toggle('collapsed');
    });
  });

  // Item click → open popup
  body.querySelectorAll('.ref-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gi = parseInt(btn.dataset.group);
      const ii = parseInt(btn.dataset.item);
      const item = sqlReferenceData[gi].items[ii];
      openRefPopup(item);
    });
  });
}

// ========== POPUP LOGIC ==========
let currentPopupSQL = '';

function openRefPopup(item) {
  const popup = document.getElementById('refPopup');
  const overlay = document.getElementById('refPopupOverlay');
  const title = document.getElementById('refPopupTitle');
  const body = document.getElementById('refPopupBody');

  title.textContent = item.name;
  currentPopupSQL = item.example;

  body.innerHTML = `
    <div class="popup-syntax"><span class="popup-label">Syntax</span><code>${escapeHTML(item.syntax)}</code></div>
    <div class="popup-explanation"><span class="popup-label">Explanation</span><p>${escapeHTML(item.explanation)}</p></div>
    <div class="popup-example"><span class="popup-label">Example</span><pre><code>${escapeHTML(item.example)}</code></pre></div>
  `;

  popup.classList.add('open');
  overlay.classList.add('open');
}

function closeRefPopup() {
  document.getElementById('refPopup').classList.remove('open');
  document.getElementById('refPopupOverlay').classList.remove('open');
}

function tryPopupSQL() {
  if (!currentPopupSQL) return;
  const editor = document.getElementById('sqlEditor');
  editor.value = currentPopupSQL;
  updateLineNumbers();
  closeRefPopup();
  editor.focus();
  // Switch to output tab
  document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-result="output"]').classList.add('active');
  document.getElementById('result-output').classList.add('active');
}

function setupPopupEvents() {
  const closeBtn = document.getElementById('refPopupClose');
  const overlay = document.getElementById('refPopupOverlay');
  const tryBtn = document.getElementById('refPopupTry');

  if (closeBtn) closeBtn.addEventListener('click', closeRefPopup);
  if (overlay) overlay.addEventListener('click', closeRefPopup);
  if (tryBtn) tryBtn.addEventListener('click', tryPopupSQL);

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRefPopup();
  });
}

// ========== RENDER CONCEPTS TAB (RIGHT PANEL) ==========
function renderConceptsTab() {
  const panel = document.getElementById('rpanel-concepts');
  if (!panel) return;

  let html = '<div class="concepts-tab-inner">';
  conceptsTabData.forEach((section, si) => {
    html += `<div class="ctab-section">
      <div class="ctab-section-header" data-csection="${si}">
        <span class="ctab-section-title">${section.topic}</span>
        <svg class="ctab-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <p class="ctab-section-desc">${section.description}</p>
      <div class="ctab-concepts" id="ctabConcepts${si}">`;
    section.concepts.forEach(concept => {
      html += `<div class="ctab-card">
        <div class="ctab-card-title">${concept.title}</div>
        <div class="ctab-card-review">${concept.review}</div>
        <pre class="ctab-card-code"><code>${escapeHTML(concept.sql)}</code></pre>
        <button class="btn btn-sm btn-primary ctab-try" data-sql="${escapeAttr(concept.sql)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          Try this SQL
        </button>
      </div>`;
    });
    html += `</div></div>`;
  });
  html += '</div>';
  panel.innerHTML = html;

  // Section collapse/expand
  panel.querySelectorAll('.ctab-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const concepts = document.getElementById(`ctabConcepts${header.dataset.csection}`);
      const desc = header.nextElementSibling;
      concepts.classList.toggle('collapsed');
      desc.classList.toggle('collapsed');
      header.classList.toggle('collapsed');
    });
  });

  // Try this SQL buttons
  panel.querySelectorAll('.ctab-try').forEach(btn => {
    btn.addEventListener('click', () => {
      const sql = btn.dataset.sql;
      const editor = document.getElementById('sqlEditor');
      editor.value = sql;
      updateLineNumbers();
      editor.focus();
      // Switch to output tab
      document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
      document.querySelector('[data-result="output"]').classList.add('active');
      document.getElementById('result-output').classList.add('active');
    });
  });
}

// ========== INIT ==========
function initSQLReference() {
  renderRefSidebar();
  setupPopupEvents();
  renderConceptsTab();
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSQLReference);
} else {
  // defer to next tick so app.js initApp can run first
  setTimeout(initSQLReference, 0);
}
