/* ===== SQL Practice Lab — HKDSE ICT Elective A ===== */

let db = null;
let SQL = null;
let queryHistory = [];
let savedDBKey = 'sql_practice_lab_db';

// ===== INITIALIZATION =====
async function initApp() {
  try {
    SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });
    db = new SQL.Database();

    // Auto-load from localStorage if a saved database exists
    const savedJson = localStorage.getItem(savedDBKey);
    if (savedJson) {
      try {
        const arr = new Uint8Array(JSON.parse(savedJson));
        db = new SQL.Database(arr);
        showToast('Saved database restored', 'success');
      } catch {
        loadSampleData();
        showToast('Database ready with sample data', 'success');
      }
    } else {
      loadSampleData();
      showToast('Database ready with sample data', 'success');
    }

    refreshTables();
    setupEventListeners();
    updateLineNumbers();
    setupExercises();
  } catch (err) {
    showToast('Failed to initialize SQL engine: ' + err.message, 'error');
  }
}

// ===== SAMPLE DATA =====
function loadSampleData() {
  const sampleSQL = `
    -- Classes table
    CREATE TABLE IF NOT EXISTS Classes (
      ClassID INT PRIMARY KEY,
      ClassName VARCHAR(20) NOT NULL,
      ClassTeacher VARCHAR(50)
    );

    INSERT INTO Classes VALUES (101, '4A', 'Mr. Wong');
    INSERT INTO Classes VALUES (102, '4B', 'Ms. Cheung');
    INSERT INTO Classes VALUES (103, '4C', 'Mr. Lee');
    INSERT INTO Classes VALUES (104, '5A', 'Ms. Lam');
    INSERT INTO Classes VALUES (105, '5B', 'Mr. Chan');

    -- Students table
    CREATE TABLE IF NOT EXISTS Students (
      StudentID INT PRIMARY KEY,
      Name VARCHAR(50) NOT NULL,
      Age INT,
      Gender VARCHAR(1),
      ClassID INT,
      Email VARCHAR(100),
      FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
    );

    INSERT INTO Students VALUES (1, 'Chan Tai Man', 16, 'M', 101, 'chanTM@school.edu.hk');
    INSERT INTO Students VALUES (2, 'Wong Siu Ming', 17, 'M', 101, 'wongSM@school.edu.hk');
    INSERT INTO Students VALUES (3, 'Lee Ka Yan', 16, 'F', 102, 'leeKY@school.edu.hk');
    INSERT INTO Students VALUES (4, 'Cheung Mei Ling', 15, 'F', 102, 'cheungML@school.edu.hk');
    INSERT INTO Students VALUES (5, 'Lau Wing Ho', 17, 'M', 103, 'lauWH@school.edu.hk');
    INSERT INTO Students VALUES (6, 'Ng Hoi Yan', 16, 'F', 103, 'ngHY@school.edu.hk');
    INSERT INTO Students VALUES (7, 'Ho Ka Ming', 18, 'M', 104, 'hoKM@school.edu.hk');
    INSERT INTO Students VALUES (8, 'Yip Sze Wan', 17, 'F', 104, 'yipSW@school.edu.hk');
    INSERT INTO Students VALUES (9, 'Tam Chi Hung', 16, 'M', 105, NULL);
    INSERT INTO Students VALUES (10, 'Fung Wai Kei', 15, 'F', 101, 'fungWK@school.edu.hk');

    -- Subjects table
    CREATE TABLE IF NOT EXISTS Subjects (
      SubjectID INT PRIMARY KEY,
      SubjectName VARCHAR(50) NOT NULL,
      Department VARCHAR(30)
    );

    INSERT INTO Subjects VALUES (1, 'ICT', 'Technology');
    INSERT INTO Subjects VALUES (2, 'Mathematics', 'Science');
    INSERT INTO Subjects VALUES (3, 'English', 'Language');
    INSERT INTO Subjects VALUES (4, 'Chinese', 'Language');
    INSERT INTO Subjects VALUES (5, 'Physics', 'Science');

    -- Enrolments table (resolves M:N relationship)
    CREATE TABLE IF NOT EXISTS Enrolments (
      EnrolmentID INT PRIMARY KEY,
      StudentID INT,
      SubjectID INT,
      Score INT,
      Grade VARCHAR(2),
      FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
      FOREIGN KEY (SubjectID) REFERENCES Subjects(SubjectID)
    );

    INSERT INTO Enrolments VALUES (1, 1, 1, 85, 'A');
    INSERT INTO Enrolments VALUES (2, 1, 2, 72, 'B');
    INSERT INTO Enrolments VALUES (3, 1, 3, 68, 'C');
    INSERT INTO Enrolments VALUES (4, 2, 1, 92, 'A');
    INSERT INTO Enrolments VALUES (5, 2, 2, 88, 'A');
    INSERT INTO Enrolments VALUES (6, 3, 1, 78, 'B');
    INSERT INTO Enrolments VALUES (7, 3, 3, 95, 'A');
    INSERT INTO Enrolments VALUES (8, 4, 2, 60, 'D');
    INSERT INTO Enrolments VALUES (9, 4, 4, 82, 'A');
    INSERT INTO Enrolments VALUES (10, 5, 1, 45, 'E');
    INSERT INTO Enrolments VALUES (11, 5, 5, 70, 'B');
    INSERT INTO Enrolments VALUES (12, 6, 3, 88, 'A');
    INSERT INTO Enrolments VALUES (13, 6, 4, 76, 'B');
    INSERT INTO Enrolments VALUES (14, 7, 1, 90, 'A');
    INSERT INTO Enrolments VALUES (15, 7, 2, 95, 'A');
    INSERT INTO Enrolments VALUES (16, 7, 5, 88, 'A');
    INSERT INTO Enrolments VALUES (17, 8, 3, 74, 'B');
    INSERT INTO Enrolments VALUES (18, 8, 4, 80, 'A');
    INSERT INTO Enrolments VALUES (19, 9, 1, 55, 'D');
    INSERT INTO Enrolments VALUES (20, 9, 2, 62, 'C');
    INSERT INTO Enrolments VALUES (21, 10, 1, 83, 'A');
    INSERT INTO Enrolments VALUES (22, 10, 3, 77, 'B');
  `;
  try {
    db.run(sampleSQL);
  } catch (err) {
    showToast('Error loading sample data: ' + err.message, 'error');
  }
}

