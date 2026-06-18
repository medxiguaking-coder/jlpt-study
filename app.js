// ===== JLPT Study App =====

// ---- State ----
let currentPage = 'home';
let vocabSession = { cards: [], index: 0, flipped: false, ratings: {} };
let vocabExtraOffset = 0;
let grammarSession = { cards: [], index: 0, quizIndex: 0, answered: false, ratings: {} };
let vocabQuiz = { questions: [], index: 0, score: 0, answered: false };
let comparisonQuiz = { questions: [], index: 0, score: 0, answered: false };

// ---- Navigation ----
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  currentPage = page;
  if (page === 'home') renderHome();
  if (page === 'vocab') renderVocabMenu();
  if (page === 'grammar') renderGrammarMenu();
  if (page === 'stats') renderStats();
  if (page === 'keigo') renderKeigoMenu();
}

// ---- Data Helpers ----
function getAllVocabIds(level) {
  return VOCAB_DATA
    .filter(v => !level || level === 'all' || v.level === level)
    .map(v => v.id);
}
function getAllGrammarIds(level) {
  return GRAMMAR_DATA
    .filter(g => !level || level === 'all' || g.level === level)
    .map(g => g.id);
}
function getVocabById(id) { return VOCAB_DATA.find(v => v.id === id); }
function getGrammarById(id) { return GRAMMAR_DATA.find(g => g.id === id); }

// ---- Home ----
function renderHome() {
  const now = new Date();
  document.getElementById('today-date').textContent = now.toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  });

  const allVocab = getAllVocabIds('all');
  const allGrammar = getAllGrammarIds('all');
  const plan = SRS.getTodayPlan(allVocab, allGrammar);

  const totalVocab = plan.vocab.due.length + plan.vocab.new.length;
  const totalGrammar = plan.grammar.due.length + plan.grammar.new.length;

  document.getElementById('daily-plan-card').innerHTML = `
    <div class="plan-title">📅 今日學習計畫</div>
    <div class="plan-items">
      <div class="plan-item">
        <div class="plan-item-num">${totalVocab}</div>
        <div class="plan-item-label">單字</div>
        <div class="plan-item-sub">複習 ${plan.vocab.due.length} ＋ 新 ${plan.vocab.new.length}</div>
      </div>
      <div class="plan-item">
        <div class="plan-item-num grammar-num">${totalGrammar}</div>
        <div class="plan-item-label">文法</div>
        <div class="plan-item-sub">複習 ${plan.grammar.due.length} ＋ 新 ${plan.grammar.new.length}</div>
      </div>
    </div>
  `;

  document.getElementById('vocab-count-home').textContent = `${totalVocab} 個單字待學習`;
  document.getElementById('grammar-count-home').textContent = `${totalGrammar} 個文法待學習`;

  // Streak
  const streak = getStreak();
  document.getElementById('streak-num').textContent = streak;

  // Mini progress
  const stats = SRS.getStats(allVocab, allGrammar);
  const vPct = stats.vocabTotal ? Math.round(stats.vocabIntroduced / stats.vocabTotal * 100) : 0;
  const gPct = stats.grammarTotal ? Math.round(stats.grammarIntroduced / stats.grammarTotal * 100) : 0;
  document.getElementById('mini-vocab-fill').style.width = vPct + '%';
  document.getElementById('mini-grammar-fill').style.width = gPct + '%';
  document.getElementById('mini-vocab-text').textContent = `單字 ${vPct}%`;
  document.getElementById('mini-grammar-text').textContent = `文法 ${gPct}%`;
}

function getStreak() {
  const raw = localStorage.getItem('jlpt_streak');
  if (!raw) return 0;
  const { count, lastDate } = JSON.parse(raw);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastDate === today || lastDate === yesterday) return count;
  return 0;
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const raw = localStorage.getItem('jlpt_streak');
  if (!raw) {
    localStorage.setItem('jlpt_streak', JSON.stringify({ count: 1, lastDate: today }));
    return;
  }
  const { count, lastDate } = JSON.parse(raw);
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastDate === today) return;
  if (lastDate === yesterday) {
    localStorage.setItem('jlpt_streak', JSON.stringify({ count: count + 1, lastDate: today }));
  } else {
    localStorage.setItem('jlpt_streak', JSON.stringify({ count: 1, lastDate: today }));
  }
}

// ---- Vocab Menu ----
function renderVocabMenu() {
  const level = document.getElementById('vocab-level-filter').value;
  const allVocab = getAllVocabIds(level === 'all' ? undefined : level);
  const plan = SRS.getTodayPlan(getAllVocabIds(), getAllGrammarIds());

  const levelVocab = level === 'all' ? allVocab : getAllVocabIds(level);
  const due = SRS.getDueCards(levelVocab);
  const newCards = SRS.getNewCards(levelVocab, 999);
  const settings = SRS.loadSettings();
  const newLimit = settings.dailyVocab;

  document.getElementById('due-vocab-count').textContent = `${due.length} 個待複習`;
  document.getElementById('new-vocab-count').textContent = `${Math.min(newCards.length, newLimit)} 個新單字`;
  document.getElementById('all-vocab-count').textContent = `共 ${Math.min(due.length + newLimit, due.length + newCards.length)} 個`;

  showVocabMenu();
}

