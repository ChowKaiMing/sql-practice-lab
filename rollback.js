/* ===== Module 3: Purposes of Rollback — Interactive Module ===== */
/* Based on HKDSE ICT Elective A syllabus notes (3.1–3.8) */

function initRollbackModule() {
  renderRollbackNav();
  showRbSection('rb-what');
}

// ===== NAVIGATION =====
function renderRollbackNav() {
  const nav = document.getElementById('rollbackNav');
  const sections = [
    { id: 'rb-what',     label: '3.1 What is Rollback?',    icon: 'database' },
    { id: 'rb-begin',    label: '3.2 BEGIN Transaction',     icon: 'key' },
    { id: 'rb-update',   label: '3.3 Rollback Wrong UPDATE', icon: 'check' },
    { id: 'rb-delete',   label: '3.4 Rollback Wrong DELETE', icon: 'shield' },
    { id: 'rb-multi',    label: '3.5 Multi-Step Changes',    icon: 'link' },
    { id: 'rb-commit',   label: '3.6 COMMIT to Save',        icon: 'key2' },
    { id: 'rb-best',     label: '3.7 Best Practices',        icon: 'search' },
    { id: 'rb-partial',  label: '3.8 Preventing Partial Updates', icon: 'award' },
  ];

  nav.innerHTML = sections.map(s => `
    <button class="concept-nav-item" data-section="${s.id}">
      ${getNavIcon(s.icon)}
      <span>${s.label}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.concept-nav-item').forEach(btn => {
    btn.addEventListener('click', () => showRbSection(btn.dataset.section));
  });
}

function showRbSection(sectionId) {
  const nav = document.getElementById('rollbackNav');
  nav.querySelectorAll('.concept-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  const content = document.getElementById('rollbackContent');
  const builders = {
    'rb-what':    buildRbWhat,
    'rb-begin':   buildRbBegin,
    'rb-update':  buildRbUpdate,
    'rb-delete':  buildRbDelete,
    'rb-multi':   buildRbMulti,
    'rb-commit':  buildRbCommit,
    'rb-best':    buildRbBest,
    'rb-partial': buildRbPartial,
  };

  content.innerHTML = '';
  if (builders[sectionId]) {
    content.innerHTML = builders[sectionId]();
  }
  content.scrollTop = 0;
}

// ===== HELPERS =====
function rbSql(sql) {
  return '<div class="sql-code-block"><div class="sql-code-header"><span class="sql-code-label">SQL</span></div><pre class="sql-code"><code>' + escapeHTML(sql) + '</code></pre></div>';
}

function rbMCQ(prefix, num, question, options, correctIdx, explanation) {
  const name = 'rb_' + prefix + '_q' + num;
  return '<div class="identify-q" data-correct="' + correctIdx + '" data-explain="' + escapeAttr(explanation || '') + '">' +
    '<div class="identify-q-num">' + num + '</div>' +
    '<div class="identify-q-text">' + question + '</div>' +
    '<div class="identify-q-opts">' +
    options.map(function(opt, i) {
      return '<label class="radio-pill"><input type="radio" name="' + name + '" value="' + i + '"><span>' + opt + '</span></label>';
    }).join('') +
    '</div>' +
    '<div class="identify-q-explain" style="display:none"></div>' +
    '</div>';
}

function rbCheckMCQ(containerId, feedbackId) {
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

// ===== TRANSACTION FLOW DIAGRAM =====
function rbFlowDiagram(steps) {
  var html = '<div class="rb-flow">';
  steps.forEach(function(step, i) {
    html += '<div class="rb-flow-step' + (step.highlight ? ' rb-flow-highlight' : '') + (step.danger ? ' rb-flow-danger' : '') + '">';
    html += '<div class="rb-flow-num">' + (i + 1) + '</div>';
    html += '<div class="rb-flow-content">';
    html += '<div class="rb-flow-label">' + step.label + '</div>';
    if (step.detail) html += '<div class="rb-flow-detail">' + step.detail + '</div>';
    html += '</div></div>';
    if (i < steps.length - 1) {
      html += '<div class="rb-flow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m0 0l-7-7m7 7l7-7"/></svg></div>';
    }
  });
  html += '</div>';
  return html;
}


// ===================================================================
// SECTION 3.1 — What is Rollback?
// ===================================================================
function buildRbWhat() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.1 What is Rollback?</h2>' +
      '<p class="concept-intro">When we use SQL, we often group several changes into one <strong>transaction</strong>. <strong>Rollback</strong> means "cancel this transaction and return the database to the state before it started". If something goes wrong, rollback undoes the changes so the database stays correct and consistent.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Simple View</div>' +
      '<p class="concept-hint">If a database operation is halfway done and there is an error or mistake, rollback "rewinds" the database to the previous correct state.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Example Idea</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Scenario</div>' +
          '<div class="callout-def">We update many ENROLLMENTS rows for exam results and later discover the formula is wrong.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Rollback</div>' +
          '<div class="callout-def">Undo those updates all at once, restoring all original grades.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Why is Rollback Needed?</div>' +
      '<div class="integrity-cards">' +
        '<div class="integrity-card entity-int">' +
          '<div class="integrity-type">Recover from Errors</div>' +
          '<div class="integrity-rule">If wrong data is entered or the wrong records are updated/deleted, rollback can undo those changes.</div>' +
        '</div>' +
        '<div class="integrity-card referential-int">' +
          '<div class="integrity-type">Maintain Integrity</div>' +
          '<div class="integrity-rule">Prevents the database from being left in a "half-changed" state where only some updates finished.</div>' +
        '</div>' +
        '<div class="integrity-card domain-int">' +
          '<div class="integrity-type">Handle Failures</div>' +
          '<div class="integrity-rule">If the system crashes during updates, rollback restores a clean, consistent state.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Understanding Rollback</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbWhatEx">' +
        rbMCQ('31', 1, 'What does rollback do?', ['Saves changes permanently', 'Cancels all changes in the current transaction', 'Deletes the database', 'Creates a new table'], 1, 'Rollback cancels (undoes) all changes made in the current transaction.') +
        rbMCQ('31', 2, 'When is rollback most useful?', ['When all changes are correct', 'When you want to add a new table', 'When a mistake is discovered after making changes', 'When the database is empty'], 2, 'Rollback is most useful when you discover a mistake and need to undo changes.') +
        rbMCQ('31', 3, 'Rollback returns the database to...', ['An empty state', 'The state before the transaction began', 'The state after COMMIT', 'A random previous state'], 1, 'Rollback restores the database to its state before BEGIN TRANSACTION.') +
        rbMCQ('31', 4, 'Which problem does rollback help prevent?', ['Slow queries', 'Partial updates leaving data inconsistent', 'Tables being too large', 'Users accessing the database'], 1, 'Rollback prevents partial updates that would leave data in an inconsistent state.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbWhatEx\',\'rbWhatFb\')">Check Answers</button>' +
      '<div id="rbWhatFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}


// ===================================================================
// SECTION 3.2 — BEGIN Transaction
// ===================================================================
function buildRbBegin() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.2 BEGIN Transaction</h2>' +
      '<p class="concept-intro">A <strong>transaction</strong> is a group of SQL statements treated as a single unit. Use <strong>BEGIN</strong> to start a transaction. Changes made after BEGIN are not permanent until you <strong>COMMIT</strong>. You can cancel them with <strong>ROLLBACK</strong>.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Starting a Transaction</div>' +
      rbSql('BEGIN TRANSACTION;\n-- All changes from here belong to one unit\n-- COMMIT to save, or ROLLBACK to cancel') +
      '<p class="concept-hint">From BEGIN until COMMIT or ROLLBACK: all changes belong to one logical unit of work. We can either save them all (COMMIT) or cancel them all (ROLLBACK).</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Transaction Lifecycle</div>' +
      rbFlowDiagram([
        { label: 'BEGIN TRANSACTION', detail: 'Start the transaction' },
        { label: 'SQL Statements', detail: 'UPDATE, INSERT, DELETE, etc.' },
        { label: 'Check Results', detail: 'Use SELECT to verify changes' },
        { label: 'COMMIT or ROLLBACK', detail: 'Save permanently or cancel everything', highlight: true },
      ]) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Example Scenario</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Goal</div>' +
          '<div class="callout-def">Change the ClassTeacher for all S3 classes and log the changes in another table.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Approach</div>' +
          '<div class="callout-def">Wrap all updates inside one transaction, then decide at the end whether to keep (COMMIT) or cancel (ROLLBACK).</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: BEGIN Transaction</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbBeginEx">' +
        rbMCQ('32', 1, 'What does BEGIN TRANSACTION do?', ['Saves all changes', 'Starts a new group of SQL statements treated as one unit', 'Deletes all data', 'Creates a backup'], 1, 'BEGIN starts a transaction \u2014 a group of statements treated as one unit.') +
        rbMCQ('32', 2, 'After BEGIN, changes are...', ['Permanent immediately', 'Not permanent until COMMIT', 'Automatically rolled back', 'Saved to a file'], 1, 'Changes after BEGIN are temporary until COMMIT makes them permanent.') +
        rbMCQ('32', 3, 'How do you cancel all changes in a transaction?', ['DELETE all rows', 'Use ROLLBACK', 'Close the database', 'Use DROP TABLE'], 1, 'ROLLBACK cancels all changes made since BEGIN.') +
        rbMCQ('32', 4, 'A transaction groups multiple SQL statements so they can be...', ['Run faster', 'Saved or cancelled as one unit', 'Run on different databases', 'Shared with other users'], 1, 'A transaction ensures multiple statements are committed or rolled back together.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbBeginEx\',\'rbBeginFb\')">Check Answers</button>' +
      '<div id="rbBeginFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}


// ===================================================================
// SECTION 3.3 — Rollback a Wrong UPDATE
// ===================================================================
function buildRbUpdate() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.3 Rollback a Wrong UPDATE</h2>' +
      '<p class="concept-intro">If you make a mistake with an UPDATE statement, you can use <strong>ROLLBACK</strong> to undo it. This is especially useful when you accidentally update the wrong records or set incorrect values.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Scenario: Accidental Mass Update</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Intention</div>' +
          '<div class="callout-def">Add 5 marks to ICT students only (WHERE CourseID = \'ICT01\').</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Mistake</div>' +
          '<div class="callout-def">Forgot the WHERE clause \u2014 updated ALL courses, not just ICT.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">The Wrong UPDATE</div>' +
      rbSql('BEGIN TRANSACTION;\n\nUPDATE ENROLLMENTS\nSET GradePoint = GradePoint + 5;\n-- Oops! This affects ALL courses, not only ICT01') +
      '<p class="concept-hint">Without a WHERE clause, every row in ENROLLMENTS is affected \u2014 all subjects get +5 marks, not just ICT.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">The Fix: ROLLBACK</div>' +
      rbSql('-- After noticing the mistake:\nROLLBACK;') +
      rbFlowDiagram([
        { label: 'BEGIN TRANSACTION', detail: 'Transaction started' },
        { label: 'UPDATE all rows', detail: 'Wrong \u2014 no WHERE clause', danger: true },
        { label: 'Notice the mistake', detail: 'GradePoint changed for ALL courses' },
        { label: 'ROLLBACK', detail: 'All changes cancelled \u2014 GradePoints restored', highlight: true },
      ]) +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Rollback Wrong UPDATE</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbUpdateEx">' +
        rbMCQ('33', 1, 'A teacher runs UPDATE ENROLLMENTS SET GradePoint = GradePoint + 5 without a WHERE clause. What happens?', ['Only ICT students are updated', 'All rows in ENROLLMENTS are updated', 'No rows are updated', 'The table is deleted'], 1, 'Without WHERE, UPDATE affects every row in the table.') +
        rbMCQ('33', 2, 'After the wrong UPDATE, what should the teacher do?', ['COMMIT the changes', 'Run DELETE FROM ENROLLMENTS', 'Use ROLLBACK to undo all changes', 'Turn off the computer'], 2, 'ROLLBACK undoes all changes made in the transaction.') +
        rbMCQ('33', 3, 'After ROLLBACK, the GradePoint values are...', ['All increased by 5', 'All set to zero', 'Restored to their original values', 'Deleted'], 2, 'ROLLBACK restores the database to its state before the transaction began.') +
        rbMCQ('33', 4, 'Why is it important to include a WHERE clause in UPDATE?', ['It makes the query run faster', 'It targets only the correct rows instead of all rows', 'It is required by SQL syntax', 'It creates a backup'], 1, 'WHERE filters which rows are affected. Without it, all rows are updated.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbUpdateEx\',\'rbUpdateFb\')">Check Answers</button>' +
      '<div id="rbUpdateFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}


// ===================================================================
// SECTION 3.4 — Rollback a Wrong DELETE
// ===================================================================
function buildRbDelete() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.4 Rollback a Wrong DELETE</h2>' +
      '<p class="concept-intro">DELETE operations are dangerous \u2014 once committed, data is gone. Using transactions with <strong>ROLLBACK</strong> gives you a safety net. If you accidentally delete important records, you can restore them.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Scenario: Accidental DELETE</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Intention</div>' +
          '<div class="callout-def">Delete ENROLLMENTS for graduated students only.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Mistake</div>' +
          '<div class="callout-def">Deleted all ICT enrollments instead due to wrong condition.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">The Wrong DELETE</div>' +
      rbSql("BEGIN TRANSACTION;\n\nDELETE FROM ENROLLMENTS\nWHERE CourseID = 'ICT01';\n-- Wrong! Meant only graduated students, but deleted ALL ICT enrollments") +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">The Fix: ROLLBACK</div>' +
      rbSql('-- Realise the mistake:\nROLLBACK;') +
      '<p class="concept-hint">All ENROLLMENTS rows deleted in this transaction are restored. No permanent data loss from this mistake.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Rollback Wrong DELETE</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbDeleteEx">' +
        rbMCQ('34', 1, 'Why is DELETE considered a dangerous operation?', ['It is slow', 'Once committed, deleted data is gone', 'It changes column names', 'It always affects all tables'], 1, 'DELETE removes rows permanently once committed.') +
        rbMCQ('34', 2, 'A clerk accidentally deletes all ICT enrollments. With a transaction, what can they do?', ['Nothing \u2014 data is lost', 'Use ROLLBACK to restore the deleted rows', 'Use INSERT to guess the data', 'Restart the computer'], 1, 'ROLLBACK restores all rows deleted within the transaction.') +
        rbMCQ('34', 3, 'After ROLLBACK on a wrong DELETE, the deleted rows are...', ['Gone forever', 'Restored as if nothing happened', 'Moved to a backup table', 'Partially restored'], 1, 'ROLLBACK fully restores the database to its pre-transaction state.') +
        rbMCQ('34', 4, 'What is the best practice before running a DELETE?', ['Run it immediately without checking', 'First run a SELECT with the same WHERE to check which rows will be affected', 'Delete all rows then re-insert the correct ones', 'Use DROP TABLE instead'], 1, 'Always SELECT first to verify the WHERE clause targets the correct rows.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbDeleteEx\',\'rbDeleteFb\')">Check Answers</button>' +
      '<div id="rbDeleteFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}


// ===================================================================
// SECTION 3.5 — Rollback Multi-Step Changes
// ===================================================================
function buildRbMulti() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.5 Rollback Multi-Step Changes</h2>' +
      '<p class="concept-intro">When a series of related changes must all succeed or all fail, use a transaction. If any step fails or produces wrong results, <strong>ROLLBACK</strong> undoes <strong>ALL</strong> changes in the transaction.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Scenario: Moving a Student to a New Class</div>' +
      rbSql("BEGIN TRANSACTION;\n\n-- Step 1: Change the student's class\nUPDATE STUDENTS\nSET ClassID = 'C3B'\nWHERE StudentID = 'S010';\n\n-- Step 2: Remove old subject enrollment\nDELETE FROM ENROLLMENTS\nWHERE StudentID = 'S010'\n  AND CourseID = 'MUSIC01';\n\n-- Step 3: Add new subject enrollment\nINSERT INTO ENROLLMENTS (EnrollmentID, StudentID, CourseID, Grade)\nVALUES ('E5001', 'S010', 'SCI01', NULL);") +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">What if Something Goes Wrong?</div>' +
      rbFlowDiagram([
        { label: 'UPDATE student class', detail: 'ClassID changed to C3B' },
        { label: 'DELETE old enrollment', detail: 'MUSIC01 enrollment removed' },
        { label: 'INSERT new enrollment', detail: 'Fails! Duplicate EnrollmentID', danger: true },
        { label: 'ROLLBACK', detail: 'ALL three steps are undone \u2014 database unchanged', highlight: true },
      ]) +
      '<p class="concept-hint">After ROLLBACK: the student\'s ClassID stays as before, the MUSIC01 enrollment is still there, and no SCI01 row was added. The database looks exactly as it did before BEGIN.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Multi-Step Rollback</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbMultiEx">' +
        rbMCQ('35', 1, 'A transaction contains 3 SQL statements. The third one fails. After ROLLBACK, how many changes remain?', ['Only the first two', 'All three', 'None \u2014 all are undone', 'Only the third'], 2, 'ROLLBACK undoes ALL changes in the transaction, not just the failed one.') +
        rbMCQ('35', 2, 'Why should related changes be grouped in one transaction?', ['To make them run faster', 'So they can all be committed or rolled back together', 'Because SQL requires it', 'To use less disk space'], 1, 'Grouping ensures consistency \u2014 all succeed or all fail.') +
        rbMCQ('35', 3, 'In the student transfer example, if we discover we picked the wrong student after step 2, what should we do?', ['COMMIT and fix later', 'ROLLBACK to undo all steps', 'Only undo step 2', 'Delete the student'], 1, 'ROLLBACK undoes all steps, returning to the clean state.') +
        rbMCQ('35', 4, 'The principle that a transaction is "all or nothing" is called...', ['Referential integrity', 'Atomicity', 'Redundancy', 'Normalization'], 1, 'Atomicity means the transaction either completes fully or not at all.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbMultiEx\',\'rbMultiFb\')">Check Answers</button>' +
      '<div id="rbMultiFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}


// ===================================================================
// SECTION 3.6 — COMMIT to Save Changes
// ===================================================================
function buildRbCommit() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.6 COMMIT to Save Changes</h2>' +
      '<p class="concept-intro"><strong>COMMIT</strong> makes all changes in the current transaction permanent. Once committed, changes <strong>cannot</strong> be rolled back. Use COMMIT when you are sure the changes are correct.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">COMMIT vs ROLLBACK</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">COMMIT</div>' +
          '<div class="callout-def">"I am satisfied \u2014 save all changes permanently." Changes are kept even if the database disconnects.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">ROLLBACK</div>' +
          '<div class="callout-def">"Something is wrong \u2014 cancel all changes in this transaction." The database returns to its previous state.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Example: Successful Transaction</div>' +
      rbSql("BEGIN TRANSACTION;\n\nUPDATE CLASSES\nSET ClassTeacher = 'Mr Ho'\nWHERE ClassID = 'C3C';\n\nUPDATE STUDENTS\nSET ClassID = 'C3C'\nWHERE StudentID IN ('S020', 'S021');\n\n-- Everything looks correct\nCOMMIT;") +
      '<p class="concept-hint">After COMMIT: changes to CLASSES and STUDENTS are stored permanently. Even if we disconnect, the database keeps the new class teacher and class assignments.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">What if we used ROLLBACK instead?</div>' +
      '<p class="concept-hint">If we had used ROLLBACK instead of COMMIT, none of these changes would be kept. The class teacher and student assignments would remain unchanged.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: COMMIT and ROLLBACK</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbCommitEx">' +
        rbMCQ('36', 1, 'What does COMMIT do?', ['Cancels all changes', 'Makes all changes in the transaction permanent', 'Starts a new transaction', 'Deletes the transaction log'], 1, 'COMMIT saves all changes permanently.') +
        rbMCQ('36', 2, 'After COMMIT, can you use ROLLBACK to undo the changes?', ['Yes, anytime', 'No \u2014 committed changes are permanent', 'Only within 5 minutes', 'Only if the database is online'], 1, 'Once committed, changes cannot be rolled back.') +
        rbMCQ('36', 3, 'When should you use COMMIT?', ['Immediately after every SQL statement', 'When you are sure the changes are correct', 'Before checking the results', 'Never \u2014 always use ROLLBACK'], 1, 'COMMIT should be used after verifying that all changes are correct.') +
        rbMCQ('36', 4, 'Without COMMIT, what happens to changes if the database closes?', ['They are saved automatically', 'They may be lost', 'They are emailed to the admin', 'They are converted to ROLLBACK'], 1, 'Uncommitted changes may be lost if the session ends.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbCommitEx\',\'rbCommitFb\')">Check Answers</button>' +
      '<div id="rbCommitFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}


// ===================================================================
// SECTION 3.7 — Transaction Safety Best Practices
// ===================================================================
function buildRbBest() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.7 Transaction Safety Best Practices</h2>' +
      '<p class="concept-intro">Rollback supports safe database work. Following best practices helps keep the database consistent and reduces damage from human error.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Four Best Practices</div>' +
      '<div class="integrity-cards">' +
        '<div class="integrity-card entity-int">' +
          '<div class="integrity-type">1. Use Transactions</div>' +
          '<div class="integrity-rule">Always use BEGIN before making important changes (mass promotions, updating many ENROLLMENTS, changing many CLASSES).</div>' +
        '</div>' +
        '<div class="integrity-card referential-int">' +
          '<div class="integrity-type">2. Test with SELECT First</div>' +
          '<div class="integrity-rule">Run a SELECT with the same WHERE condition to check which rows will be affected before running UPDATE or DELETE.</div>' +
        '</div>' +
        '<div class="integrity-card domain-int">' +
          '<div class="integrity-type">3. Check Before COMMIT</div>' +
          '<div class="integrity-rule">Use SELECT and joins to verify data after changes. If anything is wrong, use ROLLBACK instead of COMMIT.</div>' +
        '</div>' +
        '<div class="integrity-card entity-int">' +
          '<div class="integrity-type">4. Group Related Statements</div>' +
          '<div class="integrity-rule">If multiple tables must be consistent (STUDENTS + ENROLLMENTS + CLASSES), put all updates in one transaction.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Safe Workflow Example</div>' +
      rbFlowDiagram([
        { label: 'SELECT to preview', detail: 'Check which rows the WHERE clause matches' },
        { label: 'BEGIN TRANSACTION', detail: 'Start the transaction' },
        { label: 'UPDATE / DELETE / INSERT', detail: 'Make the changes' },
        { label: 'SELECT to verify', detail: 'Check the results look correct' },
        { label: 'COMMIT or ROLLBACK', detail: 'Save if correct, undo if wrong', highlight: true },
      ]) +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Best Practices</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbBestEx">' +
        rbMCQ('37', 1, 'Before running DELETE FROM ENROLLMENTS WHERE CourseID = \'ICT01\', what should you do first?', ['Run it immediately', 'Run SELECT * FROM ENROLLMENTS WHERE CourseID = \'ICT01\' to check which rows match', 'Run COMMIT', 'Turn off the database'], 1, 'Always preview with SELECT using the same WHERE before DELETE.') +
        rbMCQ('37', 2, 'After making changes inside a transaction, what should you do before COMMIT?', ['Close the application', 'Use SELECT and joins to verify the changes are correct', 'Immediately COMMIT', 'Use DROP TABLE'], 1, 'Verify results with SELECT before committing.') +
        rbMCQ('37', 3, 'Why should related changes to STUDENTS, ENROLLMENTS, and CLASSES be in one transaction?', ['To run faster', 'So they can be rolled back together if something is wrong', 'Because SQL requires it', 'To save disk space'], 1, 'Grouping ensures all related changes are committed or rolled back together.') +
        rbMCQ('37', 4, 'What is the purpose of testing with SELECT before UPDATE?', ['To make the UPDATE run faster', 'To verify which rows will be affected by the WHERE clause', 'To create a backup', 'To lock the table'], 1, 'SELECT preview ensures the WHERE clause targets the intended rows.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbBestEx\',\'rbBestFb\')">Check Answers</button>' +
      '<div id="rbBestFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}


// ===================================================================
// SECTION 3.8 — Preventing Partial Updates
// ===================================================================
function buildRbPartial() {
  return '<div class="concept-section">' +
    '<div class="concept-header">' +
      '<h2 class="concept-title">3.8 Preventing Partial Updates</h2>' +
      '<p class="concept-intro">Without transactions, if a multi-step operation fails halfway, you get <strong>partial updates</strong> \u2014 some changes are applied but not others. This leaves data in an <strong>inconsistent state</strong>. Transactions ensure <strong>atomicity</strong>: all changes succeed together, or none are applied.</p>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">What is a Partial Update?</div>' +
      '<div class="concept-callout-grid">' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Scenario</div>' +
          '<div class="callout-def">Enroll all S3 students into ICT01: insert ENROLLMENTS rows, then update COURSES enrollment count.</div>' +
        '</div>' +
        '<div class="concept-callout">' +
          '<div class="callout-term">Crash!</div>' +
          '<div class="callout-def">System crashes after some ENROLLMENTS rows are inserted but before the course count is updated.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">Without Transactions</div>' +
      rbFlowDiagram([
        { label: 'INSERT 15 of 30 enrollment rows', detail: 'Partially done' },
        { label: 'System crash!', detail: 'Operation interrupted', danger: true },
        { label: 'Course count NOT updated', detail: 'COURSES.TotalEnrolled is wrong', danger: true },
        { label: 'Database is inconsistent', detail: 'Some students enrolled, others not. Count is wrong.', danger: true },
      ]) +
    '</div>' +

    '<div class="concept-example">' +
      '<div class="example-label">With Transactions</div>' +
      rbSql("BEGIN TRANSACTION;\n\n-- Insert all enrollment rows\nINSERT INTO ENROLLMENTS (EnrollmentID, StudentID, CourseID, Grade)\nSELECT 'E' || StudentID, StudentID, 'ICT01', NULL\nFROM STUDENTS\nWHERE ClassID LIKE 'C3%';\n\n-- Update course enrollment count\nUPDATE COURSES\nSET TotalEnrolled = TotalEnrolled + 30\nWHERE CourseID = 'ICT01';\n\n-- If system detects failure:\nROLLBACK;\n-- No partial data left!") +
      rbFlowDiagram([
        { label: 'BEGIN TRANSACTION', detail: 'All changes are one unit' },
        { label: 'INSERT enrollments', detail: 'All rows belong to this transaction' },
        { label: 'System crash!', detail: 'Operation interrupted', danger: true },
        { label: 'Automatic ROLLBACK', detail: 'ALL changes undone \u2014 no partial data', highlight: true },
      ]) +
      '<p class="concept-hint">With transactions: either all related changes are made (with COMMIT) or none are made (with ROLLBACK). The database is never left half-updated. This is the "all or nothing" principle called <strong>atomicity</strong>.</p>' +
    '</div>' +

    '<div class="exercise-block">' +
      '<div class="exercise-block-title">Exercise: Preventing Partial Updates</div>' +
      '<p class="exercise-instructions">Choose the best answer for each question.</p>' +
      '<div id="rbPartialEx">' +
        rbMCQ('38', 1, 'A partial update means...', ['All changes were applied', 'Only some of the planned changes were applied', 'No changes were applied', 'Changes were applied twice'], 1, 'A partial update occurs when only some intended changes are completed.') +
        rbMCQ('38', 2, 'Why is a partial update a problem?', ['It uses too much disk space', 'It leaves the database in an inconsistent state', 'It makes queries slower', 'It deletes the transaction log'], 1, 'Partial updates create inconsistencies \u2014 some data is updated, some is not.') +
        rbMCQ('38', 3, 'How do transactions prevent partial updates?', ['By running all statements faster', 'By ensuring all changes succeed together or none are applied', 'By making a copy of the database', 'By locking all tables permanently'], 1, 'Transactions ensure atomicity \u2014 all or nothing.') +
        rbMCQ('38', 4, 'If a system crashes during a transaction, what happens to the changes?', ['They are kept as-is (partial)', 'They are automatically rolled back to prevent inconsistency', 'They are committed automatically', 'They are emailed to the administrator'], 1, 'The database engine automatically rolls back incomplete transactions after a crash.') +
      '</div>' +
      '<button class="btn btn-primary btn-check-answer" onclick="rbCheckMCQ(\'rbPartialEx\',\'rbPartialFb\')">Check Answers</button>' +
      '<div id="rbPartialFb" class="feedback-area"></div>' +
    '</div>' +
  '</div>';
}
