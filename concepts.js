/* ===== Relational Database Concepts — Interactive Module ===== */
/* Based on HKDSE ICT Elective A syllabus notes (1.1–1.11) */

let conceptsScore = { correct: 0, total: 0 };

function initConceptsModule() {
  const container = document.getElementById('conceptsContent');
  if (!container) return;
  renderConceptsNav();
  showConceptSection('what-is-rdb');
}

// ===== NAVIGATION =====
function renderConceptsNav() {
  const nav = document.getElementById('conceptsNav');
  const sections = [
    { id: 'what-is-rdb',    label: '1.1 What is a Relational DB?', icon: 'database' },
    { id: 'entity',         label: '1.2 Entity', icon: 'table' },
    { id: 'attribute',      label: '1.3 Attribute', icon: 'columns' },
    { id: 'domain',         label: '1.4 Domain', icon: 'shield' },
    { id: 'rel-1m',         label: '1.5 One-to-Many', icon: 'link' },
    { id: 'rel-mn',         label: '1.6 Many-to-Many', icon: 'link2' },
    { id: 'pk',             label: '1.7 Primary Key', icon: 'key' },
    { id: 'fk',             label: '1.8 Foreign Key', icon: 'key2' },
    { id: 'ck-index',       label: '1.9–1.10 CK & Index', icon: 'search' },
    { id: 'integrity',      label: '1.11 Integrity', icon: 'check' },
    { id: 'quiz',           label: 'Concept Quiz', icon: 'award' },
  ];

  nav.innerHTML = sections.map(s => `
    <button class="concept-nav-item" data-section="${s.id}">
      ${getNavIcon(s.icon)}
      <span>${s.label}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.concept-nav-item').forEach(btn => {
    btn.addEventListener('click', () => showConceptSection(btn.dataset.section));
  });
}

function getNavIcon(type) {
  const icons = {
    database: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    table: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>',
    columns: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18M15 3v18"/></svg>',
    shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    link2: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 7h3a5 5 0 0 1 0 10h-3m-6 0H6A5 5 0 0 1 6 7h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    key: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
    key2: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M11.5 11.5L17 6"/><path d="M15 3l4 4"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    award: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  };
  return icons[type] || '';
}

function showConceptSection(sectionId) {
  document.querySelectorAll('.concept-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  const content = document.getElementById('conceptsContent');
  const builders = {
    'what-is-rdb': buildWhatIsRDB,
    'entity':      buildEntitySection,
    'attribute':   buildAttributeSection,
    'domain':      buildDomainSection,
    'rel-1m':      buildRel1MSection,
    'rel-mn':      buildRelMNSection,
    'pk':          buildPKSection,
    'fk':          buildFKSection,
    'ck-index':    buildCKIndexSection,
    'integrity':   buildIntegritySection,
    'quiz':        buildQuizSection,
  };

  content.innerHTML = '';
  if (builders[sectionId]) {
    content.innerHTML = builders[sectionId]();
    attachInteractions(sectionId);
  }
  content.scrollTop = 0;
}

// ===== HELPER BUILDERS =====
function makeCheckbox(group, label, correct) {
  return `<label class="attr-check" data-correct="${correct}">
    <input type="checkbox" name="${group}" value="${label}">
    <span>${label}</span>
  </label>`;
}

function makeRadioPill(name, value, label) {
  return `<label class="radio-pill"><input type="radio" name="${name}" value="${value}"><span>${label}</span></label>`;
}

function makeMCQ(num, question, options, correctIdx, explanation) {
  return `<div class="identify-q" data-correct="${correctIdx}" data-explain="${escapeAttr(explanation || '')}">
    <div class="identify-q-num">${num}</div>
    <div class="identify-q-text">${question}</div>
    <div class="identify-q-opts">
      ${options.map((opt, i) => `
        <label class="radio-pill"><input type="radio" name="mcq_${num}" value="${i}"><span>${opt}</span></label>
      `).join('')}
    </div>
    <div class="identify-q-explain" style="display:none"></div>
  </div>`;
}

function showFeedback(containerId, correct, total) {
  const el = document.getElementById(containerId);
  const pct = Math.round((correct / total) * 100);
  const emoji = pct === 100 ? '🎉' : pct >= 70 ? '👍' : '📝';
  el.innerHTML = `<div class="feedback-score">${emoji} ${correct}/${total} correct (${pct}%)</div>`;
}

function checkMCQExercise(containerId, feedbackId) {
  let correct = 0, total = 0;
  document.querySelectorAll(`#${containerId} .identify-q`).forEach(q => {
    total++;
    const expected = parseInt(q.dataset.correct);
    const selected = q.querySelector('input:checked');
    const explainEl = q.querySelector('.identify-q-explain');
    if (selected && parseInt(selected.value) === expected) {
      correct++;
      q.classList.add('correct');
      q.classList.remove('incorrect');
      if (explainEl) explainEl.style.display = 'none';
    } else {
      q.classList.add('incorrect');
      q.classList.remove('correct');
      if (explainEl && q.dataset.explain) {
        explainEl.textContent = q.dataset.explain;
        explainEl.style.display = 'block';
      }
    }
  });
  showFeedback(feedbackId, correct, total);
}

