// DocWeaver Popup
// Handles popup interface and quick actions

// Initialize polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
  var browser = chrome;
}

class PopupManager {
  constructor() {
    this.collection = null;
    
    this.init();
  }
  
  async init() {
    // Load collection data
    await this.loadCollection();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Render collection
    this.renderCollection();
  }
  
  async loadCollection() {
    try {
      const response = await browser.runtime.sendMessage({ action: 'getCollection' });
      if (response.success) {
        this.collection = response.data;
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    }
  }
  
  setupEventListeners() {
    // Add page button
    document.getElementById('add-page').addEventListener('click', () => {
      this.addCurrentPage();
    });
    
    // View collection button
    document.getElementById('view-collection').addEventListener('click', () => {
      this.viewCollection();
    });
    
    // Generate PDF button
    document.getElementById('generate-pdf').addEventListener('click', () => {
      this.generatePDF();
    });
    
    // Footer links
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openHelp();
    });
    
    document.getElementById('settings-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openSettings();
    });
    
    document.getElementById('about-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openAbout();
    });
  }
  
  async addCurrentPage() {
    try {
      // Get current tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) {
        this.showError('No active tab found');
        return;
      }
      
      const currentTab = tabs[0];
      
      // Send message to content script to show capture modal
      await browser.tabs.sendMessage(currentTab.id, {
        action: 'showCaptureModal'
      });
      
      // Close popup
      window.close();
      
    } catch (error) {
      console.error('Error adding current page:', error);
      this.showError('Error adding page: ' + error.message);
    }
  }
  
  async viewCollection() {
    try {
      // Get current tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) {
        this.showError('No active tab found');
        return;
      }
      
      const currentTab = tabs[0];
      
      // Send message to content script to open sidebar
      await browser.tabs.sendMessage(currentTab.id, {
        action: 'openSidebar'
      });
      
      // Close popup
      window.close();
      
    } catch (error) {
      console.error('Error opening collection:', error);
      this.showError('Error opening collection: ' + error.message);
    }
  }
  
  async generatePDF() {
    try {
      if (!this.collection || this.collection.pages.length === 0) {
        this.showError('No pages to generate PDF from');
        return;
      }
      
      const response = await browser.runtime.sendMessage({
        action: 'generatePDF',
        data: { collectionId: this.collection.id }
      });
      
      if (response.success) {
        // Close popup
        window.close();
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showError('Error generating PDF: ' + error.message);
    }
  }
  
  openHelp() {
    browser.tabs.create({ url: 'https://docs.docweaver.io' });
    window.close();
  }
  
  openSettings() {
    browser.tabs.create({ url: browser.runtime.getURL('options/options.html') });
    window.close();
  }
  
  openAbout() {
    browser.tabs.create({ url: 'https://docweaver.io/about' });
    window.close();
  }
  
  renderCollection() {
    const stats = this.calculateStats();
    const recentPages = this.getRecentPages();
    
    // Update stats
    this.updateStats(stats);
    
    // Render recent pages
    this.renderRecentPages(recentPages);
  }
  
  calculateStats() {
    if (!this.collection || this.collection.pages.length === 0) {
      return { pageCount: 0, wordCount: 0, readTime: '0 min' };
    }
    
    const pageCount = this.collection.pages.length;
    const wordCount = this.collection.pages.reduce((total, page) => total + page.wordCount, 0);
    const totalMinutes = this.collection.pages.reduce((total, page) => {
      const minutes = parseInt(page.readTime) || 0;
      return total + minutes;
    }, 0);
    
    return {
      pageCount,
      wordCount,
      readTime: totalMinutes === 0 ? '0 min' : `${totalMinutes} min`
    };
  }
  
  updateStats(stats) {
    document.getElementById('page-count').textContent = stats.pageCount;
    document.getElementById('word-count').textContent = stats.wordCount.toLocaleString();
    document.getElementById('read-time').textContent = stats.readTime;
  }
  
  getRecentPages() {
    if (!this.collection || this.collection.pages.length === 0) {
      return [];
    }
    
    // Return last 5 pages, sorted by capture time
    return this.collection.pages
      .sort((a, b) => b.capturedAt - a.capturedAt)
      .slice(0, 5);
  }
  
  renderRecentPages(pages) {
    const pagesList = document.getElementById('pages-list');
    
    if (pages.length === 0) {
      pagesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <div class="empty-text">No pages yet</div>
          <div class="empty-subtext">Start collecting to see your pages here</div>
        </div>
      `;
      return;
    }
    
    // Clear existing content
    pagesList.innerHTML = '';
    
    // Render each page
    pages.forEach(page => {
      const pageElement = this.createPageElement(page);
      pagesList.appendChild(pageElement);
    });
  }
  
  createPageElement(page) {
    const template = document.getElementById('page-item-template');
    const clone = template.content.cloneNode(true);
    const pageItem = clone.querySelector('.page-item');
    
    // Set data attributes
    pageItem.dataset.pageId = page.id;
    
    // Fill in content
    pageItem.querySelector('.page-title').textContent = page.title;
    pageItem.querySelector('.page-words').textContent = `${page.wordCount} words`;
    pageItem.querySelector('.page-read-time').textContent = page.readTime;
    
    // Setup action buttons
    pageItem.querySelectorAll('.page-action').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.dataset.action;
        this.handlePageAction(action, page);
      });
    });
    
    // Setup click to view page
    pageItem.addEventListener('click', () => {
      this.viewPage(page);
    });
    
    return pageItem;
  }
  
  handlePageAction(action, page) {
    switch (action) {
      case 'view':
        this.viewPage(page);
        break;
      case 'delete':
        this.deletePage(page);
        break;
    }
  }
  
  viewPage(page) {
    browser.tabs.create({ url: page.url });
    window.close();
  }
  
  async deletePage(page) {
    if (!confirm(`Are you sure you want to delete "${page.title}"?`)) {
      return;
    }
    
    try {
      // Remove page from collection
      this.collection.pages = this.collection.pages.filter(p => p.id !== page.id);
      
      // Save to storage
      await browser.runtime.sendMessage({
        action: 'updateCollection',
        data: { collection: this.collection }
      });
      
      // Re-render
      this.renderCollection();
      
    } catch (error) {
      console.error('Error deleting page:', error);
      this.showError('Error deleting page');
    }
  }
  
  showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: #FEF2F2;
      color: #DC2626;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
  });
} else {
  new PopupManager();
}
