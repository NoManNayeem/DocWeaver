// DocWeaver Print Page
// Handles PDF generation with Paged.js

// Initialize polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
  var browser = chrome;
}

class PrintManager {
  constructor() {
    this.collection = null;
    this.isReady = false;
    
    this.init();
  }
  
  async init() {
    try {
      // Get collection ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const collectionId = urlParams.get('collectionId') || 'current';
      
      // Load collection data
      await this.loadCollection(collectionId);
      
      if (this.collection) {
        // Generate PDF content
        await this.generatePDF();
      } else {
        this.showError('No collection found');
      }
      
    } catch (error) {
      console.error('Error initializing print manager:', error);
      this.showError('Error loading collection: ' + error.message);
    }
  }
  
  async loadCollection(collectionId) {
    try {
      const response = await browser.runtime.sendMessage({ 
        action: 'getCollection',
        data: { collectionId }
      });
      
      if (response.success && response.data) {
        this.collection = response.data;
      } else {
        throw new Error(response.error || 'Collection not found');
      }
    } catch (error) {
      console.error('Error loading collection:', error);
      throw error;
    }
  }
  
  async generatePDF() {
    try {
      // Show loading state
      this.showLoading();
      
      // Apply syntax highlighting to code blocks
      this.applySyntaxHighlighting();
      
      // Generate HTML content
      const htmlContent = this.generateHTML();
      
      // Update page content
      document.getElementById('app').innerHTML = htmlContent;
      
      // Setup Paged.js
      await this.setupPagedJS();
      
      // Auto-print after layout is ready
      this.autoPrint();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showError('Error generating PDF: ' + error.message);
    }
  }
  
  applySyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
      // Find all code blocks and apply highlighting
      this.collection.pages.forEach(page => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = page.content;
        
        const codeBlocks = tempDiv.querySelectorAll('pre code, code');
        codeBlocks.forEach(block => {
          hljs.highlightElement(block);
        });
        
        page.content = tempDiv.innerHTML;
      });
    }
  }
  
  generateHTML() {
    const { pages, settings } = this.collection;
    const totalWords = pages.reduce((sum, page) => sum + page.wordCount, 0);
    const totalReadTime = pages.reduce((sum, page) => {
      const minutes = parseInt(page.readTime) || 0;
      return sum + minutes;
    }, 0);
    
    // Set CSS variables for headers/footers
    document.documentElement.style.setProperty('--doc-title', 'DocWeaver Collection');
    document.documentElement.style.setProperty('--source-url', `${pages.length} pages`);
    
    let html = '';
    
    // Cover page
    if (settings.coverPage) {
      html += this.generateCoverPage(totalWords, totalReadTime);
    }
    
    // Table of contents
    if (settings.tableOfContents) {
      html += this.generateTableOfContents();
    }
    
    // Page content
    pages.forEach((page, index) => {
      html += this.generatePageContent(page, index);
    });
    
    return html;
  }
  
  generateCoverPage(totalWords, totalReadTime) {
    const { pages } = this.collection;
    const firstPage = pages[0];
    const lastPage = pages[pages.length - 1];
    
    return `
      <div class="cover-page">
        <div class="cover-title">DocWeaver Collection</div>
        <div class="cover-subtitle">Technical Documentation</div>
        <div class="cover-meta">
          <div><strong>Pages:</strong> ${pages.length}</div>
          <div><strong>Words:</strong> ${totalWords.toLocaleString()}</div>
          <div><strong>Read Time:</strong> ${totalReadTime} min</div>
          <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
          <div><strong>Sources:</strong> ${firstPage.url} to ${lastPage.url}</div>
        </div>
      </div>
    `;
  }
  
  generateTableOfContents() {
    const { pages } = this.collection;
    
    let tocItems = '';
    pages.forEach((page, index) => {
      tocItems += `
        <div class="toc-item">
          <a href="#page-${index}">
            <span>${page.title}</span>
            <span class="toc-dots"></span>
            <span class="toc-page">${index + 1}</span>
          </a>
        </div>
      `;
    });
    
    return `
      <div class="toc">
        <div class="toc-title">Table of Contents</div>
        <div class="toc-list">
          ${tocItems}
        </div>
      </div>
    `;
  }
  
  generatePageContent(page, index) {
    const captureDate = new Date(page.capturedAt).toLocaleDateString();
    const wordCount = page.wordCount.toLocaleString();
    
    return `
      <div class="page-content" id="page-${index}">
        <div class="page-header">
          <div class="page-title">${this.escapeHtml(page.title)}</div>
          <div class="page-meta">
            <span>📄 ${page.type}</span>
            <span>📊 ${wordCount} words</span>
            <span>⏱️ ${page.readTime}</span>
            <span>📅 ${captureDate}</span>
          </div>
        </div>
        <div class="page-content">
          ${page.content}
        </div>
      </div>
    `;
  }
  
  async setupPagedJS() {
    if (typeof Paged !== 'undefined') {
      try {
        // Configure Paged.js
        const paged = new Paged.Previewer();
        
        // Wait for layout to complete
        paged.on('rendered', () => {
          this.isReady = true;
          console.log('Paged.js layout completed');
        });
        
        // Handle errors
        paged.on('error', (error) => {
          console.error('Paged.js error:', error);
          this.showError('Layout error: ' + error.message);
        });
        
      } catch (error) {
        console.error('Error setting up Paged.js:', error);
        // Continue without Paged.js if it fails
        this.isReady = true;
      }
    } else {
      // Paged.js not available, continue without it
      this.isReady = true;
    }
  }
  
  autoPrint() {
    // Wait for layout to be ready
    const checkReady = () => {
      if (this.isReady) {
        // Small delay to ensure everything is rendered
        setTimeout(() => {
          window.print();
        }, 500);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    
    checkReady();
  }
  
  showLoading() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="loading">
        <div>🔄 Generating PDF...</div>
        <div style="font-size: 12pt; margin-top: 10pt; color: #9CA3AF;">
          Weaving your documentation into a beautiful PDF...
        </div>
      </div>
    `;
  }
  
  showError(message) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="error">
        <div>❌ Error</div>
        <div style="font-size: 12pt; margin-top: 10pt; color: #9CA3AF;">
          ${this.escapeHtml(message)}
        </div>
        <div style="margin-top: 20pt;">
          <button onclick="window.close()" style="
            background: #6366F1;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Close</button>
        </div>
      </div>
    `;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize print manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PrintManager();
  });
} else {
  new PrintManager();
}