// ===== SQL EXECUTION =====
function executeSQL(sql) {
  const startTime = performance.now();
  const trimmed = sql.trim();
  if (!trimmed) return;

  // Split into individual statements
  const statements = trimmed.split(';').filter(s => s.trim());
  const results = [];
  let hasError = false;

  for (const stmt of statements) {
    const s = stmt.trim();
    if (!s) continue;

    try {
      const res = db.exec(s);
      const elapsed = ((performance.now() - startTime)).toFixed(1);

      if (res.length > 0) {
        results.push({ type: 'table', data: res[0], sql: s, time: elapsed });
      } else {
        // DDL/DML statement — count affected rows
        const changes = db.getRowsModified();
        let msg = `Query executed successfully.`;
        const upperS = s.toUpperCase();
        if (upperS.startsWith('INSERT')) msg = `1 row inserted.`;
        else if (upperS.startsWith('UPDATE')) msg = `${changes} row(s) updated.`;
        else if (upperS.startsWith('DELETE')) msg = `${changes} row(s) deleted.`;
        else if (upperS.startsWith('CREATE TABLE')) msg = `Table created successfully.`;
        else if (upperS.startsWith('DROP TABLE')) msg = `Table dropped successfully.`;
        else if (upperS.startsWith('ALTER TABLE')) msg = `Table altered successfully.`;
        else if (upperS.startsWith('CREATE VIEW')) msg = `View created successfully.`;
        else if (upperS.startsWith('DROP VIEW')) msg = `View dropped successfully.`;
        else if (upperS.startsWith('CREATE INDEX')) msg = `Index created successfully.`;
        results.push({ type: 'message', status: 'success', text: msg, sql: s, time: elapsed });
      }

      addToHistory(s, true);
    } catch (err) {
      results.push({ type: 'message', status: 'error', text: err.message, sql: s });
      addToHistory(s, false);
      hasError = true;
    }
  }

  renderResults(results);
  refreshTables();
}

