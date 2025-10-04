// DocWeaver Content Script
// Main entry point for page interaction and FAB injection

// Initialize polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
  var browser = chrome;
}

class DocWeaverContentScript {
  constructor() {
    this.fab = null;
    this.sidebar = null;
    this.isActive = false;
    this.collectionCount = 0;
    this.selectionMode = false;
    
    this.init();
  }
  
  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
    
    // Listen for messages from background script
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open
    });
  }
  
  setup() {
    // Inject FAB
    this.injectFAB();
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Load collection count
    this.loadCollectionCount();
  }
  
  injectFAB() {
    // Create shadow DOM container
    const container = document.createElement('div');
    container.id = 'docweaver-container';
    document.body.appendChild(container);
    
    // Create shadow root
    const shadow = container.attachShadow({ mode: 'closed' });
    
    // Inject FAB HTML and CSS
    shadow.innerHTML = `
      <style>
        @import url('${browser.runtime.getURL('ui/fab.css')}');
      </style>
      <div id="docweaver-fab" class="fab-container">
        <div class="fab-main" id="fab-main">
          <span class="fab-icon">💾</span>
          <span class="fab-text">Start Collecting</span>
        </div>
        <div class="fab-actions" id="fab-actions" style="display: none;">
          <div class="fab-counter" id="fab-counter">📚 0</div>
          <button class="fab-action" id="fab-add" title="Add Page">+ Add</button>
          <button class="fab-action" id="fab-view" title="View Collection">👁️</button>
          <button class="fab-action" id="fab-generate" title="Generate PDF">✨ Create</button>
        </div>
      </div>
    `;
    
    this.fab = shadow;
    this.setupFABEvents();
  }
  
  setupFABEvents() {
    const mainButton = this.fab.getElementById('fab-main');
    const addButton = this.fab.getElementById('fab-add');
    const viewButton = this.fab.getElementById('fab-view');
    const generateButton = this.fab.getElementById('fab-generate');
    
    mainButton.addEventListener('click', () => this.toggleActive());
    addButton.addEventListener('click', () => this.showCaptureModal());
    viewButton.addEventListener('click', () => this.openSidebar());
    generateButton.addEventListener('click', () => this.generatePDF());
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            e.preventDefault();
            this.showCaptureModal();
            break;
          case 's':
            e.preventDefault();
            this.toggleSelectionMode();
            break;
          case 'v':
            e.preventDefault();
            this.openSidebar();
            break;
          case 'g':
            e.preventDefault();
            this.generatePDF();
            break;
          case 'c':
            e.preventDefault();
            this.clearCollection();
            break;
        }
      } else if (e.key === 'Escape') {
        this.exitSelectionMode();
      }
    });
  }
  
  async loadCollectionCount() {
    try {
      const response = await browser.runtime.sendMessage({ action: 'getCollection' });
      if (response.success && response.data) {
        this.collectionCount = response.data.pages.length;
        this.updateFABDisplay();
      }
    } catch (error) {
      console.error('Error loading collection count:', error);
    }
  }
  
  toggleActive() {
    this.isActive = !this.isActive;
    this.updateFABDisplay();
    
    if (this.isActive) {
      this.showToast('Collection started! Click + to add pages.');
    } else {
      this.showToast('Collection paused.');
    }
  }
  
  updateFABDisplay() {
    const mainButton = this.fab.getElementById('fab-main');
    const actionsContainer = this.fab.getElementById('fab-actions');
    const counter = this.fab.getElementById('fab-counter');
    
    if (this.isActive) {
      mainButton.style.display = 'none';
      actionsContainer.style.display = 'flex';
      counter.textContent = `📚 ${this.collectionCount}`;
    } else {
      mainButton.style.display = 'flex';
      actionsContainer.style.display = 'none';
    }
  }
  
  showCaptureModal() {
    if (!this.isActive) {
      this.toggleActive();
    }
    
    // Create capture modal
    const modal = document.createElement('div');
    modal.id = 'docweaver-capture-modal';
    modal.className = 'capture-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Choose Capture Mode</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="capture-options">
            <div class="capture-option" data-mode="full">
              <div class="option-icon">📄</div>
              <div class="option-content">
                <div class="option-title">Full Page</div>
                <div class="option-desc">Capture entire page content</div>
                <div class="option-badge">Complete</div>
              </div>
            </div>
            <div class="capture-option" data-mode="smart">
              <div class="option-icon">✂️</div>
              <div class="option-content">
                <div class="option-title">Smart Selection</div>
                <div class="option-desc">Choose specific elements</div>
                <div class="option-badge">Intelligent</div>
              </div>
            </div>
            <div class="capture-option" data-mode="article">
              <div class="option-icon">📝</div>
              <div class="option-content">
                <div class="option-title">Article Only</div>
                <div class="option-desc">Main content without clutter</div>
                <div class="option-badge">Clean</div>
              </div>
            </div>
            <div class="capture-option" data-mode="code">
              <div class="option-icon">💻</div>
              <div class="option-content">
                <div class="option-title">Code Only</div>
                <div class="option-desc">Code blocks with syntax highlighting</div>
                <div class="option-badge">Technical</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup modal events
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
    
    // Setup capture option events
    modal.querySelectorAll('.capture-option').forEach(option => {
      option.addEventListener('click', () => {
        const mode = option.dataset.mode;
        this.capturePage(mode);
        document.body.removeChild(modal);
      });
    });
  }
  
  async capturePage(mode) {
    try {
      this.showToast('Capturing page...');
      
      // Use the global extractor instead of dynamic import
      const content = await this.extractContent(mode);
      
      // Debug logging
      console.log('Extracted content length:', content.html.length);
      console.log('Content preview:', content.html.substring(0, 200) + '...');
      
      // Send to background for processing
      const response = await browser.runtime.sendMessage({
        action: 'capturePage',
        data: {
          url: window.location.href,
          title: document.title,
          content: content.html,
          type: mode,
          metadata: content.metadata
        }
      });
      
      if (response.success) {
        this.collectionCount = response.data.totalPages;
        this.updateFABDisplay();
        this.showSuccessAnimation();
        this.showToast(`Page added! Total: ${this.collectionCount}`);
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Error capturing page:', error);
      this.showToast('Error capturing page: ' + error.message, 'error');
    }
  }
  
  toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;
    
    if (this.selectionMode) {
      this.enterSelectionMode();
    } else {
      this.exitSelectionMode();
    }
  }
  
  enterSelectionMode() {
    // Enable selection mode using global selector
    if (window.docweaverSelector) {
      window.docweaverSelector.enableSelectionMode();
    } else {
      this.showToast('Selection mode not available', 'error');
    }
    
    this.showToast('Selection mode active. Click elements to select them.');
  }
  
  exitSelectionMode() {
    this.selectionMode = false;
    // Disable selection mode
    document.querySelectorAll('.docweaver-selectable').forEach(el => {
      el.classList.remove('docweaver-selectable', 'docweaver-selected');
    });
    this.showToast('Selection mode disabled.');
  }
  
  async openSidebar() {
    try {
      // Inject sidebar directly instead of using background script
      this.injectSidebar();
      this.showToast('Sidebar opened');
    } catch (error) {
      console.error('Error opening sidebar:', error);
      this.showToast('Error opening sidebar', 'error');
    }
  }
  
  injectSidebar() {
    // Check if sidebar already exists
    if (document.querySelector('#docweaver-sidebar')) {
      return;
    }
    
    // Create sidebar container
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'docweaver-sidebar';
    sidebarContainer.innerHTML = `
      <div class="sidebar-overlay"></div>
      <div class="sidebar-content">
        <div class="sidebar-header">
          <div class="header-content">
            <div class="header-icon">📚</div>
            <div class="header-text">
              <h3>DocWeaver Collection</h3>
              <p>Your documentation hub</p>
            </div>
          </div>
          <button class="sidebar-close">&times;</button>
        </div>
        <div class="sidebar-body">
          <div class="collection-stats">
            <div class="stat-card">
              <div class="stat-icon">📄</div>
              <div class="stat-info">
                <div class="stat-value" id="sidebar-page-count">0</div>
                <div class="stat-label">Pages</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <div class="stat-value" id="sidebar-word-count">0</div>
                <div class="stat-label">Words</div>
              </div>
            </div>
          </div>
          <div class="collection-actions">
            <button id="sidebar-generate-pdf" class="btn-primary">
              <span class="btn-icon">✨</span>
              <span class="btn-text">Generate PDF</span>
            </button>
            <button id="sidebar-clear" class="btn-secondary">
              <span class="btn-icon">🗑️</span>
              <span class="btn-text">Clear All</span>
            </button>
          </div>
          <div class="collection-list" id="sidebar-collection-list">
            <div class="empty-state">
              <div class="empty-icon">📚</div>
              <div class="empty-text">No pages collected yet</div>
              <div class="empty-subtext">Click the + button to add pages</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add sidebar styles
    const style = document.createElement('style');
    style.textContent = `
      #docweaver-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        width: 420px;
        height: 100vh;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        animation: sidebarSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      @keyframes sidebarSlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .sidebar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(12px);
        animation: overlayFadeIn 0.3s ease-out;
      }
      
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .sidebar-content {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: -8px 0 32px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
      }
      
      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px;
        border-bottom: 1px solid rgba(229, 231, 235, 0.5);
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        position: relative;
      }
      
      .sidebar-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #6366F1, #8B5CF6, #14B8A6);
      }
      
      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .header-icon {
        font-size: 24px;
        animation: iconPulse 2s ease-in-out infinite;
      }
      
      @keyframes iconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .header-text h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        line-height: 1.2;
      }
      
      .header-text p {
        margin: 2px 0 0 0;
        font-size: 12px;
        color: #6B7280;
        font-weight: 500;
      }
      
      .sidebar-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #6B7280;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      
      .sidebar-close:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #EF4444;
        transform: scale(1.1);
      }
      
      .sidebar-body {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
      }
      
      .collection-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }
      
      .stat-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        transition: all 0.2s ease;
      }
      
      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .stat-icon {
        font-size: 20px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
      
      .stat-info {
        flex: 1;
      }
      
      .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        line-height: 1;
      }
      
      .stat-label {
        font-size: 12px;
        color: #6B7280;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .collection-actions {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
      }
      
      .btn-primary, .btn-secondary {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        color: white;
        box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
      }
      
      .btn-primary:hover {
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
      }
      
      .btn-secondary {
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        color: #374151;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }
      
      .btn-secondary:hover {
        background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
        transform: translateY(-1px);
      }
      
      .btn-icon {
        font-size: 16px;
      }
      
      .collection-list {
        min-height: 200px;
      }
      
      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #6B7280;
      }
      
      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.6;
      }
      
      .empty-text {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }
      
      .empty-subtext {
        font-size: 14px;
        color: #6B7280;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(sidebarContainer);
    
    // Setup sidebar events
    sidebarContainer.querySelector('.sidebar-close').addEventListener('click', () => {
      document.body.removeChild(sidebarContainer);
    });
    
    sidebarContainer.querySelector('.sidebar-overlay').addEventListener('click', () => {
      document.body.removeChild(sidebarContainer);
    });
    
    sidebarContainer.querySelector('#sidebar-generate-pdf').addEventListener('click', () => {
      this.generatePDF();
    });
    
    sidebarContainer.querySelector('#sidebar-clear').addEventListener('click', () => {
      this.clearCollection();
    });
    
    // Load and display collection
    this.loadSidebarCollection();
  }
  
  async loadSidebarCollection() {
    try {
      const response = await browser.runtime.sendMessage({ action: 'getCollection' });
      if (response.success && response.data) {
        this.updateSidebarStats(response.data);
        this.displaySidebarCollection(response.data);
      }
    } catch (error) {
      console.error('Error loading collection for sidebar:', error);
    }
  }
  
  updateSidebarStats(collection) {
    const pageCount = collection.pages.length;
    const wordCount = collection.pages.reduce((total, page) => total + page.wordCount, 0);
    
    const pageCountEl = document.querySelector('#sidebar-page-count');
    const wordCountEl = document.querySelector('#sidebar-word-count');
    
    if (pageCountEl) pageCountEl.textContent = pageCount;
    if (wordCountEl) wordCountEl.textContent = wordCount.toLocaleString();
  }
  
  displaySidebarCollection(collection) {
    const listEl = document.querySelector('#sidebar-collection-list');
    if (!listEl) return;
    
    if (collection.pages.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <p>No pages collected yet</p>
          <p>Click the + button to add pages</p>
        </div>
      `;
      return;
    }
    
    listEl.innerHTML = collection.pages.map(page => `
      <div class="page-item" style="
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border: 1px solid rgba(229, 231, 235, 0.5);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'" 
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <div style="font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">📄</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${page.title}</div>
            <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">${page.type} • ${page.wordCount} words • ${page.readTime}</div>
            <div style="font-size: 11px; color: #9CA3AF; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${page.url}</div>
          </div>
          <div style="display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
            <button onclick="window.open('${page.url}', '_blank')" style="
              background: linear-gradient(135deg, #3B82F6, #1D4ED8);
              color: white;
              border: none;
              border-radius: 6px;
              padding: 6px 8px;
              cursor: pointer;
              font-size: 12px;
              transition: all 0.2s ease;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">👁️</button>
            <button onclick="this.closest('.page-item').remove()" style="
              background: linear-gradient(135deg, #EF4444, #DC2626);
              color: white;
              border: none;
              border-radius: 6px;
              padding: 6px 8px;
              cursor: pointer;
              font-size: 12px;
              transition: all 0.2s ease;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🗑️</button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  async generatePDF() {
    try {
      const response = await browser.runtime.sendMessage({ 
        action: 'generatePDF',
        data: { collectionId: 'current' }
      });
      
      if (response.success) {
        this.showToast('Opening PDF generator...');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showToast('Error generating PDF: ' + error.message, 'error');
    }
  }
  
  async clearCollection() {
    if (confirm('Are you sure you want to clear the collection?')) {
      try {
        await browser.storage.local.remove(['currentCollection']);
        this.collectionCount = 0;
        this.updateFABDisplay();
        this.showToast('Collection cleared');
      } catch (error) {
        console.error('Error clearing collection:', error);
        this.showToast('Error clearing collection', 'error');
      }
    }
  }
  
  handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'showCaptureModal':
        this.showCaptureModal();
        sendResponse({ success: true });
        break;
        
      case 'updateCollectionCount':
        this.collectionCount = message.data.count;
        this.updateFABDisplay();
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  }
  
  showToast(message, type = 'info', duration = 4000) {
    // Play sound effect
    this.playSound(type);
    
    const toast = document.createElement('div');
    toast.className = `docweaver-toast docweaver-toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-content">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, duration);
  }
  
  playSound(type) {
    try {
      // Create audio context for sound effects
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different types
      const frequencies = {
        success: [523.25, 659.25, 783.99], // C5, E5, G5
        error: [200, 150], // Low descending
        warning: [440, 330], // A4, E4
        info: [440] // A4
      };
      
      const freq = frequencies[type] || frequencies.info;
      
      if (Array.isArray(freq)) {
        // Play chord for success
        freq.forEach((f, index) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.setValueAtTime(f, audioContext.currentTime);
            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            osc.start();
            osc.stop(audioContext.currentTime + 0.3);
          }, index * 100);
        });
      } else {
        // Play single tone
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      // Silently fail if audio context is not available
      console.log('Audio not available:', error);
    }
  }
  
  showSuccessAnimation() {
    // Create ripple effect
    this.createRippleEffect();
    
    // Create confetti effect
    const confetti = document.createElement('div');
    confetti.className = 'docweaver-confetti';
    confetti.innerHTML = '🎉';
    
    document.body.appendChild(confetti);
    
    // Create particle effects
    this.createParticleEffects();
    
    setTimeout(() => {
      if (document.body.contains(confetti)) {
        document.body.removeChild(confetti);
      }
    }, 1200);
  }
  
  createRippleEffect() {
    const ripple = document.createElement('div');
    ripple.className = 'docweaver-ripple';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      if (document.body.contains(ripple)) {
        document.body.removeChild(ripple);
      }
    }, 800);
  }
  
  createParticleEffects() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'docweaver-particles';
    document.body.appendChild(particleContainer);
    
    // Create multiple particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position around center
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const x = window.innerWidth / 2 + Math.cos(angle) * distance;
      const y = window.innerHeight / 2 + Math.sin(angle) * distance;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      particleContainer.appendChild(particle);
    }
    
    setTimeout(() => {
      if (document.body.contains(particleContainer)) {
        document.body.removeChild(particleContainer);
      }
    }, 2000);
  }
  
  async extractContent(mode) {
    // Simple content extraction without external dependencies
    switch (mode) {
      case 'full':
        return this.extractFullPage();
      case 'smart':
        return this.extractSmartSelection();
      case 'article':
        return this.extractArticle();
      case 'code':
        return this.extractCode();
      default:
        throw new Error(`Unknown capture mode: ${mode}`);
    }
  }
  
  extractFullPage() {
    const content = document.body.cloneNode(true);
    this.sanitizeContent(content);
    this.normalizeStyles(content);
    
    const metadata = this.extractMetadata();
    
    return {
      html: content.innerHTML, // Use innerHTML instead of outerHTML
      metadata: metadata
    };
  }
  
  extractSmartSelection() {
    const selectedElements = document.querySelectorAll('.docweaver-selected');
    
    if (selectedElements.length === 0) {
      throw new Error('No content selected. Please select content first.');
    }
    
    const container = document.createElement('div');
    selectedElements.forEach(el => {
      container.appendChild(el.cloneNode(true));
    });
    
    this.sanitizeContent(container);
    this.normalizeStyles(container);
    
    const metadata = this.extractMetadata();
    
    return {
      html: container.innerHTML,
      metadata: metadata
    };
  }
  
  extractArticle() {
    // Simple article extraction
    const mainContent = document.querySelector('main, article, .content, .post, .entry') || 
                      document.querySelector('[role="main"]') ||
                      document.body;
    
    const content = mainContent.cloneNode(true);
    this.removeUnwantedElements(content);
    this.sanitizeContent(content);
    this.normalizeStyles(content);
    
    const metadata = this.extractMetadata();
    
    return {
      html: content.innerHTML,
      metadata: metadata
    };
  }
  
  extractCode() {
    const codeBlocks = document.querySelectorAll('pre code, pre, .highlight, .code-block');
    const container = document.createElement('div');
    
    codeBlocks.forEach(block => {
      const clone = block.cloneNode(true);
      container.appendChild(clone);
    });
    
    if (container.children.length === 0) {
      throw new Error('No code blocks found on this page');
    }
    
    this.sanitizeContent(container);
    this.normalizeStyles(container);
    
    const metadata = this.extractMetadata();
    
    return {
      html: container.innerHTML,
      metadata: metadata
    };
  }
  
  sanitizeContent(element) {
    // Remove script tags and event handlers
    const scripts = element.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove style tags
    const styles = element.querySelectorAll('style');
    styles.forEach(style => style.remove());
    
    // Remove iframes
    const iframes = element.querySelectorAll('iframe');
    iframes.forEach(iframe => iframe.remove());
    
    // Remove elements with dangerous attributes
    const dangerousElements = element.querySelectorAll('[onclick], [onload], [onerror]');
    dangerousElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
  
  normalizeStyles(element) {
    // Add basic styling for better PDF output
    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin: 1.5em 0 0.5em 0;
        font-weight: 600;
        line-height: 1.3;
      }
      
      h1 { font-size: 2em; }
      h2 { font-size: 1.5em; }
      h3 { font-size: 1.25em; }
      
      p {
        margin: 1em 0;
      }
      
      code {
        font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
        background: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 0.9em;
      }
      
      pre {
        background: #f8f8f8;
        border: 1px solid #e1e1e1;
        border-radius: 5px;
        padding: 15px;
        overflow-x: auto;
        margin: 1em 0;
      }
      
      pre code {
        background: none;
        padding: 0;
        border-radius: 0;
      }
      
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      
      li {
        margin: 0.5em 0;
      }
      
      blockquote {
        border-left: 4px solid #ddd;
        margin: 1em 0;
        padding-left: 1em;
        color: #666;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      
      th, td {
        border: 1px solid #ddd;
        padding: 8px 12px;
        text-align: left;
      }
      
      th {
        background: #f5f5f5;
        font-weight: 600;
      }
      
      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1em auto;
      }
      
      a {
        color: #0066cc;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
    `;
    
    element.insertBefore(style, element.firstChild);
  }
  
  removeUnwantedElements(element) {
    // Remove navigation
    const navSelectors = [
      'nav', '.nav', '.navigation', '.navbar', '.menu',
      '.breadcrumb', '.breadcrumbs', '.pagination'
    ];
    navSelectors.forEach(selector => {
      const elements = element.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    // Remove ads and promotional content
    const adSelectors = [
      '.ad', '.advertisement', '.ads', '.promo', '.sponsored',
      '.sidebar', '.widget', '.social-share', '.share-buttons',
      '.comments', '.comment', '.related', '.recommended'
    ];
    adSelectors.forEach(selector => {
      const elements = element.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
  }
  
  extractMetadata() {
    const metadata = {
      url: window.location.href,
      title: document.title,
      description: this.getMetaContent('description'),
      author: this.getMetaContent('author') || this.getMetaContent('article:author'),
      publishDate: this.getMetaContent('article:published_time') || this.getMetaContent('datePublished'),
      tags: this.getMetaTags('article:tag') || this.getMetaTags('keywords'),
      siteName: this.getMetaContent('og:site_name') || this.getMetaContent('site_name'),
      language: document.documentElement.lang || 'en'
    };
    
    return metadata;
  }
  
  getMetaContent(property) {
    const meta = document.querySelector(`meta[name="${property}"], meta[property="${property}"]`);
    return meta ? meta.content : null;
  }
  
  getMetaTags(property) {
    const metas = document.querySelectorAll(`meta[name="${property}"], meta[property="${property}"]`);
    return Array.from(metas).map(meta => meta.content);
  }
}

// Initialize content script
new DocWeaverContentScript();
