const VoiceService = {
  recognition: null,
  isListening: false,
  synthesis: window.speechSynthesis,
  supported: {
    stt: false,
    tts: false
  },

  init(onResult, onStatusChange, onError) {
    // Check Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStatusChange) onStatusChange('listening');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onStatusChange) onStatusChange('idle');
      };

      this.recognition.onerror = (e) => {
        this.isListening = false;
        if (onStatusChange) onStatusChange('idle');
        if (onError) onError(e.error);
      };

      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        if (onResult) onResult(result);
      };

      this.supported.stt = true;
    }

    // Check Speech Synthesis
    if (this.synthesis) {
      this.supported.tts = true;
    }

    return this.supported;
  },

  startListening() {
    if (!this.supported.stt || !this.recognition) return false;
    if (this.isListening) return true;
    
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      return false;
    }
  },

  stopListening() {
    if (!this.supported.stt || !this.recognition) return;
    if (!this.isListening) return;
    
    try {
      this.recognition.stop();
    } catch (e) {
      console.error('Failed to stop speech recognition:', e);
    }
  },

  speak(text, onStart, onEnd) {
    if (!this.supported.tts || !this.synthesis) return;

    // Cancel ongoing speak operations
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose a premium voice (typically a natural English voice)
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      v.name.includes('Microsoft David') || 
      v.name.includes('Samantha') || 
      (v.lang === 'en-US' && v.localService)
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.05; // Slightly faster for natural rhythm
    utterance.pitch = 1.0;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  },

  cancelSpeaking() {
    if (this.supported.tts && this.synthesis) {
      this.synthesis.cancel();
    }
  }
};