// ===== RENDER RESULTS =====
function renderResults(results) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = '';

  let totalRows = 0;
  let totalTime = 0;

  for (const r of results) {
    if (r.type === 'table') {
      const { columns, values } = r.data;
      totalRows += values.length;
      totalTime = parseFloat(r.time);

      const wrap = document.createElement('div');
      wrap.className = 'result-table-wrap';

      let html = '<table class="result-table"><thead><tr>';
      for (const col of columns) {
        html += `<th>${escapeHTML(col)}</th>`;
      }
      html += '</tr></thead><tbody>';

      for (const row of values) {
        html += '<tr>';
        for (const val of row) {
          if (val === null) {
            html += `<td class="null-val">NULL</td>`;
          } else {
            html += `<td>${escapeHTML(String(val))}</td>`;
          }
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      wrap.innerHTML = html;
      container.appendChild(wrap);

    } else {
      totalTime = parseFloat(r.time || 0);
      const msgDiv = document.createElement('div');
      msgDiv.className = `result-message ${r.status}`;
      msgDiv.textContent = r.text;
      container.appendChild(msgDiv);
    }
  }

  const info = document.getElementById('resultsInfo');
  if (totalRows > 0) {
    info.textContent = `${totalRows} row${totalRows > 1 ? 's' : ''} · ${totalTime}ms`;
  } else if (results.length > 0) {
    info.textContent = `${totalTime}ms`;
  }
}

// ===== HISTORY =====
function addToHistory(sql, success) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  queryHistory.unshift({ sql, success, time });
  if (queryHistory.length > 50) queryHistory.pop();
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('historyContainer');
  if (queryHistory.length === 0) {
    container.innerHTML = '<div class="empty-state"><p class="text-muted">No queries executed yet</p></div>';
    return;
  }

  container.innerHTML = queryHistory.map(h => `
    <div class="history-item" data-sql="${escapeAttr(h.sql)}">
      <span class="history-status ${h.success ? 'ok' : 'err'}"></span>
      <span class="history-time">${h.time}</span>
      <span class="history-sql">${escapeHTML(h.sql)}</span>
    </div>
  `).join('');

  container.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      document.getElementById('sqlEditor').value = item.dataset.sql;
      updateLineNumbers();
    });
  });
}

// ===== TABLE LIST =====
function refreshTables() {
  const container = document.getElementById('tablesList');
  try {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    const views = db.exec("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name");

    if ((!tables.length || !tables[0].values.length) && (!views.length || !views[0].values.length)) {
      container.innerHTML = '<p class="text-muted" style="font-size:var(--text-xs); padding:var(--space-2);">No tables yet. Create one using CREATE TABLE.</p>';
      return;
    }

    let html = '';

    // Tables
    if (tables.length && tables[0].values.length) {
      for (const [tableName] of tables[0].values) {
        const info = db.exec(`PRAGMA table_info("${tableName}")`);
        const count = db.exec(`SELECT COUNT(*) FROM "${tableName}"`);
        const rowCount = count.length ? count[0].values[0][0] : 0;

        html += `<div class="table-card">
          <div class="table-card-header">
            <span class="table-card-name">${escapeHTML(tableName)}</span>
            <span class="table-card-count">${rowCount} rows</span>
          </div>
          <div class="table-card-cols">`;

        if (info.length) {
          for (const col of info[0].values) {
            const colName = col[1];
            const colType = col[2] || '';
            const isPK = col[5] === 1;
            html += `<span class="col-tag ${isPK ? 'pk' : ''}" title="${escapeAttr(colType)}${isPK ? ' (PK)' : ''}">${escapeHTML(colName)}</span>`;
          }
        }

        html += `</div>
          <div class="table-card-actions">
            <button class="btn btn-sm btn-outline tc-view-btn" data-table="${escapeAttr(tableName)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>
              View
            </button>
            <button class="btn btn-sm btn-primary tc-insert-btn" data-table="${escapeAttr(tableName)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Insert
            </button>
          </div>
        </div>`;
      }
    }

    // Views
    if (views.length && views[0].values.length) {
      html += '<div style="margin-top:var(--space-3)"><span class="section-label">Views</span></div>';
      for (const [viewName] of views[0].values) {
        html += `<div class="table-card" style="margin-top:var(--space-2)">
          <div class="table-card-header">
            <span class="table-card-name" style="color:var(--color-warning)">${escapeHTML(viewName)}</span>
            <span class="table-card-count">view</span>
          </div>
          <div class="table-card-actions">
            <button class="btn btn-sm btn-outline tc-view-btn" data-table="${escapeAttr(viewName)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>
              View
            </button>
          </div>
        </div>`;
      }
    }

    container.innerHTML = html;

    // Attach View buttons
    container.querySelectorAll('.tc-view-btn').forEach(btn => {
      btn.addEventListener('click', () => viewTableData(btn.dataset.table));
    });
    // Attach Insert buttons
    container.querySelectorAll('.tc-insert-btn').forEach(btn => {
      btn.addEventListener('click', () => openInsertForm(btn.dataset.table));
    });
  } catch (err) {
    container.innerHTML = `<p class="text-muted" style="font-size:var(--text-xs)">Error: ${escapeHTML(err.message)}</p>`;
  }
}

