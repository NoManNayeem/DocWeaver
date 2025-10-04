// DocWeaver Background Service Worker
// Handles messaging and orchestration between components

// Initialize polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// Message handling
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  switch (message.action) {
    case 'capturePage':
      handlePageCapture(message, sender, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'getCollection':
      handleGetCollection(message, sendResponse);
      return true;
      
    case 'updateCollection':
      handleUpdateCollection(message, sendResponse);
      return true;
      
    case 'generatePDF':
      handleGeneratePDF(message, sendResponse);
      return true;
      
    case 'openSidebar':
      handleOpenSidebar(message, sender, sendResponse);
      return true;
      
    default:
      console.warn('Unknown message action:', message.action);
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Handle page capture
async function handlePageCapture(message, sender, sendResponse) {
  try {
    const { url, title, content, type, metadata } = message.data;
    
    // Debug logging
    console.log('Background received page capture:', {
      url,
      title,
      contentLength: content ? content.length : 0,
      type,
      metadata
    });
    
    // Get current collection or create new one
    const result = await browser.storage.local.get(['currentCollection']);
    let collection = result.currentCollection || {
      id: generateId(),
      createdAt: Date.now(),
      pages: [],
      settings: {
        pageSize: 'A4',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        includeHeaders: true,
        includePageNumbers: true,
        includeSourceUrls: true,
        includeDateCaptured: true,
        syntaxHighlighting: true
      }
    };
    
    // Create new page entry
    const page = {
      id: generateId(),
      url: url,
      title: title,
      content: content,
      capturedAt: Date.now(),
      wordCount: countWords(content),
      readTime: calculateReadTime(content),
      type: type,
      metadata: metadata || {}
    };
    
    // Add to collection
    collection.pages.push(page);
    
    // Save to storage
    await browser.storage.local.set({ currentCollection: collection });
    
    console.log('Page added to collection:', {
      pageId: page.id,
      totalPages: collection.pages.length,
      wordCount: page.wordCount
    });
    
    sendResponse({ 
      success: true, 
      data: { 
        collectionId: collection.id,
        pageId: page.id,
        totalPages: collection.pages.length
      }
    });
    
  } catch (error) {
    console.error('Error capturing page:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle get collection
async function handleGetCollection(message, sendResponse) {
  try {
    const result = await browser.storage.local.get(['currentCollection']);
    sendResponse({ 
      success: true, 
      data: result.currentCollection || null 
    });
  } catch (error) {
    console.error('Error getting collection:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle update collection
async function handleUpdateCollection(message, sendResponse) {
  try {
    const { collection } = message.data;
    await browser.storage.local.set({ currentCollection: collection });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error updating collection:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle generate PDF
async function handleGeneratePDF(message, sendResponse) {
  try {
    const { collectionId } = message.data;
    
    // Open print page in new tab
    const printUrl = browser.runtime.getURL(`print/print.html?collectionId=${collectionId}`);
    const tab = await browser.tabs.create({ url: printUrl });
    
    sendResponse({ success: true, data: { tabId: tab.id } });
  } catch (error) {
    console.error('Error generating PDF:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle open sidebar
async function handleOpenSidebar(message, sender, sendResponse) {
  try {
    // Inject sidebar into current tab
    await browser.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ['sidebar/sidebar.js']
    });
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error opening sidebar:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Utility functions
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

function countWords(text) {
  if (!text) return 0;
  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}

function calculateReadTime(wordCount) {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes === 1 ? '1 min' : `${minutes} min`;
}

// Context menu setup
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'docweaver-capture',
    title: 'Add to DocWeaver',
    contexts: ['page', 'selection']
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'docweaver-capture') {
    browser.tabs.sendMessage(tab.id, {
      action: 'showCaptureModal',
      data: { selection: info.selectionText }
    });
  }
});
