const Storage = {
  // Key names
  KEYS: {
    NOTES: 'smart_student_notes',
    DECKS: 'smart_student_decks',
    TASKS: 'smart_student_tasks',
    ANALYTICS: 'smart_student_analytics',
    PROFILE: 'smart_student_profile',
    ROADMAPS: 'smart_student_roadmaps'
  },

  // Generic helper methods
  get(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  },

  // Notes CRUD
  getNotes() {
    return this.get(this.KEYS.NOTES, this.getDefaultNotes());
  },

  saveNotes(notes) {
    this.set(this.KEYS.NOTES, notes);
  },

  // Flashcards CRUD
  getDecks() {
    return this.get(this.KEYS.DECKS, this.getDefaultDecks());
  },

  saveDecks(decks) {
    this.set(this.KEYS.DECKS, decks);
  },

  // Planner/Tasks CRUD
  getTasks() {
    return this.get(this.KEYS.TASKS, this.getDefaultTasks());
  },

  saveTasks(tasks) {
    this.set(this.KEYS.TASKS, tasks);
  },

  // Analytics history
  getAnalytics() {
    return this.get(this.KEYS.ANALYTICS, this.getDefaultAnalytics());
  },

  saveAnalytics(analytics) {
    this.set(this.KEYS.ANALYTICS, analytics);
  },

  // Profile management
  getProfile() {
    return this.get(this.KEYS.PROFILE, this.getDefaultProfile());
  },

  saveProfile(profile) {
    this.set(this.KEYS.PROFILE, profile);
  },

  // Roadmap Progress
  getRoadmaps() {
    return this.get(this.KEYS.ROADMAPS, this.getDefaultRoadmaps());
  },

  saveRoadmaps(roadmaps) {
    this.set(this.KEYS.ROADMAPS, roadmaps);
  },

  // Default Mockup Data for premium first experience
  getDefaultNotes() {
    return [
      {
        id: 'note-1',
        title: 'Neural Networks Architecture 🧠',
        content: '# Neural Networks Architecture\n\nNotes on the core architectural components of neural networks.\n\n## Core Layers\n1. **Input Layer**: Receives the raw features.\n2. **Hidden Layers**: Perform mathematical transformations.\n3. **Output Layer**: Produces prediction probabilities.\n\n## Activation Functions\n- **ReLU**: f(x) = max(0, x)\n- **Sigmoid**: 1 / (1 + e^-x)\n- **Softmax**: Normalizes values to sum to 1.\n\n## Backpropagation\nGradient descent calculates how weights change using the chain rule.',
        folder: 'Computer Science',
        tags: ['AI', 'Deep Learning'],
        lastModified: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'note-2',
        title: 'Linear Algebra Cheat Sheet 📐',
        content: '# Linear Algebra Cheat Sheet\n\nImportant concepts for ML and computer graphics.\n\n- **Eigenvalues**: Ax = λx (scaling factor)\n- **Eigenvectors**: x (vector whose direction remains unchanged)\n- **Dot Product**: Measures vector alignment\n- **Cross Product**: Generates a perpendicular vector',
        folder: 'Mathematics',
        tags: ['Math', 'Foundations'],
        lastModified: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },

  getDefaultDecks() {
    return [
      {
        id: 'deck-1',
        name: 'Web Dev & JS Basics 🌐',
        lastStudied: new Date().toLocaleDateString(),
        cards: [
          { id: 'c1', front: 'What is a Closure in JavaScript?', back: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). It allows an inner function to access the scope of an outer function even after the outer function has returned.', srsInterval: 1, srsEase: 2.5, srsDueDate: new Date().toISOString() },
          { id: 'c2', front: 'What is Event Delegation?', back: 'Event delegation is a technique where you attach a single event listener to a parent element instead of multiple event listeners to individual child elements. The event bubbles up, and you can inspect the target of the event to handle it accordingly.', srsInterval: 1, srsEase: 2.5, srsDueDate: new Date().toISOString() },
          { id: 'c3', front: 'Explain Promises in JS', back: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has 3 states: Pending, Fulfilled, or Rejected.', srsInterval: 2, srsEase: 2.6, srsDueDate: new Date(Date.now() + 86400000).toISOString() }
        ]
      },
      {
        id: 'deck-2',
        name: 'Data Structures & Algorithms 🌳',
        lastStudied: 'Never',
        cards: [
          { id: 'c4', front: 'Time Complexity of Binary Search?', back: 'O(log n) because the search space is cut in half at each step.', srsInterval: 1, srsEase: 2.5, srsDueDate: new Date().toISOString() },
          { id: 'c5', front: 'Difference between Stack and Queue?', back: 'Stack is LIFO (Last In First Out) - push/pop.\nQueue is FIFO (First In First Out) - enqueue/dequeue.', srsInterval: 1, srsEase: 2.5, srsDueDate: new Date().toISOString() }
        ]
      }
    ];
  },

  getDefaultTasks() {
    return [
      { id: 't1', title: 'Prepare presentation slides for CS Project', description: 'Make slides covering CNN, RNN, and Transformer nodes.', status: 'in_progress', priority: 'high', dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] },
      { id: 't2', title: 'Revise Calculus eigenvectors worksheet', description: 'Do problems 1 to 15 on Chapter 4 review sheet.', status: 'todo', priority: 'medium', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
      { id: 't3', title: 'Write Resume Experience bullets', description: 'Use action words for student developer role.', status: 'done', priority: 'high', dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] }
    ];
  },

  getDefaultAnalytics() {
    // Generate mock analytics history for the past 7 days
    const analytics = [];
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseDate = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const dayName = weekdays[d.getDay() === 0 ? 6 : d.getDay() - 1];
      
      // Random but realistic study hours, cards studied, quiz scores
      analytics.push({
        date: dayName,
        dateString: d.toISOString().split('T')[0],
        focusTime: Math.floor(Math.random() * 80) + 20, // 20 - 100 mins
        cardsStudied: Math.floor(Math.random() * 15) + 5,
        quizAccuracy: Math.floor(Math.random() * 30) + 70 // 70% - 100%
      });
    }
    return analytics;
  },

  getDefaultProfile() {
    return {
      name: 'Alex Vance',
      avatar: '',
      major: 'Computer Science & Mathematics',
      level: 4,
      xp: 2840,
      xpToNextLevel: 4000,
      streak: 5 // consecutive days
    };
  },

  getDefaultRoadmaps() {
    return {
      'cs': { activeNode: 'node-intro', completedNodes: ['node-intro', 'node-git'] },
      'datascience': { activeNode: 'node-python', completedNodes: ['node-python'] }
    };
  }
};