// ===== VIEW TABLE DATA =====
function viewTableData(tableName) {
  if (!db) return;
  const sql = `SELECT * FROM "${tableName}";`;
  document.getElementById('sqlEditor').value = sql;
  updateLineNumbers();
  executeSQL(sql);
  // Switch to output tab
  document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-result="output"]').classList.add('active');
  document.getElementById('result-output').classList.add('active');
}

// ===== INSERT FORM =====
function openInsertForm(tableName) {
  if (!db) return;
  try {
    const info = db.exec(`PRAGMA table_info("${tableName}")`);
    if (!info.length) return;

    const dialog = document.getElementById('insertModal');
    const title = document.getElementById('insertModalTitle');
    const form = document.getElementById('insertFormFields');
    const errorDiv = document.getElementById('insertError');

    title.textContent = 'Insert into ' + tableName;
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    dialog.dataset.table = tableName;

    let fieldsHtml = '';
    for (const col of info[0].values) {
      const colName = col[1];
      const colType = (col[2] || 'TEXT').toUpperCase();
      const notNull = col[3] === 1;
      const isPK = col[5] === 1;
      const defaultVal = col[4];

      const typeHint = colType.includes('INT') ? 'number' : 'text';
      const placeholder = colType + (isPK ? ' (PK)' : '') + (notNull ? ' NOT NULL' : '') + (defaultVal !== null ? ' default: ' + defaultVal : '');

      fieldsHtml += `<div class="insert-field">
        <label class="insert-label">
          <span class="insert-col-name">${escapeHTML(colName)}</span>
          <span class="insert-col-type">${escapeHTML(colType)}${isPK ? ' PK' : ''}${notNull ? ' NOT NULL' : ''}</span>
        </label>
        <input class="insert-input" type="text" data-col="${escapeAttr(colName)}" data-type="${escapeAttr(colType)}" placeholder="${escapeAttr(placeholder)}" />
        <label class="insert-null-check"><input type="checkbox" data-null-for="${escapeAttr(colName)}"> NULL</label>
      </div>`;
    }
    form.innerHTML = fieldsHtml;

    // Wire up NULL checkboxes to disable input
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const colName = cb.dataset.nullFor;
        const input = form.querySelector(`input[data-col="${colName}"]`);
        if (input) {
          input.disabled = cb.checked;
          if (cb.checked) input.value = '';
        }
      });
    });

    dialog.showModal();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

