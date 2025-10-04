// DocWeaver Smart Selection
// Handles intelligent content selection with auto-expansion

// Initialize polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
  var browser = chrome;
}

class SmartSelector {
  constructor() {
    this.isActive = false;
    this.selectedElements = new Set();
    this.overlay = null;
    this.setupStyles();
  }
  
  setupStyles() {
    // Inject selection styles
    const style = document.createElement('style');
    style.id = 'docweaver-selection-styles';
    style.textContent = `
      .docweaver-selection-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        z-index: 2147483647;
        pointer-events: none;
      }
      
      .docweaver-selectable {
        outline: 2px solid #6366F1 !important;
        background: rgba(99, 102, 241, 0.1) !important;
        cursor: crosshair !important;
        transition: all 0.2s ease !important;
      }
      
      .docweaver-selectable:hover {
        outline: 2px solid #14B8A6 !important;
        background: rgba(20, 184, 166, 0.15) !important;
        transform: scale(1.02) !important;
      }
      
      .docweaver-selected {
        outline: 2px dashed #14B8A6 !important;
        background: rgba(20, 184, 166, 0.15) !important;
        position: relative !important;
      }
      
      .docweaver-selected::after {
        content: "✓";
        position: absolute;
        top: -10px;
        right: -10px;
        background: #14B8A6;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        z-index: 2147483648;
      }
      
      .docweaver-selection-toolbar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border-radius: 25px;
        padding: 10px 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 2147483649;
        display: flex;
        align-items: center;
        gap: 15px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      
      .docweaver-selection-toolbar button {
        background: #6366F1;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      .docweaver-selection-toolbar button:hover {
        background: #4F46E5;
        transform: translateY(-1px);
      }
      
      .docweaver-selection-toolbar button.secondary {
        background: #6B7280;
      }
      
      .docweaver-selection-toolbar button.secondary:hover {
        background: #4B5563;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  enableSelectionMode() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.selectedElements.clear();
    
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'docweaver-selection-overlay';
    document.body.appendChild(this.overlay);
    
    // Create toolbar
    this.createToolbar();
    
    // Make elements selectable
    this.makeElementsSelectable();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Show instructions
    this.showInstructions();
  }
  
  disableSelectionMode() {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Remove overlay
    if (this.overlay && document.body.contains(this.overlay)) {
      document.body.removeChild(this.overlay);
    }
    
    // Remove toolbar
    const toolbar = document.querySelector('.docweaver-selection-toolbar');
    if (toolbar && document.body.contains(toolbar)) {
      document.body.removeChild(toolbar);
    }
    
    // Remove selection classes
    document.querySelectorAll('.docweaver-selectable, .docweaver-selected').forEach(el => {
      el.classList.remove('docweaver-selectable', 'docweaver-selected');
    });
    
    this.selectedElements.clear();
  }
  
  createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'docweaver-selection-toolbar';
    toolbar.innerHTML = `
      <span>Selected: <strong id="selection-count">0</strong> elements</span>
      <button id="capture-selected">Capture Selected</button>
      <button id="clear-selection" class="secondary">Clear All</button>
      <button id="exit-selection" class="secondary">Exit</button>
    `;
    
    document.body.appendChild(toolbar);
    
    // Setup toolbar events
    toolbar.querySelector('#capture-selected').addEventListener('click', () => {
      this.captureSelected();
    });
    
    toolbar.querySelector('#clear-selection').addEventListener('click', () => {
      this.clearSelection();
    });
    
    toolbar.querySelector('#exit-selection').addEventListener('click', () => {
      this.disableSelectionMode();
    });
  }
  
  makeElementsSelectable() {
    // Define selectable element types
    const selectableSelectors = [
      'article', 'section', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'img',
      '.content', '.post', '.entry', '.article', '.main', '.body'
    ];
    
    // Find all potential selectable elements
    const elements = document.querySelectorAll(selectableSelectors.join(', '));
    
    elements.forEach(el => {
      // Skip if already processed or if element is too small
      if (el.classList.contains('docweaver-selectable') || 
          el.classList.contains('docweaver-selected') ||
          el.offsetHeight < 20 || el.offsetWidth < 20) {
        return;
      }
      
      // Skip if element is inside another selectable element
      if (el.closest('.docweaver-selectable, .docweaver-selected')) {
        return;
      }
      
      el.classList.add('docweaver-selectable');
    });
  }
  
  setupEventListeners() {
    // Handle clicks on selectable elements
    document.addEventListener('click', (e) => {
      if (!this.isActive) return;
      
      const selectable = e.target.closest('.docweaver-selectable');
      if (selectable) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSelection(selectable);
      }
    });
    
    // Handle mouse over for preview
    document.addEventListener('mouseover', (e) => {
      if (!this.isActive) return;
      
      const selectable = e.target.closest('.docweaver-selectable');
      if (selectable && !selectable.classList.contains('docweaver-selected')) {
        this.previewSelection(selectable);
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isActive) {
        this.disableSelectionMode();
      }
    });
  }
  
  toggleSelection(element) {
    if (element.classList.contains('docweaver-selected')) {
      // Deselect
      element.classList.remove('docweaver-selected');
      this.selectedElements.delete(element);
    } else {
      // Select
      element.classList.add('docweaver-selected');
      this.selectedElements.add(element);
      
      // Auto-expand selection based on content type
      this.autoExpandSelection(element);
    }
    
    this.updateSelectionCount();
  }
  
  autoExpandSelection(element) {
    // Auto-expand to full code blocks
    if (element.tagName === 'CODE' && element.parentElement.tagName === 'PRE') {
      const preElement = element.parentElement;
      if (!this.selectedElements.has(preElement)) {
        preElement.classList.add('docweaver-selected');
        this.selectedElements.add(preElement);
      }
    }
    
    // Auto-expand to full lists
    if (element.tagName === 'LI') {
      const listElement = element.closest('ul, ol');
      if (listElement && !this.selectedElements.has(listElement)) {
        listElement.classList.add('docweaver-selected');
        this.selectedElements.add(listElement);
      }
    }
    
    // Auto-expand to full headings with content
    if (element.tagName.match(/^H[1-6]$/)) {
      const section = this.findSectionForHeading(element);
      if (section && !this.selectedElements.has(section)) {
        section.classList.add('docweaver-selected');
        this.selectedElements.add(section);
      }
    }
    
    // Auto-expand to full tables
    if (element.tagName === 'TD' || element.tagName === 'TH') {
      const table = element.closest('table');
      if (table && !this.selectedElements.has(table)) {
        table.classList.add('docweaver-selected');
        this.selectedElements.add(table);
      }
    }
  }
  
  findSectionForHeading(heading) {
    // Find the section that belongs to this heading
    let current = heading.nextElementSibling;
    const section = document.createElement('div');
    section.className = 'docweaver-section';
    
    while (current) {
      // Stop at next heading of same or higher level
      if (current.tagName.match(/^H[1-6]$/)) {
        const currentLevel = parseInt(current.tagName[1]);
        const headingLevel = parseInt(heading.tagName[1]);
        if (currentLevel <= headingLevel) {
          break;
        }
      }
      
      section.appendChild(current.cloneNode(true));
      current = current.nextElementSibling;
    }
    
    return section.children.length > 0 ? section : null;
  }
  
  previewSelection(element) {
    // Add temporary preview class
    element.classList.add('docweaver-preview');
    
    // Remove preview after a short delay
    setTimeout(() => {
      element.classList.remove('docweaver-preview');
    }, 200);
  }
  
  clearSelection() {
    this.selectedElements.forEach(element => {
      element.classList.remove('docweaver-selected');
    });
    this.selectedElements.clear();
    this.updateSelectionCount();
  }
  
  updateSelectionCount() {
    const countElement = document.querySelector('#selection-count');
    if (countElement) {
      countElement.textContent = this.selectedElements.size;
    }
  }
  
  async captureSelected() {
    if (this.selectedElements.size === 0) {
      alert('Please select some content first.');
      return;
    }
    
    try {
      // Create container for selected content
      const container = document.createElement('div');
      container.className = 'docweaver-selected-content';
      
      // Clone selected elements
      this.selectedElements.forEach(element => {
        container.appendChild(element.cloneNode(true));
      });
      
      // Sanitize content
      this.sanitizeContent(container);
      
      // Send to background for processing
      const response = await browser.runtime.sendMessage({
        action: 'capturePage',
        data: {
          url: window.location.href,
          title: document.title,
          content: container.innerHTML,
          type: 'smart',
          metadata: {
            selectedCount: this.selectedElements.size,
            selectionType: 'smart'
          }
        }
      });
      
      if (response.success) {
        this.showSuccessMessage();
        this.disableSelectionMode();
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Error capturing selected content:', error);
      alert('Error capturing content: ' + error.message);
    }
  }
  
  sanitizeContent(element) {
    // Remove selection classes
    element.querySelectorAll('.docweaver-selectable, .docweaver-selected').forEach(el => {
      el.classList.remove('docweaver-selectable', 'docweaver-selected');
    });
    
    // Remove scripts and dangerous content
    element.querySelectorAll('script, style').forEach(el => el.remove());
    
    // Clean up attributes
    element.querySelectorAll('*').forEach(el => {
      el.removeAttribute('style');
      el.removeAttribute('class');
      el.removeAttribute('id');
    });
  }
  
  showInstructions() {
    const instructions = document.createElement('div');
    instructions.className = 'docweaver-instructions';
    instructions.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 2147483650;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        max-width: 400px;
      ">
        <h3>Smart Selection Mode</h3>
        <p>Click on elements to select them. Selected elements will be highlighted.</p>
        <p><strong>Tips:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>Click code blocks to select the entire block</li>
          <li>Click list items to select the entire list</li>
          <li>Click headings to select the section</li>
          <li>Click table cells to select the entire table</li>
        </ul>
        <button onclick="this.parentElement.remove()" style="
          background: #6366F1;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
        ">Got it!</button>
      </div>
    `;
    
    document.body.appendChild(instructions);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(instructions)) {
        document.body.removeChild(instructions);
      }
    }, 5000);
  }
  
  showSuccessMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #14B8A6;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 2147483650;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        ✅ Content captured successfully!
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 3000);
  }
}

// Create global instance
const smartSelector = new SmartSelector();

// Export functions for use in content script
export const enableSelectionMode = () => smartSelector.enableSelectionMode();
export const disableSelectionMode = () => smartSelector.disableSelectionMode();

// Make available globally
if (typeof window !== 'undefined') {
  window.docweaverSelector = smartSelector;
}
