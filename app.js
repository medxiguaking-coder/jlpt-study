// ===== JLPT Study App =====

// ---- State ----
let currentPage = 'home';
let vocabSession = { cards: [], index: 0, flipped: false, ratings: {} };
let grammarSession = { cards: [], index: 0, quizIndex: 0, answered: false, ratings: {} };

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
    cards = SRS.getNewCards(allVocab, newLimit);
  }

  if (cards.length === 0) {
    alert('今天沒有待練習的單字！明天再來吧 😊');
    return;
  }

  vocabSession = { cards, index: 0, flipped: false, ratings: {} };
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
  const { ratings } = vocabSession;
  const counts = { low: 0, medium: 0, high: 0 };
  Object.values(ratings).forEach(r => counts[r]++);

  document.getElementById('vocab-session').classList.add('hidden');
  document.getElementById('vocab-complete').classList.remove('hidden');
  document.getElementById('vocab-complete-stats').innerHTML = `
    <div class="complete-row"><span>完成單字數</span><span>${Object.keys(ratings).length}</span></div>
    <div class="complete-row"><span>😊 熟悉</span><span style="color:var(--high)">${counts.high}</span></div>
    <div class="complete-row"><span>🤔 普通</span><span style="color:var(--medium)">${counts.medium}</span></div>
    <div class="complete-row"><span>😅 不熟</span><span style="color:var(--low)">${counts.low}</span></div>
  `;
}

function exitVocabSession() {
  showVocabMenu();
  renderVocabMenu();
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

  const feedback = document.getElementById('quiz-feedback');

  if (selected === answer) {
    btn.classList.add('correct');
    feedback.textContent = '✅ 正確！';
    feedback.className = 'quiz-feedback correct-fb';
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => {
      if (b.textContent === answer) b.classList.add('correct');
    });
    const filled = sentence.replace('___', answer);
    feedback.textContent = `❌ 正確答案：${answer}　→「${filled}」`;
    feedback.className = 'quiz-feedback wrong-fb';
  }

  // Add next button
  const grammar = getGrammarById(grammarSession.cards[grammarSession.index]);
  const hasMore = grammarSession.quizIndex < grammar.choices.length - 1;

  feedback.innerHTML += `<button class="next-quiz-btn" onclick="${hasMore ? 'nextQuiz()' : 'showGrammarRating()'}">${hasMore ? '下一題 →' : '評分 →'}</button>`;
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
  // Update vocab/grammar counts on home page too
  const allVocab = getAllVocabIds();
  const allGrammar = getAllGrammarIds();
  const plan = SRS.getTodayPlan(allVocab, allGrammar);
});