function updateVocabCounts() { renderVocabMenu(); }

function showVocabMenu() {
  document.getElementById('vocab-menu').classList.remove('hidden');
  document.getElementById('vocab-session').classList.add('hidden');
  document.getElementById('vocab-complete').classList.add('hidden');
}

// ---- Vocab Session ----
function startVocabSession(type) {
  const level = document.getElementById('vocab-level-filter').value;
  const levelFilter = level === 'all' ? undefined : level;
  const allVocab = getAllVocabIds(levelFilter);
  const settings = SRS.loadSettings();
  const newLimit = settings.dailyVocab;

  let cards = [];
  if (!type || type === 'all') {
    const due = SRS.getDueCards(allVocab);
    const newCards = SRS.getNewCards(allVocab, newLimit);
    cards = shuffle([...due, ...newCards]);
  } else if (type === 'review') {
    cards = shuffle(SRS.getDueCards(allVocab));
  } else if (type === 'new') {
    cards = SRS.getNewCards(allVocab, vocabExtraOffset + newLimit).slice(vocabExtraOffset);
  }

  if (cards.length === 0) {
    if (type === 'new') {
      alert('所有單字都已經學過囉！太棒了 🎉');
    } else {
      alert('今天沒有待練習的單字！明天再來吧 😊');
    }
    return;
  }

  vocabSession = { cards, index: 0, flipped: false, ratings: {}, type };
  document.getElementById('vocab-menu').classList.add('hidden');
  document.getElementById('vocab-complete').classList.add('hidden');
  document.getElementById('vocab-session').classList.remove('hidden');
  renderVocabCard();
}

function renderVocabCard() {
  const { cards, index } = vocabSession;
  if (index >= cards.length) {
    finishVocabSession();
    return;
  }

  const vocab = getVocabById(cards[index]);
  if (!vocab) { vocabSession.index++; renderVocabCard(); return; }

  document.getElementById('session-current').textContent = index + 1;
  document.getElementById('session-total').textContent = cards.length;
  document.getElementById('session-progress-bar').style.width = (index / cards.length * 100) + '%';

  const badge = document.getElementById('session-level-badge');
  badge.textContent = vocab.level;
  badge.className = 'session-level-badge' + (vocab.level === 'N1' ? ' n1' : '');

  // Front
  document.getElementById('card-word').textContent = vocab.word;
  document.getElementById('card-reading').textContent = vocab.reading;

  // Back
  document.getElementById('card-meaning').textContent = vocab.meaning;
  document.getElementById('card-pos').textContent = vocab.pos || '';
  document.getElementById('card-sentences').innerHTML = vocab.sentences.map(s => `
    <div class="sentence-item">
      <div class="sentence-ja">${s.ja}</div>
      <div class="sentence-zh">${s.zh}</div>
    </div>
  `).join('');

  // Reset flip state
  vocabSession.flipped = false;
  document.getElementById('card-front').classList.remove('hidden');
  document.getElementById('card-back').classList.add('hidden');
  document.getElementById('rating-panel').classList.add('hidden');

  // Card flip animation
  const card = document.getElementById('flashcard');
  card.classList.remove('card-flip');
  void card.offsetWidth;
  card.classList.add('card-flip');
}

function flipCard() {
  if (vocabSession.flipped) return;
  vocabSession.flipped = true;
  document.getElementById('card-front').classList.add('hidden');
  document.getElementById('card-back').classList.remove('hidden');
  document.getElementById('rating-panel').classList.remove('hidden');
}

function rateCard(rating) {
  const { cards, index } = vocabSession;
  const id = cards[index];
  SRS.updateCard(id, rating);
  vocabSession.ratings[id] = rating;
  vocabSession.index++;
  updateStreak();
  renderVocabCard();
}

function finishVocabSession() {
  const { ratings, type } = vocabSession;
  const counts = { low: 0, medium: 0, high: 0 };
  Object.values(ratings).forEach(r => counts[r]++);

  if (type === 'new') {
    const settings = SRS.loadSettings();
    vocabExtraOffset += (settings.dailyVocab || 20);
  }

  document.getElementById('vocab-session').classList.add('hidden');
  document.getElementById('vocab-complete').classList.remove('hidden');
  document.getElementById('vocab-complete-stats').innerHTML = `
    <div class="complete-row"><span>完成單字數</span><span>${Object.keys(ratings).length}</span></div>
    <div class="complete-row"><span>😊 熟悉</span><span style="color:var(--high)">${counts.high}</span></div>
    <div class="complete-row"><span>🤔 普通</span><span style="color:var(--medium)">${counts.medium}</span></div>
    <div class="complete-row"><span>😅 不熟</span><span style="color:var(--low)">${counts.low}</span></div>
  `;

  const moreBtn = document.getElementById('vocab-more-btn');
  if (moreBtn) {
    moreBtn.classList.toggle('hidden', type !== 'new');
  }
}

function exitVocabSession() {
  showVocabMenu();
  renderVocabMenu();
}

function continueMoreVocab() {
  startVocabSession('new');
}