// ===== MINI TABLE RENDERER =====
function miniTable(name, cols, rows) {
  let html = `<div class="mini-table">
    <div class="mini-table-name">${name}</div>
    <table><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return html;
}


// ===================================================================
// SECTION 1.1 — What is a Relational Database?
// ===================================================================
function buildWhatIsRDB() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.1 What is a Relational Database?</h2>
        <p class="concept-intro">A relational database stores data in <strong>tables</strong>. These tables are related to each other through <strong>keys</strong> and <strong>relationships</strong>. Each table represents one type of entity.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Structure of a Table</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Columns</div>
            <div class="callout-def">fields or attributes (e.g. StudentID, Name)</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Rows</div>
            <div class="callout-def">records or tuples (one row = one real-world object)</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">Example: Our School Database has 4 tables</div>
        <div class="entity-map">
          <div class="entity-card-vis">
            <div class="entity-icon">🎓</div>
            <div class="entity-name-vis">STUDENTS</div>
            <div class="entity-desc-small">information about each student</div>
          </div>
          <div class="entity-card-vis">
            <div class="entity-icon">🏫</div>
            <div class="entity-name-vis">CLASSES</div>
            <div class="entity-desc-small">information about each class group</div>
          </div>
          <div class="entity-card-vis">
            <div class="entity-icon">📚</div>
            <div class="entity-name-vis">COURSES</div>
            <div class="entity-desc-small">information about each course</div>
          </div>
          <div class="entity-card-vis">
            <div class="entity-icon">📝</div>
            <div class="entity-name-vis">ENROLLMENTS</div>
            <div class="entity-desc-small">which student takes which course</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">Sample Data: STUDENTS table</div>
        ${miniTable('STUDENTS',
          ['StudentID', 'Name', 'Gender', 'DateOfBirth', 'ClassID'],
          [
            ['S001', 'Chan Tai Man', 'M', '2009-03-15', 'C3A'],
            ['S002', 'Wong Siu Ming', 'F', '2009-07-22', 'C3A'],
            ['S003', 'Lee Ka Yan', 'M', '2009-01-10', 'C3B'],
          ]
        )}
        <p class="concept-hint">Each <strong>column</strong> is an attribute. Each <strong>row</strong> is a record. Tables can be linked together by keys.</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Identify Parts of a Table</div>
        <p class="exercise-instructions">Answer the following questions about relational databases.</p>
        <div id="rdbExercise">
          ${makeMCQ(1, 'In a relational database, data is stored in...', ['Files', 'Tables', 'Arrays', 'Documents'], 1, 'A relational database stores data in tables.')}
          ${makeMCQ(2, 'Each column in a table represents...', ['A record', 'A table', 'An attribute (field)', 'A database'], 2, 'Columns represent attributes or fields.')}
          ${makeMCQ(3, 'Each row in a table represents...', ['An attribute', 'A record (one real-world object)', 'A relationship', 'A key'], 1, 'Each row is one record or tuple.')}
          ${makeMCQ(4, 'How are tables linked together?', ['By colour', 'By keys and relationships', 'By size', 'By date'], 1, 'Tables are linked through keys and relationships.')}
          ${makeMCQ(5, 'How many tables does our school database have?', ['2', '3', '4', '5'], 2, 'STUDENTS, CLASSES, COURSES, and ENROLLMENTS = 4 tables.')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkMCQExercise('rdbExercise','rdbFeedback')">Check Answers</button>
        <div id="rdbFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}


// ===================================================================
// SECTION 1.2 — Entity
// ===================================================================
function buildEntitySection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.2 Entity</h2>
        <p class="concept-intro">An <strong>entity</strong> is an object or thing in the real world that you want to store data about. In a database, each entity becomes a <strong>table</strong>.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Entities → Tables</div>
        <div class="entity-map">
          <div class="entity-card-vis">
            <div class="entity-icon">🎓</div>
            <div class="entity-name-vis">STUDENT</div>
            <div class="entity-arrow">→</div>
            <div class="entity-table-name">STUDENTS table</div>
          </div>
          <div class="entity-card-vis">
            <div class="entity-icon">🏫</div>
            <div class="entity-name-vis">CLASS</div>
            <div class="entity-arrow">→</div>
            <div class="entity-table-name">CLASSES table</div>
          </div>
          <div class="entity-card-vis">
            <div class="entity-icon">📚</div>
            <div class="entity-name-vis">COURSE</div>
            <div class="entity-arrow">→</div>
            <div class="entity-table-name">COURSES table</div>
          </div>
          <div class="entity-card-vis">
            <div class="entity-icon">📝</div>
            <div class="entity-name-vis">ENROLLMENT</div>
            <div class="entity-arrow">→</div>
            <div class="entity-table-name">ENROLLMENTS table</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Match Entities to Tables</div>
        <p class="exercise-instructions">Drag each real-world entity to its correct table name. On mobile, tap the entity then tap the target.</p>
        <div class="drag-match-game" id="entityMatchGame">
          <div class="drag-sources" id="entitySources">
            <div class="drag-chip" draggable="true" data-answer="STUDENTS">A person studying at the school</div>
            <div class="drag-chip" draggable="true" data-answer="ENROLLMENTS">A record of a student taking a course</div>
            <div class="drag-chip" draggable="true" data-answer="CLASSES">A group of students with a teacher (e.g. 3A)</div>
            <div class="drag-chip" draggable="true" data-answer="COURSES">A course offered by the school (e.g. ICT)</div>
          </div>
          <div class="drag-targets">
            <div class="drag-target" data-table="STUDENTS"><span class="target-label">STUDENTS</span><span class="drop-zone" data-accept="STUDENTS">Drop here</span></div>
            <div class="drag-target" data-table="CLASSES"><span class="target-label">CLASSES</span><span class="drop-zone" data-accept="CLASSES">Drop here</span></div>
            <div class="drag-target" data-table="COURSES"><span class="target-label">COURSES</span><span class="drop-zone" data-accept="COURSES">Drop here</span></div>
            <div class="drag-target" data-table="ENROLLMENTS"><span class="target-label">ENROLLMENTS</span><span class="drop-zone" data-accept="ENROLLMENTS">Drop here</span></div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Real-World Entities</div>
        <p class="exercise-instructions">Which of the following could be entities in a school database?</p>
        <div id="entityIdentifyExercise">
          ${makeMCQ(1, 'A library in a school', ['Yes, it is an entity', 'No, it is not an entity'], 0, 'A library is a real-world object we can store data about.')}
          ${makeMCQ(2, 'The colour blue', ['Yes, it is an entity', 'No, it is not an entity'], 1, 'A colour is a value, not something you store multiple records about.')}
          ${makeMCQ(3, 'A textbook used in a course', ['Yes, it is an entity', 'No, it is not an entity'], 0, 'A textbook is a real-world object with its own attributes.')}
          ${makeMCQ(4, 'A homework assignment', ['Yes, it is an entity', 'No, it is not an entity'], 0, 'An assignment is something with attributes like title, due date, marks.')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkMCQExercise('entityIdentifyExercise','entityIdFeedback')">Check Answers</button>
        <div id="entityIdFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}


// ===================================================================
// SECTION 1.3 — Attribute
// ===================================================================
function buildAttributeSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.3 Attribute</h2>
        <p class="concept-intro">An <strong>attribute</strong> is a property or field that describes an entity. In a table, each <strong>column</strong> is an attribute.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Attributes of Each Table</div>
        <div class="attr-showcase">
          <div class="attr-showcase-table">
            <div class="attr-showcase-name">STUDENTS</div>
            <div class="attr-showcase-list">StudentID, Name, Gender, DateOfBirth, ClassID</div>
          </div>
          <div class="attr-showcase-table">
            <div class="attr-showcase-name">CLASSES</div>
            <div class="attr-showcase-list">ClassID, ClassName, ClassTeacher</div>
          </div>
          <div class="attr-showcase-table">
            <div class="attr-showcase-name">COURSES</div>
            <div class="attr-showcase-list">CourseID, CourseName, Room</div>
          </div>
          <div class="attr-showcase-table">
            <div class="attr-showcase-name">ENROLLMENTS</div>
            <div class="attr-showcase-list">EnrollmentID, StudentID, CourseID, Grade</div>
          </div>
        </div>
        <p class="concept-hint">Look at any table and point to each column — that is an attribute.</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Identify Attributes</div>
        <p class="exercise-instructions">For each table, select which items are attributes (columns) of that table.</p>
        <div id="attrExercise">
          <div class="attr-table-block">
            <div class="attr-table-name">STUDENTS Table</div>
            <div class="attr-options">
              ${makeCheckbox('attr_s', 'StudentID', true)}
              ${makeCheckbox('attr_s', 'Name', true)}
              ${makeCheckbox('attr_s', 'ClassName', false)}
              ${makeCheckbox('attr_s', 'Gender', true)}
              ${makeCheckbox('attr_s', 'DateOfBirth', true)}
              ${makeCheckbox('attr_s', 'CourseName', false)}
              ${makeCheckbox('attr_s', 'ClassID', true)}
              ${makeCheckbox('attr_s', 'Grade', false)}
            </div>
          </div>
          <div class="attr-table-block">
            <div class="attr-table-name">ENROLLMENTS Table</div>
            <div class="attr-options">
              ${makeCheckbox('attr_e', 'EnrollmentID', true)}
              ${makeCheckbox('attr_e', 'StudentID', true)}
              ${makeCheckbox('attr_e', 'Name', false)}
              ${makeCheckbox('attr_e', 'CourseID', true)}
              ${makeCheckbox('attr_e', 'Grade', true)}
              ${makeCheckbox('attr_e', 'ClassName', false)}
              ${makeCheckbox('attr_e', 'Room', false)}
              ${makeCheckbox('attr_e', 'DateOfBirth', false)}
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkAttributeExercise()">Check Answers</button>
        <div id="attrFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}


// ===================================================================
// SECTION 1.4 — Domain
// ===================================================================
function buildDomainSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.4 Domain</h2>
        <p class="concept-intro">A <strong>domain</strong> is the set of allowed values for an attribute. Domains control what kind of data can be stored, to keep data valid and meaningful. If a value is outside the domain, it should <strong>not</strong> be accepted.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Examples of Domains</div>
        <div class="domain-examples">
          <div class="domain-card">
            <div class="domain-attr">STUDENTS.Gender</div>
            <div class="domain-values">{ 'M', 'F' }</div>
          </div>
          <div class="domain-card">
            <div class="domain-attr">CLASSES.ClassName</div>
            <div class="domain-values">strings like '3A', '3B', '4C'</div>
          </div>
          <div class="domain-card">
            <div class="domain-attr">COURSES.CourseID</div>
            <div class="domain-values">codes like 'ICT01', 'MATH02'</div>
          </div>
          <div class="domain-card">
            <div class="domain-attr">ENROLLMENTS.Grade</div>
            <div class="domain-values">{ 'A', 'B', 'C', 'D', 'E', 'U' }</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Valid or Invalid?</div>
        <p class="exercise-instructions">For each attempted data entry, decide whether the value is <strong>valid</strong> (within the domain) or <strong>invalid</strong> (violates the domain).</p>
        <div id="domainExercise" class="domain-exercise">
          ${makeDomainQuestion(1, "INSERT a student with Gender = 'M'", "STUDENTS.Gender domain: {M, F}", true)}
          ${makeDomainQuestion(2, "INSERT a student with Gender = 'X'", "STUDENTS.Gender domain: {M, F}", false)}
          ${makeDomainQuestion(3, "INSERT an enrollment with Grade = 'B'", "ENROLLMENTS.Grade domain: {A, B, C, D, E, U}", true)}
          ${makeDomainQuestion(4, "INSERT an enrollment with Grade = 'Z'", "ENROLLMENTS.Grade domain: {A, B, C, D, E, U}", false)}
          ${makeDomainQuestion(5, "INSERT a class with ClassName = '4A'", "CLASSES.ClassName domain: class codes", true)}
          ${makeDomainQuestion(6, "INSERT a class with ClassName = 'Class ABC?'", "CLASSES.ClassName domain: class codes like 3A, 4B", false)}
          ${makeDomainQuestion(7, "INSERT a course with CourseID = 'ICT01'", "COURSES.CourseID domain: codes like ICT01, MATH02", true)}
          ${makeDomainQuestion(8, "INSERT a course with CourseID = 123", "COURSES.CourseID domain: codes like ICT01, MATH02", false)}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkDomainExercise()">Check Answers</button>
        <div id="domainFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}

function makeDomainQuestion(num, statement, context, valid) {
  return `<div class="domain-q" data-valid="${valid}">
    <div class="domain-q-num">${num}</div>
    <div class="domain-q-content">
      <div class="domain-q-stmt">${statement}</div>
      <div class="domain-q-ctx">${context}</div>
    </div>
    <div class="domain-q-btns">
      <label class="radio-pill"><input type="radio" name="domain_${num}" value="true"><span>Valid</span></label>
      <label class="radio-pill"><input type="radio" name="domain_${num}" value="false"><span>Invalid</span></label>
    </div>
  </div>`;
}


// ===================================================================
// SECTION 1.5 — One-to-Many (1:M)
// ===================================================================
function buildRel1MSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.5 Relationship: One-to-Many (1:M)</h2>
        <p class="concept-intro">A <strong>relationship</strong> shows how two entities are connected. A <strong>one-to-many (1:M)</strong> relationship means one record in table A is linked to many records in table B, but each record in table B links to only one in table A.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">One-to-One (1:1) — for reference</div>
        <p class="concept-hint">One record in table A relates to at most one in table B. Less common in simple school examples. Example: If each student has exactly one locker and each locker belongs to one student, STUDENTS ↔ LOCKERS is 1:1.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">One-to-Many (1:M) Examples</div>
        <div class="rel-diagram">
          <div class="rel-row">
            <div class="rel-entity">CLASSES</div>
            <div class="rel-connector">
              <span class="rel-card">1</span>
              <div class="rel-line"></div>
              <span class="rel-card">M</span>
            </div>
            <div class="rel-entity">STUDENTS</div>
            <div class="rel-explain">One class has many students</div>
          </div>
          <div class="rel-row">
            <div class="rel-entity">COURSES</div>
            <div class="rel-connector">
              <span class="rel-card">1</span>
              <div class="rel-line"></div>
              <span class="rel-card">M</span>
            </div>
            <div class="rel-entity">ENROLLMENTS</div>
            <div class="rel-explain">One course has many enrollments</div>
          </div>
        </div>
        <p class="concept-hint">CLASSES.ClassID appears <strong>once</strong> in CLASSES but <strong>many times</strong> in STUDENTS. Say: "Class 3A appears once in CLASSES but many times in STUDENTS → 1:M."</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Identify 1:1 or 1:M</div>
        <p class="exercise-instructions">For each scenario, select the correct relationship type.</p>
        <div id="rel1mExercise">
          ${makeMCQ(1, 'One CLASS has many STUDENTS', ['1:1', '1:M'], 1, 'A class can have 30+ students, but each student belongs to one class.')}
          ${makeMCQ(2, 'Each STUDENT has exactly one LOCKER, and each LOCKER belongs to one STUDENT', ['1:1', '1:M'], 0, 'One student ↔ one locker = 1:1.')}
          ${makeMCQ(3, 'One COURSE has many ENROLLMENTS', ['1:1', '1:M'], 1, 'Many students can enrol in the same course.')}
          ${makeMCQ(4, 'One TEACHER teaches many CLASSES', ['1:1', '1:M'], 1, 'Each class has one class teacher, but a teacher can teach multiple classes.')}
          ${makeMCQ(5, 'Each COUNTRY has exactly one CAPITAL, and each CAPITAL belongs to one COUNTRY', ['1:1', '1:M'], 0, 'One capital per country, one country per capital = 1:1.')}
          ${makeMCQ(6, 'In STUDENTS, where does ClassID appear?', ['Once per class', 'Many times — many students share the same ClassID', 'Never'], 1, 'ClassID appears many times in STUDENTS because many students are in the same class.')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkMCQExercise('rel1mExercise','rel1mFeedback')">Check Answers</button>
        <div id="rel1mFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}


// ===================================================================
// SECTION 1.6 — Many-to-Many (M:N)
// ===================================================================
function buildRelMNSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.6 Relationship: Many-to-Many (M:N)</h2>
        <p class="concept-intro">A <strong>many-to-many (M:N)</strong> relationship means many records in table A link to many records in table B. Relational databases handle this with an extra <strong>link table</strong>.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">M:N in Our School Database</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Direct View</div>
            <div class="callout-def">A STUDENT can take many COURSES. A COURSE can be taken by many STUDENTS. → M:N</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Resolution</div>
            <div class="callout-def">Create ENROLLMENTS as a link table with: EnrollmentID, StudentID, CourseID, Grade</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">How the link table works</div>
        <div class="rel-diagram">
          <div class="rel-resolved">
            <div class="rel-resolved-diagram">
              <span>STUDENTS</span>
              <span class="rel-card-sm">1</span>
              <div class="rel-line-sm"></div>
              <span class="rel-card-sm">M</span>
              <span class="rel-link-table">ENROLLMENTS</span>
              <span class="rel-card-sm">M</span>
              <div class="rel-line-sm"></div>
              <span class="rel-card-sm">1</span>
              <span>COURSES</span>
            </div>
            <p class="concept-hint">ENROLLMENTS "breaks" the many-to-many into two one-to-many relationships.</p>
          </div>
        </div>
      </div>

      ${miniTable('ENROLLMENTS (link table)',
        ['EnrollmentID', 'StudentID', 'CourseID', 'Grade'],
        [
          ['E0001', 'S001', 'ICT01', 'A'],
          ['E0002', 'S001', 'MATH02', 'B'],
          ['E0003', 'S002', 'ICT01', 'C'],
          ['E0004', 'S002', 'MATH02', 'A'],
        ]
      )}

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Many-to-Many Relationships</div>
        <p class="exercise-instructions">Answer questions about M:N relationships.</p>
        <div id="relMnExercise">
          ${makeMCQ(1, 'Why cannot we store the M:N relationship directly between STUDENTS and COURSES?', ['It is too complex', 'Relational databases do not support M:N directly — we need a link table', 'There is no reason'], 1, 'Relational tables need a link (junction) table to resolve M:N.')}
          ${makeMCQ(2, 'The ENROLLMENTS table is called a...', ['Primary table', 'Link (junction) table', 'View', 'Index table'], 1, 'It links STUDENTS and COURSES — it is a link/junction table.')}
          ${makeMCQ(3, 'After resolving with ENROLLMENTS, the relationship becomes...', ['Two 1:1 relationships', 'Two 1:M relationships', 'One M:N relationship', 'No relationship'], 1, 'STUDENTS 1:M ENROLLMENTS and COURSES 1:M ENROLLMENTS.')}
          ${makeMCQ(4, 'In a school library, STUDENTS can borrow many BOOKS, and BOOKS can be borrowed by many STUDENTS. What do you need?', ['A 1:M relationship', 'A link table (e.g. BORROWINGS)', 'A 1:1 relationship', 'Nothing'], 1, 'This is M:N — you need a link table like BORROWINGS.')}
          ${makeMCQ(5, 'Which columns would the link table ENROLLMENTS contain?', ['StudentID and CourseName', 'EnrollmentID, StudentID, CourseID, and Grade', 'Only Grade', 'StudentName and CourseName'], 1, 'The link table has its own PK plus the FKs from both related tables, plus any extra attributes.')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkMCQExercise('relMnExercise','relMnFeedback')">Check Answers</button>
        <div id="relMnFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}


// ===================================================================
// SECTION 1.7 — Primary Key
// ===================================================================
function buildPKSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.7 Key: Primary Key (PK)</h2>
        <p class="concept-intro">A <strong>primary key (PK)</strong> is an attribute (or combination of attributes) that <strong>uniquely identifies</strong> each record in a table. No two rows can have the same PK value, and a PK cannot be <strong>NULL</strong>.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Primary Keys in Our Database</div>
        <div class="keys-visual">
          <div class="key-table-vis">
            <div class="key-table-title">STUDENTS</div>
            <div class="key-row"><span class="key-badge pk">PK</span> StudentID</div>
            <div class="key-row">Name</div>
            <div class="key-row">Gender</div>
            <div class="key-row">DateOfBirth</div>
            <div class="key-row">ClassID</div>
          </div>
          <div class="key-table-vis">
            <div class="key-table-title">CLASSES</div>
            <div class="key-row"><span class="key-badge pk">PK</span> ClassID</div>
            <div class="key-row">ClassName</div>
            <div class="key-row">ClassTeacher</div>
          </div>
          <div class="key-table-vis">
            <div class="key-table-title">COURSES</div>
            <div class="key-row"><span class="key-badge pk">PK</span> CourseID</div>
            <div class="key-row">CourseName</div>
            <div class="key-row">Room</div>
          </div>
          <div class="key-table-vis">
            <div class="key-table-title">ENROLLMENTS</div>
            <div class="key-row"><span class="key-badge pk">PK</span> EnrollmentID</div>
            <div class="key-row">StudentID</div>
            <div class="key-row">CourseID</div>
            <div class="key-row">Grade</div>
          </div>
        </div>
        <p class="concept-hint">Ask yourself: "Which column uniquely identifies each row in this table?"</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Identify Primary Keys</div>
        <p class="exercise-instructions">For each table, select the correct primary key.</p>
        <div id="pkExercise">
          ${makeMCQ(1, 'What is the primary key of the STUDENTS table?', ['Name', 'StudentID', 'ClassID', 'Gender'], 1, 'StudentID uniquely identifies each student.')}
          ${makeMCQ(2, 'What is the primary key of the CLASSES table?', ['ClassName', 'ClassTeacher', 'ClassID', 'StudentID'], 2, 'ClassID uniquely identifies each class.')}
          ${makeMCQ(3, 'What is the primary key of the ENROLLMENTS table?', ['StudentID', 'CourseID', 'Grade', 'EnrollmentID'], 3, 'EnrollmentID uniquely identifies each enrollment.')}
          ${makeMCQ(4, 'Can a primary key value be NULL?', ['Yes', 'No', 'Sometimes'], 1, 'A PK can NEVER be NULL — this is a fundamental rule.')}
          ${makeMCQ(5, 'Can two rows in STUDENTS have the same StudentID?', ['Yes', 'No'], 1, 'No — PK values must be unique.')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkMCQExercise('pkExercise','pkFeedback')">Check Answers</button>
        <div id="pkFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}


// ===================================================================
// SECTION 1.8 — Foreign Key
// ===================================================================
function buildFKSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.8 Key: Foreign Key (FK)</h2>
        <p class="concept-intro">A <strong>foreign key (FK)</strong> is an attribute in one table that refers to the <strong>primary key</strong> of another table. Foreign keys create <strong>relationships</strong> between tables.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Foreign Keys in Our Database</div>
        <div class="keys-visual">
          <div class="key-table-vis">
            <div class="key-table-title">STUDENTS</div>
            <div class="key-row"><span class="key-badge pk">PK</span> StudentID</div>
            <div class="key-row">Name</div>
            <div class="key-row"><span class="key-badge fk">FK</span> ClassID</div>
          </div>
          <div class="key-link-arrow">
            <svg width="40" height="24" viewBox="0 0 40 24"><path d="M0 12h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            <span class="key-link-label">references</span>
          </div>
          <div class="key-table-vis">
            <div class="key-table-title">CLASSES</div>
            <div class="key-row"><span class="key-badge pk">PK</span> ClassID</div>
            <div class="key-row">ClassName</div>
          </div>
        </div>

        <div class="keys-visual" style="margin-top:var(--space-4)">
          <div class="key-table-vis">
            <div class="key-table-title">ENROLLMENTS</div>
            <div class="key-row"><span class="key-badge pk">PK</span> EnrollmentID</div>
            <div class="key-row"><span class="key-badge fk">FK</span> StudentID</div>
            <div class="key-row"><span class="key-badge fk">FK</span> CourseID</div>
            <div class="key-row">Grade</div>
          </div>
          <div class="key-link-arrow">
            <svg width="40" height="24" viewBox="0 0 40 24"><path d="M0 12h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            <span class="key-link-label">references</span>
          </div>
          <div class="key-table-vis">
            <div class="key-table-title">STUDENTS & COURSES</div>
            <div class="key-row"><span class="key-badge pk">PK</span> StudentID</div>
            <div class="key-row"><span class="key-badge pk">PK</span> CourseID</div>
          </div>
        </div>
        <p class="concept-hint">Using FKs, we can join tables: To find which class a student belongs to, use STUDENTS.ClassID → CLASSES. To find which courses a student takes, use ENROLLMENTS (StudentID, CourseID).</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Identify Key Types</div>
        <p class="exercise-instructions">For each attribute, select its key type.</p>
        <div id="fkExercise" class="keys-exercise">
          ${makeKeyQuestion(1, 'STUDENTS.StudentID', 'pk', 'Uniquely identifies each student')}
          ${makeKeyQuestion(2, 'STUDENTS.ClassID', 'fk', 'References CLASSES.ClassID')}
          ${makeKeyQuestion(3, 'CLASSES.ClassID', 'pk', 'Uniquely identifies each class')}
          ${makeKeyQuestion(4, 'ENROLLMENTS.StudentID', 'fk', 'References STUDENTS.StudentID')}
          ${makeKeyQuestion(5, 'ENROLLMENTS.EnrollmentID', 'pk', 'Uniquely identifies each enrollment')}
          ${makeKeyQuestion(6, 'ENROLLMENTS.CourseID', 'fk', 'References COURSES.CourseID')}
          ${makeKeyQuestion(7, 'COURSES.CourseID', 'pk', 'Uniquely identifies each course')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkKeysExercise()">Check Answers</button>
        <div id="keysFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}

function makeKeyQuestion(num, attr, correctType, hint) {
  return `<div class="key-q" data-correct="${correctType}">
    <div class="key-q-num">${num}</div>
    <div class="key-q-attr">${attr}</div>
    <div class="key-q-btns">
      <label class="radio-pill"><input type="radio" name="key_${num}" value="pk"><span>Primary Key</span></label>
      <label class="radio-pill"><input type="radio" name="key_${num}" value="fk"><span>Foreign Key</span></label>
      <label class="radio-pill"><input type="radio" name="key_${num}" value="ck"><span>Candidate Key</span></label>
    </div>
    <div class="key-q-hint" style="display:none">${hint}</div>
  </div>`;
}


// ===================================================================
// SECTION 1.9–1.10 — Candidate Key & Index
// ===================================================================
function buildCKIndexSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.9 Candidate Key & 1.10 Index</h2>
        <p class="concept-intro">A <strong>candidate key</strong> is any attribute (or group of attributes) that <em>can</em> uniquely identify each record. The <strong>primary key</strong> is chosen from the candidate keys. An <strong>index</strong> is a structure that helps the database find data faster.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Candidate Keys in STUDENTS</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">StudentID</div>
            <div class="callout-def">Unique → candidate key → <strong>chosen as PK</strong></div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">HKID or StudentEmail</div>
            <div class="callout-def">If unique → also a candidate key (but not chosen as PK)</div>
          </div>
        </div>
        <p class="concept-hint">"Candidate keys are all the 'good choices' for PK; PK is the one we actually choose."</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Index</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">What it does</div>
            <div class="callout-def">Helps the database find data faster, like the index at the back of a book</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Auto-indexed</div>
            <div class="callout-def">Primary keys are usually indexed automatically</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Trade-off</div>
            <div class="callout-def">Indexes improve speed, but use extra storage and must be updated when data changes</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Candidate Keys</div>
        <p class="exercise-instructions">Answer questions about candidate keys.</p>
        <div id="ckExercise">
          ${makeMCQ(1, 'A candidate key must be...', ['Unique only', 'Unique and minimal (no extra attributes)', 'A number', 'Named "ID"'], 1, 'All candidate keys are unique and minimal.')}
          ${makeMCQ(2, 'The primary key is chosen from...', ['Foreign keys', 'Candidate keys', 'All columns', 'Index columns'], 1, 'We pick one candidate key to be the PK.')}
          ${makeMCQ(3, 'In STUDENTS, if both StudentID and StudentEmail are unique, how many candidate keys are there?', ['1', '2', '3', '0'], 1, 'Both are candidate keys; we choose one as PK.')}
          ${makeMCQ(4, 'If StudentEmail is a candidate key but not the PK, what is it called?', ['Foreign key', 'An alternate / candidate key', 'Index', 'Domain'], 1, 'It remains a candidate key (or alternate key).')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkMCQExercise('ckExercise','ckFeedback')">Check Answers</button>
        <div id="ckFeedback" class="feedback-area"></div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Index Benefits</div>
        <p class="exercise-instructions">Which columns would benefit most from an index? Select all that apply.</p>
        <div class="attr-options" id="indexExercise">
          ${makeCheckbox('idx', 'STUDENTS.StudentID (Primary Key)', true)}
          ${makeCheckbox('idx', 'STUDENTS.Name (frequently searched)', true)}
          ${makeCheckbox('idx', 'STUDENTS.Gender (only 2 values — low selectivity)', false)}
          ${makeCheckbox('idx', 'ENROLLMENTS.StudentID (frequently joined)', true)}
          ${makeCheckbox('idx', 'ENROLLMENTS.CourseID (frequently joined)', true)}
          ${makeCheckbox('idx', 'ENROLLMENTS.Grade (only 6 values — low selectivity)', false)}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkIndexExercise()">Check Answers</button>
        <div id="indexFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}


// ===================================================================
// SECTION 1.11 — Integrity
// ===================================================================
function buildIntegritySection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">1.11 Integrity in Relational Databases</h2>
        <p class="concept-intro">Integrity ensures that the data in the database is <strong>accurate and consistent</strong>. There are three types of integrity.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Three Types of Integrity</div>
        <div class="integrity-cards">
          <div class="integrity-card entity-int">
            <div class="integrity-type">1.11.1 Entity Integrity</div>
            <div class="integrity-rule">Every table must have a PK. The PK <strong>cannot be NULL or duplicated</strong>.</div>
            <div class="integrity-eg">In STUDENTS, every student must have a StudentID, and no two students can share the same StudentID.</div>
          </div>
          <div class="integrity-card referential-int">
            <div class="integrity-type">1.11.2 Referential Integrity</div>
            <div class="integrity-rule">A FK value must match an existing PK in the related table, or be <strong>NULL</strong>.</div>
            <div class="integrity-eg">STUDENTS.ClassID must refer to a ClassID that exists in CLASSES. You cannot assign ClassID = 'C9Z' if there is no such class.</div>
          </div>
          <div class="integrity-card domain-int">
            <div class="integrity-type">1.11.3 Domain Integrity</div>
            <div class="integrity-rule">Values must be from the correct <strong>domain</strong> (type, range, format).</div>
            <div class="integrity-eg">STUDENTS.DateOfBirth must be a valid date, not text like "hello". ENROLLMENTS.Grade must be one of the allowed grade letters.</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">What happens when integrity is broken?</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Referential</div>
            <div class="callout-def">Deleting a CLASS that still has students → breaks referential integrity. The system may block the deletion, cascade it, or set FKs to NULL.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Entity</div>
            <div class="callout-def">Inserting a row with no PK or a duplicate PK → breaks entity integrity.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Domain</div>
            <div class="callout-def">Inserting ClassName = "Class ABC?" when the domain expects "3A", "4B" → breaks domain integrity.</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Which Integrity Rule is Violated?</div>
        <p class="exercise-instructions">For each scenario, identify which type of integrity is violated.</p>
        <div id="integrityExercise" class="integrity-exercise">
          ${makeIntegrityQuestion(1, 'Two students in STUDENTS have the same StudentID', 'entity', 'PK must be unique → entity integrity.')}
          ${makeIntegrityQuestion(2, 'A student has ClassID = "C9Z", but no class C9Z exists in CLASSES', 'referential', 'FK must reference an existing PK → referential integrity.')}
          ${makeIntegrityQuestion(3, 'An enrollment has Grade = "Z" (domain is {A,B,C,D,E,U})', 'domain', 'Grade is outside the allowed domain → domain integrity.')}
          ${makeIntegrityQuestion(4, 'A row in STUDENTS has StudentID = NULL', 'entity', 'PK cannot be NULL → entity integrity.')}
          ${makeIntegrityQuestion(5, 'Deleting Class C3A from CLASSES while students still reference ClassID = C3A', 'referential', 'Would create orphan records → referential integrity.')}
          ${makeIntegrityQuestion(6, 'A student has DateOfBirth = "hello" instead of a valid date', 'domain', 'DateOfBirth must be a valid date → domain integrity.')}
          ${makeIntegrityQuestion(7, 'An enrollment has StudentID = S999, but no student S999 exists', 'referential', 'FK references non-existent PK → referential integrity.')}
          ${makeIntegrityQuestion(8, 'Two enrollments share the same EnrollmentID', 'entity', 'PK must be unique → entity integrity.')}
          ${makeIntegrityQuestion(9, 'CLASSES.ClassName is set to "Class ABC?" instead of "3A"', 'domain', 'ClassName is outside the expected format → domain integrity.')}
          ${makeIntegrityQuestion(10, 'ENROLLMENTS.CourseID = "XYZ99" but no such course exists', 'referential', 'FK must match existing PK → referential integrity.')}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="checkIntegrityExercise()">Check Answers</button>
        <div id="integrityFeedback" class="feedback-area"></div>
      </div>
    </div>
  `;
}

