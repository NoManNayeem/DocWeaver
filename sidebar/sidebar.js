// DocWeaver Sidebar Manager
// Handles collection display, reordering, and page management

// Initialize polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
  var browser = chrome;
}

class SidebarManager {
  constructor() {
    this.collection = null;
    this.isVisible = false;
    this.sortable = null;
    this.currentEditingPage = null;
    
    this.init();
  }
  
  async init() {
    // Load collection data
    await this.loadCollection();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize sortable
    this.initializeSortable();
    
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
    // Close button
    document.getElementById('sidebar-close').addEventListener('click', () => {
      this.hide();
    });
    
    // Generate PDF button
    document.getElementById('generate-pdf').addEventListener('click', () => {
      this.generatePDF();
    });
    
    // Clear collection button
    document.getElementById('clear-collection').addEventListener('click', () => {
      this.clearCollection();
    });
    
    // Start collecting button
    document.getElementById('start-collecting').addEventListener('click', () => {
      this.startCollecting();
    });
    
    // Help link
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.showHelp();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }
  
  initializeSortable() {
    const collectionList = document.getElementById('collection-list');
    
    if (collectionList && typeof Sortable !== 'undefined') {
      this.sortable = new Sortable(collectionList, {
        animation: 300,
        ghostClass: 'dragging',
        onStart: (evt) => {
          evt.item.classList.add('dragging');
        },
        onEnd: (evt) => {
          evt.item.classList.remove('dragging');
          this.reorderPages(evt.oldIndex, evt.newIndex);
        }
      });
    }
  }
  
