/* ===== Creating a Simple Relational Database — Interactive Module ===== */
/* Based on HKDSE ICT Elective A syllabus notes (2.1–2.11) */

// ===== MODULE INIT =====
function initCreatingDbModule() {
  const container = document.getElementById('creatingDbContent');
  if (!container) return;
  renderCreatingDbNav();
  showCdbSection('cdb-design');
}

// ===== NAVIGATION =====
function renderCreatingDbNav() {
  const nav = document.getElementById('creatingDbNav');
  if (!nav) return;
  const sections = [
    { id: 'cdb-design',    label: '2.1 Good Relational Design',      icon: 'database' },
    { id: 'cdb-update',    label: '2.2 Updating Data in One Place',  icon: 'table'    },
    { id: 'cdb-verify',    label: '2.3 Verifying Updates',           icon: 'search'   },
    { id: 'cdb-join2',     label: '2.4 Joining Two Tables',          icon: 'link'     },
    { id: 'cdb-join3',     label: '2.5 Joining Three Tables',        icon: 'link2'    },
    { id: 'cdb-null',      label: '2.6 Handling NULL',               icon: 'shield'   },
    { id: 'cdb-isnull',    label: '2.7 Filtering NULL Values',       icon: 'columns'  },
    { id: 'cdb-groupby',   label: '2.8 Counting per Group',          icon: 'key'      },
    { id: 'cdb-leftjoin',  label: '2.9 Enrollment Patterns',         icon: 'key2'     },
    { id: 'cdb-insert',    label: '2.10 Adding New Records',         icon: 'check'    },
    { id: 'cdb-enroll',    label: '2.11 Creating Enrollments',       icon: 'award'    },
  ];

  nav.innerHTML = sections.map(s => `
    <button class="concept-nav-item" data-section="${s.id}">
      ${getNavIcon(s.icon)}
      <span>${s.label}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.concept-nav-item').forEach(btn => {
    btn.addEventListener('click', () => showCdbSection(btn.dataset.section));
  });
}

function showCdbSection(sectionId) {
  document.querySelectorAll('#creatingDbNav .concept-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  const content = document.getElementById('creatingDbContent');
  const builders = {
    'cdb-design':   buildCdbDesign,
    'cdb-update':   buildCdbUpdate,
    'cdb-verify':   buildCdbVerify,
    'cdb-join2':    buildCdbJoin2,
    'cdb-join3':    buildCdbJoin3,
    'cdb-null':     buildCdbNull,
    'cdb-isnull':   buildCdbIsNull,
    'cdb-groupby':  buildCdbGroupBy,
    'cdb-leftjoin': buildCdbLeftJoin,
    'cdb-insert':   buildCdbInsert,
    'cdb-enroll':   buildCdbEnroll,
  };

  content.innerHTML = '';
  if (builders[sectionId]) {
    content.innerHTML = builders[sectionId]();
  }
  content.scrollTop = 0;
}

// ===== LOCAL MCQ HELPERS =====
function cdbMakeMCQ(sectionPrefix, num, question, options, correctIdx, explanation) {
  const name = 'cdb_' + sectionPrefix + '_q' + num;
  return `<div class="identify-q" data-correct="${correctIdx}" data-explain="${escapeAttr(explanation || '')}">
    <div class="identify-q-num">${num}</div>
    <div class="identify-q-text">${question}</div>
    <div class="identify-q-opts">
      ${options.map((opt, i) => `
        <label class="radio-pill"><input type="radio" name="${name}" value="${i}"><span>${opt}</span></label>
      `).join('')}
    </div>
    <div class="identify-q-explain" style="display:none"></div>
  </div>`;
}

function cdbCheckMCQ(containerId, feedbackId) {
  let correct = 0, total = 0;
  document.querySelectorAll('#' + containerId + ' .identify-q').forEach(q => {
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

// ===== SQL CODE BLOCK HELPER =====
function cdbSqlBlock(sqlString) {
  return `<div class="sql-code-block">
    <div class="sql-code-header"><span class="sql-code-label">SQL</span></div>
    <pre class="sql-code"><code>${escapeHTML(sqlString)}</code></pre>
  </div>`;
}

// ===================================================================
// SECTION 2.1 — Good Relational Design
// ===================================================================
function buildCdbDesign() {
  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.1 Good Relational Design</h2>
        <p class="concept-intro">A well-designed relational database avoids <strong>data redundancy</strong> by splitting information into separate tables. Each table stores data about one entity, and tables are connected through <strong>Primary Keys (PK)</strong> and <strong>Foreign Keys (FK)</strong>.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Why Avoid Redundancy?</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Bad Design</div>
            <div class="callout-def">Store room number inside every student row. If the room changes, you must update hundreds of rows — and risk inconsistency.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Good Design</div>
            <div class="callout-def">Store room number once in the COURSES table. All students who enrol automatically see the correct room via a JOIN.</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">Our 4-Table School Database</div>
        <div class="keys-visual" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;">
          <div class="key-table-vis">
            <div class="key-table-title">STUDENTS</div>
            <div class="key-row"><span class="key-badge pk">PK</span> StudentID</div>
            <div class="key-row">Name</div>
            <div class="key-row">Gender</div>
            <div class="key-row">DateOfBirth</div>
            <div class="key-row"><span class="key-badge fk">FK</span> ClassID</div>
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
            <div class="key-row"><span class="key-badge fk">FK</span> StudentID</div>
            <div class="key-row"><span class="key-badge fk">FK</span> CourseID</div>
            <div class="key-row">Grade</div>
          </div>
        </div>
        <p class="concept-hint">ENROLLMENTS acts as a <strong>junction table</strong> linking STUDENTS and COURSES in a many-to-many relationship.</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Good Relational Design</div>
        <p class="exercise-instructions">Choose the best answer for each question.</p>
        <div id="cdbDesignEx">
          ${cdbMakeMCQ('21', 1,
            'Why should we store a student\'s class teacher name in a separate CLASSES table rather than in every student row?',
            [
              'It makes the database run faster',
              'To avoid redundancy — update once and it reflects for all students',
              'Because student rows cannot store text',
              'It is required by SQL syntax'
            ],
            1,
            'Storing data once avoids redundancy. If the class teacher changes, you update it in one row in CLASSES instead of updating every student row.'
          )}
          ${cdbMakeMCQ('21', 2,
            'In a well-designed school database, where should the Room attribute for a course be stored?',
            [
              'In the STUDENTS table',
              'In the ENROLLMENTS table for each student',
              'In the COURSES table — once per course',
              'In both STUDENTS and COURSES'
            ],
            2,
            'Room belongs to a course, so it is stored once in COURSES. Enrolling students access it via a JOIN.'
          )}
          ${cdbMakeMCQ('21', 3,
            'What is the purpose of a Foreign Key (FK) in a relational database?',
            [
              'To store large text data',
              'To uniquely identify each row in a table',
              'To link a row in one table to a related row in another table',
              'To speed up queries'
            ],
            2,
            'A FK references the PK of another table, creating a relationship between the two tables.'
          )}
          ${cdbMakeMCQ('21', 4,
            'The ENROLLMENTS table has two foreign keys: StudentID and CourseID. What kind of relationship does it resolve?',
            [
              'One-to-One',
              'One-to-Many',
              'Many-to-Many',
              'Self-referencing'
            ],
            2,
            'A student can enrol in many courses and a course can have many students — this is a Many-to-Many relationship resolved by a junction table (ENROLLMENTS).'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbDesignEx','cdbDesignFb')">Check Answers</button>
        <div id="cdbDesignFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.2 — Updating Data in One Place
// ===================================================================
function buildCdbUpdate() {
  const sql = `UPDATE COURSES
SET Room = 'Lab 3'
WHERE CourseID = 'ICT001';`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.2 Updating Data in One Place</h2>
        <p class="concept-intro">One of the greatest advantages of a normalised relational database is that you only need to <strong>update data in one place</strong>. Because related tables reference each other through keys, all queries automatically reflect the new value.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Scenario: ICT Course Moves to a New Room</div>
        <p style="margin:0 0 10px;">Suppose ICT moves from Lab 1 to Lab 3. In a normalised design, we update <strong>one row</strong> in COURSES:</p>
        ${cdbSqlBlock(sql)}
        <p class="concept-hint">Every student enrolled in ICT will now see "Lab 3" when they query their course room — no other tables need changing.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Contrast: Redundant (Unnormalised) Design</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Unnormalised</div>
            <div class="callout-def">Room stored in every ENROLLMENTS row. 30 students in ICT means 30 rows to update — and if you miss one, the data is inconsistent.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Normalised</div>
            <div class="callout-def">Room stored once in COURSES. One UPDATE statement, zero chance of inconsistency.</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Updating Data</div>
        <p class="exercise-instructions">Answer the questions about updating normalised data.</p>
        <div id="cdbUpdateEx">
          ${cdbMakeMCQ('22', 1,
            'A teacher\'s name is stored once in the CLASSES table. To change the teacher for class 3A, how many rows must you UPDATE?',
            [
              'One row in CLASSES',
              'One row per student in class 3A',
              'One row in every table',
              'You cannot update a teacher\'s name'
            ],
            0,
            'Because the teacher name is stored only once in CLASSES, a single UPDATE to that row is sufficient.'
          )}
          ${cdbMakeMCQ('22', 2,
            'Which SQL statement is used to change existing data in a table?',
            ['INSERT INTO', 'SELECT FROM', 'UPDATE ... SET', 'DELETE FROM'],
            2,
            'UPDATE ... SET changes the value of one or more columns in existing rows.'
          )}
          ${cdbMakeMCQ('22', 3,
            'After running UPDATE COURSES SET Room = \'Lab 3\' WHERE CourseID = \'ICT001\', how many rows in ENROLLMENTS need to be changed?',
            ['All rows for ICT001 students', 'One row per enrolled student', 'Zero rows — COURSES was updated', 'It depends on how many students are enrolled'],
            2,
            'Because ENROLLMENTS only stores StudentID and CourseID (not the room), no rows in ENROLLMENTS need updating. The room is looked up from COURSES at query time.'
          )}
          ${cdbMakeMCQ('22', 4,
            'What keyword in an UPDATE statement specifies which rows to change?',
            ['SET', 'WHERE', 'FROM', 'JOIN'],
            1,
            'WHERE filters which rows are affected by the UPDATE. Without WHERE, all rows would be updated.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbUpdateEx','cdbUpdateFb')">Check Answers</button>
        <div id="cdbUpdateFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.3 — Verifying Updates Across Tables
// ===================================================================
function buildCdbVerify() {
  const sql = `SELECT s.StudentID, s.Name, c.CourseName, c.Room
FROM STUDENTS s
JOIN ENROLLMENTS e ON s.StudentID = e.StudentID
JOIN COURSES c    ON e.CourseID   = c.CourseID
WHERE c.CourseID = 'ICT001';`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.3 Verifying Updates Across Tables</h2>
        <p class="concept-intro">After making an update, it is good practice to <strong>verify</strong> the change is correctly reflected across all related tables. We do this with a <strong>SELECT with JOIN</strong>, which combines data from multiple tables in one result.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Verification Query</div>
        <p style="margin:0 0 10px;">To confirm all ICT students now see Lab 3:</p>
        ${cdbSqlBlock(sql)}
      </div>

      <div class="concept-example">
        <div class="example-label">What the Query Returns</div>
        ${miniTable('Result',
          ['StudentID', 'Name', 'CourseName', 'Room'],
          [
            ['S001', 'Chan Tai Man', 'ICT', 'Lab 3'],
            ['S002', 'Wong Siu Ming', 'ICT', 'Lab 3'],
            ['S003', 'Lee Ka Yan', 'ICT', 'Lab 3'],
          ]
        )}
        <p class="concept-hint">All enrolled students now show the updated room "Lab 3" — because the data is stored once in COURSES.</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Verifying Updates</div>
        <p class="exercise-instructions">Answer the questions about verification queries.</p>
        <div id="cdbVerifyEx">
          ${cdbMakeMCQ('23', 1,
            'Which SQL clause is used to combine rows from two tables based on a matching condition?',
            ['WHERE', 'GROUP BY', 'JOIN ... ON', 'HAVING'],
            2,
            'JOIN ... ON combines rows from two tables where the ON condition matches, e.g. StudentID in STUDENTS equals StudentID in ENROLLMENTS.'
          )}
          ${cdbMakeMCQ('23', 2,
            'In the verification query, what does "s.Name" refer to?',
            [
              'The Name column from any table',
              'The Name column from the STUDENTS table aliased as s',
              'A variable called s',
              'The first column in the result'
            ],
            1,
            'Table aliases (s, e, c) are used to prefix column names, making clear which table each column comes from.'
          )}
          ${cdbMakeMCQ('23', 3,
            'Why do we need a WHERE clause in the verification query?',
            [
              'To join the tables together',
              'To filter results to only ICT001 students',
              'To sort the results',
              'To count the number of rows'
            ],
            1,
            'WHERE c.CourseID = \'ICT001\' restricts the output to rows for the ICT course only.'
          )}
          ${cdbMakeMCQ('23', 4,
            'If the Room value in COURSES is correct after the UPDATE, what will happen when students run a SELECT query?',
            [
              'They will still see the old room — each student row stores the room separately',
              'They will see the new room because JOIN fetches the current value from COURSES',
              'The query will return an error',
              'Only some students will see the new room'
            ],
            1,
            'JOIN fetches the Room value from COURSES at query time, so all students immediately see the updated value.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbVerifyEx','cdbVerifyFb')">Check Answers</button>
        <div id="cdbVerifyFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.4 — Joining Two Tables
// ===================================================================
function buildCdbJoin2() {
  const sql = `SELECT s.StudentID, s.Name, c.ClassName, c.ClassTeacher
FROM STUDENTS s
JOIN CLASSES c ON s.ClassID = c.ClassID;`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.4 Joining Two Tables</h2>
        <p class="concept-intro">A <strong>JOIN</strong> (also called an equi-join) combines rows from two tables by matching a <strong>Foreign Key</strong> in one table to the <strong>Primary Key</strong> in another. The <code>ON</code> clause specifies the matching condition.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Equi-Join: STUDENTS + CLASSES</div>
        ${cdbSqlBlock(sql)}
      </div>

      <div class="concept-example">
        <div class="example-label">How the Join Works</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">FROM STUDENTS s</div>
            <div class="callout-def">Start with all rows in STUDENTS, give it the alias "s"</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">JOIN CLASSES c</div>
            <div class="callout-def">Bring in rows from CLASSES, aliased "c"</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">ON s.ClassID = c.ClassID</div>
            <div class="callout-def">Match each student to their class where ClassID values are equal (FK = PK)</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">Sample Result</div>
        ${miniTable('Result',
          ['StudentID', 'Name', 'ClassName', 'ClassTeacher'],
          [
            ['S001', 'Chan Tai Man', '3A', 'Mr. Wong'],
            ['S002', 'Wong Siu Ming', '3A', 'Mr. Wong'],
            ['S003', 'Lee Ka Yan', '3B', 'Ms. Lam'],
          ]
        )}
        <p class="concept-hint">Without the JOIN, you would only see ClassID (a number). The JOIN replaces it with the human-readable ClassName and ClassTeacher from CLASSES.</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Two-Table JOIN</div>
        <p class="exercise-instructions">Answer the questions about joining two tables.</p>
        <div id="cdbJoin2Ex">
          ${cdbMakeMCQ('24', 1,
            'What does the ON clause in a JOIN specify?',
            [
              'Which columns to display in the result',
              'The condition for matching rows between the two tables',
              'How to sort the results',
              'Which database to connect to'
            ],
            1,
            'ON specifies the join condition — usually FK in one table equals PK in the other.'
          )}
          ${cdbMakeMCQ('24', 2,
            'In "JOIN CLASSES c ON s.ClassID = c.ClassID", what does the letter "c" represent?',
            [
              'The letter C in ClassID',
              'A table alias for CLASSES',
              'A column in the result',
              'A count of classes'
            ],
            1,
            '"c" is a table alias for CLASSES, making it quicker to prefix column names like c.ClassName.'
          )}
          ${cdbMakeMCQ('24', 3,
            'Which pair of columns is used to join STUDENTS to CLASSES?',
            [
              'STUDENTS.StudentID = CLASSES.ClassID',
              'STUDENTS.ClassID = CLASSES.ClassID',
              'STUDENTS.Name = CLASSES.ClassName',
              'STUDENTS.StudentID = CLASSES.ClassTeacher'
            ],
            1,
            'ClassID is the FK in STUDENTS and the PK in CLASSES — so we match on STUDENTS.ClassID = CLASSES.ClassID.'
          )}
          ${cdbMakeMCQ('24', 4,
            'A student has ClassID = \'3A\'. After a JOIN with CLASSES, what extra information can the query return?',
            [
              'Only the ClassID value "3A"',
              'ClassName and ClassTeacher from the matching row in CLASSES',
              'All columns from ENROLLMENTS',
              'Nothing — JOINs only filter rows'
            ],
            1,
            'JOIN fetches additional columns (ClassName, ClassTeacher) from the matching CLASSES row, enriching the result.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbJoin2Ex','cdbJoin2Fb')">Check Answers</button>
        <div id="cdbJoin2Fb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.5 — Joining Three Tables
// ===================================================================
function buildCdbJoin3() {
  const sql = `SELECT s.Name, c.CourseName, e.Grade
FROM STUDENTS s
JOIN ENROLLMENTS e ON s.StudentID = e.StudentID
JOIN COURSES c     ON e.CourseID  = c.CourseID;`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.5 Joining Three Tables</h2>
        <p class="concept-intro">For <strong>Many-to-Many (M:N)</strong> relationships, data is accessed through a <strong>junction table</strong>. To see which students are in which courses (with grades), we must JOIN three tables: <code>STUDENTS → ENROLLMENTS → COURSES</code>.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Three-Table Join</div>
        ${cdbSqlBlock(sql)}
      </div>

      <div class="concept-example">
        <div class="example-label">How the Chain of JOINs Works</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Step 1</div>
            <div class="callout-def">Join STUDENTS to ENROLLMENTS on StudentID. Each enrollment is matched to the student who made it.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Step 2</div>
            <div class="callout-def">Join ENROLLMENTS to COURSES on CourseID. Each enrollment is also matched to the course it belongs to.</div>
          </div>
        </div>
        <p class="concept-hint">ENROLLMENTS is the <strong>bridge table</strong>. It holds the FKs for both STUDENTS and COURSES, allowing the three-table join.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Sample Result</div>
        ${miniTable('Result',
          ['Name', 'CourseName', 'Grade'],
          [
            ['Chan Tai Man', 'ICT', 'A'],
            ['Chan Tai Man', 'Mathematics', 'B'],
            ['Wong Siu Ming', 'ICT', 'B+'],
          ]
        )}
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Three-Table JOIN</div>
        <p class="exercise-instructions">Answer the questions about three-table joins.</p>
        <div id="cdbJoin3Ex">
          ${cdbMakeMCQ('25', 1,
            'Why is ENROLLMENTS needed in the three-table join to get student course grades?',
            [
              'Because ENROLLMENTS contains the student names',
              'Because ENROLLMENTS is the junction table that links STUDENTS to COURSES',
              'Because COURSES does not have a CourseID',
              'Because SQL can only join two tables at a time'
            ],
            1,
            'ENROLLMENTS holds both StudentID (FK to STUDENTS) and CourseID (FK to COURSES), forming the bridge between the two main tables.'
          )}
          ${cdbMakeMCQ('25', 2,
            'In the three-table join, which column links ENROLLMENTS to COURSES?',
            ['StudentID', 'EnrollmentID', 'CourseID', 'Grade'],
            2,
            'CourseID is the FK in ENROLLMENTS that references the PK in COURSES.'
          )}
          ${cdbMakeMCQ('25', 3,
            'What does "JOIN ENROLLMENTS e ON s.StudentID = e.StudentID" achieve?',
            [
              'It selects all enrollments regardless of student',
              'It matches each student row to their enrollment rows',
              'It filters enrollments to only show Grade A',
              'It joins COURSES to ENROLLMENTS'
            ],
            1,
            'This JOIN connects each STUDENTS row to the ENROLLMENTS rows that belong to that student, using the shared StudentID.'
          )}
          ${cdbMakeMCQ('25', 4,
            'A student is enrolled in 3 courses. How many rows will appear for that student in the three-table join result?',
            ['1 row', '2 rows', '3 rows', 'It depends on the number of classes'],
            2,
            'One row appears per enrollment. If a student has 3 enrollments, they appear 3 times — once per course.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbJoin3Ex','cdbJoin3Fb')">Check Answers</button>
        <div id="cdbJoin3Fb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.6 — Handling Missing Data (NULL)
// ===================================================================
function buildCdbNull() {
  const sql = `INSERT INTO STUDENTS (StudentID, Name, Gender, DateOfBirth, ClassID)
VALUES ('S010', 'Tam Chi Hung', 'M', '2009-05-20', NULL);`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.6 Handling Missing Data (NULL)</h2>
        <p class="concept-intro"><strong>NULL</strong> represents a missing, unknown, or inapplicable value. It is <strong>not</strong> the same as zero (0), an empty string (""), or the text "NULL". NULL simply means "no data entered here".</p>
      </div>

      <div class="concept-example">
        <div class="example-label">NULL vs Other Values</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">NULL</div>
            <div class="callout-def">Unknown or not yet assigned. E.g. a student whose ClassID is not yet assigned.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">0 (zero)</div>
            <div class="callout-def">A known numeric value. E.g. a score of 0 is different from a missing score.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">'' (empty string)</div>
            <div class="callout-def">A known but blank text value. E.g. a name that was deliberately left blank.</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">Inserting a Row with NULL</div>
        ${cdbSqlBlock(sql)}
        <p class="concept-hint">Here ClassID is NULL because the student has not yet been assigned to a class. The value is unknown, not zero.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">NULL in a Table</div>
        ${miniTable('STUDENTS (partial)',
          ['StudentID', 'Name', 'Gender', 'ClassID'],
          [
            ['S001', 'Chan Tai Man', 'M', 'C3A'],
            ['S010', 'Tam Chi Hung', 'M', 'NULL'],
          ]
        )}
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Understanding NULL</div>
        <p class="exercise-instructions">Test your understanding of NULL values.</p>
        <div id="cdbNullEx">
          ${cdbMakeMCQ('26', 1,
            'A student\'s email address is not yet known. Which value should be stored?',
            ['0', 'An empty string ""', 'NULL', 'The text "unknown"'],
            2,
            'NULL means the value is missing or unknown. It correctly represents "we do not have this information yet".'
          )}
          ${cdbMakeMCQ('26', 2,
            'Is NULL the same as zero (0)?',
            [
              'Yes, they both mean "nothing"',
              'No — NULL means unknown/missing; 0 is a known numeric value',
              'Yes, in SQL they are treated identically',
              'Only for text columns'
            ],
            1,
            'NULL and 0 are completely different. NULL means the value is absent; 0 is an actual numeric value that happens to be zero.'
          )}
          ${cdbMakeMCQ('26', 3,
            'In the INSERT statement, what happens to a column that receives NULL?',
            [
              'The row is rejected',
              'The column stores the text "NULL"',
              'The column is left without a value (unknown)',
              'The column gets the value 0'
            ],
            2,
            'Inserting NULL leaves the column with no value — it is stored as a special "no data" marker.'
          )}
          ${cdbMakeMCQ('26', 4,
            'Which of the following columns might legitimately contain NULL in a student record?',
            [
              'StudentID (Primary Key)',
              'Name (required for identification)',
              'Email (may not yet be available)',
              'Gender'
            ],
            2,
            'Primary keys and mandatory identification fields cannot be NULL. Email is optional and may not be available when the student is first registered.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbNullEx','cdbNullFb')">Check Answers</button>
        <div id="cdbNullFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.7 — Filtering Non-NULL Values
// ===================================================================
function buildCdbIsNull() {
  const sqlIsNull = `-- Find students with no class assigned
SELECT StudentID, Name
FROM STUDENTS
WHERE ClassID IS NULL;`;

  const sqlIsNotNull = `-- Find students who DO have a class assigned
SELECT StudentID, Name
FROM STUDENTS
WHERE ClassID IS NOT NULL;`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.7 Filtering NULL Values</h2>
        <p class="concept-intro">To test for NULL in SQL, you <strong>cannot</strong> use <code>= NULL</code>. You must use the special syntax <code>IS NULL</code> or <code>IS NOT NULL</code>. This is because NULL is not a value — it is the absence of a value, so equality comparisons do not work.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">IS NULL — Find Rows With Missing Data</div>
        ${cdbSqlBlock(sqlIsNull)}
      </div>

      <div class="concept-example">
        <div class="example-label">IS NOT NULL — Find Rows With Data Present</div>
        ${cdbSqlBlock(sqlIsNotNull)}
      </div>

      <div class="concept-example">
        <div class="example-label">Why Not Use = NULL?</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">WRONG: WHERE ClassID = NULL</div>
            <div class="callout-def">This never returns any rows. NULL cannot be compared with "=" because NULL is not equal to anything — not even itself.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">CORRECT: WHERE ClassID IS NULL</div>
            <div class="callout-def">IS NULL is the special SQL syntax designed to check for the absence of a value.</div>
          </div>
        </div>
        <p class="concept-hint">Remember: in SQL, <code>NULL = NULL</code> evaluates to UNKNOWN, not TRUE. Always use IS NULL / IS NOT NULL.</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: IS NULL and IS NOT NULL</div>
        <p class="exercise-instructions">Answer the questions about filtering NULL values.</p>
        <div id="cdbIsNullEx">
          ${cdbMakeMCQ('27', 1,
            'Which SQL syntax correctly finds all students without an email address?',
            [
              'WHERE Email = NULL',
              'WHERE Email = ""',
              'WHERE Email IS NULL',
              'WHERE Email != 0'
            ],
            2,
            'IS NULL is the correct SQL syntax to check for missing values. = NULL never returns rows.'
          )}
          ${cdbMakeMCQ('27', 2,
            'What does "WHERE Grade IS NOT NULL" return?',
            [
              'All rows where Grade is zero',
              'All rows where Grade has a value (not missing)',
              'All rows where Grade is empty string',
              'Nothing — IS NOT NULL is invalid SQL'
            ],
            1,
            'IS NOT NULL returns all rows where the column has been given a value (even if that value is 0 or empty string).'
          )}
          ${cdbMakeMCQ('27', 3,
            'Why does "WHERE Age = NULL" never return results?',
            [
              'Because Age is always filled in',
              'Because NULL cannot be compared with = ; use IS NULL instead',
              'Because SQL does not support the = operator for integers',
              'Because NULL is stored as -1 internally'
            ],
            1,
            'NULL comparisons with = always return UNKNOWN, not TRUE. You must use IS NULL.'
          )}
          ${cdbMakeMCQ('27', 4,
            'A query uses "WHERE Room IS NOT NULL". A course with Room = \'Lab 1\' will:',
            [
              'Be excluded from results',
              'Appear in results — Lab 1 is not NULL',
              'Cause a syntax error',
              'Return NULL'
            ],
            1,
            'IS NOT NULL returns rows where the column has any non-NULL value. "Lab 1" is a valid value, so the row is included.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbIsNullEx','cdbIsNullFb')">Check Answers</button>
        <div id="cdbIsNullFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.8 — Counting Records per Group
// ===================================================================
function buildCdbGroupBy() {
  const sql = `SELECT c.ClassName, COUNT(s.StudentID) AS StudentCount
FROM STUDENTS s
JOIN CLASSES c ON s.ClassID = c.ClassID
GROUP BY c.ClassName;`;

  const sql2 = `-- Count enrollments per course
SELECT c.CourseName, COUNT(e.EnrollmentID) AS Enrolled
FROM ENROLLMENTS e
JOIN COURSES c ON e.CourseID = c.CourseID
GROUP BY c.CourseName;`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.8 Counting Records per Group</h2>
        <p class="concept-intro"><code>GROUP BY</code> collects rows that share the same value into a group. Combined with <code>COUNT()</code>, it lets us count how many records belong to each group — for example, how many students are in each class.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Count Students per Class</div>
        ${cdbSqlBlock(sql)}
      </div>

      <div class="concept-example">
        <div class="example-label">Sample Result</div>
        ${miniTable('Result',
          ['ClassName', 'StudentCount'],
          [
            ['3A', '12'],
            ['3B', '11'],
            ['3C', '13'],
          ]
        )}
      </div>

      <div class="concept-example">
        <div class="example-label">Count Enrollments per Course</div>
        ${cdbSqlBlock(sql2)}
        <p class="concept-hint"><code>AS StudentCount</code> gives the calculated column a human-readable name in the result. Without it, the column header would be <code>COUNT(s.StudentID)</code>.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">How GROUP BY Works</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Without GROUP BY</div>
            <div class="callout-def">COUNT() counts ALL rows in the table — one total number.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">With GROUP BY ClassName</div>
            <div class="callout-def">COUNT() counts rows within each unique ClassName group — one count per class.</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: GROUP BY and COUNT</div>
        <p class="exercise-instructions">Answer the questions about grouping and counting data.</p>
        <div id="cdbGroupByEx">
          ${cdbMakeMCQ('28', 1,
            'What does COUNT(s.StudentID) do in the query?',
            [
              'Adds up all StudentID numbers',
              'Counts how many non-NULL StudentID values exist in each group',
              'Finds the maximum StudentID',
              'Lists all StudentIDs'
            ],
            1,
            'COUNT(column) counts the number of non-NULL values in that column within each group defined by GROUP BY.'
          )}
          ${cdbMakeMCQ('28', 2,
            'What is the purpose of GROUP BY c.ClassName?',
            [
              'To sort results alphabetically by ClassName',
              'To filter out classes with no students',
              'To group rows together by ClassName so COUNT can work per class',
              'To join CLASSES to STUDENTS'
            ],
            2,
            'GROUP BY creates separate groups for each unique ClassName value, then COUNT() is applied within each group.'
          )}
          ${cdbMakeMCQ('28', 3,
            'What does "AS StudentCount" do in the SELECT clause?',
            [
              'Creates a new table called StudentCount',
              'Gives the COUNT() result a readable column name in the output',
              'Filters results to only StudentCount rows',
              'Sorts by the count descending'
            ],
            1,
            'AS is used to give an alias (a friendly name) to a calculated column in the result set.'
          )}
          ${cdbMakeMCQ('28', 4,
            'A school has 5 classes. How many rows will the "count students per class" query return?',
            ['1', '5', 'Equal to the total number of students', 'It depends on the WHERE clause'],
            1,
            'GROUP BY ClassName produces one row per unique class name. With 5 classes, there are 5 rows in the result.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbGroupByEx','cdbGroupByFb')">Check Answers</button>
        <div id="cdbGroupByFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.9 — Analyzing Enrollment Patterns
// ===================================================================
function buildCdbLeftJoin() {
  const sqlLeft = `-- Show all courses, including those with no enrollments
SELECT c.CourseName, COUNT(e.EnrollmentID) AS EnrollmentCount
FROM COURSES c
LEFT JOIN ENROLLMENTS e ON c.CourseID = e.CourseID
GROUP BY c.CourseName;`;

  const sqlHaving = `-- Only show courses with more than 10 students enrolled
SELECT c.CourseName, COUNT(e.EnrollmentID) AS EnrollmentCount
FROM COURSES c
LEFT JOIN ENROLLMENTS e ON c.CourseID = e.CourseID
GROUP BY c.CourseName
HAVING COUNT(e.EnrollmentID) > 10;`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.9 Analyzing Enrollment Patterns</h2>
        <p class="concept-intro">A <strong>LEFT JOIN</strong> returns all rows from the left (first) table, even if there are no matching rows in the right table. This is useful to see courses that have <em>no</em> enrollments. <strong>HAVING</strong> filters groups after aggregation (like a WHERE clause for GROUP BY results).</p>
      </div>

      <div class="concept-example">
        <div class="example-label">LEFT JOIN — Include All Courses</div>
        ${cdbSqlBlock(sqlLeft)}
      </div>

      <div class="concept-example">
        <div class="example-label">INNER JOIN vs LEFT JOIN</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">INNER JOIN (default JOIN)</div>
            <div class="callout-def">Only returns courses that have at least one enrollment. Courses with zero students are excluded.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">LEFT JOIN</div>
            <div class="callout-def">Returns ALL courses, even those with zero enrollments. Unmatched enrollment columns show NULL.</div>
          </div>
        </div>
      </div>

      <div class="concept-example">
        <div class="example-label">HAVING — Filter After Grouping</div>
        ${cdbSqlBlock(sqlHaving)}
        <p class="concept-hint"><code>HAVING</code> filters groups (after GROUP BY). <code>WHERE</code> filters individual rows (before GROUP BY). Use HAVING when you need to filter on an aggregate like COUNT() or SUM().</p>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: LEFT JOIN and HAVING</div>
        <p class="exercise-instructions">Answer the questions about LEFT JOIN and HAVING.</p>
        <div id="cdbLeftJoinEx">
          ${cdbMakeMCQ('29', 1,
            'A course has zero enrollments. Will it appear in an INNER JOIN query between COURSES and ENROLLMENTS?',
            [
              'Yes — all courses always appear',
              'No — INNER JOIN only returns courses with matching enrollment rows',
              'Yes, with a count of NULL',
              'It depends on the WHERE clause'
            ],
            1,
            'INNER JOIN excludes rows from the left table that have no match in the right table. A course with zero enrollments has no ENROLLMENTS rows to match.'
          )}
          ${cdbMakeMCQ('29', 2,
            'What does LEFT JOIN guarantee?',
            [
              'All rows from both tables appear',
              'All rows from the LEFT (first) table appear, even without a match on the right',
              'Only matched rows appear',
              'The result is sorted by the left table'
            ],
            1,
            'LEFT JOIN keeps all rows from the left table. If no matching row exists in the right table, NULL is placed in the right-table columns.'
          )}
          ${cdbMakeMCQ('29', 3,
            'Which clause should you use to show only courses with MORE than 10 enrolled students?',
            [
              'WHERE COUNT(e.EnrollmentID) > 10',
              'HAVING COUNT(e.EnrollmentID) > 10',
              'FILTER COUNT > 10',
              'GROUP BY COUNT > 10'
            ],
            1,
            'HAVING filters on aggregated values after GROUP BY. WHERE cannot be used with aggregate functions like COUNT().'
          )}
          ${cdbMakeMCQ('29', 4,
            'What is the key difference between WHERE and HAVING?',
            [
              'WHERE works on text; HAVING works on numbers',
              'WHERE filters rows before grouping; HAVING filters groups after aggregation',
              'WHERE is faster; HAVING is more accurate',
              'They are interchangeable'
            ],
            1,
            'WHERE filters individual rows before GROUP BY is applied. HAVING filters the grouped results after aggregation.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbLeftJoinEx','cdbLeftJoinFb')">Check Answers</button>
        <div id="cdbLeftJoinFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.10 — Adding New Records
// ===================================================================
function buildCdbInsert() {
  const sqlClass = `-- 1. Add a new class first (parent table)
INSERT INTO CLASSES (ClassID, ClassName, ClassTeacher)
VALUES ('C4A', '4A', 'Mr. Chan');`;

  const sqlStudent = `-- 2. Then add a student referencing that class (child table)
INSERT INTO STUDENTS (StudentID, Name, Gender, DateOfBirth, ClassID)
VALUES ('S050', 'Ho Siu Wai', 'M', '2008-11-03', 'C4A');`;

  const sqlCourse = `-- Add a new course
INSERT INTO COURSES (CourseID, CourseName, Room)
VALUES ('PHY001', 'Physics', 'Room 204');`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.10 Adding New Records</h2>
        <p class="concept-intro">When inserting new rows, you must respect <strong>Foreign Key constraints</strong>: always insert into the <strong>parent</strong> table first, then the <strong>child</strong> table. Inserting a child row that references a non-existent parent will be rejected.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Parent Before Child: Add a Class, Then a Student</div>
        ${cdbSqlBlock(sqlClass)}
        ${cdbSqlBlock(sqlStudent)}
        <p class="concept-hint">CLASSES is the parent; STUDENTS is the child (it has a FK pointing to CLASSES). Insert the class row first so the FK reference is valid.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Adding a New Course</div>
        ${cdbSqlBlock(sqlCourse)}
      </div>

      <div class="concept-example">
        <div class="example-label">Insert Order Rules</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">Correct Order</div>
            <div class="callout-def">1. Insert parent rows (CLASSES, COURSES) first.<br>2. Insert child rows (STUDENTS, ENROLLMENTS) after.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">Wrong Order</div>
            <div class="callout-def">Inserting a STUDENT with ClassID = \'C4A\' before that class exists in CLASSES violates the FK constraint and the row will be rejected.</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Inserting Records</div>
        <p class="exercise-instructions">Answer the questions about inserting data safely.</p>
        <div id="cdbInsertEx">
          ${cdbMakeMCQ('210', 1,
            'You want to add a new student who belongs to class C5B. What must you do first?',
            [
              'Insert the student row first',
              'Ensure class C5B already exists in the CLASSES table',
              'Delete all students from C5B first',
              'Set ClassID to NULL in the student row'
            ],
            1,
            'The student\'s ClassID FK must reference an existing row in CLASSES. If C5B does not exist yet, the insert will fail.'
          )}
          ${cdbMakeMCQ('210', 2,
            'Which SQL keyword is used to add a new row to a table?',
            ['UPDATE', 'INSERT INTO', 'ALTER TABLE', 'MERGE'],
            1,
            'INSERT INTO is the SQL statement for adding new rows to a table.'
          )}
          ${cdbMakeMCQ('210', 3,
            'What happens if you try to INSERT a student with ClassID = \'C9Z\' and that class does not exist in CLASSES?',
            [
              'The student is inserted with ClassID = NULL',
              'A new class C9Z is automatically created',
              'The insert is rejected — FK constraint violation',
              'The student is inserted without a ClassID'
            ],
            2,
            'FK constraints enforce referential integrity. If the referenced parent row does not exist, the insert is rejected.'
          )}
          ${cdbMakeMCQ('210', 4,
            'In the INSERT statement "INSERT INTO COURSES (CourseID, CourseName, Room) VALUES (\'PHY001\', \'Physics\', \'Room 204\')", what determines which value maps to which column?',
            [
              'Values are matched by data type',
              'Values are matched by their position in the same order as the column list',
              'Values are matched alphabetically',
              'The database assigns values automatically'
            ],
            1,
            'Values are matched positionally to the column list: first value -> first column, second value -> second column, etc.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbInsertEx','cdbInsertFb')">Check Answers</button>
        <div id="cdbInsertFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}

// ===================================================================
// SECTION 2.11 — Creating Enrollment Records
// ===================================================================
function buildCdbEnroll() {
  const sqlInsertEnroll = `-- Step 1: Insert a new enrollment (grade not yet known)
INSERT INTO ENROLLMENTS (EnrollmentID, StudentID, CourseID, Grade)
VALUES ('E100', 'S050', 'PHY001', NULL);`;

  const sqlUpdateGrade = `-- Step 2: Update grade after assessment
UPDATE ENROLLMENTS
SET Grade = 'A'
WHERE EnrollmentID = 'E100';`;

  const sqlVerify = `-- Step 3: Verify the enrollment with a JOIN
SELECT s.Name, c.CourseName, e.Grade
FROM ENROLLMENTS e
JOIN STUDENTS s ON e.StudentID = s.StudentID
JOIN COURSES c  ON e.CourseID  = c.CourseID
WHERE e.EnrollmentID = 'E100';`;

  return `
    <div class="concept-section">
      <div class="concept-header">
        <h2 class="concept-title">2.11 Creating Enrollment Records</h2>
        <p class="concept-intro">Creating an enrollment involves a complete workflow: first <strong>insert</strong> the enrollment record (with grade NULL if not yet known), then <strong>update</strong> the grade after assessment, and finally <strong>verify</strong> the record using a JOIN query.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Step 1 — Insert the Enrollment</div>
        ${cdbSqlBlock(sqlInsertEnroll)}
        <p class="concept-hint">Grade is NULL because the student just enrolled and has not yet been assessed. Both StudentID and CourseID must already exist in their respective parent tables.</p>
      </div>

      <div class="concept-example">
        <div class="example-label">Step 2 — Update the Grade After Assessment</div>
        ${cdbSqlBlock(sqlUpdateGrade)}
      </div>

      <div class="concept-example">
        <div class="example-label">Step 3 — Verify with a JOIN</div>
        ${cdbSqlBlock(sqlVerify)}
      </div>

      <div class="concept-example">
        <div class="example-label">Full Workflow Summary</div>
        <div class="concept-callout-grid">
          <div class="concept-callout">
            <div class="callout-term">INSERT (Grade = NULL)</div>
            <div class="callout-def">Create the enrollment record. Grade is unknown at enrolment time, so set it to NULL.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">UPDATE Grade</div>
            <div class="callout-def">After results are available, use UPDATE SET to assign the actual grade.</div>
          </div>
          <div class="concept-callout">
            <div class="callout-term">SELECT + JOIN</div>
            <div class="callout-def">Join ENROLLMENTS, STUDENTS, and COURSES to verify the record shows the correct student name, course name, and grade.</div>
          </div>
        </div>
      </div>

      <div class="exercise-block">
        <div class="exercise-block-title">Exercise: Enrollment Workflow</div>
        <p class="exercise-instructions">Answer the questions about the enrollment creation workflow.</p>
        <div id="cdbEnrollEx">
          ${cdbMakeMCQ('211', 1,
            'When inserting a new enrollment, why might Grade be set to NULL?',
            [
              'Because the Grade column does not allow real values',
              'Because the student has not yet sat the assessment',
              'Because NULL means grade A in this database',
              'Because INSERT cannot include Grade'
            ],
            1,
            'NULL correctly represents "grade not yet known". The grade can be filled in later with an UPDATE once results are available.'
          )}
          ${cdbMakeMCQ('211', 2,
            'Before inserting an ENROLLMENTS row with StudentID = \'S050\' and CourseID = \'PHY001\', what must be true?',
            [
              'The enrollment ID must be NULL',
              'Both S050 in STUDENTS and PHY001 in COURSES must already exist',
              'COURSES must be dropped first',
              'Grade must not be NULL'
            ],
            1,
            'ENROLLMENTS has FKs to both STUDENTS and COURSES. Both referenced rows must exist before the enrollment row can be inserted.'
          )}
          ${cdbMakeMCQ('211', 3,
            'Which SQL statement is used to assign a grade to an existing enrollment record?',
            ['INSERT INTO ENROLLMENTS', 'UPDATE ENROLLMENTS SET Grade', 'SELECT Grade FROM ENROLLMENTS', 'ALTER TABLE ENROLLMENTS ADD Grade'],
            1,
            'UPDATE ... SET changes the value of an existing row. INSERT would create a new (duplicate) row.'
          )}
          ${cdbMakeMCQ('211', 4,
            'In the verification JOIN query, what does joining all three tables (ENROLLMENTS, STUDENTS, COURSES) allow you to see?',
            [
              'Only the enrollment ID',
              'The student\'s name, course name, and grade in one result row',
              'All grades in the database',
              'Only courses with non-NULL grades'
            ],
            1,
            'Joining all three tables fetches the student name from STUDENTS, the course name from COURSES, and the grade from ENROLLMENTS — all in one readable row.'
          )}
        </div>
        <button class="btn btn-primary btn-check-answer" onclick="cdbCheckMCQ('cdbEnrollEx','cdbEnrollFb')">Check Answers</button>
        <div id="cdbEnrollFb" class="feedback-area"></div>
      </div>
    </div>
  `;
}
