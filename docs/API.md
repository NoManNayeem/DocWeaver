# DocWeaver API Reference

Complete API documentation for DocWeaver browser extension.

## 📚 Table of Contents

- [Storage API](#storage-api)
- [Message API](#message-api)
- [Content Script API](#content-script-api)
- [Background Script API](#background-script-api)
- [Sidebar API](#sidebar-api)
- [Print API](#print-api)
- [Event System](#event-system)

## 💾 Storage API

### Collection Schema

```javascript
const collectionSchema = {
  id: 'uuid-v4',
  createdAt: 'ISO timestamp',
  updatedAt: 'ISO timestamp',
  pages: [
    {
      id: 'page-uuid',
      url: 'https://example.com',
      title: 'Page Title',
      content: 'HTML content',
      capturedAt: 'ISO timestamp',
      wordCount: 1234,
      readTime: '5 min',
      type: 'full|selection|article|code',
      metadata: {
        author: 'Author Name',
        publishDate: 'ISO date',
        tags: ['react', 'hooks'],
        description: 'Page description',
        source: 'Source website',
        language: 'en'
      }
    }
  ],
  settings: {
    pageSize: 'A4|Letter|Legal',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    includeHeaders: true,
    includePageNumbers: true,
    includeSourceUrls: true,
    includeDateCaptured: true,
    syntaxHighlighting: true,
    fontFamily: 'system-ui',
    fontSize: 12,
    lineHeight: 1.5
  }
};
```

### Storage Methods

#### Get Collection
```javascript
browser.storage.local.get(['collection']).then(result => {
  const collection = result.collection || { pages: [], settings: {} };
});
```

#### Save Collection
```javascript
browser.storage.local.set({ collection: collectionData });
```

#### Clear Collection
```javascript
browser.storage.local.remove(['collection']);
```

## 📨 Message API

### Message Types

#### Capture Page
```javascript
browser.runtime.sendMessage({
  action: 'capturePage',
  data: {
    url: 'https://example.com',
    title: 'Page Title',
    content: 'HTML content',
    type: 'full|selection|article|code',
    metadata: {
      author: 'Author Name',
      publishDate: '2024-01-01',
      tags: ['react', 'hooks']
    }
  }
});
```

#### Get Collection
```javascript
browser.runtime.sendMessage({
  action: 'getCollection'
});
```

#### Update Collection
```javascript
browser.runtime.sendMessage({
  action: 'updateCollection',
  data: {
    pages: updatedPages,
    settings: updatedSettings
  }
});
```

#### Generate PDF
```javascript
browser.runtime.sendMessage({
  action: 'generatePDF',
  data: {
    collectionId: 'current',
    options: {
      pageSize: 'A4',
      margins: { top: 20, right: 20, bottom: 20, left: 20 }
    }
  }
});
```

#### Delete Page
```javascript
browser.runtime.sendMessage({
  action: 'deletePage',
  data: {
    pageId: 'page-uuid'
  }
});
```

#### Reorder Pages
```javascript
browser.runtime.sendMessage({
  action: 'reorderPages',
  data: {
    pageIds: ['page1', 'page2', 'page3']
  }
});
```

## 🎯 Content Script API

### FAB (Floating Action Button)

#### Initialize FAB
```javascript
class DocWeaverFAB {
  constructor() {
    this.fab = null;
    this.isVisible = false;
    this.captureMode = null;
  }
}
```

#### Show FAB
```javascript
showFAB() {
  if (this.fab) return;
  
  this.fab = document.createElement('div');
  this.fab.className = 'docweaver-fab';
  this.fab.innerHTML = this.getFABHTML();
  document.body.appendChild(this.fab);
}
```

#### Hide FAB
```javascript
hideFAB() {
  if (this.fab && document.body.contains(this.fab)) {
    document.body.removeChild(this.fab);
    this.fab = null;
  }
}
```

### Capture Modes

#### Full Page Capture
```javascript
async captureFullPage() {
  const content = await this.extractFullPage();
  return {
    html: content,
    metadata: this.extractMetadata()
  };
}
```

#### Smart Selection Capture
```javascript
async captureSmartSelection() {
  const selectedElements = this.getSelectedElements();
  const content = await this.extractSelectedContent(selectedElements);
  return {
    html: content,
    metadata: this.extractMetadata()
  };
}
```

#### Article Only Capture
```javascript
async captureArticleOnly() {
  const article = await this.extractArticle();
  return {
    html: article,
    metadata: this.extractMetadata()
  };
}
```

#### Code Only Capture
```javascript
async captureCodeOnly() {
  const codeBlocks = await this.extractCodeBlocks();
  return {
    html: codeBlocks,
    metadata: this.extractMetadata()
  };
}
```

### Content Extraction

#### Extract Full Page
```javascript
extractFullPage() {
  const body = document.body.cloneNode(true);
  this.sanitizeContent(body);
  this.normalizeStyles(body);
  return body.innerHTML;
}
```

#### Extract Selected Content
```javascript
extractSelectedContent(elements) {
  const container = document.createElement('div');
  elements.forEach(el => {
    const clone = el.cloneNode(true);
    container.appendChild(clone);
  });
  this.sanitizeContent(container);
  return container.innerHTML;
}
```

#### Extract Article
```javascript
extractArticle() {
  const article = document.querySelector('article') || 
                  document.querySelector('main') || 
                  document.querySelector('[role="main"]');
  
  if (article) {
    this.sanitizeContent(article);
    return article.innerHTML;
  }
  
  // Fallback to readability.js
  return this.useReadability();
}
```

#### Extract Code Blocks
```javascript
extractCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre code, code');
  const container = document.createElement('div');
  
  codeBlocks.forEach(block => {
    const clone = block.cloneNode(true);
    this.highlightCode(clone);
    container.appendChild(clone);
  });
  
  return container.innerHTML;
}
```

### Content Sanitization

#### Sanitize Content
```javascript
sanitizeContent(element) {
  // Remove scripts
  element.querySelectorAll('script').forEach(script => script.remove());
  
  // Remove event handlers
  const elements = element.querySelectorAll('*');
  elements.forEach(el => {
    const attributes = el.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    }
  });
  
  // Remove unwanted elements
  this.removeUnwantedElements(element);
}
```

#### Remove Unwanted Elements
```javascript
removeUnwantedElements(element) {
  const unwantedSelectors = [
    'nav', 'header', 'footer', 'aside',
    '.advertisement', '.ads', '.banner',
    '.social-share', '.comments', '.related'
  ];
  
  unwantedSelectors.forEach(selector => {
    element.querySelectorAll(selector).forEach(el => el.remove());
  });
}
```

#### Normalize Styles
```javascript
normalizeStyles(element) {
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; }
    pre, code { font-family: 'Fira Code', monospace; }
    img { max-width: 100%; height: auto; }
  `;
  element.appendChild(style);
}
```

## 🔧 Background Script API

### Service Worker

#### Handle Messages
```javascript
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'capturePage':
      return handlePageCapture(message, sender, sendResponse);
    case 'getCollection':
      return handleGetCollection(message, sender, sendResponse);
    case 'updateCollection':
      return handleUpdateCollection(message, sender, sendResponse);
    case 'generatePDF':
      return handleGeneratePDF(message, sender, sendResponse);
    default:
      return false;
  }
});
```

#### Handle Page Capture
```javascript
async function handlePageCapture(message, sender, sendResponse) {
  try {
    const { url, title, content, type, metadata } = message.data;
    
    const page = {
      id: generateUUID(),
      url,
      title,
      content,
      capturedAt: new Date().toISOString(),
      wordCount: countWords(content),
      readTime: calculateReadTime(content),
      type,
      metadata
    };
    
    const collection = await getCollection();
    collection.pages.push(page);
    await saveCollection(collection);
    
    sendResponse({ success: true, pageId: page.id });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
```

#### Handle Get Collection
```javascript
async function handleGetCollection(message, sender, sendResponse) {
  try {
    const collection = await getCollection();
    sendResponse({ success: true, collection });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
```

#### Handle Update Collection
```javascript
async function handleUpdateCollection(message, sender, sendResponse) {
  try {
    const { pages, settings } = message.data;
    const collection = await getCollection();
    
    if (pages) collection.pages = pages;
    if (settings) collection.settings = { ...collection.settings, ...settings };
    
    await saveCollection(collection);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
```

#### Handle Generate PDF
```javascript
async function handleGeneratePDF(message, sender, sendResponse) {
  try {
    const { collectionId, options } = message.data;
    const collection = await getCollection();
    
    const printUrl = browser.runtime.getURL('print/print.html');
    const tab = await browser.tabs.create({
      url: `${printUrl}?collectionId=${collectionId}`,
      active: true
    });
    
    sendResponse({ success: true, tabId: tab.id });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
```

### Storage Helpers

#### Get Collection
```javascript
async function getCollection() {
  const result = await browser.storage.local.get(['collection']);
  return result.collection || { pages: [], settings: {} };
}
```

#### Save Collection
```javascript
async function saveCollection(collection) {
  await browser.storage.local.set({ collection });
}
```

#### Count Words
```javascript
function countWords(text) {
  if (!text) return 0;
  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}
```

#### Calculate Read Time
```javascript
function calculateReadTime(content) {
  const wordCount = countWords(content);
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}
```

## 🎨 Sidebar API

### Sidebar Management

#### Initialize Sidebar
```javascript
class DocWeaverSidebar {
  constructor() {
    this.sidebar = null;
    this.isVisible = false;
  }
}
```

#### Show Sidebar
```javascript
showSidebar() {
  if (this.sidebar) return;
  
  this.sidebar = document.createElement('div');
  this.sidebar.id = 'docweaver-sidebar';
  this.sidebar.innerHTML = this.getSidebarHTML();
  document.body.appendChild(this.sidebar);
  
  this.attachEventListeners();
  this.loadCollection();
}
```

#### Hide Sidebar
```javascript
hideSidebar() {
  if (this.sidebar && document.body.contains(this.sidebar)) {
    document.body.removeChild(this.sidebar);
    this.sidebar = null;
  }
}
```

#### Load Collection
```javascript
async loadCollection() {
  try {
    const response = await browser.runtime.sendMessage({
      action: 'getCollection'
    });
    
    if (response.success) {
      this.displayCollection(response.collection);
    }
  } catch (error) {
    console.error('Error loading collection:', error);
  }
}
```

#### Display Collection
```javascript
displayCollection(collection) {
  const list = document.getElementById('sidebar-collection-list');
  const stats = this.calculateStats(collection);
  
  this.updateStats(stats);
  this.renderPages(collection.pages);
}
```

#### Render Pages
```javascript
renderPages(pages) {
  const list = document.getElementById('sidebar-collection-list');
  
  if (pages.length === 0) {
    list.innerHTML = this.getEmptyStateHTML();
    return;
  }
  
  list.innerHTML = pages.map(page => this.getPageHTML(page)).join('');
}
```

#### Get Page HTML
```javascript
getPageHTML(page) {
  return `
    <div class="page-item" data-page-id="${page.id}">
      <div class="page-header">
        <div class="page-title">${page.title}</div>
        <div class="page-actions">
          <button class="page-action view-page" title="View">
            <span class="action-icon">👁️</span>
          </button>
          <button class="page-action edit-page" title="Edit">
            <span class="action-icon">✏️</span>
          </button>
          <button class="page-action delete-page" title="Delete">
            <span class="action-icon">🗑️</span>
          </button>
        </div>
      </div>
      <div class="page-meta">
        <span class="page-type">${page.type}</span>
        <span class="page-stats">${page.wordCount} words • ${page.readTime}</span>
      </div>
    </div>
  `;
}
```

## 🖨️ Print API

### PDF Generation

#### Initialize Print Page
```javascript
class DocWeaverPrint {
  constructor() {
    this.collection = null;
    this.settings = null;
  }
}
```

#### Load Collection
```javascript
async loadCollection() {
  const urlParams = new URLSearchParams(window.location.search);
  const collectionId = urlParams.get('collectionId');
  
  if (collectionId === 'current') {
    const response = await browser.runtime.sendMessage({
      action: 'getCollection'
    });
    
    if (response.success) {
      this.collection = response.collection;
      this.renderPDF();
    }
  }
}
```

#### Render PDF
```javascript
renderPDF() {
  const container = document.getElementById('pdf-content');
  const pages = this.collection.pages;
  
  pages.forEach((page, index) => {
    const pageElement = this.createPageElement(page, index);
    container.appendChild(pageElement);
  });
  
  this.applyStyles();
  this.setupPagedJS();
}
```

#### Create Page Element
```javascript
createPageElement(page, index) {
  const pageDiv = document.createElement('div');
  pageDiv.className = 'pdf-page';
  pageDiv.innerHTML = `
    <div class="page-header">
      <h1>${page.title}</h1>
      <div class="page-meta">
        <span class="page-url">${page.url}</span>
        <span class="page-date">${new Date(page.capturedAt).toLocaleDateString()}</span>
      </div>
    </div>
    <div class="page-content">
      ${page.content}
    </div>
  `;
  
  return pageDiv;
}
```

#### Setup PagedJS
```javascript
setupPagedJS() {
  if (typeof Paged !== 'undefined') {
    Paged.on('rendered', () => {
      console.log('PDF layout complete');
      // PDF is ready for printing
    });
  }
}
```

#### Apply Styles
```javascript
applyStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @page {
      size: A4;
      margin: 20mm;
    }
    
    .pdf-page {
      page-break-after: always;
    }
    
    .page-header {
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      padding-bottom: 10px;
    }
    
    .page-content {
      line-height: 1.6;
    }
    
    pre, code {
      font-family: 'Fira Code', monospace;
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}
```

## 📡 Event System

### Custom Events

#### FAB Events
```javascript
// FAB shown
document.dispatchEvent(new CustomEvent('docweaver:fab:shown'));

// FAB hidden
document.dispatchEvent(new CustomEvent('docweaver:fab:hidden'));

// Capture started
document.dispatchEvent(new CustomEvent('docweaver:capture:started', {
  detail: { mode: 'full' }
}));

// Capture completed
document.dispatchEvent(new CustomEvent('docweaver:capture:completed', {
  detail: { pageId: 'uuid', mode: 'full' }
}));
```

#### Sidebar Events
```javascript
// Sidebar shown
document.dispatchEvent(new CustomEvent('docweaver:sidebar:shown'));

// Sidebar hidden
document.dispatchEvent(new CustomEvent('docweaver:sidebar:hidden'));

// Collection updated
document.dispatchEvent(new CustomEvent('docweaver:collection:updated', {
  detail: { pages: [], stats: {} }
}));
```

#### PDF Events
```javascript
// PDF generation started
document.dispatchEvent(new CustomEvent('docweaver:pdf:started'));

// PDF generation completed
document.dispatchEvent(new CustomEvent('docweaver:pdf:completed', {
  detail: { pageCount: 5, wordCount: 1000 }
}));
```

### Event Listeners

#### Listen for Events
```javascript
// Listen for capture events
document.addEventListener('docweaver:capture:completed', (event) => {
  console.log('Page captured:', event.detail);
});

// Listen for collection updates
document.addEventListener('docweaver:collection:updated', (event) => {
  console.log('Collection updated:', event.detail);
});
```

## 🔧 Utility Functions

### UUID Generation
```javascript
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

### URL Validation
```javascript
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
```

### Content Sanitization
```javascript
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove scripts
  div.querySelectorAll('script').forEach(script => script.remove());
  
  // Remove event handlers
  const elements = div.querySelectorAll('*');
  elements.forEach(el => {
    const attributes = el.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    }
  });
  
  return div.innerHTML;
}
```

---

This API reference provides complete documentation for all DocWeaver functionality. For more examples and tutorials, see the [Tutorial Guide](TUTORIAL.md).