  renderCollection() {
    const collectionList = document.getElementById('collection-list');
    const emptyState = document.getElementById('empty-state');
    const stats = this.calculateStats();
    
    // Update stats
    this.updateStats(stats);
    
    if (!this.collection || this.collection.pages.length === 0) {
      collectionList.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear existing items
    collectionList.innerHTML = '';
    
    // Render each page
    this.collection.pages.forEach((page, index) => {
      const pageElement = this.createPageElement(page, index);
      collectionList.appendChild(pageElement);
    });
  }
  
  createPageElement(page, index) {
    const template = document.getElementById('page-item-template');
    const clone = template.content.cloneNode(true);
    const pageItem = clone.querySelector('.page-item');
    
    // Set data attributes
    pageItem.dataset.pageId = page.id;
    pageItem.dataset.index = index;
    
    // Fill in content
    pageItem.querySelector('.page-title').textContent = page.title;
    pageItem.querySelector('.page-url').textContent = page.url;
    pageItem.querySelector('.page-words').textContent = `${page.wordCount} words`;
    pageItem.querySelector('.page-read-time').textContent = page.readTime;
    pageItem.querySelector('.page-content-preview').textContent = this.getContentPreview(page.content);
    
    // Setup action buttons
    pageItem.querySelectorAll('.page-action').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.dataset.action;
        this.handlePageAction(action, page);
      });
    });
    
    return pageItem;
  }
  
  getContentPreview(content) {
    // Strip HTML tags and get first 100 characters
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  }
  
  calculateStats() {
    if (!this.collection || this.collection.pages.length === 0) {
      return { pageCount: 0, wordCount: 0, readTime: '0 min' };
    }
    
    const pageCount = this.collection.pages.length;
    const wordCount = this.collection.pages.reduce((total, page) => total + page.wordCount, 0);
    const totalMinutes = this.collection.pages.reduce((total, page) => {
      const minutes = parseInt(page.readTime);
      return total + (isNaN(minutes) ? 0 : minutes);
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
  
  handlePageAction(action, page) {
    switch (action) {
      case 'view':
        this.viewPage(page);
        break;
      case 'refresh':
        this.refreshPage(page);
        break;
      case 'edit':
        this.editPage(page);
        break;
      case 'delete':
        this.deletePage(page);
        break;
    }
  }
  
  viewPage(page) {
    // Open page in new tab
    browser.tabs.create({ url: page.url });
  }
  
  async refreshPage(page) {
    try {
      // Show loading state
      const pageElement = document.querySelector(`[data-page-id="${page.id}"]`);
      if (pageElement) {
        pageElement.style.opacity = '0.5';
      }
      
      // Re-capture page content
      const response = await browser.tabs.query({ active: true, currentWindow: true });
      if (response.length > 0) {
        await browser.tabs.sendMessage(response[0].id, {
          action: 'refreshPage',
          data: { pageId: page.id, url: page.url }
        });
      }
      
      // Reload collection
      await this.loadCollection();
      this.renderCollection();
      
    } catch (error) {
      console.error('Error refreshing page:', error);
      this.showToast('Error refreshing page', 'error');
    }
  }
  
  editPage(page) {
    this.currentEditingPage = page;
    this.showEditModal(page);
  }
  
  showEditModal(page) {
    // Create edit modal
    const template = document.getElementById('edit-modal-template');
    const clone = template.content.cloneNode(true);
    const modal = clone.querySelector('.edit-modal');
    
    // Fill in current values
    document.getElementById('edit-title').value = page.title;
    document.getElementById('edit-notes').value = page.metadata.notes || '';
    
    document.body.appendChild(modal);
    
    // Setup modal events
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('cancel-edit').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('save-edit').addEventListener('click', () => {
      this.savePageEdit(modal);
    });
  }
  
  async savePageEdit(modal) {
    try {
      const title = document.getElementById('edit-title').value.trim();
      const notes = document.getElementById('edit-notes').value.trim();
      
      if (!title) {
        this.showToast('Title is required', 'error');
        return;
      }
      
      // Update page in collection
      const pageIndex = this.collection.pages.findIndex(p => p.id === this.currentEditingPage.id);
      if (pageIndex !== -1) {
        this.collection.pages[pageIndex].title = title;
        this.collection.pages[pageIndex].metadata.notes = notes;
        
        // Save to storage
        await browser.runtime.sendMessage({
          action: 'updateCollection',
          data: { collection: this.collection }
        });
        
        // Re-render
        this.renderCollection();
        
        // Close modal
        document.body.removeChild(modal);
        
        this.showToast('Page updated successfully');
      }
      
    } catch (error) {
      console.error('Error saving page edit:', error);
      this.showToast('Error saving changes', 'error');
    }
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
      
      this.showToast('Page deleted');
      
    } catch (error) {
      console.error('Error deleting page:', error);
      this.showToast('Error deleting page', 'error');
    }
  }
  
  async reorderPages(oldIndex, newIndex) {
    try {
      // Reorder pages in collection
      const page = this.collection.pages.splice(oldIndex, 1)[0];
      this.collection.pages.splice(newIndex, 0, page);
      
      // Save to storage
      await browser.runtime.sendMessage({
        action: 'updateCollection',
        data: { collection: this.collection }
      });
      
      this.showToast('Pages reordered');
      
    } catch (error) {
      console.error('Error reordering pages:', error);
      this.showToast('Error reordering pages', 'error');
    }
  }
  
  async generatePDF() {
    try {
      if (!this.collection || this.collection.pages.length === 0) {
        this.showToast('No pages to generate PDF from', 'error');
        return;
      }
      
      const response = await browser.runtime.sendMessage({
        action: 'generatePDF',
        data: { collectionId: this.collection.id }
      });
      
      if (response.success) {
        this.showToast('Opening PDF generator...');
        this.hide();
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showToast('Error generating PDF: ' + error.message, 'error');
    }
  }
  
  async clearCollection() {
    if (!confirm('Are you sure you want to clear the entire collection? This cannot be undone.')) {
      return;
    }
    
    try {
      await browser.storage.local.remove(['currentCollection']);
      this.collection = null;
      this.renderCollection();
      this.showToast('Collection cleared');
      
    } catch (error) {
      console.error('Error clearing collection:', error);
      this.showToast('Error clearing collection', 'error');
    }
  }
  
  startCollecting() {
    this.hide();
    // Focus on the main page to show FAB
    window.focus();
  }
  
  showHelp() {
    // Open help in new tab
    browser.tabs.create({ url: 'https://docs.docweaver.io' });
  }
  
  show() {
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
    // Sidebar is already visible as it's injected into the page
  }
  
  hide() {
    this.isVisible = false;
    document.body.style.overflow = '';
    // Remove sidebar from DOM
    const sidebar = document.querySelector('.sidebar-container');
    if (sidebar) {
      sidebar.remove();
    }
  }
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `docweaver-toast docweaver-toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }
}

// Initialize sidebar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();
  });
} else {
  new SidebarManager();
}