function submitInsertForm() {
  const dialog = document.getElementById('insertModal');
  const tableName = dialog.dataset.table;
  const form = document.getElementById('insertFormFields');
  const errorDiv = document.getElementById('insertError');
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';

  const cols = [];
  const vals = [];

  form.querySelectorAll('.insert-field').forEach(field => {
    const input = field.querySelector('.insert-input');
    const nullCb = field.querySelector('input[type="checkbox"]');
    const colName = input.dataset.col;
    const colType = input.dataset.type;

    cols.push(colName);

    if (nullCb && nullCb.checked) {
      vals.push('NULL');
    } else if (input.value.trim() === '') {
      vals.push('NULL');
    } else if (colType.includes('INT') || colType.includes('REAL') || colType.includes('FLOAT') || colType.includes('NUM')) {
      const num = Number(input.value.trim());
      if (isNaN(num)) {
        vals.push("'" + input.value.trim().replace(/'/g, "''") + "'");
      } else {
        vals.push(String(num));
      }
    } else {
      vals.push("'" + input.value.trim().replace(/'/g, "''") + "'");
    }
  });

  const sql = `INSERT INTO "${tableName}" (${cols.join(', ')}) VALUES (${vals.join(', ')});`;

  try {
    db.run(sql);
    dialog.close();
    refreshTables();
    // Show the insert in editor and run to verify
    document.getElementById('sqlEditor').value = sql + '\n\n-- Inserted successfully. Viewing updated data:\nSELECT * FROM "' + tableName + '";';
    updateLineNumbers();
    executeSQL('SELECT * FROM "' + tableName + '"');
    document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-result="output"]').classList.add('active');
    document.getElementById('result-output').classList.add('active');
    showToast('Row inserted into ' + tableName, 'success');
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
  }
}

// ===== EXERCISES =====
function setupExercises() {
  const exercises = [
    { num: 1, desc: 'List all students in Class 4A (ClassID = 101).', hint: 'SELECT * FROM Students WHERE ClassID = 101;', tag: 'SELECT / WHERE' },
    { num: 2, desc: 'Find the names and ages of students aged 16 or above, sorted by age descending.', hint: 'SELECT Name, Age FROM Students\nWHERE Age >= 16\nORDER BY Age DESC;', tag: 'ORDER BY' },
    { num: 3, desc: 'Count how many students are in each class.', hint: 'SELECT ClassID, COUNT(*) AS NumStudents\nFROM Students\nGROUP BY ClassID;', tag: 'GROUP BY' },
    { num: 4, desc: 'Find classes with more than 2 students.', hint: 'SELECT ClassID, COUNT(*) AS NumStudents\nFROM Students\nGROUP BY ClassID\nHAVING COUNT(*) > 2;', tag: 'HAVING' },
    { num: 5, desc: 'List students whose name starts with "C".', hint: "SELECT * FROM Students\nWHERE Name LIKE 'C%';", tag: 'LIKE' },
    { num: 6, desc: 'Show each student\'s name alongside their class name using a JOIN.', hint: 'SELECT s.Name, c.ClassName\nFROM Students s\nINNER JOIN Classes c ON s.ClassID = c.ClassID;', tag: 'INNER JOIN' },
    { num: 7, desc: 'Find students who have no email address.', hint: 'SELECT Name FROM Students\nWHERE Email IS NULL;', tag: 'IS NULL' },
    { num: 8, desc: 'Calculate the average score for each subject.', hint: 'SELECT sub.SubjectName, AVG(e.Score) AS AvgScore\nFROM Enrolments e\nINNER JOIN Subjects sub ON e.SubjectID = sub.SubjectID\nGROUP BY sub.SubjectName;', tag: 'AVG / JOIN' },
    { num: 9, desc: 'Find students who scored above the average score.', hint: 'SELECT DISTINCT s.Name\nFROM Students s\nINNER JOIN Enrolments e ON s.StudentID = e.StudentID\nWHERE e.Score > (SELECT AVG(Score) FROM Enrolments);', tag: 'Sub-query' },
    { num: 10, desc: 'Show ALL students and their subjects, including students with no enrolments.', hint: 'SELECT s.Name, sub.SubjectName, e.Score\nFROM Students s\nLEFT OUTER JOIN Enrolments e ON s.StudentID = e.StudentID\nLEFT OUTER JOIN Subjects sub ON e.SubjectID = sub.SubjectID;', tag: 'LEFT JOIN' },
    { num: 11, desc: 'Create a view called "TopStudents" showing students with at least one A grade.', hint: "CREATE VIEW TopStudents AS\nSELECT DISTINCT s.StudentID, s.Name\nFROM Students s\nINNER JOIN Enrolments e ON s.StudentID = e.StudentID\nWHERE e.Grade = 'A';", tag: 'CREATE VIEW' },
    { num: 12, desc: 'Add a new column "Phone" to the Students table.', hint: 'ALTER TABLE Students ADD Phone VARCHAR(20);', tag: 'ALTER TABLE' },
    { num: 13, desc: 'Find the student with the highest total score across all subjects.', hint: 'SELECT s.Name, SUM(e.Score) AS TotalScore\nFROM Students s\nINNER JOIN Enrolments e ON s.StudentID = e.StudentID\nGROUP BY s.StudentID, s.Name\nORDER BY TotalScore DESC\nLIMIT 1;', tag: 'SUM / ORDER BY' },
    { num: 14, desc: 'List students in ClassID 101 or 102 using the IN operator.', hint: 'SELECT * FROM Students\nWHERE ClassID IN (101, 102);', tag: 'IN' },
    { num: 15, desc: 'Find students aged between 15 and 17 (inclusive).', hint: 'SELECT * FROM Students\nWHERE Age BETWEEN 15 AND 17;', tag: 'BETWEEN' },
    { num: 16, desc: 'Concatenate student name and email into one column.', hint: "SELECT Name || ' <' || COALESCE(Email, 'N/A') || '>' AS ContactInfo\nFROM Students;", tag: 'String / ||' },
    { num: 17, desc: 'Create a new table "Teachers" with TeacherID, Name, and Department.', hint: "CREATE TABLE Teachers (\n  TeacherID INT PRIMARY KEY,\n  Name VARCHAR(50) NOT NULL,\n  Department VARCHAR(30)\n);", tag: 'CREATE TABLE' },
    { num: 18, desc: 'Insert a new student (ID 11, "Li Mei", age 16, female, class 103).', hint: "INSERT INTO Students (StudentID, Name, Age, Gender, ClassID)\nVALUES (11, 'Li Mei', 16, 'F', 103);", tag: 'INSERT' },
    { num: 19, desc: 'Update the age of student ID 1 to 17.', hint: "UPDATE Students\nSET Age = 17\nWHERE StudentID = 1;", tag: 'UPDATE' },
    { num: 20, desc: 'Use NATURAL JOIN to combine Students and Classes tables.', hint: "SELECT * FROM Students NATURAL JOIN Classes;", tag: 'NATURAL JOIN' },
  ];

  const container = document.getElementById('exercisesList');
  container.innerHTML = exercises.map(ex => `
    <div class="exercise-card" data-hint="${escapeAttr(ex.hint)}">
      <div class="exercise-num">Exercise ${ex.num}</div>
      <div class="exercise-desc">${escapeHTML(ex.desc)}</div>
      <span class="exercise-tag">${escapeHTML(ex.tag)}</span>
    </div>
  `).join('');

  container.querySelectorAll('.exercise-card').forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('sqlEditor').value = card.dataset.hint;
      updateLineNumbers();
      // Switch to output tab
      document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
      document.querySelector('[data-result="output"]').classList.add('active');
      document.getElementById('result-output').classList.add('active');
    });
  });
}