// ---- Vocab Quiz (漢字読み・語彙選択) ----
function startVocabQuiz() {
  const pool = shuffle([...VOCAB_DATA]).slice(0, 20);
  const questions = pool.map(v => {
    const isReading = Math.random() < 0.5;
    if (isReading) {
      const distractors = shuffle(VOCAB_DATA.filter(x => x.id !== v.id && x.reading !== v.reading))
        .slice(0, 3).map(x => x.reading);
      const options = shuffle([v.reading, ...distractors]);
      return { prompt: '選出正確的讀音', word: v.word, options, answer: v.reading, vocab: v };
    } else {
      const distractors = shuffle(VOCAB_DATA.filter(x => x.id !== v.id && x.meaning !== v.meaning))
        .slice(0, 3).map(x => x.meaning);
      const options = shuffle([v.meaning, ...distractors]);
      return { prompt: '選出正確的意思', word: `${v.word}（${v.reading}）`, options, answer: v.meaning, vocab: v };
    }
  });

  vocabQuiz = { questions, index: 0, score: 0, answered: false };
  document.getElementById('vocab-menu').classList.add('hidden');
  document.getElementById('vocab-complete').classList.add('hidden');
  document.getElementById('vocab-quiz-complete').classList.add('hidden');
  document.getElementById('vocab-quiz-session').classList.remove('hidden');
  renderVocabQuiz();
}

function renderVocabQuiz() {
  const { questions, index } = vocabQuiz;
  if (index >= questions.length) { finishVocabQuiz(); return; }

  const q = questions[index];
  document.getElementById('vq-current').textContent = index + 1;
  document.getElementById('vq-total').textContent = questions.length;
  document.getElementById('vq-progress-bar').style.width = (index / questions.length * 100) + '%';
  document.getElementById('vq-prompt').textContent = q.prompt;
  document.getElementById('vq-word').textContent = q.word;

  vocabQuiz.answered = false;
  const feedback = document.getElementById('vq-feedback');
  feedback.className = 'quiz-feedback hidden';
  feedback.textContent = '';

  const opts = shuffle([...q.options]);
  document.getElementById('vq-options').innerHTML = opts.map(o => `
    <button class="quiz-option" onclick="selectVocabQuizOption(this, '${escapeAttr(o)}', '${escapeAttr(q.answer)}')">${o}</button>
  `).join('');
}

function selectVocabQuizOption(btn, selected, answer) {
  if (vocabQuiz.answered) return;
  vocabQuiz.answered = true;

  const allBtns = document.querySelectorAll('#vq-options .quiz-option');
  allBtns.forEach(b => b.classList.add('disabled'));

  const q = vocabQuiz.questions[vocabQuiz.index];
  const isCorrect = selected === answer;

  if (isCorrect) {
    btn.classList.add('correct');
    vocabQuiz.score++;
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (b.textContent === answer) b.classList.add('correct'); });
  }

  const v = q.vocab;
  const hasMore = vocabQuiz.index < vocabQuiz.questions.length - 1;
  const feedback = document.getElementById('vq-feedback');
  feedback.className = `quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
  feedback.innerHTML = `
    <div class="fb-result">${isCorrect ? '✅ 正確！' : '❌ 正確答案：' + answer}</div>
    <div class="fb-filled">${v.word}（${v.reading}） — ${v.meaning}</div>
    <button class="next-quiz-btn" onclick="nextVocabQuiz()">${hasMore ? '下一題 →' : '查看結果 →'}</button>
  `;
}

function nextVocabQuiz() {
  vocabQuiz.index++;
  renderVocabQuiz();
}

function finishVocabQuiz() {
  document.getElementById('vocab-quiz-session').classList.add('hidden');
  document.getElementById('vocab-quiz-complete').classList.remove('hidden');
  const { questions, score } = vocabQuiz;
  const pct = questions.length ? Math.round(score / questions.length * 100) : 0;
  document.getElementById('vocab-quiz-complete-stats').innerHTML = `
    <div class="complete-row"><span>總題數</span><span>${questions.length}</span></div>
    <div class="complete-row"><span>答對</span><span style="color:var(--high)">${score}</span></div>
    <div class="complete-row"><span>正確率</span><span>${pct}%</span></div>
  `;
}

function exitVocabQuiz() {
  document.getElementById('vocab-quiz-session').classList.add('hidden');
  document.getElementById('vocab-quiz-complete').classList.add('hidden');
  showVocabMenu();
  renderVocabMenu();
}

// ---- Grammar Comparison (近義文法比較) ----
function startGrammarComparison() {
  const questions = shuffle([...GRAMMAR_COMPARE]);
  comparisonQuiz = { questions, index: 0, score: 0, answered: false };
  document.getElementById('grammar-menu').classList.add('hidden');
  document.getElementById('grammar-complete').classList.add('hidden');
  document.getElementById('grammar-comparison-complete').classList.add('hidden');
  document.getElementById('grammar-comparison-session').classList.remove('hidden');
  renderComparisonQuiz();
}

function renderComparisonQuiz() {
  const { questions, index } = comparisonQuiz;
  if (index >= questions.length) { finishGrammarComparison(); return; }

  const q = questions[index];
  document.getElementById('cmp-current').textContent = index + 1;
  document.getElementById('cmp-total').textContent = questions.length;
  document.getElementById('cmp-progress-bar').style.width = (index / questions.length * 100) + '%';
  document.getElementById('cmp-sentence').innerHTML = formatSentence(q.sentence);
  document.getElementById('cmp-translation').textContent = q.translation || '';

  comparisonQuiz.answered = false;
  const feedback = document.getElementById('cmp-feedback');
  feedback.className = 'quiz-feedback hidden';
  feedback.textContent = '';

  const opts = shuffle([...q.options]);
  document.getElementById('cmp-options').innerHTML = opts.map(o => `
    <button class="quiz-option" onclick="selectComparisonOption(this, '${escapeAttr(o)}', '${escapeAttr(q.answer)}')">${o}</button>
  `).join('');
}

function selectComparisonOption(btn, selected, answer) {
  if (comparisonQuiz.answered) return;
  comparisonQuiz.answered = true;

  const allBtns = document.querySelectorAll('#cmp-options .quiz-option');
  allBtns.forEach(b => b.classList.add('disabled'));

  const q = comparisonQuiz.questions[comparisonQuiz.index];
  const isCorrect = selected === answer;

  if (isCorrect) {
    btn.classList.add('correct');
    comparisonQuiz.score++;
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (b.textContent === answer) b.classList.add('correct'); });
  }

  const filled = q.sentence.replace('___', `【${answer}】`);
  const hasMore = comparisonQuiz.index < comparisonQuiz.questions.length - 1;
  const feedback = document.getElementById('cmp-feedback');
  feedback.className = `quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
  feedback.innerHTML = `
    <div class="fb-result">${isCorrect ? '✅ 正確！' : '❌ 正確答案：' + answer}</div>
    <div class="fb-filled">${filled}</div>
    <div class="fb-explanation">
      <div class="fb-exp-title">📖 辨析說明</div>
      <div class="fb-exp-text">${q.explanation}</div>
    </div>
    <button class="next-quiz-btn" onclick="nextComparisonQuiz()">${hasMore ? '下一題 →' : '查看結果 →'}</button>
  `;
}

