// DocWeaver Content Extractor
// Handles different capture modes and content extraction

// Initialize polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
  var browser = chrome;
}

class ContentExtractor {
  constructor() {
    this.readability = null;
    this.highlighter = null;
  }
  
  async init() {
    // Load Readability for article extraction
    try {
      const readabilityModule = await import(browser.runtime.getURL('lib/readability.min.js'));
      this.readability = readabilityModule.Readability;
    } catch (error) {
      console.warn('Readability not available:', error);
    }
    
    // Load syntax highlighter
    try {
      const hljsModule = await import(browser.runtime.getURL('lib/highlight.min.js'));
      this.highlighter = hljsModule.default;
    } catch (error) {
      console.warn('Syntax highlighter not available:', error);
    }
  }
  
  async extractContent(mode) {
    await this.init();
    
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
    
    // Sanitize content
    this.sanitizeContent(content);
    
    // Normalize styles
    this.normalizeStyles(content);
    
    // Extract metadata
    const metadata = this.extractMetadata();
    
    return {
      html: content.outerHTML,
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
    
    // Sanitize and normalize
    this.sanitizeContent(container);
    this.normalizeStyles(container);
    
    const metadata = this.extractMetadata();
    
    return {
      html: container.innerHTML,
      metadata: metadata
    };
  }
  
  extractArticle() {
    if (!this.readability) {
      // Fallback to simple article extraction
      return this.extractArticleFallback();
    }
    
    try {
      const doc = document.cloneNode(true);
      const reader = new this.readability(doc);
      const article = reader.parse();
      
      if (!article) {
        throw new Error('Could not extract article content');
      }
      
      const content = document.createElement('div');
      content.innerHTML = article.content;
      
      // Sanitize and normalize
      this.sanitizeContent(content);
      this.normalizeStyles(content);
      
      const metadata = {
        ...this.extractMetadata(),
        title: article.title,
        author: article.byline,
        excerpt: article.excerpt
      };
      
      return {
        html: content.innerHTML,
        metadata: metadata
      };
    } catch (error) {
      console.warn('Readability extraction failed, using fallback:', error);
      return this.extractArticleFallback();
    }
  }
  
  extractArticleFallback() {
    // Simple article extraction without Readability
    const mainContent = document.querySelector('main, article, .content, .post, .entry') || 
                      document.querySelector('[role="main"]') ||
                      document.body;
    
    const content = mainContent.cloneNode(true);
    
    // Remove navigation, ads, comments, etc.
    this.removeUnwantedElements(content);
    
    // Sanitize and normalize
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
      
      // Apply syntax highlighting if available
      if (this.highlighter) {
        this.highlighter.highlightElement(clone);
      }
      
      container.appendChild(clone);
    });
    
    if (container.children.length === 0) {
      throw new Error('No code blocks found on this page');
    }
    
    // Sanitize and normalize
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
    
    // Remove style tags (we'll use our own CSS)
    const styles = element.querySelectorAll('style');
    styles.forEach(style => style.remove());
    
    // Remove iframes
    const iframes = element.querySelectorAll('iframe');
    iframes.forEach(iframe => iframe.remove());
    
    // Remove elements with dangerous attributes
    const dangerousElements = element.querySelectorAll('[onclick], [onload], [onerror]');
    dangerousElements.forEach(el => {
      // Remove event handlers
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    // Clean up attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove class attributes that might interfere
      if (el.className && el.className.includes('ad') || 
          el.className.includes('advertisement') ||
          el.className.includes('popup')) {
        el.remove();
        return;
      }
      
      // Remove style attributes
      el.removeAttribute('style');
      
      // Remove data attributes that might contain scripts
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('data-') && 
            (attr.value.includes('javascript:') || attr.value.includes('eval'))) {
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
    
    // Remove elements with ad-related classes
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.className && (
        el.className.includes('ad') ||
        el.className.includes('advertisement') ||
        el.className.includes('promo') ||
        el.className.includes('sponsored')
      )) {
        el.remove();
      }
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

// Export for use in content script
const extractor = new ContentExtractor();

// Make extractContent available globally for content script
if (typeof window !== 'undefined') {
  window.docweaverExtractor = extractor;
}

export { extractor as default };
export const extractContent = (mode) => extractor.extractContent(mode);
