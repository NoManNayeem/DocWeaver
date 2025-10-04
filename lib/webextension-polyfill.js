// WebExtension Polyfill for cross-browser compatibility
// This is a minimal implementation for DocWeaver

(function() {
  'use strict';
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  // Initialize browser object if it doesn't exist
  if (typeof browser === 'undefined') {
    window.browser = chrome;
  }
  
  // Add Promise support for older browsers
  if (typeof Promise === 'undefined') {
    // Load a Promise polyfill if needed
    console.warn('Promise not available, some features may not work');
  }
  
  // Ensure chrome object exists
  if (typeof chrome === 'undefined') {
    console.error('Chrome extension APIs not available');
    return;
  }
  
  // Add missing methods to browser object
  if (browser && !browser.storage) {
    browser.storage = chrome.storage;
  }
  
  if (browser && !browser.tabs) {
    browser.tabs = chrome.tabs;
  }
  
  if (browser && !browser.runtime) {
    browser.runtime = chrome.runtime;
  }
  
  if (browser && !browser.scripting) {
    browser.scripting = chrome.scripting;
  }
  
  if (browser && !browser.contextMenus) {
    browser.contextMenus = chrome.contextMenus;
  }
  
  // Add download support
  if (browser && !browser.downloads) {
    browser.downloads = chrome.downloads;
  }
  
  console.log('WebExtension polyfill loaded');
})();