function nextComparisonQuiz() {
  comparisonQuiz.index++;
  renderComparisonQuiz();
}

function finishGrammarComparison() {
  document.getElementById('grammar-comparison-session').classList.add('hidden');
  document.getElementById('grammar-comparison-complete').classList.remove('hidden');
  const { questions, score } = comparisonQuiz;
  const pct = questions.length ? Math.round(score / questions.length * 100) : 0;
  document.getElementById('grammar-comparison-complete-stats').innerHTML = `
    <div class="complete-row"><span>總題數</span><span>${questions.length}</span></div>
    <div class="complete-row"><span>答對</span><span style="color:var(--high)">${score}</span></div>
    <div class="complete-row"><span>正確率</span><span>${pct}%</span></div>
  `;
}

function exitGrammarComparison() {
  document.getElementById('grammar-comparison-session').classList.add('hidden');
  document.getElementById('grammar-comparison-complete').classList.add('hidden');
  showGrammarMenu();
  renderGrammarMenu();
}

// ---- Grammar Menu ----
function renderGrammarMenu() {
  const allGrammar = getAllGrammarIds();
  const settings = SRS.loadSettings();
  const due = SRS.getDueCards(allGrammar);
  const newCards = SRS.getNewCards(allGrammar, settings.dailyGrammar);

  document.getElementById('due-grammar-count').textContent = `${due.length} 個待複習`;
  document.getElementById('new-grammar-count').textContent = `${newCards.length} 個新文法`;
  document.getElementById('all-grammar-count').textContent = `共 ${due.length + newCards.length} 個`;
  document.getElementById('comparison-count').textContent = `${GRAMMAR_COMPARE.length} 題辨析練習`;

  showGrammarMenu();
}

function showGrammarMenu() {
  document.getElementById('grammar-menu').classList.remove('hidden');
  document.getElementById('grammar-session').classList.add('hidden');
  document.getElementById('grammar-complete').classList.add('hidden');
}

// ---- Grammar Session ----
function startGrammarSession(type) {
  const allGrammar = getAllGrammarIds();
  const settings = SRS.loadSettings();
  const limit = settings.dailyGrammar;

  let cards = [];
  if (!type || type === 'all') {
    const due = SRS.getDueCards(allGrammar);
    const newCards = SRS.getNewCards(allGrammar, limit);
    cards = shuffle([...due, ...newCards]);
  } else if (type === 'review') {
    cards = shuffle(SRS.getDueCards(allGrammar));
  } else if (type === 'new') {
    cards = SRS.getNewCards(allGrammar, limit);
  }

  if (cards.length === 0) {
    alert('今天沒有待練習的文法！明天再來吧 😊');
    return;
  }

  grammarSession = { cards, index: 0, quizIndex: 0, answered: false, ratings: {} };
  document.getElementById('grammar-menu').classList.add('hidden');
  document.getElementById('grammar-complete').classList.add('hidden');
  document.getElementById('grammar-session').classList.remove('hidden');
  renderGrammarCard();
}