// ===== SAVE / LOAD / EXPORT =====
function saveDatabase() {
  try {
    const data = db.export();
    const arr = Array.from(data);
    const json = JSON.stringify(arr);
    // Save to both global variable (for quick access) and localStorage (for persistence)
    window.__savedDB = json;
    window.__savedDBTimestamp = new Date().toISOString();
    try {
      localStorage.setItem(savedDBKey, json);
      localStorage.setItem(savedDBKey + '_ts', window.__savedDBTimestamp);
    } catch (e) {
      // localStorage may be unavailable (e.g. private browsing restrictions)
    }
    showToast('Database saved successfully', 'success');
  } catch (err) {
    showToast('Save failed: ' + err.message, 'error');
  }
}

function loadDatabase() {
  try {
    let savedJson = window.__savedDB;
    let timestamp = window.__savedDBTimestamp;
    if (!savedJson) {
      // Fallback to localStorage
      savedJson = localStorage.getItem(savedDBKey);
      timestamp = localStorage.getItem(savedDBKey + '_ts');
    }
    if (!savedJson) {
      showToast('No saved database found. Save one first.', 'info');
      return;
    }
    if (!SQL) {
      showToast('SQL engine not ready. Please refresh the page.', 'error');
      return;
    }
    const arr = new Uint8Array(JSON.parse(savedJson));
    db.close();
    db = new SQL.Database(arr);
    refreshTables();
    showToast('Database loaded from save (' + (timestamp || 'unknown time') + ')', 'success');
  } catch (err) {
    showToast('Load failed: ' + err.message, 'error');
  }
}

function exportDatabase() {
  try {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sql_practice_lab.db';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Database exported as sql_practice_lab.db', 'success');
  } catch (err) {
    showToast('Export failed: ' + err.message, 'error');
  }
}

