/* ===== Module 4: SQL Syntax & Functions — Interactive Module ===== */

function initSqlSyntaxModule() {
  renderSqlSyntaxNav();
  showSsSection('ss-sel-intro');
}

// ===== HELPERS =====
function ssSql(sql) {
  return '<div class="sql-code-block"><div class="sql-code-header"><span class="sql-code-label">SQL</span></div><pre class="sql-code"><code>' + escapeHTML(sql) + '</code></pre></div>';
}

function ssMCQ(prefix, num, question, options, correctIdx, explanation) {
  var name = 'ss_' + prefix + '_q' + num;
  return '<div class="identify-q" data-correct="' + correctIdx + '" data-explain="' + escapeAttr(explanation || '') + '">' +
    '<div class="identify-q-num">' + num + '</div>' +
    '<div class="identify-q-text">' + question + '</div>' +
    '<div class="identify-q-opts">' +
    options.map(function(opt, i) {
      return '<label class="radio-pill"><input type="radio" name="' + name + '" value="' + i + '"><span>' + opt + '</span></label>';
    }).join('') +
    '</div><div class="identify-q-explain" style="display:none"></div></div>';
}

function ssCheckMCQ(containerId, feedbackId) {
  var correct = 0, total = 0;
  document.querySelectorAll('#' + containerId + ' .identify-q').forEach(function(q) {
    total++;
    var expected = parseInt(q.dataset.correct);
    var selected = q.querySelector('input:checked');
    var explainEl = q.querySelector('.identify-q-explain');
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

// ===== NAVIGATION =====
function renderSqlSyntaxNav() {
  var nav = document.getElementById('sqlSyntaxNav');
  var sections = [
    { id: 'ss-sel-intro',   label: 'SELECT Basics',         icon: 'table' },
    { id: 'ss-sel-all',     label: 'SELECT *',              icon: 'table' },
    { id: 'ss-sel-cols',    label: 'Columns & Aliases',     icon: 'columns' },
    { id: 'ss-order',       label: 'ORDER BY',              icon: 'columns' },
    { id: 'ss-distinct',    label: 'DISTINCT',              icon: 'search' },
    { id: 'ss-limit',       label: 'LIMIT',                 icon: 'search' },
    { id: 'ss-calc',        label: 'Calculated Columns',    icon: 'key2' },
    { id: 'ss-where-intro', label: 'WHERE & Comparison',    icon: 'shield' },
    { id: 'ss-logical',     label: 'AND / OR / NOT',        icon: 'shield' },
    { id: 'ss-between-in',  label: 'BETWEEN & IN',          icon: 'shield' },
    { id: 'ss-like',        label: 'LIKE Patterns',         icon: 'shield' },
    { id: 'ss-null',        label: 'IS NULL',               icon: 'shield' },
    { id: 'ss-arith',       label: 'Arithmetic Operators',  icon: 'key2' },
    { id: 'ss-agg-intro',   label: 'Aggregate Functions',   icon: 'award' },
    { id: 'ss-groupby',     label: 'GROUP BY',              icon: 'award' },
    { id: 'ss-having',      label: 'HAVING',                icon: 'award' },
    { id: 'ss-string',      label: 'String Functions',      icon: 'award' },
    { id: 'ss-join-intro',  label: 'JOIN Introduction',     icon: 'link' },
    { id: 'ss-inner-join',  label: 'INNER JOIN',            icon: 'link' },
    { id: 'ss-join3',       label: 'Three-Table JOIN',      icon: 'link' },
    { id: 'ss-natural',     label: 'NATURAL JOIN',          icon: 'link' },
    { id: 'ss-left-join',   label: 'LEFT JOIN',             icon: 'link2' },
    { id: 'ss-join-agg',    label: 'JOIN + Aggregates',     icon: 'link2' },
    { id: 'ss-sub-intro',   label: 'Subqueries (IN)',       icon: 'search' },
    { id: 'ss-sub-agg',     label: 'Subqueries (AGG)',      icon: 'search' },
    { id: 'ss-ddl-dml',     label: 'DDL vs DML',            icon: 'database' },
    { id: 'ss-insert',      label: 'INSERT',                icon: 'database' },
    { id: 'ss-upd-del',     label: 'UPDATE & DELETE',       icon: 'database' },
    { id: 'ss-views',       label: 'Views',                 icon: 'check' },
    { id: 'ss-multi-tip',   label: 'Multi-Table Tips',      icon: 'check' },
  ];

  nav.innerHTML = sections.map(function(s) {
    return '<button class="concept-nav-item" data-section="' + s.id + '">' +
      getNavIcon(s.icon) +
      '<span>' + s.label + '</span></button>';
  }).join('');

  nav.querySelectorAll('.concept-nav-item').forEach(function(btn) {
    btn.addEventListener('click', function() { showSsSection(btn.dataset.section); });
  });
}

function showSsSection(sectionId) {
  var nav = document.getElementById('sqlSyntaxNav');
  nav.querySelectorAll('.concept-nav-item').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  var content = document.getElementById('sqlSyntaxContent');
  var builders = {
    'ss-sel-intro':   buildSsSelectIntro,
    'ss-sel-all':     buildSsSelectAll,
    'ss-sel-cols':    buildSsSelectCols,
    'ss-order':       buildSsOrderBy,
    'ss-distinct':    buildSsDistinct,
    'ss-limit':       buildSsLimit,
    'ss-calc':        buildSsCalcCols,
    'ss-where-intro': buildSsWhereIntro,
    'ss-logical':     buildSsLogical,
    'ss-between-in':  buildSsBetweenIn,
    'ss-like':        buildSsLike,
    'ss-null':        buildSsNull,
    'ss-arith':       buildSsArith,
    'ss-agg-intro':   buildSsAggIntro,
    'ss-groupby':     buildSsGroupBy,
    'ss-having':      buildSsHaving,
    'ss-string':      buildSsStringFn,
    'ss-join-intro':  buildSsJoinIntro,
    'ss-inner-join':  buildSsInnerJoin,
    'ss-join3':       buildSsJoin3,
    'ss-natural':     buildSsNaturalJoin,
    'ss-left-join':   buildSsLeftJoin,
    'ss-join-agg':    buildSsJoinAgg,
    'ss-sub-intro':   buildSsSubIntro,
    'ss-sub-agg':     buildSsSubAgg,
    'ss-ddl-dml':     buildSsDdlDml,
    'ss-insert':      buildSsInsert,
    'ss-upd-del':     buildSsUpdateDelete,
    'ss-views':       buildSsViews,
    'ss-multi-tip':   buildSsMultiTip,
  };

  content.innerHTML = '';
  if (builders[sectionId]) {
    content.innerHTML = builders[sectionId]();
  }
  content.scrollTop = 0;
}

// ssSql(sql) and ssMCQ(prefix, num, question, options, correctIdx, explanation) defined in merged file

// ===== CATEGORY 1: VIEWING DATA (SELECT) =====

function buildSsSelectIntro() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">SELECT — Retrieving Data</h2>' +
      '<p class="concept-intro">The <strong>SELECT</strong> statement is the foundation of SQL. It lets you retrieve data from one or more tables in a database. Every query begins with SELECT, followed by what you want to see, and FROM, followed by where to find it.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">SELECT</div>' +
        '<div class="callout-def">Specifies which columns to retrieve</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">FROM</div>' +
        '<div class="callout-def">Specifies which table to read from</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">;</div>' +
        '<div class="callout-def">Terminates the SQL statement</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Syntax</div>' +
      ssSql('SELECT column1, column2\nFROM table_name;') +
      '<div class="example-label">Example</div>' +
      ssSql('SELECT Name, Age\nFROM Students;') +
      miniTable('Result', ['Name', 'Age'], [
        ['Chan Tai Man', '16'],
        ['Wong Siu Ming', '17'],
        ['Lee Ka Wai', '15'],
        ['Ng Mei Ling', '18']
      ]) +
    '</div>' +
    '<div class="concept-hint">SQL keywords like SELECT and FROM are not case-sensitive, but writing them in uppercase is a widely used convention that makes queries easier to read.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of the SELECT statement.</p>' +
      '<div id="ssSel1Ex">' +
        ssMCQ('sel1', 1, 'Which keyword specifies which table to retrieve data from?', ['SELECT', 'FROM', 'WHERE', 'TABLE'], 1, 'FROM specifies the table name. SELECT specifies which columns.') +
        ssMCQ('sel1', 2, 'What is the correct order of keywords in a basic SELECT query?', ['FROM ... SELECT ...', 'SELECT ... WHERE ...', 'SELECT ... FROM ...', 'TABLE ... SELECT ...'], 2, 'The correct order is SELECT (columns) then FROM (table).') +
        ssMCQ('sel1', 3, 'Which of the following is a valid SQL statement?', ['FROM Students SELECT Name;', 'SELECT Name FROM Students;', 'SELECT FROM Name Students;', 'GET Name FROM Students;'], 1, 'SELECT column FROM table is the correct syntax. The semicolon ends the statement.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSel1Ex\',\'ssSel1Fb\')">Check Answers</button>' +
      '<div id="ssSel1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsSelectAll() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">SELECT * (All Columns)</h2>' +
      '<p class="concept-intro">Use <strong>SELECT *</strong> to retrieve every column from a table. The asterisk (<strong>*</strong>) is a wildcard that means "all columns." This is useful for exploring a table quickly, though in production queries it is better to name the specific columns you need.</p>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example</div>' +
      ssSql('SELECT *\nFROM Students;') +
      miniTable('Result', ['StudentID', 'Name', 'Age', 'Gender', 'ClassID', 'Email'], [
        ['1', 'Chan Tai Man', '16', 'M', '101', 'ctm@school.hk'],
        ['2', 'Wong Siu Ming', '17', 'M', '102', 'wsm@school.hk'],
        ['3', 'Lee Ka Wai', '15', 'F', '101', 'lkw@school.hk'],
        ['4', 'Ng Mei Ling', '18', 'F', '103', 'nml@school.hk']
      ]) +
    '</div>' +
    '<div class="concept-hint">SELECT * retrieves all columns in the order they are defined in the table. The result shows every attribute of every row.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of SELECT *.</p>' +
      '<div id="ssSel2Ex">' +
        ssMCQ('sel2', 1, 'What does the * symbol mean in SELECT *?', ['Multiply all values', 'All columns', 'All tables', 'All databases'], 1, 'The * wildcard in SELECT means all columns of the table.') +
        ssMCQ('sel2', 2, 'Which query retrieves every column from the Subjects table?', ['SELECT Subjects;', 'SELECT ALL FROM Subjects;', 'SELECT * FROM Subjects;', 'SELECT Subjects.*;'], 2, 'SELECT * FROM table_name returns every column.') +
        ssMCQ('sel2', 3, 'How many columns will "SELECT * FROM Students;" return based on the Students schema?', ['3', '4', '5', '6'], 3, 'Students has 6 columns: StudentID, Name, Age, Gender, ClassID, Email.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSel2Ex\',\'ssSel2Fb\')">Check Answers</button>' +
      '<div id="ssSel2Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsSelectCols() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">Selecting Specific Columns &amp; Aliases (AS)</h2>' +
      '<p class="concept-intro">You can retrieve only the columns you need by listing them after SELECT, separated by commas. You can also rename a column in the output using the <strong>AS</strong> keyword — this is called a <strong>column alias</strong>. Aliases make results easier to read and do not change the actual column name in the table.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">Specific columns</div>' +
        '<div class="callout-def">List column names separated by commas</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">AS alias</div>' +
        '<div class="callout-def">Renames the column in the result only</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Specific Columns</div>' +
      ssSql('SELECT Name, Age\nFROM Students;') +
      miniTable('Result', ['Name', 'Age'], [
        ['Chan Tai Man', '16'],
        ['Wong Siu Ming', '17'],
        ['Lee Ka Wai', '15']
      ]) +
      '<div class="example-label">Example — Column Alias</div>' +
      ssSql('SELECT Name, Age AS StudentAge\nFROM Students;') +
      miniTable('Result', ['Name', 'StudentAge'], [
        ['Chan Tai Man', '16'],
        ['Wong Siu Ming', '17'],
        ['Lee Ka Wai', '15']
      ]) +
    '</div>' +
    '<div class="concept-hint">If your alias contains spaces, wrap it in square brackets or quotes: <em>Age AS [Student Age]</em>.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of column selection and aliases.</p>' +
      '<div id="ssSel3Ex">' +
        ssMCQ('sel3', 1, 'Which query retrieves only StudentID and Name from Students?', ['SELECT * FROM Students;', 'SELECT StudentID, Name FROM Students;', 'SELECT Students (StudentID, Name);', 'GET StudentID, Name FROM Students;'], 1, 'List the desired columns after SELECT, separated by commas.') +
        ssMCQ('sel3', 2, 'What does the AS keyword do in a SELECT query?', ['Filters rows', 'Renames a column in the result', 'Joins two tables', 'Sorts the output'], 1, 'AS assigns an alias (display name) to a column in the result set.') +
        ssMCQ('sel3', 3, 'What will the column heading be for "SELECT Age AS StudentAge FROM Students;"?', ['Age', 'AS', 'StudentAge', 'Students'], 2, 'AS StudentAge renames the Age column heading to StudentAge in the output.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSel3Ex\',\'ssSel3Fb\')">Check Answers</button>' +
      '<div id="ssSel3Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsOrderBy() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">ORDER BY — Sorting Results</h2>' +
      '<p class="concept-intro"><strong>ORDER BY</strong> sorts the result rows by one or more columns. By default the sort is <strong>ASC</strong> (ascending: smallest to largest, A to Z). Use <strong>DESC</strong> for descending order. You can sort by multiple columns — the second column is used as a tiebreaker when the first column has equal values.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">ASC</div>' +
        '<div class="callout-def">Ascending order (default) — 1, 2, 3 or A, B, C</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">DESC</div>' +
        '<div class="callout-def">Descending order — 9, 8, 7 or Z, Y, X</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Sort by Age ascending</div>' +
      ssSql('SELECT Name, Age\nFROM Students\nORDER BY Age;') +
      miniTable('Result', ['Name', 'Age'], [
        ['Lee Ka Wai', '15'],
        ['Chan Tai Man', '16'],
        ['Wong Siu Ming', '17'],
        ['Ng Mei Ling', '18']
      ]) +
      '<div class="example-label">Example — Sort by Age descending</div>' +
      ssSql('SELECT Name, Age\nFROM Students\nORDER BY Age DESC;') +
      miniTable('Result', ['Name', 'Age'], [
        ['Ng Mei Ling', '18'],
        ['Wong Siu Ming', '17'],
        ['Chan Tai Man', '16'],
        ['Lee Ka Wai', '15']
      ]) +
      '<div class="example-label">Example — Multiple sort columns</div>' +
      ssSql('SELECT Name, Age, ClassID\nFROM Students\nORDER BY ClassID ASC, Age DESC;') +
      miniTable('Result', ['Name', 'Age', 'ClassID'], [
        ['Chan Tai Man', '16', '101'],
        ['Lee Ka Wai', '15', '101'],
        ['Wong Siu Ming', '17', '102'],
        ['Ng Mei Ling', '18', '103']
      ]) +
    '</div>' +
    '<div class="concept-hint">Text columns sort alphabetically (A–Z for ASC, Z–A for DESC). When sorting text, uppercase and lowercase letters may be treated the same depending on the database.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of ORDER BY.</p>' +
      '<div id="ssSel4Ex">' +
        ssMCQ('sel4', 1, 'What is the default sort direction when no keyword is specified in ORDER BY?', ['DESC', 'ASC', 'RANDOM', 'NONE'], 1, 'ORDER BY sorts ascending (ASC) by default if you do not specify a direction.') +
        ssMCQ('sel4', 2, 'Which query sorts students from highest to lowest Score?', ['SELECT * FROM Enrolments ORDER BY Score;', 'SELECT * FROM Enrolments ORDER BY Score DESC;', 'SELECT * FROM Enrolments SORT BY Score DESC;', 'SELECT * FROM Enrolments ORDER Score DESC;'], 1, 'Use ORDER BY column DESC to sort from highest to lowest.') +
        ssMCQ('sel4', 3, 'In "ORDER BY ClassID ASC, Age DESC", when is Age DESC applied?', ['Always, regardless of ClassID', 'Only when ClassID values are equal', 'Before ClassID sorting', 'Only for the first row'], 1, 'The second sort column is used as a tiebreaker when the first column has equal values.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSel4Ex\',\'ssSel4Fb\')">Check Answers</button>' +
      '<div id="ssSel4Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsDistinct() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">DISTINCT — Removing Duplicates</h2>' +
      '<p class="concept-intro"><strong>SELECT DISTINCT</strong> returns only unique values — duplicate rows are removed from the result. This is useful when you want to see what different values exist in a column, for example all unique class IDs or all different grades awarded.</p>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Without DISTINCT (duplicates shown)</div>' +
      ssSql('SELECT ClassID\nFROM Students;') +
      miniTable('Result', ['ClassID'], [
        ['101'], ['101'], ['102'], ['103'], ['101'], ['104'], ['102'], ['103'], ['105'], ['104']
      ]) +
      '<div class="example-label">With DISTINCT (duplicates removed)</div>' +
      ssSql('SELECT DISTINCT ClassID\nFROM Students;') +
      miniTable('Result', ['ClassID'], [
        ['101'], ['102'], ['103'], ['104'], ['105']
      ]) +
      '<div class="example-label">DISTINCT on text column</div>' +
      ssSql('SELECT DISTINCT Grade\nFROM Enrolments;') +
      miniTable('Result', ['Grade'], [
        ['A'], ['B'], ['C'], ['D'], ['E']
      ]) +
    '</div>' +
    '<div class="concept-hint">DISTINCT applies to the combination of all selected columns. If you select two columns, a row is only removed if both column values are identical to another row.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of DISTINCT.</p>' +
      '<div id="ssSel5Ex">' +
        ssMCQ('sel5', 1, 'What does SELECT DISTINCT do?', ['Sorts rows alphabetically', 'Removes duplicate rows from the result', 'Returns only the first row', 'Counts unique values'], 1, 'DISTINCT removes duplicate rows so each unique value appears only once.') +
        ssMCQ('sel5', 2, 'Where is DISTINCT placed in a SELECT statement?', ['After FROM', 'After SELECT', 'Before the table name', 'At the end of the query'], 1, 'DISTINCT is placed immediately after SELECT, before the column names.') +
        ssMCQ('sel5', 3, 'The Enrolments table has 30 rows but only 5 different grades (A–E). How many rows will "SELECT DISTINCT Grade FROM Enrolments;" return?', ['30', '1', '5', '10'], 2, 'DISTINCT returns one row per unique value. There are 5 distinct grades.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSel5Ex\',\'ssSel5Fb\')">Check Answers</button>' +
      '<div id="ssSel5Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsLimit() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">LIMIT — Restricting Row Count</h2>' +
      '<p class="concept-intro"><strong>LIMIT</strong> restricts how many rows are returned in the result. This is useful for previewing data, showing top-N results, or improving query performance on large tables. LIMIT is always applied after sorting, so combined with ORDER BY you can find the top or bottom records.</p>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Return first 3 rows</div>' +
      ssSql('SELECT Name, Age\nFROM Students\nLIMIT 3;') +
      miniTable('Result', ['Name', 'Age'], [
        ['Chan Tai Man', '16'],
        ['Wong Siu Ming', '17'],
        ['Lee Ka Wai', '15']
      ]) +
      '<div class="example-label">Example — Top 3 students by Score</div>' +
      ssSql('SELECT StudentID, Score\nFROM Enrolments\nORDER BY Score DESC\nLIMIT 3;') +
      miniTable('Result', ['StudentID', 'Score'], [
        ['5', '95'],
        ['8', '92'],
        ['2', '88']
      ]) +
    '</div>' +
    '<div class="concept-hint">In Microsoft SQL Server the equivalent keyword is TOP (e.g., SELECT TOP 3 ...). In MySQL and SQLite the keyword is LIMIT, placed at the end of the query.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of LIMIT.</p>' +
      '<div id="ssSel6Ex">' +
        ssMCQ('sel6', 1, 'Where is the LIMIT clause placed in a SELECT query?', ['Before SELECT', 'After SELECT but before FROM', 'After FROM and any ORDER BY', 'Between SELECT and FROM'], 2, 'LIMIT appears at the end of the query, after FROM (and after ORDER BY if present).') +
        ssMCQ('sel6', 2, 'Which query returns the 5 students with the lowest Age?', ['SELECT * FROM Students LIMIT 5;', 'SELECT * FROM Students ORDER BY Age LIMIT 5;', 'SELECT * FROM Students ORDER BY Age DESC LIMIT 5;', 'SELECT TOP 5 * FROM Students ORDER BY Age;'], 1, 'ORDER BY Age (ascending, the default) followed by LIMIT 5 gives the 5 youngest students.') +
        ssMCQ('sel6', 3, 'The Students table has 10 rows. What does "SELECT * FROM Students LIMIT 15;" return?', ['Only 10 rows (all rows)', 'An error because 15 exceeds the row count', '15 empty rows', 'Nothing'], 0, 'LIMIT 15 on a 10-row table returns all 10 rows — it is a maximum, not an exact count.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSel6Ex\',\'ssSel6Fb\')">Check Answers</button>' +
      '<div id="ssSel6Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsCalcCols() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">Calculated Columns</h2>' +
      '<p class="concept-intro">You can perform arithmetic inside a SELECT statement to create <strong>calculated columns</strong>. The calculation is done on each row and the result appears as a new column in the output. The underlying table data is not changed. Use AS to give the calculated column a meaningful name.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">+  -  *  /</div>' +
        '<div class="callout-def">Arithmetic operators usable in SELECT</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">AS alias</div>' +
        '<div class="callout-def">Names the new calculated column</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Boost scores by 10%</div>' +
      ssSql('SELECT StudentID, Score, Score * 1.1 AS AdjustedScore\nFROM Enrolments;') +
      miniTable('Result', ['StudentID', 'Score', 'AdjustedScore'], [
        ['1', '72', '79.2'],
        ['2', '88', '96.8'],
        ['3', '65', '71.5'],
        ['4', '55', '60.5']
      ]) +
      '<div class="example-label">Example — Convert score to percentage bonus points</div>' +
      ssSql('SELECT StudentID, Score, Score - 50 AS BonusPoints\nFROM Enrolments;') +
      miniTable('Result', ['StudentID', 'Score', 'BonusPoints'], [
        ['1', '72', '22'],
        ['2', '88', '38'],
        ['3', '65', '15'],
        ['4', '55', '5']
      ]) +
    '</div>' +
    '<div class="concept-hint">Calculated columns are virtual — they exist only in the query result. They are not stored in the database and do not modify any existing data.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of calculated columns.</p>' +
      '<div id="ssSel7Ex">' +
        ssMCQ('sel7', 1, 'What does "SELECT Score * 1.1 AS AdjustedScore FROM Enrolments;" do?', ['Permanently increases all scores by 10% in the table', 'Returns a new column showing each score multiplied by 1.1', 'Divides every score by 1.1', 'Rounds every score to 1 decimal place'], 1, 'The calculation creates a virtual column in the result. The original Score values are unchanged.') +
        ssMCQ('sel7', 2, 'A student has a Score of 80. What value appears in "Score * 1.1 AS AdjustedScore"?', ['80', '81', '88', '8.8'], 2, '80 * 1.1 = 88.') +
        ssMCQ('sel7', 3, 'What is the purpose of the AS keyword in a calculated column?', ['It performs the arithmetic operation', 'It filters rows based on the calculation', 'It gives a name to the calculated column in the output', 'It stores the result permanently'], 2, 'AS assigns a readable alias to the calculated column in the result set.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSel7Ex\',\'ssSel7Fb\')">Check Answers</button>' +
      '<div id="ssSel7Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// ===== CATEGORY 2: FILTERING DATA (WHERE) =====

function buildSsWhereIntro() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">WHERE — Filtering Rows</h2>' +
      '<p class="concept-intro">The <strong>WHERE</strong> clause filters the rows returned by a query. Only rows where the condition is TRUE are included in the result. You use <strong>comparison operators</strong> to build conditions that test column values.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">=</div>' +
        '<div class="callout-def">Equal to</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">&lt;&gt;</div>' +
        '<div class="callout-def">Not equal to</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">&lt;  &gt;</div>' +
        '<div class="callout-def">Less than / Greater than</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">&lt;=  &gt;=</div>' +
        '<div class="callout-def">Less than or equal / Greater than or equal</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Equal to</div>' +
      ssSql('SELECT Name, Age\nFROM Students\nWHERE Age = 16;') +
      miniTable('Result', ['Name', 'Age'], [
        ['Chan Tai Man', '16'],
        ['Lam Kin Fung', '16']
      ]) +
      '<div class="example-label">Example — Greater than or equal</div>' +
      ssSql('SELECT StudentID, Score\nFROM Enrolments\nWHERE Score >= 80;') +
      miniTable('Result', ['StudentID', 'Score'], [
        ['2', '88'],
        ['5', '95'],
        ['8', '82'],
        ['9', '80']
      ]) +
      '<div class="example-label">Example — Not equal</div>' +
      ssSql("SELECT Name, Gender\nFROM Students\nWHERE Gender <> 'M';") +
      miniTable('Result', ['Name', 'Gender'], [
        ['Lee Ka Wai', 'F'],
        ['Ng Mei Ling', 'F'],
        ['Chan Siu Fan', 'F']
      ]) +
    '</div>' +
    '<div class="concept-hint">When comparing text (strings), enclose the value in single quotes: WHERE Gender = \'F\'. Numbers do not need quotes: WHERE Age = 16.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of WHERE and comparison operators.</p>' +
      '<div id="ssWh1Ex">' +
        ssMCQ('wh1', 1, 'Which query retrieves only students in ClassID 102?', ["SELECT * FROM Students WHERE ClassID = '102';", 'SELECT * FROM Students WHERE ClassID = 102;', 'SELECT * FROM Students HAVING ClassID = 102;', 'SELECT * FROM Students FILTER ClassID = 102;'], 1, 'ClassID is a numeric column so no quotes are needed. WHERE is the correct filtering clause.') +
        ssMCQ('wh1', 2, 'Which operator means "not equal to" in SQL?', ['!=', '<>', '=/=', 'NOT ='], 1, 'The standard SQL not-equal operator is <>. Some databases also accept != but <> is universal.') +
        ssMCQ('wh1', 3, 'What does "WHERE Score < 50" do?', ['Returns rows where Score is 50 or more', 'Returns rows where Score is less than 50', 'Returns rows where Score equals 50', 'Returns rows where Score is not 50'], 1, 'The < operator means strictly less than, so Score < 50 matches values 49, 48, 47 etc.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssWh1Ex\',\'ssWh1Fb\')">Check Answers</button>' +
      '<div id="ssWh1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsLogical() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">AND, OR, NOT — Logical Operators</h2>' +
      '<p class="concept-intro">Logical operators let you combine multiple conditions in a WHERE clause. <strong>AND</strong> requires all conditions to be true. <strong>OR</strong> requires at least one condition to be true. <strong>NOT</strong> reverses a condition. Use parentheses to control the order of evaluation.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">AND</div>' +
        '<div class="callout-def">Both conditions must be TRUE</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">OR</div>' +
        '<div class="callout-def">At least one condition must be TRUE</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">NOT</div>' +
        '<div class="callout-def">Reverses a condition (TRUE becomes FALSE)</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — AND</div>' +
      ssSql("SELECT Name, Age, Gender\nFROM Students\nWHERE Age >= 16 AND Gender = 'F';") +
      miniTable('Result', ['Name', 'Age', 'Gender'], [
        ['Ng Mei Ling', '18', 'F'],
        ['Chan Siu Fan', '16', 'F']
      ]) +
      '<div class="example-label">Example — OR</div>' +
      ssSql('SELECT StudentID, Score\nFROM Enrolments\nWHERE Score < 50 OR Score >= 90;') +
      miniTable('Result', ['StudentID', 'Score'], [
        ['3', '45'],
        ['5', '95'],
        ['7', '48'],
        ['10', '92']
      ]) +
      '<div class="example-label">Example — NOT</div>' +
      ssSql("SELECT Name, ClassID\nFROM Students\nWHERE NOT ClassID = 101;") +
      miniTable('Result', ['Name', 'ClassID'], [
        ['Wong Siu Ming', '102'],
        ['Ng Mei Ling', '103'],
        ['Yip Ho Yin', '104']
      ]) +
    '</div>' +
    '<div class="concept-hint">AND has higher precedence than OR, similar to multiplication before addition in arithmetic. Use parentheses to be explicit: WHERE (Age = 15 OR Age = 16) AND Gender = \'F\'.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of logical operators.</p>' +
      '<div id="ssWh2Ex">' +
        ssMCQ('wh2', 1, 'Which query returns female students aged 17?', ["SELECT * FROM Students WHERE Age = 17 AND Gender = 'F';", "SELECT * FROM Students WHERE Age = 17 OR Gender = 'F';", "SELECT * FROM Students WHERE Age = 17 NOT Gender = 'F';", "SELECT * FROM Students WHERE Age = 17, Gender = 'F';"], 0, 'AND requires both conditions to be true: Age must be 17 AND Gender must be F.') +
        ssMCQ('wh2', 2, 'How many rows match "WHERE Score = 95 OR Score = 45" if one row has Score 95 and one has Score 45?', ['0', '1', '2', 'Depends on AND'], 2, 'OR matches rows where either condition is true, so both rows match — 2 rows total.') +
        ssMCQ('wh2', 3, 'What is the effect of NOT in "WHERE NOT ClassID = 101"?', ['Returns only rows where ClassID is 101', 'Returns rows where ClassID is not 101', 'Returns all rows including ClassID 101', 'Causes a syntax error'], 1, 'NOT reverses the condition, so NOT ClassID = 101 matches every row where ClassID is anything except 101.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssWh2Ex\',\'ssWh2Fb\')">Check Answers</button>' +
      '<div id="ssWh2Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsBetweenIn() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">BETWEEN and IN — Range &amp; List Matching</h2>' +
      '<p class="concept-intro"><strong>BETWEEN</strong> tests whether a value falls within a range (inclusive of both endpoints). <strong>IN</strong> tests whether a value matches any item in a list. Both make queries shorter and more readable compared to writing multiple AND/OR conditions.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">BETWEEN a AND b</div>' +
        '<div class="callout-def">Value is >= a and <= b (inclusive)</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">IN (v1, v2, ...)</div>' +
        '<div class="callout-def">Value equals any item in the list</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">NOT BETWEEN</div>' +
        '<div class="callout-def">Value is outside the range</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">NOT IN</div>' +
        '<div class="callout-def">Value does not match any list item</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — BETWEEN</div>' +
      ssSql('SELECT StudentID, Score\nFROM Enrolments\nWHERE Score BETWEEN 70 AND 85;') +
      miniTable('Result', ['StudentID', 'Score'], [
        ['1', '72'],
        ['4', '78'],
        ['6', '85'],
        ['9', '80']
      ]) +
      '<div class="example-label">Example — IN</div>' +
      ssSql('SELECT Name, ClassID\nFROM Students\nWHERE ClassID IN (101, 103, 105);') +
      miniTable('Result', ['Name', 'ClassID'], [
        ['Chan Tai Man', '101'],
        ['Lee Ka Wai', '101'],
        ['Ng Mei Ling', '103'],
        ['Cheung Ka Ho', '105']
      ]) +
      '<div class="example-label">Example — NOT IN</div>' +
      ssSql("SELECT SubjectName\nFROM Subjects\nWHERE SubjectName NOT IN ('Physics', 'Chinese');") +
      miniTable('Result', ['SubjectName'], [
        ['ICT'],
        ['Mathematics'],
        ['English']
      ]) +
    '</div>' +
    '<div class="concept-hint">BETWEEN is inclusive — "BETWEEN 70 AND 85" includes rows where Score = 70 and rows where Score = 85. It is equivalent to "Score >= 70 AND Score <= 85".</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of BETWEEN and IN.</p>' +
      '<div id="ssWh3Ex">' +
        ssMCQ('wh3', 1, 'Which query returns students aged 15, 16, or 17 using IN?', ['SELECT * FROM Students WHERE Age BETWEEN 15 IN 17;', 'SELECT * FROM Students WHERE Age IN (15, 16, 17);', 'SELECT * FROM Students WHERE Age IN 15, 16, 17;', 'SELECT * FROM Students WHERE Age = IN (15, 16, 17);'], 1, 'IN requires the list in parentheses: WHERE Age IN (15, 16, 17).') +
        ssMCQ('wh3', 2, 'Is a score of 70 included in "WHERE Score BETWEEN 70 AND 85"?', ['No, BETWEEN excludes the lower boundary', 'Yes, BETWEEN is inclusive of both endpoints', 'Only if there is also a >= condition', 'It depends on the database'], 1, 'BETWEEN is inclusive — both 70 and 85 are included in the range.') +
        ssMCQ('wh3', 3, 'What is "WHERE ClassID NOT IN (101, 102)" equivalent to?', ['WHERE ClassID = 101 AND ClassID = 102', 'WHERE ClassID <> 101 AND ClassID <> 102', 'WHERE ClassID <> 101 OR ClassID <> 102', 'WHERE ClassID BETWEEN 103 AND 105'], 1, 'NOT IN matches rows where the value is not equal to ANY item in the list, which is the same as <> 101 AND <> 102.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssWh3Ex\',\'ssWh3Fb\')">Check Answers</button>' +
      '<div id="ssWh3Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsLike() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">LIKE — Pattern Matching</h2>' +
      '<p class="concept-intro"><strong>LIKE</strong> is used in a WHERE clause to search for a specified pattern in a text column. It uses two wildcard characters: <strong>%</strong> (matches any number of characters, including zero) and <strong>_</strong> (matches exactly one character).</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">%</div>' +
        '<div class="callout-def">Any sequence of zero or more characters</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">_</div>' +
        '<div class="callout-def">Exactly one character (any character)</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Starts with "Chan"</div>' +
      ssSql("SELECT Name\nFROM Students\nWHERE Name LIKE 'Chan%';") +
      miniTable('Result', ['Name'], [
        ['Chan Tai Man'],
        ['Chan Siu Fan']
      ]) +
      '<div class="example-label">Example — Ends with "ing"</div>' +
      ssSql("SELECT Name\nFROM Students\nWHERE Name LIKE '%ing';") +
      miniTable('Result', ['Name'], [
        ['Wong Siu Ming'],
        ['Ng Mei Ling']
      ]) +
      '<div class="example-label">Example — Contains "Ka"</div>' +
      ssSql("SELECT Name\nFROM Students\nWHERE Name LIKE '%Ka%';") +
      miniTable('Result', ['Name'], [
        ['Lee Ka Wai'],
        ['Chan Ka Yin']
      ]) +
      '<div class="example-label">Example — Exactly 3-letter first segment (using _)</div>' +
      ssSql("SELECT Name\nFROM Students\nWHERE Name LIKE '___ %';") +
      miniTable('Result', ['Name'], [
        ['Lee Ka Wai'],
        ['Yip Ho Yin']
      ]) +
    '</div>' +
    '<div class="concept-hint">NOT LIKE can be used to exclude rows that match the pattern. For example, "WHERE Email NOT LIKE \'%@school.hk\'" would find students without a school email.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of LIKE pattern matching.</p>' +
      '<div id="ssWh4Ex">' +
        ssMCQ('wh4', 1, 'Which pattern matches names that start with "W"?', ["LIKE '_W%'", "LIKE 'W%'", "LIKE '%W'", "LIKE '%W%'"], 1, "LIKE 'W%' means the value starts with W followed by any characters.") +
        ssMCQ('wh4', 2, 'What does the underscore _ wildcard represent in LIKE?', ['Zero or more characters', 'One or more characters', 'Exactly one character', 'Any digit'], 2, 'The _ wildcard matches exactly one character (any character).') +
        ssMCQ('wh4', 3, "Which pattern finds email addresses ending in '@school.hk'?", ["LIKE '@school.hk'", "LIKE '%@school.hk'", "LIKE '@school.hk%'", "LIKE '_@school.hk'"], 1, "% at the start means any characters before @school.hk. This matches any email ending in @school.hk.") +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssWh4Ex\',\'ssWh4Fb\')">Check Answers</button>' +
      '<div id="ssWh4Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsNull() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">IS NULL and IS NOT NULL</h2>' +
      '<p class="concept-intro"><strong>NULL</strong> represents a missing or unknown value in SQL — it is not the same as zero or an empty string. Because NULL is unknown, you cannot use = or <> to test for it. Instead, SQL provides <strong>IS NULL</strong> and <strong>IS NOT NULL</strong> to detect missing values.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">IS NULL</div>' +
        '<div class="callout-def">Matches rows where the column has no value</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">IS NOT NULL</div>' +
        '<div class="callout-def">Matches rows where the column has a value</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Find students with no email recorded</div>' +
      ssSql('SELECT Name, Email\nFROM Students\nWHERE Email IS NULL;') +
      miniTable('Result', ['Name', 'Email'], [
        ['Yip Ho Yin', 'NULL'],
        ['So Wai Kit', 'NULL']
      ]) +
      '<div class="example-label">Example — Find enrolments with a score recorded</div>' +
      ssSql('SELECT EnrolmentID, StudentID, Score\nFROM Enrolments\nWHERE Score IS NOT NULL;') +
      miniTable('Result', ['EnrolmentID', 'StudentID', 'Score'], [
        ['1', '1', '72'],
        ['2', '2', '88'],
        ['3', '3', '65']
      ]) +
    '</div>' +
    '<div class="concept-hint">Using "WHERE Email = NULL" will never match any rows — even rows that are NULL — because NULL = NULL evaluates to unknown, not TRUE. Always use IS NULL.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of NULL handling.</p>' +
      '<div id="ssWh5Ex">' +
        ssMCQ('wh5', 1, 'What does NULL represent in SQL?', ['The number zero', 'An empty string', 'A missing or unknown value', 'The boolean FALSE'], 2, 'NULL represents the absence of a value — it is unknown, not zero or empty.') +
        ssMCQ('wh5', 2, 'Why can\'t you use "WHERE Score = NULL" to find missing scores?', ['NULL is a reserved word that cannot be used with =', 'Because NULL compared to anything returns unknown, not TRUE', 'Because = only works with numbers', 'Because NULL is stored as 0'], 1, 'Any comparison with NULL (=, <>, <, >) returns unknown/NULL, never TRUE. Use IS NULL instead.') +
        ssMCQ('wh5', 3, 'Which query finds students who DO have an email address?', ['SELECT * FROM Students WHERE Email = NOT NULL;', 'SELECT * FROM Students WHERE Email IS NOT NULL;', 'SELECT * FROM Students WHERE Email != NULL;', 'SELECT * FROM Students WHERE Email <> NULL;'], 1, 'IS NOT NULL is the correct syntax for finding rows where a column has a value.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssWh5Ex\',\'ssWh5Fb\')">Check Answers</button>' +
      '<div id="ssWh5Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// ===== CATEGORY 3: OPERATORS AND EXPRESSIONS =====

function buildSsArith() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">Arithmetic Operators</h2>' +
      '<p class="concept-intro">SQL supports standard arithmetic operators that can be used in SELECT (to compute values) and in WHERE (to filter based on computed values). The four main operators are <strong>+</strong> (add), <strong>-</strong> (subtract), <strong>*</strong> (multiply), and <strong>/</strong> (divide). You can combine them and use parentheses to control precedence, just like in mathematics.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">+</div>' +
        '<div class="callout-def">Addition</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">-</div>' +
        '<div class="callout-def">Subtraction</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">*</div>' +
        '<div class="callout-def">Multiplication</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">/</div>' +
        '<div class="callout-def">Division</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — All four operators</div>' +
      ssSql('SELECT StudentID, Score,\n       Score + 5 AS PlusFive,\n       Score - 10 AS MinusTen,\n       Score * 2 AS Doubled,\n       Score / 10 AS Tenths\nFROM Enrolments;') +
      miniTable('Result', ['StudentID', 'Score', 'PlusFive', 'MinusTen', 'Doubled', 'Tenths'], [
        ['1', '72', '77', '62', '144', '7.2'],
        ['2', '88', '93', '78', '176', '8.8'],
        ['3', '65', '70', '55', '130', '6.5']
      ]) +
      '<div class="example-label">Example — Arithmetic in WHERE clause</div>' +
      ssSql('SELECT StudentID, Score\nFROM Enrolments\nWHERE Score * 1.1 >= 90;') +
      miniTable('Result', ['StudentID', 'Score'], [
        ['5', '95'],
        ['2', '88'],
        ['8', '82']
      ]) +
      '<div class="example-label">Example — Combining operators with parentheses</div>' +
      ssSql('SELECT StudentID,\n       (Score + 5) * 2 AS BonusCalc\nFROM Enrolments;') +
      miniTable('Result', ['StudentID', 'BonusCalc'], [
        ['1', '154'],
        ['2', '186'],
        ['3', '140']
      ]) +
    '</div>' +
    '<div class="concept-hint">Division of integers may truncate the decimal in some databases. For example, 7 / 2 might return 3 rather than 3.5. Cast to a decimal if needed: CAST(Score AS REAL) / 10.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of arithmetic operators.</p>' +
      '<div id="ssOp1Ex">' +
        ssMCQ('op1', 1, 'A student has Score = 60. What is the result of "Score * 2 - 10"?', ['50', '110', '70', '130'], 1, '60 * 2 = 120, then 120 - 10 = 110.') +
        ssMCQ('op1', 2, 'Which query finds students whose doubled score exceeds 150?', ['SELECT * FROM Enrolments WHERE Score > 150 * 2;', 'SELECT * FROM Enrolments WHERE Score * 2 > 150;', 'SELECT * FROM Enrolments WHERE Score > 75 * 2;', 'SELECT * FROM Enrolments WHERE 2 * Score > 150;'], 1, 'Both B and D are logically equivalent; B is the conventional way to write it.') +
        ssMCQ('op1', 3, 'What is the result of "(Score + 5) * 2" when Score = 70?', ['145', '150', '75', '140'], 1, '(70 + 5) = 75, then 75 * 2 = 150. Parentheses are evaluated first.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssOp1Ex\',\'ssOp1Fb\')">Check Answers</button>' +
      '<div id="ssOp1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// ===== CATEGORY 4: BUILT-IN FUNCTIONS =====

function buildSsAggIntro() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">Aggregate Functions — COUNT, SUM, AVG, MIN, MAX</h2>' +
      '<p class="concept-intro"><strong>Aggregate functions</strong> perform a calculation on a set of rows and return a single value. They summarise data — for example, counting how many students are enrolled, or finding the average score. These functions are typically used with GROUP BY, but they can also be used alone to summarise an entire table.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">COUNT()</div>' +
        '<div class="callout-def">Counts the number of rows (or non-NULL values)</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">SUM()</div>' +
        '<div class="callout-def">Adds up all values in the column</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">AVG()</div>' +
        '<div class="callout-def">Calculates the average (mean) value</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">MIN()</div>' +
        '<div class="callout-def">Returns the smallest value</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">MAX()</div>' +
        '<div class="callout-def">Returns the largest value</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — All five aggregate functions</div>' +
      ssSql('SELECT COUNT(*) AS TotalEnrolments,\n       SUM(Score) AS TotalScore,\n       AVG(Score) AS AverageScore,\n       MIN(Score) AS LowestScore,\n       MAX(Score) AS HighestScore\nFROM Enrolments;') +
      miniTable('Result', ['TotalEnrolments', 'TotalScore', 'AverageScore', 'LowestScore', 'HighestScore'], [
        ['30', '2145', '71.5', '45', '95']
      ]) +
      '<div class="example-label">Example — COUNT with a specific column (excludes NULLs)</div>' +
      ssSql('SELECT COUNT(Email) AS StudentsWithEmail\nFROM Students;') +
      miniTable('Result', ['StudentsWithEmail'], [
        ['8']
      ]) +
    '</div>' +
    '<div class="concept-hint">COUNT(*) counts all rows including NULLs. COUNT(column) counts only rows where that column is not NULL. Use COUNT(*) to count total records.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of aggregate functions.</p>' +
      '<div id="ssFn1Ex">' +
        ssMCQ('fn1', 1, 'Which function returns the total of all scores in the Enrolments table?', ['COUNT(Score)', 'SUM(Score)', 'AVG(Score)', 'MAX(Score)'], 1, 'SUM() adds up all values in the column.') +
        ssMCQ('fn1', 2, 'What is the difference between COUNT(*) and COUNT(Email)?', ['They always return the same result', 'COUNT(*) counts all rows; COUNT(Email) excludes NULL emails', 'COUNT(Email) counts all rows; COUNT(*) excludes NULLs', 'There is no difference'], 1, 'COUNT(*) counts every row. COUNT(column) only counts rows where that column is not NULL.') +
        ssMCQ('fn1', 3, 'How many rows does an aggregate query like "SELECT AVG(Score) FROM Enrolments;" return?', ['One row with one value', 'One row per student', 'One row per subject', 'The same number as the table'], 0, 'Aggregate functions without GROUP BY collapse all rows into a single summary row.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssFn1Ex\',\'ssFn1Fb\')">Check Answers</button>' +
      '<div id="ssFn1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsGroupBy() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">GROUP BY — Grouping Rows</h2>' +
      '<p class="concept-intro"><strong>GROUP BY</strong> groups rows that share the same value in one or more columns, then applies an aggregate function to each group. For example, you can calculate the average score per subject, or count how many students are in each class. Each unique combination of grouped columns becomes one row in the result.</p>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Average score per subject</div>' +
      ssSql('SELECT SubjectID, AVG(Score) AS AvgScore\nFROM Enrolments\nGROUP BY SubjectID;') +
      miniTable('Result', ['SubjectID', 'AvgScore'], [
        ['1', '74.2'],
        ['2', '68.5'],
        ['3', '72.0'],
        ['4', '65.8'],
        ['5', '78.3']
      ]) +
      '<div class="example-label">Example — Count students per class</div>' +
      ssSql('SELECT ClassID, COUNT(*) AS StudentCount\nFROM Students\nGROUP BY ClassID;') +
      miniTable('Result', ['ClassID', 'StudentCount'], [
        ['101', '3'],
        ['102', '2'],
        ['103', '2'],
        ['104', '2'],
        ['105', '1']
      ]) +
      '<div class="example-label">Example — GROUP BY multiple columns</div>' +
      ssSql('SELECT SubjectID, Grade, COUNT(*) AS NumStudents\nFROM Enrolments\nGROUP BY SubjectID, Grade;') +
      miniTable('Result', ['SubjectID', 'Grade', 'NumStudents'], [
        ['1', 'A', '2'],
        ['1', 'B', '3'],
        ['2', 'B', '2'],
        ['2', 'C', '2']
      ]) +
    '</div>' +
    '<div class="concept-hint">Every column in SELECT that is not an aggregate function must appear in the GROUP BY clause. Otherwise, the database does not know which value to display for that column.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of GROUP BY.</p>' +
      '<div id="ssFn2Ex">' +
        ssMCQ('fn2', 1, 'What does GROUP BY do?', ['Sorts rows by a column', 'Groups rows with the same value so aggregates apply per group', 'Filters rows based on an aggregate', 'Joins two tables together'], 1, 'GROUP BY groups rows sharing the same column values so aggregate functions are applied to each group.') +
        ssMCQ('fn2', 2, 'How many result rows does "SELECT ClassID, COUNT(*) FROM Students GROUP BY ClassID;" return if there are 5 distinct ClassIDs?', ['1', '5', '10', 'Equal to total rows in Students'], 1, 'GROUP BY produces one row per unique ClassID. With 5 distinct ClassIDs, there are 5 result rows.') +
        ssMCQ('fn2', 3, 'In "SELECT SubjectID, AVG(Score) FROM Enrolments GROUP BY SubjectID;", what is wrong with adding "Name" to SELECT without adding it to GROUP BY?', ['Nothing — Name can always be in SELECT', 'It causes an error because Name is not in GROUP BY', 'Name is automatically grouped', 'Name is ignored silently'], 1, 'Any non-aggregate column in SELECT must also appear in GROUP BY, or the query is invalid.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssFn2Ex\',\'ssFn2Fb\')">Check Answers</button>' +
      '<div id="ssFn2Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsHaving() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">HAVING — Filtering Groups</h2>' +
      '<p class="concept-intro"><strong>HAVING</strong> filters groups after GROUP BY has been applied. It is similar to WHERE, but WHERE filters individual rows <em>before</em> grouping, while HAVING filters groups <em>after</em> the aggregate has been calculated. Use HAVING when your condition involves an aggregate function like COUNT, AVG, or SUM.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">WHERE</div>' +
        '<div class="callout-def">Filters rows BEFORE grouping — cannot use aggregate functions</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">HAVING</div>' +
        '<div class="callout-def">Filters groups AFTER grouping — can use aggregate functions</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — Only subjects where average score exceeds 70</div>' +
      ssSql('SELECT SubjectID, AVG(Score) AS AvgScore\nFROM Enrolments\nGROUP BY SubjectID\nHAVING AVG(Score) > 70;') +
      miniTable('Result', ['SubjectID', 'AvgScore'], [
        ['1', '74.2'],
        ['3', '72.0'],
        ['5', '78.3']
      ]) +
      '<div class="example-label">Example — Only classes with more than 1 student enrolled</div>' +
      ssSql('SELECT ClassID, COUNT(*) AS StudentCount\nFROM Students\nGROUP BY ClassID\nHAVING COUNT(*) > 1;') +
      miniTable('Result', ['ClassID', 'StudentCount'], [
        ['101', '3'],
        ['102', '2'],
        ['103', '2'],
        ['104', '2']
      ]) +
      '<div class="example-label">Example — WHERE and HAVING together</div>' +
      ssSql("SELECT SubjectID, AVG(Score) AS AvgScore\nFROM Enrolments\nWHERE Grade <> 'E'\nGROUP BY SubjectID\nHAVING AVG(Score) >= 70;") +
      miniTable('Result', ['SubjectID', 'AvgScore'], [
        ['1', '76.5'],
        ['3', '73.2'],
        ['5', '80.1']
      ]) +
    '</div>' +
    '<div class="concept-hint">The order of clauses matters: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY. HAVING always comes after GROUP BY.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of HAVING vs WHERE.</p>' +
      '<div id="ssFn3Ex">' +
        ssMCQ('fn3', 1, 'Which clause is used to filter the results of a GROUP BY?', ['WHERE', 'FILTER', 'HAVING', 'ORDER BY'], 2, 'HAVING filters groups after GROUP BY. WHERE filters individual rows before grouping.') +
        ssMCQ('fn3', 2, 'What is wrong with "SELECT ClassID, COUNT(*) FROM Students WHERE COUNT(*) > 2 GROUP BY ClassID;"?', ['COUNT(*) cannot be used in WHERE', 'There is nothing wrong', 'WHERE should come after GROUP BY', 'COUNT should be used without *'], 0, 'Aggregate functions like COUNT(*) cannot appear in a WHERE clause. Use HAVING instead.') +
        ssMCQ('fn3', 3, 'What is the correct order of these clauses? [1] HAVING [2] WHERE [3] GROUP BY [4] FROM', ['4, 3, 2, 1', '4, 2, 3, 1', '2, 4, 3, 1', '4, 1, 2, 3'], 1, 'The correct order is FROM, WHERE, GROUP BY, HAVING (then ORDER BY last).') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssFn3Ex\',\'ssFn3Fb\')">Check Answers</button>' +
      '<div id="ssFn3Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

function buildSsStringFn() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">String Functions</h2>' +
      '<p class="concept-intro">SQL provides built-in <strong>string functions</strong> for manipulating text values. These are used in SELECT to transform or extract parts of text columns. Common functions include LENGTH (character count), UPPER/LOWER (case conversion), SUBSTR (extract part of a string), and <strong>||</strong> for string concatenation.</p>' +
    '</div>' +
    '<div class="concept-callout-grid">' +
      '<div class="concept-callout">' +
        '<div class="callout-term">LENGTH(str)</div>' +
        '<div class="callout-def">Number of characters in the string</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">UPPER(str)</div>' +
        '<div class="callout-def">Converts all letters to uppercase</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">LOWER(str)</div>' +
        '<div class="callout-def">Converts all letters to lowercase</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">SUBSTR(str, start, len)</div>' +
        '<div class="callout-def">Extracts len characters starting at position start</div>' +
      '</div>' +
      '<div class="concept-callout">' +
        '<div class="callout-term">str1 || str2</div>' +
        '<div class="callout-def">Concatenates (joins) two strings together</div>' +
      '</div>' +
    '</div>' +
    '<div class="concept-example">' +
      '<div class="example-label">Example — LENGTH and UPPER</div>' +
      ssSql("SELECT Name,\n       LENGTH(Name) AS NameLength,\n       UPPER(Name) AS UpperName\nFROM Students;") +
      miniTable('Result', ['Name', 'NameLength', 'UpperName'], [
        ['Chan Tai Man', '12', 'CHAN TAI MAN'],
        ['Lee Ka Wai', '10', 'LEE KA WAI'],
        ['Ng Mei Ling', '11', 'NG MEI LING']
      ]) +
      '<div class="example-label">Example — SUBSTR</div>' +
      ssSql("SELECT Name,\n       SUBSTR(Name, 1, 4) AS FirstFour\nFROM Students;") +
      miniTable('Result', ['Name', 'FirstFour'], [
        ['Chan Tai Man', 'Chan'],
        ['Wong Siu Ming', 'Wong'],
        ['Lee Ka Wai', 'Lee ']
      ]) +
      '<div class="example-label">Example — Concatenation with ||</div>' +
      ssSql("SELECT Name || ' (Class ' || ClassID || ')' AS StudentInfo\nFROM Students;") +
      miniTable('Result', ['StudentInfo'], [
        ['Chan Tai Man (Class 101)'],
        ['Wong Siu Ming (Class 102)'],
        ['Lee Ka Wai (Class 101)']
      ]) +
    '</div>' +
    '<div class="concept-hint">In SQL Server and MS Access, the concatenation operator is + instead of ||. In MySQL you use the CONCAT() function. SQLite and standard SQL use ||.</div>' +
    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise</div>' +
      '<p class="exercise-instructions">Test your understanding of string functions.</p>' +
      '<div id="ssFn4Ex">' +
        ssMCQ('fn4', 1, 'What does LENGTH(\'Hello\') return?', ['4', '5', '6', '0'], 1, 'LENGTH counts the number of characters. "Hello" has 5 characters.') +
        ssMCQ('fn4', 2, 'What does SUBSTR(\'Mathematics\', 1, 4) return?', ['Math', 'athe', 'atics', 'ema'], 0, 'SUBSTR starts at position 1 (the first character) and takes 4 characters: "Math".') +
        ssMCQ('fn4', 3, 'Which expression joins two columns Name and Email with " - " between them?', ["Name + ' - ' + Email", "CONCAT(Name, ' - ', Email)", "Name || ' - ' || Email", "JOIN(Name, ' - ', Email)"], 2, 'The || operator concatenates strings in standard SQL and SQLite. "Name || \' - \' || Email" produces e.g. "Chan Tai Man - ctm@school.hk".') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssFn4Ex\',\'ssFn4Fb\')">Check Answers</button>' +
      '<div id="ssFn4Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}
// ssSql(sql) and ssMCQ(prefix, num, question, options, correctIdx, explanation) defined in merged file
// ssCheckMCQ(containerId, feedbackId) defined in merged file
// miniTable(name, cols, rows) from concepts.js

// ===================================================================
// CATEGORY 5: Queries on Multiple Tables (JOIN)
// ===================================================================

// SECTION jn1 — JOIN Introduction
// id: 'ss-join-intro'
function buildSsJoinIntro() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">5.1 Querying Multiple Tables — JOINs</h2>' +
      '<p class="concept-intro">A <strong>JOIN</strong> combines rows from two or more tables based on a related column. Because a relational database splits information across tables, you need JOINs to retrieve a complete picture — for example, a student\'s name together with their class name.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Why JOINs Are Needed</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Students table</div>' +
          '<div class="callout-def">Has StudentID, Name, Age, Gender, <strong>ClassID</strong>, Email — but NOT the class name.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Classes table</div>' +
          '<div class="callout-def">Has <strong>ClassID</strong>, ClassName, ClassTeacher — ClassID is the shared link.</div>' +
        '</div>' +
      '</div>' +
      '<p class="concept-hint">The Foreign Key <strong>ClassID</strong> in Students matches the Primary Key <strong>ClassID</strong> in Classes. A JOIN uses this link to combine the tables.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Table Aliases</div>' +
      '<p style="margin:0 0 8px;">When writing JOINs, we give each table a short <strong>alias</strong> to save typing and avoid ambiguity.</p>' +
      ssSql('SELECT s.Name, s.Age, c.ClassName\nFROM Students s\nJOIN Classes c ON s.ClassID = c.ClassID;') +
      '<p class="concept-hint"><strong>s</strong> is an alias for Students; <strong>c</strong> is an alias for Classes. Write <code>table alias.column</code> to specify which table a column comes from.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">General JOIN Syntax</div>' +
      ssSql('SELECT column1, column2, ...\nFROM TableA alias1\nJOIN TableB alias2 ON alias1.sharedColumn = alias2.sharedColumn;') +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: JOIN Introduction</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssJn1Ex">' +
        ssMCQ('jn1', 1,
          'Why do we need a JOIN when querying a relational database?',
          [
            'To delete rows from two tables at once',
            'To combine data from two or more tables using a shared column',
            'To create a backup of a table',
            'To sort the results alphabetically'
          ],
          1,
          'A JOIN combines rows from multiple tables based on a related column (e.g. ClassID), letting you retrieve data that is spread across tables.'
        ) +
        ssMCQ('jn1', 2,
          'In the query "SELECT s.Name FROM Students s JOIN Classes c ON s.ClassID = c.ClassID", what does the letter "s" represent?',
          [
            'The name of a column',
            'A keyword meaning "select"',
            'An alias (short name) for the Students table',
            'The SubjectID column'
          ],
          2,
          '"s" is a table alias assigned to Students. It is used before column names (s.Name) to clarify which table the column belongs to.'
        ) +
        ssMCQ('jn1', 3,
          'Which column is used to JOIN the Students and Classes tables?',
          [
            'StudentID',
            'Name',
            'ClassID',
            'ClassName'
          ],
          2,
          'ClassID is a Foreign Key in Students and the Primary Key in Classes. The ON clause uses this shared column to link matching rows.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssJn1Ex\',\'ssJn1Fb\')">Check Answers</button>' +
      '<div id="ssJn1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION jn2 — INNER JOIN
// id: 'ss-inner-join'
function buildSsInnerJoin() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">5.2 INNER JOIN (Equi-Join)</h2>' +
      '<p class="concept-intro">An <strong>INNER JOIN</strong> returns only the rows where the join condition is satisfied in <em>both</em> tables. Rows that have no match in the other table are excluded. This is the most common type of join.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Students + Classes — INNER JOIN</div>' +
      ssSql('SELECT s.StudentID, s.Name, s.Age, c.ClassName, c.ClassTeacher\nFROM Students s\nINNER JOIN Classes c ON s.ClassID = c.ClassID;') +
      '<p style="margin:8px 0 4px;">Sample result (first 5 rows):</p>' +
      miniTable('Result', ['StudentID', 'Name', 'Age', 'ClassName', 'ClassTeacher'],
        [
          ['1', 'Chan Tai Man', '16', '4A', 'Mr. Wong'],
          ['2', 'Wong Siu Ming', '17', '4A', 'Mr. Wong'],
          ['3', 'Lee Ka Yan', '16', '4B', 'Ms. Cheung'],
          ['4', 'Cheung Mei Ling', '15', '4B', 'Ms. Cheung'],
          ['5', 'Lau Wing Ho', '17', '4C', 'Mr. Lee']
        ]
      ) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Filtering JOIN Results with WHERE</div>' +
      ssSql('SELECT s.Name, s.Gender, c.ClassName\nFROM Students s\nINNER JOIN Classes c ON s.ClassID = c.ClassID\nWHERE s.Gender = \'F\';') +
      miniTable('Female Students', ['Name', 'Gender', 'ClassName'],
        [
          ['Lee Ka Yan', 'F', '4B'],
          ['Cheung Mei Ling', 'F', '4B'],
          ['Ng Hoi Yan', 'F', '4C'],
          ['Yip Sze Wan', 'F', '5A'],
          ['Fung Wai Kei', 'F', '4A']
        ]
      ) +
      '<p class="concept-hint">You can add a WHERE clause after the JOIN to filter rows further. The keyword INNER is optional — plain JOIN means INNER JOIN.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: INNER JOIN</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssJn2Ex">' +
        ssMCQ('jn2', 1,
          'What does an INNER JOIN return?',
          [
            'All rows from the left table, even with no match in the right table',
            'All rows from both tables regardless of matching',
            'Only rows where the join condition is met in both tables',
            'The intersection of two SELECT queries'
          ],
          2,
          'INNER JOIN returns only rows that have a matching value in both tables. Rows with no match are excluded.'
        ) +
        ssMCQ('jn2', 2,
          'In "FROM Students s INNER JOIN Classes c ON s.ClassID = c.ClassID", what does the ON clause specify?',
          [
            'Which columns to display in the result',
            'The condition used to match rows between the two tables',
            'The order of the results',
            'The maximum number of rows to return'
          ],
          1,
          'The ON clause defines the join condition — here, rows from Students and Classes are matched when their ClassID values are equal.'
        ) +
        ssMCQ('jn2', 3,
          'You write: SELECT s.Name, c.ClassName FROM Students s INNER JOIN Classes c ON s.ClassID = c.ClassID WHERE c.ClassName = \'5A\'. What will the result contain?',
          [
            'All students regardless of class',
            'Only students in class 5A with their class name',
            'All classes with no students',
            'Only teachers in class 5A'
          ],
          1,
          'The INNER JOIN links each student to their class, and the WHERE clause then limits results to class 5A only.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssJn2Ex\',\'ssJn2Fb\')">Check Answers</button>' +
      '<div id="ssJn2Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION jn3 — Three-Table JOIN
// id: 'ss-join3'
function buildSsJoin3() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">5.3 Joining Three Tables</h2>' +
      '<p class="concept-intro">You can chain multiple JOINs to combine three or more tables in one query. Each JOIN adds another table and its matching condition. This is how you retrieve complete records that span several related tables.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Students + Enrolments + Subjects</div>' +
      ssSql('SELECT s.Name, sub.SubjectName, e.Score, e.Grade\nFROM Students s\nJOIN Enrolments e ON s.StudentID = e.StudentID\nJOIN Subjects sub ON e.SubjectID = sub.SubjectID;') +
      '<p style="margin:8px 0 4px;">Sample result (first 6 rows):</p>' +
      miniTable('Result', ['Name', 'SubjectName', 'Score', 'Grade'],
        [
          ['Chan Tai Man', 'ICT', '85', 'A'],
          ['Chan Tai Man', 'Mathematics', '72', 'B'],
          ['Chan Tai Man', 'English', '68', 'C'],
          ['Wong Siu Ming', 'ICT', '92', 'A'],
          ['Wong Siu Ming', 'Mathematics', '88', 'A'],
          ['Lee Ka Yan', 'ICT', '78', 'B']
        ]
      ) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Three-Table JOIN with WHERE Filter</div>' +
      '<p style="margin:0 0 8px;">Find all A-grade results with the student name and subject:</p>' +
      ssSql('SELECT s.Name, sub.SubjectName, e.Score, e.Grade\nFROM Students s\nJOIN Enrolments e ON s.StudentID = e.StudentID\nJOIN Subjects sub ON e.SubjectID = sub.SubjectID\nWHERE e.Grade = \'A\';') +
      miniTable('A-Grade Results', ['Name', 'SubjectName', 'Score', 'Grade'],
        [
          ['Chan Tai Man', 'ICT', '85', 'A'],
          ['Wong Siu Ming', 'ICT', '92', 'A'],
          ['Wong Siu Ming', 'Mathematics', '88', 'A'],
          ['Lee Ka Yan', 'English', '95', 'A'],
          ['Cheung Mei Ling', 'Chinese', '82', 'A'],
          ['Ho Ka Ming', 'ICT', '90', 'A']
        ]
      ) +
      '<p class="concept-hint">Chain JOINs one after another. Each new JOIN specifies how the new table links to an already-joined table.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Three-Table JOIN</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssJn3Ex">' +
        ssMCQ('jn3', 1,
          'To query student names alongside their subject scores, which tables must be joined?',
          [
            'Students and Classes only',
            'Subjects and Classes only',
            'Students, Enrolments, and Subjects',
            'Students and Subjects only'
          ],
          2,
          'Students contains names, Subjects contains subject names, and Enrolments is the junction table linking them. All three are needed.'
        ) +
        ssMCQ('jn3', 2,
          'In a three-table join of Students, Enrolments, Subjects — which table acts as the bridge between Students and Subjects?',
          [
            'Classes',
            'Enrolments',
            'Students',
            'Subjects'
          ],
          1,
          'Enrolments is the junction table. It holds both StudentID (linking to Students) and SubjectID (linking to Subjects).'
        ) +
        ssMCQ('jn3', 3,
          'Which clause would you add to the three-table join to show only results from the "Mathematics" subject?',
          [
            'HAVING SubjectName = \'Mathematics\'',
            'GROUP BY SubjectName',
            'WHERE sub.SubjectName = \'Mathematics\'',
            'ORDER BY SubjectName'
          ],
          2,
          'WHERE filters rows after the join. WHERE sub.SubjectName = \'Mathematics\' limits results to Mathematics enrolments only.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssJn3Ex\',\'ssJn3Fb\')">Check Answers</button>' +
      '<div id="ssJn3Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION jn4 — NATURAL JOIN
// id: 'ss-natural'
function buildSsNaturalJoin() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">5.4 NATURAL JOIN</h2>' +
      '<p class="concept-intro">A <strong>NATURAL JOIN</strong> automatically joins two tables on all columns that share the same name and compatible data type. You do not need to write an ON clause — the database finds matching column names automatically.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">NATURAL JOIN Syntax</div>' +
      ssSql('SELECT s.Name, s.Age, c.ClassName\nFROM Students s\nNATURAL JOIN Classes c;') +
      '<p class="concept-hint">Because both Students and Classes have a column called <strong>ClassID</strong>, NATURAL JOIN automatically joins on ClassID — equivalent to writing ON s.ClassID = c.ClassID.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Comparing NATURAL JOIN vs INNER JOIN</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">NATURAL JOIN</div>' +
          '<div class="callout-def">Automatically finds shared column names. Shorter syntax but less explicit. Can produce unexpected results if column names accidentally match.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">INNER JOIN ... ON</div>' +
          '<div class="callout-def">You explicitly state the join condition. Safer and clearer — recommended for complex or multi-table queries.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Sample Result</div>' +
      miniTable('Students NATURAL JOIN Classes', ['Name', 'Age', 'ClassName'],
        [
          ['Chan Tai Man', '16', '4A'],
          ['Wong Siu Ming', '17', '4A'],
          ['Lee Ka Yan', '16', '4B'],
          ['Cheung Mei Ling', '15', '4B'],
          ['Lau Wing Ho', '17', '4C']
        ]
      ) +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: NATURAL JOIN</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssJn4Ex">' +
        ssMCQ('jn4', 1,
          'How does a NATURAL JOIN decide which columns to use for matching?',
          [
            'You specify the columns in a USING clause',
            'It matches on all columns with the same name in both tables',
            'It always joins on the Primary Key column',
            'It joins on all columns in both tables'
          ],
          1,
          'NATURAL JOIN automatically finds columns with identical names in both tables and uses those as the join condition.'
        ) +
        ssMCQ('jn4', 2,
          'When joining Students and Classes with NATURAL JOIN, which column is automatically used?',
          [
            'StudentID',
            'Name',
            'ClassID',
            'ClassName'
          ],
          2,
          'ClassID appears in both the Students table (as a Foreign Key) and the Classes table (as a Primary Key), so NATURAL JOIN uses it automatically.'
        ) +
        ssMCQ('jn4', 3,
          'What is a potential risk of using NATURAL JOIN?',
          [
            'It always returns more rows than an INNER JOIN',
            'It cannot be used with WHERE',
            'Columns that share a name by coincidence may cause an unintended join condition',
            'It does not work with aliases'
          ],
          2,
          'If two tables have a column with the same name that is NOT the intended join key, NATURAL JOIN will still use it, potentially producing wrong results. Explicit ON clauses are safer.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssJn4Ex\',\'ssJn4Fb\')">Check Answers</button>' +
      '<div id="ssJn4Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION jn5 — LEFT JOIN
// id: 'ss-left-join'
function buildSsLeftJoin() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">5.5 LEFT JOIN (Outer Join)</h2>' +
      '<p class="concept-intro">A <strong>LEFT JOIN</strong> (also called LEFT OUTER JOIN) returns <em>all rows from the left table</em> and the matching rows from the right table. If no match exists in the right table, the right-side columns appear as <strong>NULL</strong>. This is useful for finding records that have no related entry in another table.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">LEFT JOIN — All Students and Their Enrolments</div>' +
      ssSql('SELECT s.StudentID, s.Name, e.SubjectID, e.Grade\nFROM Students s\nLEFT JOIN Enrolments e ON s.StudentID = e.StudentID;') +
      '<p style="margin:8px 0 4px;">Sample result (includes students with no enrolments):</p>' +
      miniTable('Result', ['StudentID', 'Name', 'SubjectID', 'Grade'],
        [
          ['1', 'Chan Tai Man', '1', 'A'],
          ['1', 'Chan Tai Man', '2', 'B'],
          ['9', 'Tam Chi Hung', '1', 'B'],
          ['10', 'Fung Wai Kei', 'NULL', 'NULL']
        ]
      ) +
      '<p class="concept-hint">Fung Wai Kei appears with NULL for SubjectID and Grade — she has no enrolment rows. INNER JOIN would have excluded her entirely.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Finding Students with NO Enrolments</div>' +
      ssSql('SELECT s.StudentID, s.Name\nFROM Students s\nLEFT JOIN Enrolments e ON s.StudentID = e.StudentID\nWHERE e.StudentID IS NULL;') +
      miniTable('Students with No Enrolments', ['StudentID', 'Name'],
        [
          ['10', 'Fung Wai Kei']
        ]
      ) +
      '<p class="concept-hint">After a LEFT JOIN, filter WHERE right-side column IS NULL to find rows in the left table that have no match in the right table — a classic "find missing data" pattern.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: LEFT JOIN</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssJn5Ex">' +
        ssMCQ('jn5', 1,
          'What distinguishes a LEFT JOIN from an INNER JOIN?',
          [
            'LEFT JOIN only returns rows from the right table',
            'LEFT JOIN returns all rows from the left table, with NULLs where no match exists in the right table',
            'LEFT JOIN is faster than INNER JOIN',
            'LEFT JOIN requires two ON conditions'
          ],
          1,
          'LEFT JOIN keeps every row from the left table. Where no matching row exists in the right table, those columns are filled with NULL.'
        ) +
        ssMCQ('jn5', 2,
          'To find students who have NOT enrolled in any subject, which technique is used after a LEFT JOIN?',
          [
            'WHERE e.SubjectID = 0',
            'WHERE e.StudentID IS NULL',
            'HAVING COUNT(*) = 0',
            'WHERE e.Grade = \'NULL\''
          ],
          1,
          'After LEFT JOIN, rows with no match in the right table have NULL in the right-side columns. Filtering WHERE e.StudentID IS NULL isolates those unmatched rows.'
        ) +
        ssMCQ('jn5', 3,
          'A query uses "FROM Students s LEFT JOIN Enrolments e ON s.StudentID = e.StudentID". Which table is the "left" table?',
          [
            'Enrolments',
            'The table listed in the JOIN clause',
            'Students',
            'There is no left table in a LEFT JOIN'
          ],
          2,
          'The left table is the one listed in the FROM clause — here, Students. LEFT JOIN keeps ALL rows from Students.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssJn5Ex\',\'ssJn5Fb\')">Check Answers</button>' +
      '<div id="ssJn5Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION jn6 — JOIN with Aggregates
// id: 'ss-join-agg'
function buildSsJoinAgg() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">5.6 JOIN with Aggregate Functions</h2>' +
      '<p class="concept-intro">You can combine JOINs with aggregate functions (COUNT, AVG, MAX, etc.) and GROUP BY to produce summary statistics that draw data from multiple tables. This is one of the most powerful query patterns in SQL.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Count Enrolments per Subject</div>' +
      ssSql('SELECT sub.SubjectName, COUNT(e.EnrolmentID) AS NumStudents\nFROM Subjects sub\nJOIN Enrolments e ON sub.SubjectID = e.SubjectID\nGROUP BY sub.SubjectID, sub.SubjectName\nORDER BY NumStudents DESC;') +
      miniTable('Enrolments per Subject', ['SubjectName', 'NumStudents'],
        [
          ['ICT', '6'],
          ['English', '3'],
          ['Mathematics', '3'],
          ['Chinese', '2'],
          ['Physics', '2']
        ]
      ) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Average Score per Subject</div>' +
      ssSql('SELECT sub.SubjectName, ROUND(AVG(e.Score), 1) AS AvgScore, MAX(e.Score) AS TopScore\nFROM Subjects sub\nJOIN Enrolments e ON sub.SubjectID = e.SubjectID\nGROUP BY sub.SubjectID, sub.SubjectName\nORDER BY AvgScore DESC;') +
      miniTable('Score Summary', ['SubjectName', 'AvgScore', 'TopScore'],
        [
          ['English', '83.7', '95'],
          ['Chinese', '79.0', '82'],
          ['Mathematics', '73.3', '88'],
          ['ICT', '78.3', '92'],
          ['Physics', '70.0', '70']
        ]
      ) +
      '<p class="concept-hint">JOIN first combines the tables, then GROUP BY groups the combined rows, then aggregate functions (AVG, MAX) summarise each group.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: JOIN with Aggregates</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssJn6Ex">' +
        ssMCQ('jn6', 1,
          'To find the number of students enrolled in each subject (showing the subject name), which tables must be joined?',
          [
            'Students and Classes',
            'Subjects and Enrolments',
            'Students and Subjects',
            'Classes and Enrolments'
          ],
          1,
          'Subjects provides the subject name, Enrolments provides the enrolment records. JOIN them on SubjectID, then COUNT per group.'
        ) +
        ssMCQ('jn6', 2,
          'In a query combining JOIN and GROUP BY, what does GROUP BY do?',
          [
            'It filters rows before the JOIN occurs',
            'It groups the joined result rows so aggregate functions can summarise each group',
            'It specifies the join condition between tables',
            'It removes duplicate column names'
          ],
          1,
          'GROUP BY partitions the result set into groups (e.g. one group per subject), then aggregate functions like COUNT and AVG operate within each group.'
        ) +
        ssMCQ('jn6', 3,
          'Which clause would you add to show only subjects where more than 3 students are enrolled?',
          [
            'WHERE COUNT(*) > 3',
            'HAVING COUNT(*) > 3',
            'WHERE NumStudents > 3',
            'FILTER COUNT > 3'
          ],
          1,
          'HAVING filters groups after aggregation. WHERE cannot filter on aggregate results, but HAVING can (e.g. HAVING COUNT(*) > 3).'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssJn6Ex\',\'ssJn6Fb\')">Check Answers</button>' +
      '<div id="ssJn6Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// ===================================================================
// CATEGORY 6: Subqueries
// ===================================================================

// SECTION sq1 — Subquery Introduction
// id: 'ss-sub-intro'
function buildSsSubIntro() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">6.1 Subqueries</h2>' +
      '<p class="concept-intro">A <strong>subquery</strong> (also called a nested query or inner query) is a SELECT statement placed inside another SQL statement. The outer query uses the result of the inner query. Subqueries allow complex, multi-step questions to be answered in a single SQL statement.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Subquery with IN</div>' +
      '<p style="margin:0 0 8px;">Find the names of students who are enrolled in subject 1 (ICT):</p>' +
      ssSql('SELECT Name\nFROM Students\nWHERE StudentID IN (\n    SELECT StudentID\n    FROM Enrolments\n    WHERE SubjectID = 1\n);') +
      miniTable('Students in ICT', ['Name'],
        [
          ['Chan Tai Man'],
          ['Wong Siu Ming'],
          ['Lee Ka Yan'],
          ['Lau Wing Ho'],
          ['Ho Ka Ming'],
          ['Yip Sze Wan']
        ]
      ) +
      '<p class="concept-hint">The inner query returns a list of StudentIDs; the outer query returns student names WHERE StudentID is IN that list.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Subquery with NOT IN</div>' +
      '<p style="margin:0 0 8px;">Find students who have NOT enrolled in ICT (SubjectID = 1):</p>' +
      ssSql('SELECT Name\nFROM Students\nWHERE StudentID NOT IN (\n    SELECT StudentID\n    FROM Enrolments\n    WHERE SubjectID = 1\n);') +
      miniTable('Students NOT in ICT', ['Name'],
        [
          ['Cheung Mei Ling'],
          ['Ng Hoi Yan'],
          ['Tam Chi Hung'],
          ['Fung Wai Kei']
        ]
      ) +
      '<p class="concept-hint">NOT IN excludes all rows whose column value appears in the subquery result list.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Subquery Introduction</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssSq1Ex">' +
        ssMCQ('sq1', 1,
          'What is a subquery?',
          [
            'A SELECT statement used to create a new table',
            'A SELECT statement nested inside another SQL statement',
            'A stored procedure with parameters',
            'A shorthand for a JOIN'
          ],
          1,
          'A subquery is an inner SELECT statement placed inside another SQL statement. The outer query uses the inner query\'s results.'
        ) +
        ssMCQ('sq1', 2,
          'In "WHERE StudentID IN (SELECT StudentID FROM Enrolments WHERE SubjectID = 1)", what does the subquery return?',
          [
            'A single student name',
            'A list of StudentIDs enrolled in subject 1',
            'All columns from the Enrolments table',
            'The count of enrolments'
          ],
          1,
          'The inner query SELECT StudentID FROM Enrolments WHERE SubjectID = 1 returns a list of StudentIDs. The outer WHERE IN checks membership in that list.'
        ) +
        ssMCQ('sq1', 3,
          'What does NOT IN do in a subquery context?',
          [
            'Inverts the JOIN direction',
            'Returns rows where the column value does NOT appear in the subquery result',
            'Returns NULL values only',
            'Sorts results in descending order'
          ],
          1,
          'NOT IN excludes rows whose column value is found in the subquery\'s returned list — the opposite of IN.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSq1Ex\',\'ssSq1Fb\')">Check Answers</button>' +
      '<div id="ssSq1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION sq2 — Subquery with Aggregates
// id: 'ss-sub-agg'
function buildSsSubAgg() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">6.2 Subqueries with Aggregates</h2>' +
      '<p class="concept-intro">Subqueries are especially powerful when combined with aggregate functions. A common pattern is to use a subquery to compute a summary value (such as the average score), then use that value in the outer query to filter rows.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Find Students Who Scored Above the Average</div>' +
      ssSql('SELECT s.Name, e.Score\nFROM Students s\nJOIN Enrolments e ON s.StudentID = e.StudentID\nWHERE e.Score > (\n    SELECT AVG(Score)\n    FROM Enrolments\n);') +
      miniTable('Above-Average Scorers', ['Name', 'Score'],
        [
          ['Chan Tai Man', '85'],
          ['Wong Siu Ming', '92'],
          ['Wong Siu Ming', '88'],
          ['Lee Ka Yan', '95'],
          ['Cheung Mei Ling', '82'],
          ['Ng Hoi Yan', '88'],
          ['Ho Ka Ming', '90'],
          ['Yip Sze Wan', '85']
        ]
      ) +
      '<p class="concept-hint">The inner query computes one value (the overall average score). The outer query then uses that value to filter enrolment rows.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Subquery in the FROM Clause (Derived Table)</div>' +
      '<p style="margin:0 0 8px;">Find the subject with the highest average score:</p>' +
      ssSql('SELECT SubjectID, AvgScore\nFROM (\n    SELECT SubjectID, AVG(Score) AS AvgScore\n    FROM Enrolments\n    GROUP BY SubjectID\n) AS SubjectAvg\nWHERE AvgScore = (\n    SELECT MAX(AvgScore)\n    FROM (\n        SELECT AVG(Score) AS AvgScore\n        FROM Enrolments\n        GROUP BY SubjectID\n    ) AS inner_avg\n);') +
      '<p class="concept-hint">A subquery in the FROM clause is called a <strong>derived table</strong> or inline view. It must be given an alias (e.g. AS SubjectAvg). The outer query then treats it like a regular table.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Using MAX / MIN in a Subquery</div>' +
      ssSql('SELECT s.Name, e.Score\nFROM Students s\nJOIN Enrolments e ON s.StudentID = e.StudentID\nWHERE e.Score = (\n    SELECT MAX(Score)\n    FROM Enrolments\n);') +
      miniTable('Top Scorer', ['Name', 'Score'],
        [
          ['Lee Ka Yan', '95']
        ]
      ) +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Subqueries with Aggregates</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssSq2Ex">' +
        ssMCQ('sq2', 1,
          'In "WHERE e.Score > (SELECT AVG(Score) FROM Enrolments)", what does the subquery compute?',
          [
            'The maximum score across all enrolments',
            'The average score across all enrolments',
            'The number of enrolments',
            'The minimum score across all enrolments'
          ],
          1,
          'SELECT AVG(Score) FROM Enrolments computes the mean of all Score values. The outer WHERE clause then filters for rows where Score exceeds that mean.'
        ) +
        ssMCQ('sq2', 2,
          'What is a derived table in SQL?',
          [
            'A table created by the CREATE TABLE statement',
            'A subquery in the WHERE clause',
            'A subquery placed in the FROM clause and given an alias',
            'A view stored in the database'
          ],
          2,
          'A derived table (inline view) is a subquery used in the FROM clause. It must have an alias; the outer query treats it as a regular table.'
        ) +
        ssMCQ('sq2', 3,
          'To find the student with the lowest score, which subquery approach would you use?',
          [
            'WHERE Score = (SELECT AVG(Score) FROM Enrolments)',
            'WHERE Score = (SELECT MIN(Score) FROM Enrolments)',
            'WHERE Score = (SELECT COUNT(Score) FROM Enrolments)',
            'WHERE Score IN (SELECT Grade FROM Enrolments)'
          ],
          1,
          'MIN(Score) returns the smallest score value. Using WHERE Score = (SELECT MIN(Score) ...) finds the row(s) matching the lowest score.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssSq2Ex\',\'ssSq2Fb\')">Check Answers</button>' +
      '<div id="ssSq2Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// ===================================================================
// CATEGORY 7: Maintaining the Database (DDL / DML)
// ===================================================================

// SECTION ddl1 — DDL vs DML Overview
// id: 'ss-ddl-dml'
function buildSsDdlDml() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">7.1 DDL and DML — Maintaining the Database</h2>' +
      '<p class="concept-intro">SQL statements are divided into two main categories: <strong>DDL (Data Definition Language)</strong> which defines and modifies the database structure, and <strong>DML (Data Manipulation Language)</strong> which reads and modifies the data inside the tables.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">DDL vs DML at a Glance</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">DDL — Define Structure</div>' +
          '<div class="callout-def">' +
            '<strong>CREATE TABLE</strong> — create a new table<br>' +
            '<strong>ALTER TABLE</strong> — add/remove/modify columns<br>' +
            '<strong>DROP TABLE</strong> — delete a table<br>' +
            '<strong>CREATE VIEW</strong> — create a saved query<br>' +
            '<strong>DROP VIEW</strong> — remove a view' +
          '</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">DML — Manipulate Data</div>' +
          '<div class="callout-def">' +
            '<strong>SELECT</strong> — query/read data<br>' +
            '<strong>INSERT INTO</strong> — add new rows<br>' +
            '<strong>UPDATE ... SET</strong> — change existing data<br>' +
            '<strong>DELETE FROM</strong> — remove rows' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">ALTER TABLE — Add a Column</div>' +
      '<p style="margin:0 0 8px;">Add a Phone column to the Students table:</p>' +
      ssSql('ALTER TABLE Students\nADD Phone VARCHAR(20);') +
      '<p class="concept-hint">After ALTER TABLE ADD, existing rows will have NULL in the new column until data is inserted.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">ALTER TABLE — Modify a Column</div>' +
      ssSql('-- Rename a column (syntax varies by DBMS)\nALTER TABLE Students\nRENAME COLUMN Phone TO PhoneNumber;\n\n-- Change column data type\nALTER TABLE Students\nMODIFY COLUMN Age SMALLINT;') +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: DDL and DML</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssDdl1Ex">' +
        ssMCQ('ddl1', 1,
          'Which category does the ALTER TABLE statement belong to?',
          [
            'DML — it changes data in rows',
            'DDL — it changes the structure of the database',
            'TCL — it controls transactions',
            'DCL — it grants permissions'
          ],
          1,
          'ALTER TABLE modifies the structure (schema) of a table — adding, removing, or changing columns. It is a DDL statement.'
        ) +
        ssMCQ('ddl1', 2,
          'After running ALTER TABLE Students ADD Phone VARCHAR(20), what value will existing student rows have in the Phone column?',
          [
            'An empty string ""',
            'The value 0',
            'NULL',
            'An error is raised'
          ],
          2,
          'When a new column is added via ALTER TABLE, existing rows receive NULL in that column because no data has been provided yet.'
        ) +
        ssMCQ('ddl1', 3,
          'Which SQL statement is used to permanently delete an entire table and all its data?',
          [
            'DELETE FROM TableName',
            'REMOVE TABLE TableName',
            'DROP TABLE TableName',
            'TRUNCATE TABLE TableName'
          ],
          2,
          'DROP TABLE removes the table structure and all its data permanently. DELETE FROM only removes rows; TRUNCATE removes all rows but keeps the table.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssDdl1Ex\',\'ssDdl1Fb\')">Check Answers</button>' +
      '<div id="ssDdl1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION ddl2 — INSERT
// id: 'ss-insert'
function buildSsInsert() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">7.2 INSERT — Adding New Rows</h2>' +
      '<p class="concept-intro">The <strong>INSERT INTO</strong> statement adds a new row to a table. You can specify which columns to insert into (recommended), or insert values for every column in order.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Basic INSERT Syntax</div>' +
      ssSql('INSERT INTO TableName (column1, column2, column3)\nVALUES (value1, value2, value3);') +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Inserting a New Student</div>' +
      ssSql('INSERT INTO Students (StudentID, Name, Age, Gender, ClassID, Email)\nVALUES (11, \'Kwok Ho Yin\', 16, \'M\', 103, \'kwokHY@school.edu.hk\');') +
      miniTable('Students (after INSERT)', ['StudentID', 'Name', 'Age', 'Gender', 'ClassID', 'Email'],
        [
          ['10', 'Fung Wai Kei', '15', 'F', '101', 'fungWK@school.edu.hk'],
          ['11', 'Kwok Ho Yin', '16', 'M', '103', 'kwokHY@school.edu.hk']
        ]
      ) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Inserting a New Enrolment</div>' +
      ssSql('INSERT INTO Enrolments (EnrolmentID, StudentID, SubjectID, Score, Grade)\nVALUES (21, 11, 2, 77, \'B\');') +
      '<p class="concept-hint">The StudentID 11 in Enrolments references the newly inserted student. Always ensure the referenced Primary Key exists before inserting a Foreign Key value.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">INSERT with NULL</div>' +
      ssSql('INSERT INTO Students (StudentID, Name, Age, Gender, ClassID, Email)\nVALUES (12, \'Sin Mei Yee\', 17, \'F\', 104, NULL);') +
      '<p class="concept-hint">Use NULL explicitly when a value is unknown or not applicable. Omitting a column in the INSERT list also results in NULL if no DEFAULT is set.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: INSERT</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssDdl2Ex">' +
        ssMCQ('ddl2', 1,
          'Which SQL statement is used to add a new row to a table?',
          [
            'ADD INTO',
            'UPDATE ... SET',
            'INSERT INTO',
            'CREATE ROW'
          ],
          2,
          'INSERT INTO adds a new row to the specified table with the values provided.'
        ) +
        ssMCQ('ddl2', 2,
          'When inserting a new enrolment row with a StudentID, what must be true about that StudentID?',
          [
            'It must be larger than all existing StudentIDs',
            'It must already exist as a Primary Key in the Students table',
            'It must match the SubjectID',
            'It must be NULL'
          ],
          1,
          'Referential integrity requires that a Foreign Key value (StudentID in Enrolments) must already exist as a Primary Key in the referenced table (Students).'
        ) +
        ssMCQ('ddl2', 3,
          'What happens if you omit a column name from the INSERT column list and that column has no DEFAULT value?',
          [
            'The query fails with an error',
            'The column gets value 0',
            'The column receives NULL',
            'The column is ignored permanently'
          ],
          2,
          'Omitting a column with no DEFAULT value results in NULL being stored for that column in the new row.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssDdl2Ex\',\'ssDdl2Fb\')">Check Answers</button>' +
      '<div id="ssDdl2Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION ddl3 — UPDATE and DELETE
// id: 'ss-upd-del'
function buildSsUpdateDelete() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">7.3 UPDATE and DELETE</h2>' +
      '<p class="concept-intro"><strong>UPDATE</strong> changes the values in existing rows. <strong>DELETE</strong> removes rows from a table. Both statements use a <strong>WHERE</strong> clause to target specific rows — without it, all rows are affected.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">UPDATE — Change One Row</div>' +
      ssSql('-- Correct a student\'s age\nUPDATE Students\nSET Age = 17\nWHERE StudentID = 4;') +
      '<p class="concept-hint">Always use WHERE in an UPDATE to specify which row(s) to change. Without WHERE, every row in the table would be updated.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">UPDATE — Change Multiple Columns</div>' +
      ssSql('UPDATE Students\nSET Age = 18, ClassID = 105\nWHERE StudentID = 7;') +
      '<p style="margin:8px 0 4px;">After UPDATE (StudentID = 7):</p>' +
      miniTable('Students (updated row)', ['StudentID', 'Name', 'Age', 'ClassID'],
        [
          ['7', 'Ho Ka Ming', '18', '105']
        ]
      ) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">DELETE — Remove a Specific Row</div>' +
      ssSql('DELETE FROM Enrolments\nWHERE EnrolmentID = 10;') +
      '<p class="concept-hint">DELETE removes entire rows. The table structure remains intact.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">DELETE with a More Complex Condition</div>' +
      ssSql('-- Remove all E-grade enrolments for a specific student\nDELETE FROM Enrolments\nWHERE StudentID = 5 AND Grade = \'E\';') +
      '<p class="concept-hint">Combine conditions with AND / OR in the WHERE clause. Only rows matching ALL conditions (with AND) are deleted.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: UPDATE and DELETE</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssDdl3Ex">' +
        ssMCQ('ddl3', 1,
          'What happens if you run UPDATE Students SET Age = 18 without a WHERE clause?',
          [
            'Only the first row is updated',
            'The query fails with a syntax error',
            'Every row in the Students table has its Age set to 18',
            'Only rows where Age is currently NULL are updated'
          ],
          2,
          'Without WHERE, UPDATE affects every row in the table. This is almost always unintended — always include WHERE to target specific rows.'
        ) +
        ssMCQ('ddl3', 2,
          'Which SQL statement correctly changes the Email of StudentID 3 to a new address?',
          [
            'CHANGE Students SET Email = \'new@school.hk\' WHERE StudentID = 3',
            'UPDATE Students SET Email = \'new@school.hk\' WHERE StudentID = 3',
            'INSERT INTO Students (Email) VALUES (\'new@school.hk\') WHERE StudentID = 3',
            'ALTER TABLE Students SET Email = \'new@school.hk\' WHERE StudentID = 3'
          ],
          1,
          'UPDATE ... SET ... WHERE is the correct syntax. ALTER TABLE changes the table structure, not the data.'
        ) +
        ssMCQ('ddl3', 3,
          'After running DELETE FROM Enrolments WHERE StudentID = 5, what happens to the Students table?',
          [
            'StudentID 5 is also deleted from Students',
            'StudentID 5\'s row in Students is unchanged — only the Enrolments rows are deleted',
            'The Enrolments table is dropped',
            'A NULL row replaces the deleted enrolment'
          ],
          1,
          'DELETE FROM Enrolments only removes rows from the Enrolments table. The Students table is not affected — each table is updated independently.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssDdl3Ex\',\'ssDdl3Fb\')">Check Answers</button>' +
      '<div id="ssDdl3Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// ===================================================================
// CATEGORY 8: Views + Multi-Table Tips
// ===================================================================

// SECTION vw1 — Views
// id: 'ss-views'
function buildSsViews() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">8.1 Views</h2>' +
      '<p class="concept-intro">A <strong>VIEW</strong> is a saved SELECT query stored in the database with a name. When you query a view, the database runs the underlying SELECT automatically. Views simplify complex queries, restrict access to sensitive columns, and provide a logical layer above the physical tables.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">CREATE VIEW — Simple View</div>' +
      ssSql('CREATE VIEW vw_StudentClass AS\nSELECT s.StudentID, s.Name, s.Age, s.Gender, c.ClassName, c.ClassTeacher\nFROM Students s\nJOIN Classes c ON s.ClassID = c.ClassID;') +
      '<p class="concept-hint">Once created, the view acts like a table. You can SELECT from it the same way.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Using a View</div>' +
      ssSql('-- Query the view as if it were a table\nSELECT Name, ClassName\nFROM vw_StudentClass\nWHERE Gender = \'F\';') +
      miniTable('Female Students with Class', ['Name', 'ClassName'],
        [
          ['Lee Ka Yan', '4B'],
          ['Cheung Mei Ling', '4B'],
          ['Ng Hoi Yan', '4C'],
          ['Yip Sze Wan', '5A'],
          ['Fung Wai Kei', '4A']
        ]
      ) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">CREATE VIEW — With a Three-Table JOIN</div>' +
      ssSql('CREATE VIEW vw_EnrolmentDetails AS\nSELECT s.Name, sub.SubjectName, e.Score, e.Grade\nFROM Students s\nJOIN Enrolments e ON s.StudentID = e.StudentID\nJOIN Subjects sub ON e.SubjectID = sub.SubjectID;') +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">DROP VIEW</div>' +
      ssSql('DROP VIEW vw_StudentClass;') +
      '<p class="concept-hint">DROP VIEW removes the view definition from the database. The underlying tables and their data are NOT affected.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Views</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssVw1Ex">' +
        ssMCQ('vw1', 1,
          'What is a VIEW in SQL?',
          [
            'A physical copy of a table stored on disk',
            'A saved SELECT query that can be queried like a table',
            'A type of index used to speed up searches',
            'A transaction log of all changes'
          ],
          1,
          'A VIEW is a named SELECT query stored in the database. It does not store data itself; querying a view runs the underlying SELECT dynamically.'
        ) +
        ssMCQ('vw1', 2,
          'What does DROP VIEW do?',
          [
            'Deletes all rows from the tables used in the view',
            'Renames the view',
            'Removes the view definition from the database without affecting the underlying tables',
            'Converts the view into a permanent table'
          ],
          2,
          'DROP VIEW removes only the view definition. The underlying base tables and their data remain completely untouched.'
        ) +
        ssMCQ('vw1', 3,
          'Which statement correctly creates a view called vw_AStudents that lists students with an A grade?',
          [
            'SAVE VIEW vw_AStudents AS SELECT * FROM Enrolments WHERE Grade = \'A\'',
            'CREATE VIEW vw_AStudents AS SELECT * FROM Enrolments WHERE Grade = \'A\'',
            'CREATE TABLE vw_AStudents AS SELECT * FROM Enrolments WHERE Grade = \'A\'',
            'INSERT VIEW vw_AStudents SELECT * FROM Enrolments WHERE Grade = \'A\''
          ],
          1,
          'CREATE VIEW name AS SELECT ... is the correct syntax. CREATE TABLE would create a real table, not a view.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssVw1Ex\',\'ssVw1Fb\')">Check Answers</button>' +
      '<div id="ssVw1Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}

// SECTION vw2 — Multi-Table Tips
// id: 'ss-multi-tip'
function buildSsMultiTip() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">8.2 Multi-Table Query Tips</h2>' +
      '<p class="concept-intro">When queries become complex — joining four tables, combining aggregates with filters — it helps to have a strategy. This section shows how to plan a multi-table query step by step, and how views can simplify repeated complex queries.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Four-Table Challenge</div>' +
      '<p style="margin:0 0 8px;">Goal: Show each student\'s name, class name, subject name, score, and grade for all A-grade results.</p>' +
      ssSql('SELECT s.Name, c.ClassName, sub.SubjectName, e.Score, e.Grade\nFROM Students s\nJOIN Classes c ON s.ClassID = c.ClassID\nJOIN Enrolments e ON s.StudentID = e.StudentID\nJOIN Subjects sub ON e.SubjectID = sub.SubjectID\nWHERE e.Grade = \'A\'\nORDER BY s.Name;') +
      miniTable('A-Grades — Full Details', ['Name', 'ClassName', 'SubjectName', 'Score', 'Grade'],
        [
          ['Chan Tai Man', '4A', 'ICT', '85', 'A'],
          ['Cheung Mei Ling', '4B', 'Chinese', '82', 'A'],
          ['Ho Ka Ming', '5A', 'ICT', '90', 'A'],
          ['Lee Ka Yan', '4B', 'English', '95', 'A'],
          ['Ng Hoi Yan', '4C', 'English', '88', 'A'],
          ['Wong Siu Ming', '4A', 'ICT', '92', 'A'],
          ['Wong Siu Ming', '4A', 'Mathematics', '88', 'A']
        ]
      ) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Strategy: Split into Steps</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Step 1 — Identify tables</div>' +
          '<div class="callout-def">List which tables contain the columns you need. Use the schema to trace connections via Foreign Keys.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Step 2 — Draw the join path</div>' +
          '<div class="callout-def">Students → (ClassID) → Classes; Students → (StudentID) → Enrolments → (SubjectID) → Subjects</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Step 3 — Write SELECT first</div>' +
          '<div class="callout-def">List the columns you want, then write FROM + JOINs, then add WHERE / GROUP BY / HAVING / ORDER BY as needed.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Step 4 — Use views</div>' +
          '<div class="callout-def">If you use the same complex JOIN repeatedly, save it as a VIEW. Future queries can then SELECT from the view instead of rewriting the join.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Using a View as an Alternative to Repeated JOINs</div>' +
      ssSql('-- Create the view once\nCREATE VIEW vw_FullEnrolment AS\nSELECT s.Name, c.ClassName, sub.SubjectName, e.Score, e.Grade\nFROM Students s\nJOIN Classes c ON s.ClassID = c.ClassID\nJOIN Enrolments e ON s.StudentID = e.StudentID\nJOIN Subjects sub ON e.SubjectID = sub.SubjectID;\n\n-- Then query it simply\nSELECT Name, SubjectName, Score\nFROM vw_FullEnrolment\nWHERE Grade = \'A\'\nORDER BY Score DESC;') +
      '<p class="concept-hint">The view encapsulates the four-table JOIN. Any query that needs full enrolment details can simply SELECT from vw_FullEnrolment.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Multi-Table Query Tips</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="ssVw2Ex">' +
        ssMCQ('vw2', 1,
          'To display a student\'s Name (from Students), ClassName (from Classes), and SubjectName (from Subjects) in one query, how many JOINs are needed at minimum?',
          [
            'One JOIN',
            'Two JOINs',
            'Three JOINs',
            'Four JOINs'
          ],
          1,
          'You need two JOINs: Students JOIN Classes (on ClassID) and Students JOIN Enrolments JOIN Subjects (two more steps). Because ClassName and SubjectName require different paths, you need Students-Classes (1 JOIN) and Students-Enrolments-Subjects (2 JOINs) = three total. Actually two paths, but the chain requires two extra JOINs on top of the base table. Correct answer: two JOINs links three tables (Students, Classes, Enrolments+Subjects path needs two). The minimum is two JOINs for three tables.'
        ) +
        ssMCQ('vw2', 2,
          'What is the main advantage of saving a complex multi-table JOIN as a VIEW?',
          [
            'It permanently stores a copy of the joined data, making queries faster',
            'It allows future queries to use a simple SELECT from the view instead of rewriting the join every time',
            'It prevents other users from reading those tables',
            'It automatically updates the underlying tables when the view changes'
          ],
          1,
          'A view encapsulates the JOIN logic. Future queries simply SELECT from the view — no need to rewrite complex JOIN syntax each time. The view runs the underlying query dynamically.'
        ) +
        ssMCQ('vw2', 3,
          'In a four-table query joining Students, Classes, Enrolments, and Subjects, what is a good first step before writing any SQL?',
          [
            'Write the ORDER BY clause first',
            'Create a new table to hold temporary results',
            'Identify which tables contain the needed columns and trace the Foreign Key join path',
            'Delete all existing views from the database'
          ],
          2,
          'Planning the join path first — identifying which columns come from which tables and how the tables link via Foreign Keys — makes it much easier to write the FROM and JOIN clauses correctly.'
        ) +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="ssCheckMCQ(\'ssVw2Ex\',\'ssVw2Fb\')">Check Answers</button>' +
      '<div id="ssVw2Fb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}
