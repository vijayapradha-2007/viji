// Smart Student OS - Core Coordinator
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  activeView: 'dashboard',
  modules: {},

  init() {
    console.log('Smart Student OS initializing...');
    
    // Core cache
    this.sidebar = document.getElementById('app-sidebar');
    this.toggleBtn = document.getElementById('toggle-sidebar');
    this.navItems = document.querySelectorAll('.nav-item');
    this.globalSearch = document.getElementById('global-search');
    
    this.notifTrigger = document.getElementById('notifications-trigger');
    this.notifOverlay = document.getElementById('notifications-overlay');
    this.clearNotifBtn = document.getElementById('clear-notifications');
    this.notifListContainer = document.getElementById('notifications-list-container');
    this.notifBadge = document.getElementById('notif-badge');
    
    // Set up standard profile UI
    this.loadProfile();

    // Event listeners
    this.setupEventListeners();

    // Init specific features (register modules)
    this.initModules();

    // Initial stats and default notifications load
    this.updateGlobalStats();
    this.loadNotifications();
    this.showToast('Smart Student OS initialized. Welcoming user...', 'success');
  },

  setupEventListeners() {
    // Collapse sidebar
    this.toggleBtn.addEventListener('click', () => {
      this.sidebar.classList.toggle('collapsed');
      // Trigger canvas resizing on 3D Dashboard if visible
      setTimeout(() => {
        if (this.activeView === 'dashboard' && this.modules.dashboard3d) {
          this.modules.dashboard3d.resize();
        }
      }, 300);
    });

    // Sidebar navigation clicks
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.getAttribute('data-view');
        this.switchView(targetView);
      });
    });

    // Global Search
    this.globalSearch.addEventListener('input', (e) => {
      this.handleGlobalSearch(e.target.value.trim().toLowerCase());
    });

    // Notifications Tray Trigger
    this.notifTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.notifOverlay.classList.toggle('active');
    });

    // Close notifications panel on outside clicks
    document.addEventListener('click', () => {
      this.notifOverlay.classList.remove('active');
    });
    this.notifOverlay.addEventListener('click', (e) => e.stopPropagation());

    // Clear notifications
    this.clearNotifBtn.addEventListener('click', () => {
      this.clearNotifications();
    });
  },

  switchView(viewName) {
    if (viewName === this.activeView) return;

    // Remove active state from current
    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
    this.navItems.forEach(item => item.classList.remove('active'));

    // Set new active
    const targetViewEl = document.getElementById(`view-${viewName}`);
    const targetNavEl = document.querySelector(`.nav-item[data-view="${viewName}"]`);

    if (targetViewEl) {
      targetViewEl.classList.add('active');
      this.activeView = viewName;
      
      // Highlight Nav
      if (targetNavEl) targetNavEl.classList.add('active');
      
      this.showToast(`Navigated to ${targetViewEl.querySelector('.view-title').innerText}`, 'info');

      // Call module specific lifecycle hooks if available
      if (this.modules[viewName] && typeof this.modules[viewName].onViewActive === 'function') {
        this.modules[viewName].onViewActive();
      }
    }
  },

  initModules() {
    // 3D Dashboard
    if (typeof Dashboard3D !== 'undefined') {
      this.modules.dashboard = Dashboard3D;
      Dashboard3D.init(this);
    }
    // AI Tutor
    if (typeof AITutor !== 'undefined') {
      this.modules.aitutor = AITutor;
      AITutor.init(this);
    }
    // PDF Chat
    if (typeof PDFChat !== 'undefined') {
      this.modules.pdfchat = PDFChat;
      PDFChat.init(this);
    }
    // Smart Notes
    if (typeof NotesModule !== 'undefined') {
      this.modules.notes = NotesModule;
      NotesModule.init(this);
    }
    // AI Quiz
    if (typeof QuizModule !== 'undefined') {
      this.modules.quiz = QuizModule;
      QuizModule.init(this);
    }
    // Flashcards
    if (typeof FlashcardsModule !== 'undefined') {
      this.modules.flashcards = FlashcardsModule;
      FlashcardsModule.init(this);
    }
    // Study Planner
    if (typeof PlannerModule !== 'undefined') {
      this.modules.planner = PlannerModule;
      PlannerModule.init(this);
    }
    // Career Mentor
    if (typeof CareerModule !== 'undefined') {
      this.modules.career = CareerModule;
      CareerModule.init(this);
    }
    // Resume Builder
    if (typeof ResumeModule !== 'undefined') {
      this.modules.resume = ResumeModule;
      ResumeModule.init(this);
    }
    // Voice AI
    if (typeof VoiceModule !== 'undefined') {
      this.modules.voice = VoiceModule;
      VoiceModule.init(this);
    }
    // Roadmaps
    if (typeof RoadmapModule !== 'undefined') {
      this.modules.roadmaps = RoadmapModule;
      RoadmapModule.init(this);
    }
    // Analytics
    if (typeof AnalyticsModule !== 'undefined') {
      this.modules.analytics = AnalyticsModule;
      AnalyticsModule.init(this);
    }
  },

  loadProfile() {
    const profile = Storage.getProfile();
    document.getElementById('profile-name').innerText = profile.name;
    document.getElementById('profile-role').innerText = `${profile.major} • Level ${profile.level}`;
  },

  updateGlobalStats() {
    const notes = Storage.getNotes();
    const tasks = Storage.getTasks();
    const decks = Storage.getDecks();
    const analytics = Storage.getAnalytics();

    // Calculate metrics
    const noteCount = notes.length;
    
    let totalFocusTime = 0;
    let quizSum = 0;
    let quizCount = 0;
    
    analytics.forEach(day => {
      totalFocusTime += day.focusTime;
      if (day.quizAccuracy) {
        quizSum += day.quizAccuracy;
        quizCount++;
      }
    });

    const averageQuizAccuracy = quizCount > 0 ? Math.round(quizSum / quizCount) : 85;

    let dueCount = 0;
    const now = new Date();
    decks.forEach(deck => {
      deck.cards.forEach(card => {
        if (!card.srsDueDate || new Date(card.srsDueDate) <= now) {
          dueCount++;
        }
      });
    });

    // Populate elements
    document.getElementById('stat-focus-time').innerText = `${totalFocusTime}m`;
    document.getElementById('stat-notes-count').innerText = noteCount;
    document.getElementById('stat-quiz-accuracy').innerText = `${averageQuizAccuracy}%`;
    document.getElementById('stat-cards-due').innerText = dueCount;
  },

  // Notification methods
  notifications: [
    { text: 'Study Goal: Finish Linear Algebra review notes.', time: '10m ago' },
    { text: 'Weekly Analytics: Focus hours increased by 15%.', time: '2h ago' },
    { text: 'Career Mentor: New internship leads listed.', time: '1d ago' }
  ],

  loadNotifications() {
    this.notifListContainer.innerHTML = '';
    if (this.notifications.length === 0) {
      this.notifListContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px; font-size: 12px;">No unread notifications</div>';
      this.notifBadge.style.display = 'none';
      return;
    }
    
    this.notifBadge.style.display = 'block';
    this.notifications.forEach(notif => {
      const el = document.createElement('div');
      el.className = 'notification-item';
      el.innerHTML = `
        <span class="notification-text">${notif.text}</span>
        <span class="notification-time">${notif.time}</span>
      `;
      this.notifListContainer.appendChild(el);
    });
  },

  addNotification(text) {
    this.notifications.unshift({
      text,
      time: 'Just now'
    });
    this.loadNotifications();
    this.showToast(text, 'info');
  },

  clearNotifications() {
    this.notifications = [];
    this.loadNotifications();
  },

  // Global Toast Alert
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    container.appendChild(toast);
    
    // Automatically remove after animation finishes (approx 4.3 seconds)
    setTimeout(() => {
      toast.remove();
    }, 4300);
  },

  handleGlobalSearch(query) {
    if (!query) return;
    console.log('Searching for:', query);
    // Find matching notes
    const notes = Storage.getNotes();
    const matchedNote = notes.find(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));
    if (matchedNote) {
      this.switchView('notes');
      if (this.modules.notes && typeof this.modules.notes.selectNote === 'function') {
        this.modules.notes.selectNote(matchedNote.id);
      }
      this.showToast(`Found and opened Note: "${matchedNote.title}"`, 'success');
      this.globalSearch.value = '';
      return;
    }

    // Find matching decks
    const decks = Storage.getDecks();
    const matchedDeck = decks.find(d => d.name.toLowerCase().includes(query));
    if (matchedDeck) {
      this.switchView('flashcards');
      if (this.modules.flashcards && typeof this.modules.flashcards.selectDeck === 'function') {
        this.modules.flashcards.selectDeck(matchedDeck.id);
      }
      this.showToast(`Found and opened Deck: "${matchedDeck.name}"`, 'success');
      this.globalSearch.value = '';
      return;
    }

    this.showToast('No notes or decks matched your query.', 'warning');
  }
};