function renderGrammarCard() {
  const { cards, index } = grammarSession;
  if (index >= cards.length) {
    finishGrammarSession();
    return;
  }

  const grammar = getGrammarById(cards[index]);
  if (!grammar) { grammarSession.index++; renderGrammarCard(); return; }

  document.getElementById('g-session-current').textContent = index + 1;
  document.getElementById('g-session-total').textContent = cards.length;
  document.getElementById('g-session-progress-bar').style.width = (index / cards.length * 100) + '%';

  const badge = document.getElementById('g-session-level-badge');
  badge.textContent = grammar.level;
  badge.className = 'session-level-badge' + (grammar.level === 'N1' ? ' n1' : '');

  // Grammar info card
  document.getElementById('g-pattern').textContent = grammar.pattern;
  document.getElementById('g-meaning').textContent = grammar.meaning;
  document.getElementById('g-connection').textContent = grammar.connection;
  document.getElementById('g-explanation').textContent = grammar.explanation;

  // Quiz
  grammarSession.quizIndex = 0;
  grammarSession.answered = false;
  renderQuiz(grammar);

  document.getElementById('grammar-rating').classList.add('hidden');
}

function renderQuiz(grammar) {
  const quiz = grammar.choices[grammarSession.quizIndex];
  if (!quiz) {
    showGrammarRating();
    return;
  }

  document.getElementById('quiz-sentence').innerHTML = formatSentence(quiz.sentence);
  document.getElementById('quiz-translation').textContent = quiz.translation || '';
  document.getElementById('quiz-feedback').className = 'quiz-feedback hidden';
  document.getElementById('quiz-feedback').textContent = '';

  const opts = shuffle([...quiz.options]);
  document.getElementById('quiz-options').innerHTML = opts.map(o => `
    <button class="quiz-option" onclick="selectOption(this, '${escapeAttr(o)}', '${escapeAttr(quiz.answer)}', '${escapeAttr(quiz.sentence)}')">${o}</button>
  `).join('');
}

function formatSentence(sentence) {
  return sentence.replace('___', '<span class="quiz-blank">＿＿＿</span>');
}

