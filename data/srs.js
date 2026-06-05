// Spaced Repetition System (SM-2 based)
// Stores state in localStorage

const SRS = {
  STORAGE_KEY: 'jlpt_srs_data',
  SETTINGS_KEY: 'jlpt_settings',
  PROGRESS_KEY: 'jlpt_progress',

  // Load all SRS card data
  load() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  },

  // Save all SRS card data
  save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // Load settings
  loadSettings() {
    const raw = localStorage.getItem(this.SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {
      dailyVocab: 20,
      dailyGrammar: 2,
      startDate: new Date().toISOString().split('T')[0],
      n2First: true,
    };
  },

  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  },

  // Get or create card state for a given ID
  getCard(id) {
    const data = this.load();
    if (!data[id]) {
      data[id] = {
        id,
        interval: 1,        // days until next review
        easeFactor: 2.5,    // SM-2 ease factor
        repetitions: 0,     // number of successful reviews
        nextReview: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        lastRating: null,   // 'low' | 'medium' | 'high'
        totalReviews: 0,
        introduced: false,
      };
      this.save(data);
    }
    return data[id];
  },

  // Update card after review
  // rating: 0=again(low), 3=hard(medium), 5=good(high)
  updateCard(id, rating) {
    const data = this.load();
    const card = this.getCard(id);
    const today = new Date().toISOString().split('T')[0];

    card.totalReviews++;
    card.introduced = true;

    // Convert rating labels to SM-2 quality (0-5)
    const qualityMap = { 'low': 1, 'medium': 3, 'high': 5 };
    const q = typeof rating === 'string' ? qualityMap[rating] : rating;
    card.lastRating = typeof rating === 'string' ? rating : (q >= 4 ? 'high' : q >= 3 ? 'medium' : 'low');

    if (q < 3) {
      // Failed - reset
      card.repetitions = 0;
      card.interval = 1;
    } else {
      // SM-2 algorithm
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetitions++;
    }

    // Update ease factor
    card.easeFactor = Math.max(1.3, card.easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    // Cap interval at 180 days
    card.interval = Math.min(card.interval, 180);

    // Set next review date
    const next = new Date();
    next.setDate(next.getDate() + card.interval);
    card.nextReview = next.toISOString().split('T')[0];

    data[id] = card;
    this.save(data);
    return card;
  },

  // Get cards due today (for review)
  getDueCards(allIds) {
    const today = new Date().toISOString().split('T')[0];
    const data = this.load();
    return allIds.filter(id => {
      const card = data[id];
      if (!card || !card.introduced) return false;
      return card.nextReview <= today;
    });
  },

  // Get new cards not yet introduced
  getNewCards(allIds, limit) {
    const data = this.load();
    return allIds.filter(id => !data[id] || !data[id].introduced).slice(0, limit);
  },

  // Get today's session plan
  getTodayPlan(vocabIds, grammarIds) {
    const settings = this.loadSettings();
    const today = new Date().toISOString().split('T')[0];
    const planKey = 'jlpt_plan_' + today;
    const existing = localStorage.getItem(planKey);
    if (existing) return JSON.parse(existing);

    const dueVocab = this.getDueCards(vocabIds);
    const dueGrammar = this.getDueCards(grammarIds);

    // New cards to introduce today
    const introducedCount = vocabIds.filter(id => {
      const d = this.load()[id];
      return d && d.introduced;
    }).length;

    const newVocabLimit = Math.max(0, settings.dailyVocab - dueVocab.length);
    const newGrammarLimit = Math.max(0, settings.dailyGrammar - dueGrammar.length);

    const newVocab = this.getNewCards(vocabIds, newVocabLimit);
    const newGrammar = this.getNewCards(grammarIds, newGrammarLimit);

    const plan = {
      date: today,
      vocab: { due: dueVocab, new: newVocab },
      grammar: { due: dueGrammar, new: newGrammar },
    };

    localStorage.setItem(planKey, JSON.stringify(plan));
    return plan;
  },

  // Statistics
  getStats(allVocabIds, allGrammarIds) {
    const data = this.load();
    const introduced = id => data[id] && data[id].introduced;
    const mastered = id => data[id] && data[id].interval >= 21 && data[id].lastRating === 'high';

    return {
      vocabTotal: allVocabIds.length,
      vocabIntroduced: allVocabIds.filter(introduced).length,
      vocabMastered: allVocabIds.filter(mastered).length,
      grammarTotal: allGrammarIds.length,
      grammarIntroduced: allGrammarIds.filter(introduced).length,
      grammarMastered: allGrammarIds.filter(mastered).length,
    };
  },

  // Reset all data
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    // Clear plan cache
    Object.keys(localStorage).filter(k => k.startsWith('jlpt_plan_')).forEach(k => localStorage.removeItem(k));
  }
};