function importDatabase(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const arr = new Uint8Array(e.target.result);
      if (!SQL) {
        showToast('SQL engine not ready. Please refresh the page.', 'error');
        return;
      }
      db.close();
      db = new SQL.Database(arr);
      refreshTables();
      showToast('Database imported from ' + file.name, 'success');
    } catch (err) {
      showToast('Import failed: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  const editor = document.getElementById('sqlEditor');
  const btnRun = document.getElementById('btnRun');
  const btnClear = document.getElementById('btnClear');
  const btnSave = document.getElementById('btnSave');
  const btnLoad = document.getElementById('btnLoad');
  const btnExport = document.getElementById('btnExport');
  const btnImport = document.getElementById('btnImport');
  const fileImport = document.getElementById('fileImport');
  const btnResetDB = document.getElementById('btnResetDB');
  const resetModal = document.getElementById('resetModal');
  const btnConfirmReset = document.getElementById('btnConfirmReset');
  const btnCancelReset = document.getElementById('btnCancelReset');
  const btnRefreshTables = document.getElementById('btnRefreshTables');

  // Run SQL
  btnRun.addEventListener('click', () => executeSQL(editor.value));

  // Ctrl+Enter to run
  editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeSQL(editor.value);
    }
    // Tab to indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      updateLineNumbers();
    }
  });

  // Line numbers
  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('scroll', () => {
    document.getElementById('lineNumbers').scrollTop = editor.scrollTop;
  });

  // Clear
  btnClear.addEventListener('click', () => {
    editor.value = '';
    updateLineNumbers();
    editor.focus();
  });

  // Save / Load / Export
  btnSave.addEventListener('click', saveDatabase);
  btnLoad.addEventListener('click', loadDatabase);
  btnExport.addEventListener('click', exportDatabase);
  btnImport.addEventListener('click', () => fileImport.click());
  fileImport.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      importDatabase(e.target.files[0]);
      e.target.value = '';
    }
  });

  // Reset
  btnResetDB.addEventListener('click', () => resetModal.showModal());
  btnConfirmReset.addEventListener('click', () => {
    if (!SQL) {
      showToast('SQL engine not ready. Please refresh the page.', 'error');
      return;
    }
    db.close();
    db = new SQL.Database();
    loadSampleData();
    refreshTables();
    resetModal.close();
    showToast('Database reset to sample data', 'success');
  });
  btnCancelReset.addEventListener('click', () => resetModal.close());

  // Refresh tables
  btnRefreshTables.addEventListener('click', refreshTables);

  // DDL / DML / View All Data buttons
  const btnShowDDL = document.getElementById('btnShowDDL');
  const btnShowDML = document.getElementById('btnShowDML');
  const btnViewAll = document.getElementById('btnViewAll');
  if (btnShowDDL) btnShowDDL.addEventListener('click', generateDDL);
  if (btnShowDML) btnShowDML.addEventListener('click', generateDML);
  if (btnViewAll) btnViewAll.addEventListener('click', viewAllData);

  // Ref-sidebar toggle
  const refSidebarToggle = document.getElementById('refSidebarToggle');
  if (refSidebarToggle) {
    refSidebarToggle.addEventListener('click', () => {
      document.getElementById('refSidebar').classList.toggle('collapsed');
    });
  }

  // Right-panel tabs
  document.querySelectorAll('.right-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.right-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.rpanel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`rpanel-${tab.dataset.rpanel}`).classList.add('active');
    });
  });

  // Result tabs
  document.querySelectorAll('.results-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`result-${tab.dataset.result}`).classList.add('active');
    });
  });

  // Dark mode toggle
  setupThemeToggle();

  // Module navigation
  setupModuleNav();

  // Editor vertical resize handle
  const resizeHandle = document.getElementById('editorResizeHandle');
  const editorWrapper = document.querySelector('.editor-wrapper');
  let isResizing = false;
  let startY = 0;
  let startHeight = 0;

  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startY = e.clientY;
    startHeight = editorWrapper.offsetHeight;
    resizeHandle.classList.add('dragging');
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const delta = e.clientY - startY;
    const newHeight = Math.max(120, Math.min(startHeight + delta, 600));
    editorWrapper.style.height = newHeight + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    resizeHandle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
}

// ===== THEME TOGGLE =====
function setupThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateToggleIcon(toggle, theme);

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    updateToggleIcon(toggle, theme);
  });
}