function escapeAttr(str) {
  return str.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

function selectOption(btn, selected, answer, sentence) {
  if (grammarSession.answered) return;
  grammarSession.answered = true;

  const allBtns = document.querySelectorAll('.quiz-option');
  allBtns.forEach(b => b.classList.add('disabled'));

  const grammar = getGrammarById(grammarSession.cards[grammarSession.index]);
  const feedback = document.getElementById('quiz-feedback');
  const isCorrect = selected === answer;

  if (isCorrect) {
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => {
      if (b.textContent === answer) b.classList.add('correct');
    });
  }

  const filled = sentence.replace('___', `【${answer}】`);
  const resultIcon = isCorrect ? '✅' : '❌';
  const resultText = isCorrect ? '正確！' : `正確答案：${answer}`;

  const hasMore = grammarSession.quizIndex < grammar.choices.length - 1;

  feedback.className = `quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
  feedback.innerHTML = `
    <div class="fb-result">${resultIcon} ${resultText}</div>
    <div class="fb-filled">${filled}</div>
    <div class="fb-explanation">
      <div class="fb-exp-title">📖 文法詳解</div>
      <div class="fb-pattern">${grammar.pattern}</div>
      <div class="fb-meaning-row"><span class="fb-label">意思：</span>${grammar.meaning}</div>
      <div class="fb-meaning-row"><span class="fb-label">接續：</span>${grammar.connection}</div>
      <div class="fb-exp-text">${grammar.explanation}</div>
    </div>
    ${hasMore ? `<button class="next-quiz-btn" onclick="nextQuiz()">下一題 →</button>` : ''}
  `;

  if (!hasMore) {
    showGrammarRating();
  }
}

function nextQuiz() {
  grammarSession.quizIndex++;
  grammarSession.answered = false;
  const grammar = getGrammarById(grammarSession.cards[grammarSession.index]);
  renderQuiz(grammar);
}

function showGrammarRating() {
  document.getElementById('grammar-rating').classList.remove('hidden');
}

function rateGrammar(rating) {
  const { cards, index } = grammarSession;
  const id = cards[index];
  SRS.updateCard(id, rating);
  grammarSession.ratings[id] = rating;
  grammarSession.index++;
  grammarSession.answered = false;
  updateStreak();
  renderGrammarCard();
}

function finishGrammarSession() {
  const { ratings } = grammarSession;
  const counts = { low: 0, medium: 0, high: 0 };
  Object.values(ratings).forEach(r => counts[r]++);

  document.getElementById('grammar-session').classList.add('hidden');
  document.getElementById('grammar-complete').classList.remove('hidden');
  document.getElementById('grammar-complete-stats').innerHTML = `
    <div class="complete-row"><span>完成文法數</span><span>${Object.keys(ratings).length}</span></div>
    <div class="complete-row"><span>😊 熟悉</span><span style="color:var(--high)">${counts.high}</span></div>
    <div class="complete-row"><span>🤔 普通</span><span style="color:var(--medium)">${counts.medium}</span></div>
    <div class="complete-row"><span>😅 不熟</span><span style="color:var(--low)">${counts.low}</span></div>
  `;
}

function exitGrammarSession() {
  showGrammarMenu();
  renderGrammarMenu();
}

// ---- Stats ----
function renderStats() {
  const allVocab = getAllVocabIds();
  const allGrammar = getAllGrammarIds();
  const stats = SRS.getStats(allVocab, allGrammar);

  const vPct = stats.vocabTotal ? Math.round(stats.vocabMastered / stats.vocabTotal * 100) : 0;
  const gPct = stats.grammarTotal ? Math.round(stats.grammarMastered / stats.grammarTotal * 100) : 0;

  document.getElementById('vocab-pct').textContent = vPct + '%';
  document.getElementById('grammar-pct').textContent = gPct + '%';
  document.getElementById('vocab-intro').textContent = stats.vocabIntroduced;
  document.getElementById('vocab-mastered').textContent = stats.vocabMastered;
  document.getElementById('vocab-total').textContent = stats.vocabTotal;
  document.getElementById('grammar-intro').textContent = stats.grammarIntroduced;
  document.getElementById('grammar-mastered').textContent = stats.grammarMastered;
  document.getElementById('grammar-total').textContent = stats.grammarTotal;

  // SVG circles
  const vOffset = 251.2 * (1 - vPct / 100);
  const gOffset = 251.2 * (1 - gPct / 100);
  document.getElementById('vocab-circle-fill').style.strokeDashoffset = vOffset;
  document.getElementById('grammar-circle-fill').style.strokeDashoffset = gOffset;

  // Level breakdown (vocab only)
  const n2Vocab = getAllVocabIds('N2');
  const n1Vocab = getAllVocabIds('N1');
  const n2Stats = SRS.getStats(n2Vocab, []);
  const n1Stats = SRS.getStats(n1Vocab, []);

  const n2Pct = n2Stats.vocabTotal ? Math.round(n2Stats.vocabIntroduced / n2Stats.vocabTotal * 100) : 0;
  const n1Pct = n1Stats.vocabTotal ? Math.round(n1Stats.vocabIntroduced / n1Stats.vocabTotal * 100) : 0;

  document.getElementById('n2-bar').style.width = n2Pct + '%';
  document.getElementById('n1-bar').style.width = n1Pct + '%';
  document.getElementById('n2-pct').textContent = n2Pct + '%';
  document.getElementById('n1-pct').textContent = n1Pct + '%';

  // Load settings into form
  const settings = SRS.loadSettings();
  document.getElementById('setting-vocab').value = settings.dailyVocab;
  document.getElementById('setting-grammar').value = settings.dailyGrammar;
}

function saveSettings() {
  const settings = SRS.loadSettings();
  settings.dailyVocab = parseInt(document.getElementById('setting-vocab').value) || 20;
  settings.dailyGrammar = parseInt(document.getElementById('setting-grammar').value) || 2;
  SRS.saveSettings(settings);
  // Clear today's plan cache so it regenerates
  const today = new Date().toISOString().split('T')[0];
  localStorage.removeItem('jlpt_plan_' + today);
}

function confirmReset() {
  if (confirm('確定要重置所有學習進度嗎？這個動作無法復原。')) {
    SRS.reset();
    alert('已重置。');
    renderStats();
    renderHome();
  }
}

// ---- Keigo ----
let keigoVerbQuiz = { questions: [], index: 0, score: 0, answered: false };
let keigoSituationQuiz = { questions: [], index: 0, score: 0, answered: false };

function showKeigoMenu() {
  document.getElementById('keigo-menu').classList.remove('hidden');
  document.getElementById('keigo-verb-table').classList.add('hidden');
  document.getElementById('keigo-verb-quiz').classList.add('hidden');
  document.getElementById('keigo-verb-quiz-complete').classList.add('hidden');
  document.getElementById('keigo-situation-quiz').classList.add('hidden');
  document.getElementById('keigo-situation-quiz-complete').classList.add('hidden');
  document.getElementById('keigo-rules-section').classList.add('hidden');
}

function renderKeigoMenu() {
  document.getElementById('keigo-verb-count').textContent = `${KEIGO_VERBS.length} 個動詞對照`;
  document.getElementById('keigo-situation-count').textContent = `${KEIGO_SITUATIONS.length} 道場面題`;
  document.getElementById('keigo-rule-count').textContent = `${KEIGO_RULES.length} 張用法卡片`;
  showKeigoMenu();
}

// ---- Verb Reference Table ----
function showKeigoVerbs() {
  document.getElementById('keigo-menu').classList.add('hidden');
  document.getElementById('keigo-verb-table').classList.remove('hidden');
  renderKeigoVerbList('all');
}

function filterKeigoVerbs(btn, cat) {
  document.querySelectorAll('.keigo-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderKeigoVerbList(cat);
}

function renderKeigoVerbList(cat) {
  const verbs = cat === 'all' ? KEIGO_VERBS : KEIGO_VERBS.filter(v => v.category === cat);
  document.getElementById('keigo-verb-list').innerHTML = verbs.map(v => `
    <div class="keigo-verb-card">
      <div class="keigo-verb-header">
        <span class="keigo-verb-plain">${v.plain}</span>
        <span class="keigo-verb-meaning">${v.meaning_zh}</span>
        <span class="keigo-cat-tag">${v.category}</span>
      </div>
      <div class="keigo-verb-row">
        <span class="keigo-type sonkei">尊敬語</span>
        <span class="keigo-verb-form">${v.sonkei}</span>
      </div>
      <div class="keigo-verb-row">
        <span class="keigo-type kenjou">謙讓語</span>
        <span class="keigo-verb-form">${v.kenjou}</span>
      </div>
      <div class="keigo-verb-row">
        <span class="keigo-type teinei">丁寧語</span>
        <span class="keigo-verb-form">${v.teinei}</span>
      </div>
    </div>
  `).join('');
}

// ---- Verb Quiz ----
function startKeigoVerbQuiz() {
  const types = ['sonkei', 'kenjou'];
  const pool = KEIGO_VERBS.filter(v => v.sonkei !== '—' || v.kenjou !== '—');
  const selected = shuffle([...pool]).slice(0, 15);
  const questions = selected.map(v => {
    const type = types[Math.floor(Math.random() * types.length)];
    const form = type === 'sonkei' ? v.sonkei : v.kenjou;
    const label = type === 'sonkei' ? '尊敬語' : '謙讓語';
    const distractors = shuffle(KEIGO_VERBS.filter(x => x.id !== v.id))
      .slice(0, 3)
      .map(x => type === 'sonkei' ? x.sonkei : x.kenjou);
    const options = shuffle([form, ...distractors]);
    return { verb: v, type, label, answer: form, options };
  });
  keigoVerbQuiz = { questions, index: 0, score: 0, answered: false };
  document.getElementById('keigo-menu').classList.add('hidden');
  document.getElementById('keigo-verb-quiz-complete').classList.add('hidden');
  document.getElementById('keigo-verb-quiz').classList.remove('hidden');
  renderKeigoVerbQuiz();
}

function renderKeigoVerbQuiz() {
  const q = keigoVerbQuiz.questions[keigoVerbQuiz.index];
  if (!q) { finishKeigoVerbQuiz(); return; }
  const pct = (keigoVerbQuiz.index / keigoVerbQuiz.questions.length) * 100;
  document.getElementById('kvq-current').textContent = keigoVerbQuiz.index + 1;
  document.getElementById('kvq-total').textContent = keigoVerbQuiz.questions.length;
  document.getElementById('kvq-progress-bar').style.width = pct + '%';
  document.getElementById('kvq-instruction').textContent = `「${q.verb.plain}」的${q.label}是？`;
  document.getElementById('kvq-word').textContent = `${q.verb.plain}（${q.verb.meaning_zh}）`;
  document.getElementById('kvq-type-badge').textContent = q.label;
  document.getElementById('kvq-type-badge').className = 'keigo-quiz-type-badge ' + q.type;
  keigoVerbQuiz.answered = false;
  document.getElementById('kvq-feedback').classList.add('hidden');
  document.getElementById('kvq-options').innerHTML = q.options.map(opt =>
    `<button class="quiz-option" onclick="selectKeigoVerbOption(this,'${escapeAttr(opt)}','${escapeAttr(q.answer)}')">${opt}</button>`
  ).join('');
}

function selectKeigoVerbOption(btn, selected, answer) {
  if (keigoVerbQuiz.answered) return;
  keigoVerbQuiz.answered = true;
  const q = keigoVerbQuiz.questions[keigoVerbQuiz.index];
  document.querySelectorAll('#kvq-options .quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === answer) b.classList.add('correct');
  });
  const correct = selected === answer;
  if (correct) { keigoVerbQuiz.score++; btn.classList.add('correct'); }
  else btn.classList.add('wrong');
  const fb = document.getElementById('kvq-feedback');
  const isLast = keigoVerbQuiz.index + 1 >= keigoVerbQuiz.questions.length;
  fb.innerHTML = `
    <div class="fb-result ${correct ? 'correct-fb' : 'wrong-fb'}">${correct ? '✓ 正確！' : '✗ 錯誤'}</div>
    <div class="fb-filled">${q.verb.plain} → <strong>${answer}</strong>（${q.label}）</div>
    <div class="fb-explanation"><span class="fb-exp-title">📌 對照</span>
      <span class="fb-exp-text">尊敬語：${q.verb.sonkei}　謙讓語：${q.verb.kenjou}　丁寧語：${q.verb.teinei}</span></div>
    <button class="next-quiz-btn" onclick="nextKeigoVerbQuiz()">${isLast ? '查看結果 →' : '下一題 →'}</button>
  `;
  fb.classList.remove('hidden');
}

function nextKeigoVerbQuiz() {
  keigoVerbQuiz.index++;
  renderKeigoVerbQuiz();
}

function finishKeigoVerbQuiz() {
  document.getElementById('keigo-verb-quiz').classList.add('hidden');
  const el = document.getElementById('keigo-verb-quiz-complete');
  el.classList.remove('hidden');
  const pct = Math.round(keigoVerbQuiz.score / keigoVerbQuiz.questions.length * 100);
  document.getElementById('keigo-verb-quiz-stats').innerHTML = `
    <div class="complete-row"><span>總題數</span><span>${keigoVerbQuiz.questions.length} 題</span></div>
    <div class="complete-row"><span>答對</span><span>${keigoVerbQuiz.score} 題</span></div>
    <div class="complete-row"><span>正確率</span><span>${pct}%</span></div>
  `;
}

function exitKeigoVerbQuiz() {
  document.getElementById('keigo-verb-quiz').classList.add('hidden');
  document.getElementById('keigo-verb-quiz-complete').classList.add('hidden');
  showKeigoMenu();
}

// ---- Situation Quiz ----
function startKeigoSituationQuiz() {
  const questions = shuffle([...KEIGO_SITUATIONS]).slice(0, 15);
  keigoSituationQuiz = { questions, index: 0, score: 0, answered: false };
  document.getElementById('keigo-menu').classList.add('hidden');
  document.getElementById('keigo-situation-quiz-complete').classList.add('hidden');
  document.getElementById('keigo-situation-quiz').classList.remove('hidden');
  renderKeigoSituationQuiz();
}

function renderKeigoSituationQuiz() {
  const q = keigoSituationQuiz.questions[keigoSituationQuiz.index];
  if (!q) { finishKeigoSituationQuiz(); return; }
  const pct = (keigoSituationQuiz.index / keigoSituationQuiz.questions.length) * 100;
  document.getElementById('ksq-current').textContent = keigoSituationQuiz.index + 1;
  document.getElementById('ksq-total').textContent = keigoSituationQuiz.questions.length;
  document.getElementById('ksq-progress-bar').style.width = pct + '%';
  document.getElementById('ksq-scene').textContent = q.scene;
  keigoSituationQuiz.answered = false;
  document.getElementById('ksq-feedback').classList.add('hidden');
  document.getElementById('ksq-options').innerHTML = shuffle([...q.options]).map(opt =>
    `<button class="quiz-option" onclick="selectKeigoSituationOption(this,'${escapeAttr(opt)}','${escapeAttr(q.answer)}')">${opt}</button>`
  ).join('');
}

function selectKeigoSituationOption(btn, selected, answer) {
  if (keigoSituationQuiz.answered) return;
  keigoSituationQuiz.answered = true;
  const q = keigoSituationQuiz.questions[keigoSituationQuiz.index];
  document.querySelectorAll('#ksq-options .quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === answer) b.classList.add('correct');
  });
  const correct = selected === answer;
  if (correct) { keigoSituationQuiz.score++; btn.classList.add('correct'); }
  else btn.classList.add('wrong');
  const fb = document.getElementById('ksq-feedback');
  const isLast = keigoSituationQuiz.index + 1 >= keigoSituationQuiz.questions.length;
  fb.innerHTML = `
    <div class="fb-result ${correct ? 'correct-fb' : 'wrong-fb'}">${correct ? '✓ 正確！' : '✗ 錯誤'}</div>
    <div class="fb-filled"><strong>${answer}</strong></div>
    <div class="fb-explanation"><span class="fb-exp-title">💬 解說</span>
      <span class="fb-exp-text">${q.explanation}</span></div>
    <button class="next-quiz-btn" onclick="nextKeigoSituationQuiz()">${isLast ? '查看結果 →' : '下一題 →'}</button>
  `;
  fb.classList.remove('hidden');
}

function nextKeigoSituationQuiz() {
  keigoSituationQuiz.index++;
  renderKeigoSituationQuiz();
}

function finishKeigoSituationQuiz() {
  document.getElementById('keigo-situation-quiz').classList.add('hidden');
  const el = document.getElementById('keigo-situation-quiz-complete');
  el.classList.remove('hidden');
  const pct = Math.round(keigoSituationQuiz.score / keigoSituationQuiz.questions.length * 100);
  document.getElementById('keigo-situation-quiz-stats').innerHTML = `
    <div class="complete-row"><span>總題數</span><span>${keigoSituationQuiz.questions.length} 題</span></div>
    <div class="complete-row"><span>答對</span><span>${keigoSituationQuiz.score} 題</span></div>
    <div class="complete-row"><span>正確率</span><span>${pct}%</span></div>
  `;
}

function exitKeigoSituationQuiz() {
  document.getElementById('keigo-situation-quiz').classList.add('hidden');
  document.getElementById('keigo-situation-quiz-complete').classList.add('hidden');
  showKeigoMenu();
}

// ---- Rules Cards ----
function showKeigoRules() {
  document.getElementById('keigo-menu').classList.add('hidden');
  document.getElementById('keigo-rules-section').classList.remove('hidden');
  const cats = ['尊敬語', '謙讓語Ⅰ', '謙讓語Ⅱ（丁重語）', '丁寧語', '美化語', '敬語的誤用', '待遇表現'];
  document.getElementById('keigo-rules-list').innerHTML = cats.map(cat => {
    const rules = KEIGO_RULES.filter(r => r.category === cat);
    if (!rules.length) return '';
    return `<div class="keigo-rules-category"><h4 class="keigo-cat-heading">${cat}</h4>` +
      rules.map(r => `
        <div class="keigo-rule-card">
          <div class="keigo-rule-title">${r.title}</div>
          <div class="keigo-rule-pattern">${r.pattern}</div>
          <div class="keigo-rule-example">${r.example}</div>
          <div class="keigo-rule-meaning">${r.meaning_zh}</div>
          <div class="keigo-rule-note">${r.note}</div>
        </div>
      `).join('') + '</div>';
  }).join('');
}

// ---- Utils ----
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---- Init ----
window.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderVocabMenu();
  renderGrammarMenu();
  renderKeigoMenu();
  // Update vocab/grammar counts on home page too
  const allVocab = getAllVocabIds();
  const allGrammar = getAllGrammarIds();
  const plan = SRS.getTodayPlan(allVocab, allGrammar);
});