function makeIntegrityQuestion(num, scenario, correct, explanation) {
  return `<div class="integ-q" data-correct="${correct}">
    <div class="integ-q-num">${num}</div>
    <div class="integ-q-text">${scenario}</div>
    <div class="integ-q-btns">
      <label class="radio-pill"><input type="radio" name="integ_${num}" value="entity"><span>Entity</span></label>
      <label class="radio-pill"><input type="radio" name="integ_${num}" value="referential"><span>Referential</span></label>
      <label class="radio-pill"><input type="radio" name="integ_${num}" value="domain"><span>Domain</span></label>
    </div>
    <div class="integ-q-explain" style="display:none">${explanation}</div>
  </div>`;
}


// ===================================================================
// CONCEPT QUIZ
// ===================================================================
function buildQuizSection() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">Concept Quiz</h2>
        <p class="concept-intro">Test your understanding of all relational database concepts (1.1–1.11). Answer all questions, then check your score.</p>
      </div>

      <div class="exercise-block">
        <div class="quiz-progress" id="quizProgress">Question 1 of ${quizQuestions.length}</div>
        <div id="quizContainer"></div>
        <div class="quiz-nav">
          <button class="btn btn-outline" id="quizPrev" onclick="quizNav(-1)" disabled>Previous</button>
          <button class="btn btn-primary" id="quizNext" onclick="quizNav(1)">Next</button>
          <button class="btn btn-primary" id="quizSubmit" onclick="submitQuiz()" style="display:none">Submit Quiz</button>
        </div>
        <div id="quizResult" class="feedback-area"></div>
      </div>
    </div>
  `;
}

const quizQuestions = [
  { q: 'A relational database stores data in...', opts: ['Files', 'Tables', 'Graphs', 'Arrays'], ans: 1 },
  { q: 'What does an entity represent?', opts: ['A column in a table', 'A real-world object or thing we store data about', 'A relationship between tables', 'A type of key'], ans: 1 },
  { q: 'Each column in a table is called a(n)...', opts: ['Record', 'Entity', 'Attribute', 'Relationship'], ans: 2 },
  { q: 'A domain defines...', opts: ['The name of a table', 'The set of allowed values for an attribute', 'A type of relationship', 'The number of rows'], ans: 1 },
  { q: 'What is the domain of ENROLLMENTS.Grade?', opts: ['Any text', '{A, B, C, D, E, U}', 'Any integer', '{Pass, Fail}'], ans: 1 },
  { q: 'A one-to-many (1:M) relationship means...', opts: ['One row links to one row', 'One row in table A links to many rows in table B', 'Many rows link to many rows', 'No rows link to each other'], ans: 1 },
  { q: 'A many-to-many (M:N) is resolved by...', opts: ['Merging tables', 'Adding a foreign key', 'Creating a link (junction) table', 'Deleting one table'], ans: 2 },
  { q: 'A primary key must be...', opts: ['Unique only', 'NOT NULL only', 'Both unique and NOT NULL', 'Neither'], ans: 2 },
  { q: 'A foreign key references...', opts: ['Any column in another table', 'The primary key of another table', 'An index', 'A candidate key only'], ans: 1 },
  { q: 'Candidate keys are...', opts: ['All columns', 'Attributes that can uniquely identify each record', 'Only the primary key', 'Foreign keys'], ans: 1 },
  { q: 'An index speeds up...', opts: ['Data insertion', 'Data retrieval (searching)', 'Data deletion', 'Table creation'], ans: 1 },
  { q: 'Indexes use extra storage and must be updated when data changes.', opts: ['True', 'False'], ans: 0 },
  { q: 'Two students with the same StudentID violates...', opts: ['Entity integrity', 'Referential integrity', 'Domain integrity', 'No rule'], ans: 0 },
  { q: 'A FK pointing to a non-existent PK violates...', opts: ['Entity integrity', 'Referential integrity', 'Domain integrity', 'No rule'], ans: 1 },
  { q: 'Inserting Grade = "Z" when the domain is {A,B,C,D,E,U} violates...', opts: ['Entity integrity', 'Referential integrity', 'Domain integrity', 'No rule'], ans: 2 },
  { q: 'Which table is the link table in our database?', opts: ['STUDENTS', 'CLASSES', 'ENROLLMENTS', 'COURSES'], ans: 2 },
  { q: 'STUDENTS.ClassID is a...', opts: ['Primary Key', 'Foreign Key', 'Candidate Key', 'Index'], ans: 1 },
  { q: 'If Email is unique in STUDENTS, it is a...', opts: ['Primary key', 'Foreign key', 'Candidate key', 'Domain'], ans: 2 },
  { q: 'Deleting a CLASS still referenced by students breaks...', opts: ['Entity integrity', 'Referential integrity', 'Domain integrity', 'All three'], ans: 1 },
  { q: 'The relationship between STUDENTS and COURSES is...', opts: ['1:1', '1:M', 'M:N (via ENROLLMENTS)', 'No relationship'], ans: 2 },
];

let quizCurrentQ = 0;
let quizAnswers = new Array(quizQuestions.length).fill(-1);

function renderQuizQuestion() {
  const container = document.getElementById('quizContainer');
  const progress = document.getElementById('quizProgress');
  if (!container) return;

  const q = quizQuestions[quizCurrentQ];
  progress.textContent = `Question ${quizCurrentQ + 1} of ${quizQuestions.length}`;

  container.innerHTML = `
    <div class="quiz-question">
      <div class="quiz-q-num">Q${quizCurrentQ + 1}</div>
      <div class="quiz-q-text">${q.q}</div>
      <div class="quiz-options">
        ${q.opts.map((opt, i) => `
          <label class="quiz-option ${quizAnswers[quizCurrentQ] === i ? 'selected' : ''}">
            <input type="radio" name="quizQ" value="${i}" ${quizAnswers[quizCurrentQ] === i ? 'checked' : ''} onchange="quizAnswers[${quizCurrentQ}]=${i}; renderQuizQuestion();">
            <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('quizPrev').disabled = quizCurrentQ === 0;
  const nextBtn = document.getElementById('quizNext');
  const submitBtn = document.getElementById('quizSubmit');
  if (quizCurrentQ === quizQuestions.length - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = '';
  } else {
    nextBtn.style.display = '';
    submitBtn.style.display = 'none';
  }
}

function quizNav(dir) {
  quizCurrentQ = Math.max(0, Math.min(quizQuestions.length - 1, quizCurrentQ + dir));
  renderQuizQuestion();
}

function submitQuiz() {
  let correct = 0;
  const details = quizQuestions.map((q, i) => {
    const isCorrect = quizAnswers[i] === q.ans;
    if (isCorrect) correct++;
    const chosen = quizAnswers[i] >= 0 ? q.opts[quizAnswers[i]] : 'Not answered';
    return `<div class="quiz-result-item ${isCorrect ? 'correct' : 'incorrect'}">
      <span class="quiz-result-num">Q${i + 1}</span>
      <span class="quiz-result-icon">${isCorrect ? '✓' : '✗'}</span>
      <span class="quiz-result-text">${q.q}</span>
      <span class="quiz-result-answer">${isCorrect ? '' : 'Your answer: ' + chosen + ' — Correct: ' + q.opts[q.ans]}</span>
    </div>`;
  });

  const pct = Math.round((correct / quizQuestions.length) * 100);
  const grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Keep Practising' : 'Review the Notes';

  document.getElementById('quizResult').innerHTML = `
    <div class="quiz-score">
      <div class="quiz-score-number">${correct}/${quizQuestions.length}</div>
      <div class="quiz-score-pct">${pct}%</div>
      <div class="quiz-score-grade">${grade}</div>
    </div>
    <div class="quiz-results-detail">${details.join('')}</div>
    <button class="btn btn-outline" onclick="resetQuiz()" style="margin-top:var(--space-4)">Retry Quiz</button>
  `;
}

function resetQuiz() {
  quizCurrentQ = 0;
  quizAnswers = new Array(quizQuestions.length).fill(-1);
  document.getElementById('quizResult').innerHTML = '';
  renderQuizQuestion();
}


// ===== CHECK ANSWER FUNCTIONS =====
function checkAttributeExercise() {
  let correct = 0, total = 0;
  document.querySelectorAll('#attrExercise .attr-check').forEach(label => {
    total++;
    const cb = label.querySelector('input');
    const isCorrectAnswer = label.dataset.correct === 'true';
    const isChecked = cb.checked;
    if (isChecked === isCorrectAnswer) {
      correct++;
      label.classList.add('correct');
      label.classList.remove('incorrect');
    } else {
      label.classList.add('incorrect');
      label.classList.remove('correct');
    }
  });
  showFeedback('attrFeedback', correct, total);
}

function checkDomainExercise() {
  let correct = 0, total = 0;
  document.querySelectorAll('#domainExercise .domain-q').forEach(q => {
    total++;
    const expected = q.dataset.valid;
    const selected = q.querySelector('input:checked');
    if (selected && selected.value === expected) {
      correct++;
      q.classList.add('correct');
      q.classList.remove('incorrect');
    } else {
      q.classList.add('incorrect');
      q.classList.remove('correct');
    }
  });
  showFeedback('domainFeedback', correct, total);
}

function checkKeysExercise() {
  let correct = 0, total = 0;
  document.querySelectorAll('#fkExercise .key-q').forEach(q => {
    total++;
    const expected = q.dataset.correct;
    const selected = q.querySelector('input:checked');
    const hint = q.querySelector('.key-q-hint');
    if (selected && selected.value === expected) {
      correct++;
      q.classList.add('correct');
      q.classList.remove('incorrect');
      hint.style.display = 'none';
    } else {
      q.classList.add('incorrect');
      q.classList.remove('correct');
      hint.style.display = 'block';
    }
  });
  showFeedback('keysFeedback', correct, total);
}

function checkIndexExercise() {
  let correct = 0, total = 0;
  document.querySelectorAll('#indexExercise .attr-check').forEach(label => {
    total++;
    const cb = label.querySelector('input');
    const isCorrectAnswer = label.dataset.correct === 'true';
    if (cb.checked === isCorrectAnswer) {
      correct++;
      label.classList.add('correct');
      label.classList.remove('incorrect');
    } else {
      label.classList.add('incorrect');
      label.classList.remove('correct');
    }
  });
  showFeedback('indexFeedback', correct, total);
}

function checkIntegrityExercise() {
  let correct = 0, total = 0;
  document.querySelectorAll('#integrityExercise .integ-q').forEach(q => {
    total++;
    const expected = q.dataset.correct;
    const selected = q.querySelector('input:checked');
    const explain = q.querySelector('.integ-q-explain');
    if (selected && selected.value === expected) {
      correct++;
      q.classList.add('correct');
      q.classList.remove('incorrect');
      explain.style.display = 'none';
    } else {
      q.classList.add('incorrect');
      q.classList.remove('correct');
      explain.style.display = 'block';
    }
  });
  showFeedback('integrityFeedback', correct, total);
}


// ===== DRAG AND DROP =====
function attachInteractions(sectionId) {
  if (sectionId === 'entity') setupDragDrop();
  if (sectionId === 'quiz') { quizCurrentQ = 0; renderQuizQuestion(); }
}

function setupDragDrop() {
  const chips = document.querySelectorAll('.drag-chip');
  const zones = document.querySelectorAll('.drop-zone');

  chips.forEach(chip => {
    chip.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', chip.dataset.answer);
      chip.classList.add('dragging');
    });
    chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const selectedChips = document.querySelectorAll('.drag-chip.selected');
      const selectedZones = document.querySelectorAll('.drop-zone.selected');
      if (selectedChips.length === 1 && selectedZones.length === 1) {
        const z = selectedZones[0];
        const c = selectedChips[0];
        if (c.dataset.answer === z.dataset.accept) {
          z.textContent = c.textContent;
          z.classList.add('filled', 'correct');
          c.classList.add('matched');
          c.style.opacity = '0.4';
        } else {
          z.classList.add('wrong');
          setTimeout(() => z.classList.remove('wrong'), 600);
        }
        selectedChips.forEach(sc => sc.classList.remove('selected'));
        selectedZones.forEach(sz => sz.classList.remove('selected'));
      }
    });
  });

  zones.forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const answer = e.dataTransfer.getData('text/plain');
      if (answer === zone.dataset.accept) {
        const chip = document.querySelector(`.drag-chip[data-answer="${answer}"]`);
        zone.textContent = chip ? chip.textContent : answer;
        zone.classList.add('filled', 'correct');
        if (chip) { chip.classList.add('matched'); chip.style.opacity = '0.4'; }
      } else {
        zone.classList.add('wrong');
        setTimeout(() => zone.classList.remove('wrong'), 600);
      }
    });
    zone.addEventListener('click', () => {
      zones.forEach(z => z.classList.remove('selected'));
      zone.classList.add('selected');
    });
  });
}