function updateToggleIcon(toggle, theme) {
  toggle.innerHTML = theme === 'dark'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// ===== LINE NUMBERS =====
function updateLineNumbers() {
  const editor = document.getElementById('sqlEditor');
  const lines = editor.value.split('\n').length;
  const nums = document.getElementById('lineNumbers');
  nums.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

// ===== TOAST =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== UTILS =====
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== DDL / DML / VIEW ALL DATA =====
function generateDDL() {
  if (!db) return;
  try {
    const tables = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    const views = db.exec("SELECT name, sql FROM sqlite_master WHERE type='view' ORDER BY name");
    let ddl = '-- ========================================\n-- DDL: CREATE TABLE Statements\n-- ========================================\n\n';
    if (tables.length && tables[0].values.length) {
      for (const row of tables[0].values) {
        ddl += row[1] + ';\n\n';
      }
    }
    if (views.length && views[0].values.length) {
      ddl += '-- ========================================\n-- Views\n-- ========================================\n\n';
      for (const row of views[0].values) {
        ddl += row[1] + ';\n\n';
      }
    }
    document.getElementById('sqlEditor').value = ddl;
    updateLineNumbers();
    showToast('DDL loaded into editor', 'success');
  } catch (err) {
    showToast('Error generating DDL: ' + err.message, 'error');
  }
}

function generateDML() {
  if (!db) return;
  try {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    if (!tables.length || !tables[0].values.length) {
      showToast('No tables found', 'error');
      return;
    }
    let dml = '-- ========================================\n-- DML: INSERT Statements (all table data)\n-- ========================================\n\n';
    for (const [tableName] of tables[0].values) {
      const info = db.exec(`PRAGMA table_info("${tableName}")`);
      if (!info.length) continue;
      const colNames = info[0].values.map(c => c[1]);
      const data = db.exec(`SELECT * FROM "${tableName}"`);
      dml += '-- ' + tableName + '\n';
      if (data.length && data[0].values.length) {
        for (const row of data[0].values) {
          const vals = row.map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'number') return String(v);
            return "'" + String(v).replace(/'/g, "''") + "'";
          });
          dml += 'INSERT INTO ' + tableName + ' (' + colNames.join(', ') + ') VALUES (' + vals.join(', ') + ');\n';
        }
      } else {
        dml += '-- (no data)\n';
      }
      dml += '\n';
    }
    document.getElementById('sqlEditor').value = dml;
    updateLineNumbers();
    showToast('DML loaded into editor', 'success');
  } catch (err) {
    showToast('Error generating DML: ' + err.message, 'error');
  }
}

function viewAllData() {
  if (!db) return;
  try {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    if (!tables.length || !tables[0].values.length) {
      showToast('No tables found', 'error');
      return;
    }
    // Build a query that selects all data from every table
    const queries = tables[0].values.map(([t]) => `SELECT '${t}' AS "[Table]", * FROM "${t}"`).join(';\n');
    document.getElementById('sqlEditor').value = queries + ';';
    updateLineNumbers();
    executeSQL(queries);
    // Switch to output tab
    document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-result="output"]').classList.add('active');
    document.getElementById('result-output').classList.add('active');
    showToast('Showing all table data', 'success');
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

// ===== MODULE NAVIGATION =====
function setupModuleNav() {
  const tabs = document.querySelectorAll('.module-tab');
  let conceptsInitialized = false;
  let creatingDbInitialized = false;
  let rollbackInitialized = false;
  let sqlSyntaxInitialized = false;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const moduleId = tab.dataset.module;

      // Update tab active state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide modules
      document.querySelectorAll('.module-view').forEach(v => v.classList.remove('active'));
      document.getElementById(`module-${moduleId}`).classList.add('active');

      // Show/hide header actions (only for SQL module)
      const headerActions = document.querySelector('.header-actions');
      const sqlOnlyBtns = ['btnSave', 'btnLoad', 'btnExport', 'btnImport'];
      sqlOnlyBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.style.display = moduleId === 'sql' ? '' : 'none';
      });

      // Show/hide footer reset button
      const resetBtn = document.getElementById('btnResetDB');
      if (resetBtn) resetBtn.style.display = moduleId === 'sql' ? '' : 'none';

      // Init concepts module on first visit
      if (moduleId === 'concepts' && !conceptsInitialized) {
        conceptsInitialized = true;
        initConceptsModule();
      }

      // Init creating-db module on first visit
      if (moduleId === 'creating-db' && !creatingDbInitialized) {
        creatingDbInitialized = true;
        if (typeof initCreatingDbModule === 'function') initCreatingDbModule();
      }

      // Init rollback module on first visit
      if (moduleId === 'rollback' && !rollbackInitialized) {
        rollbackInitialized = true;
        if (typeof initRollbackModule === 'function') initRollbackModule();
      }

      // Init sql-syntax module on first visit
      if (moduleId === 'sql-syntax' && !sqlSyntaxInitialized) {
        sqlSyntaxInitialized = true;
        if (typeof initSqlSyntaxModule === 'function') initSqlSyntaxModule();
      }
    });
  });
}

// ===== START =====
initApp();
