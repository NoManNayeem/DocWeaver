// Paged.js Polyfill for DocWeaver
// Minimal implementation for print layout

(function() {
  'use strict';
  
  // Simple Paged.js implementation
  const Paged = {
    Previewer: function() {
      this.isReady = false;
      this.init();
    },
    
    init: function() {
      // Setup page layout
      this.setupPageLayout();
      
      // Mark as ready
      this.isReady = true;
      
      // Trigger ready event
      setTimeout(() => {
        this.trigger('rendered');
      }, 100);
    },
    
    setupPageLayout: function() {
      // Add CSS for print layout
      const style = document.createElement('style');
      style.textContent = `
        @page {
          size: A4;
          margin: 20mm;
        }
        
        .pagedjs_page {
          width: 210mm;
          height: 297mm;
          margin: 0 auto 20px;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          page-break-after: always;
        }
        
        .pagedjs_pages {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: #f8fafc;
        }
        
        @media print {
          .pagedjs_pages {
            background: white;
            padding: 0;
          }
          
          .pagedjs_page {
            box-shadow: none;
            margin: 0;
            page-break-after: always;
          }
        }
      `;
      
      document.head.appendChild(style);
    },
    
    on: function(event, callback) {
      if (event === 'rendered' && this.isReady) {
        setTimeout(callback, 0);
      } else {
        // Store callback for later
        this.callbacks = this.callbacks || {};
        this.callbacks[event] = callback;
      }
    },
    
    trigger: function(event) {
      if (this.callbacks && this.callbacks[event]) {
        this.callbacks[event]();
      }
    }
  };
  
  // Make Paged available globally
  if (typeof window !== 'undefined') {
    window.Paged = Paged;
  }
  
  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Paged;
  }
  
  console.log('Paged.js polyfill loaded');
  
})();
