# Troubleshooting Guide

Comprehensive troubleshooting guide for DocWeaver browser extension.

## 📚 Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [Common Issues](#common-issues)
- [Browser-Specific Issues](#browser-specific-issues)
- [Performance Issues](#performance-issues)
- [Content Capture Issues](#content-capture-issues)
- [PDF Generation Issues](#pdf-generation-issues)
- [Advanced Troubleshooting](#advanced-troubleshooting)

## 🔍 Quick Diagnosis

### Is DocWeaver Working?

**Check these basics first:**

1. **Extension Status**
   - Is the extension loaded in your browser?
   - Check browser extension settings
   - Look for DocWeaver in the list

2. **FAB Visibility**
   - Do you see the floating action button?
   - Is it in the bottom-right corner?
   - Does it respond to clicks?

3. **Page Compatibility**
   - Are you on a supported webpage?
   - Is the page fully loaded?
   - Are there any JavaScript errors?

### Quick Fixes

**Try these first:**
1. **Refresh the page** (F5 or Ctrl+R)
2. **Reload the extension** in browser settings
3. **Check browser console** for errors
4. **Try a different webpage**

## 🚨 Common Issues

### Issue 1: FAB Not Appearing

**Symptoms:**
- No floating action button visible
- Extension appears loaded but no UI

**Possible Causes:**
- Page not fully loaded
- JavaScript errors on page
- Extension not properly loaded
- CSS conflicts with website

**Solutions:**

1. **Check Extension Status**
   ```javascript
   // Open browser console (F12) and run:
   console.log('DocWeaver loaded:', typeof DocWeaver !== 'undefined');
   ```

2. **Verify Page Load**
   - Wait for page to fully load
   - Check for loading indicators
   - Ensure all content is visible

3. **Check for JavaScript Errors**
   - Open browser console (F12)
   - Look for red error messages
   - Check for DocWeaver-related errors

4. **Test on Different Page**
   - Try a simple webpage (like Google)
   - Test on documentation sites
   - Check if issue is page-specific

5. **Reload Extension**
   - Go to browser extension settings
   - Find DocWeaver
   - Click "Reload" or "Refresh"

### Issue 2: Content Not Capturing

**Symptoms:**
- FAB appears but capture fails
- No content in collection
- Error messages during capture

**Possible Causes:**
- Page has no content
- Content is dynamically loaded
- Capture mode not suitable
- JavaScript errors

**Solutions:**

1. **Check Page Content**
   - Ensure page has visible content
   - Wait for dynamic content to load
   - Scroll to load all content

2. **Try Different Capture Modes**
   - Full Page: For complete pages
   - Smart Selection: For specific content
   - Article Only: For main content
   - Code Only: For code blocks

3. **Check Browser Console**
   - Look for error messages
   - Check for JavaScript errors
   - Verify extension is working

4. **Test Content Extraction**
   ```javascript
   // Test in browser console:
   document.body.innerHTML.length > 0
   ```

### Issue 3: Collection Not Saving

**Symptoms:**
- Content captures but doesn't save
- Collection appears empty
- Data lost after refresh

**Possible Causes:**
- Storage permissions denied
- Browser storage full
- Extension storage issues
- Data corruption

**Solutions:**

1. **Check Storage Permissions**
   - Verify extension has storage permission
   - Check browser settings
   - Ensure storage is not disabled

2. **Clear Browser Storage**
   - Clear browser cache and cookies
   - Check available storage space
   - Remove unnecessary data

3. **Test Storage Functionality**
   ```javascript
   // Test in browser console:
   browser.storage.local.get(['collection']).then(result => {
     console.log('Storage test:', result);
   });
   ```

4. **Check for Storage Errors**
   - Look for storage-related errors
   - Check browser console
   - Verify extension permissions

### Issue 4: PDF Generation Fails

**Symptoms:**
- PDF generation starts but fails
- Print dialog doesn't appear
- Generated PDF is empty or corrupted

**Possible Causes:**
- Collection is empty
- Browser print settings
- Content formatting issues
- Paged.js loading problems

**Solutions:**

1. **Check Collection Content**
   - Ensure collection has pages
   - Verify content is captured
   - Check for empty pages

2. **Verify Browser Print Settings**
   - Check print dialog settings
   - Ensure PDF option is available
   - Test with browser's print function

3. **Check Content Formatting**
   - Look for HTML errors
   - Verify content structure
   - Check for missing resources

4. **Test PDF Generation**
   - Try with smaller collection
   - Check for JavaScript errors
   - Verify Paged.js is loading

## 🌐 Browser-Specific Issues

### Chrome Issues

**Common Chrome Problems:**

1. **Extension Not Loading**
   - Check manifest.json syntax
   - Verify all files are present
   - Check for permission issues

2. **Content Script Errors**
   - Check for CSP violations
   - Verify script injection
   - Check for JavaScript errors

3. **Storage Issues**
   - Check chrome.storage.local access
   - Verify storage permissions
   - Check for quota exceeded errors

**Chrome Solutions:**
```javascript
// Check extension status
chrome.runtime.getManifest()

// Check storage
chrome.storage.local.get(['collection'])

// Check permissions
chrome.permissions.getAll()
```

### Edge Issues

**Common Edge Problems:**

1. **Compatibility Issues**
   - Check Chromium version
   - Verify Manifest V3 support
   - Check for Edge-specific bugs

2. **Performance Issues**
   - Check memory usage
   - Verify extension performance
   - Check for Edge-specific optimizations

**Edge Solutions:**
- Use latest Edge version
- Check for Edge updates
- Verify Chromium compatibility

### Firefox Issues

**Common Firefox Problems:**

1. **Manifest V3 Support**
   - Check Firefox version (109+)
   - Verify MV3 compatibility
   - Check for Firefox-specific issues

2. **API Differences**
   - Check webextension-polyfill
   - Verify API compatibility
   - Check for Firefox-specific APIs

**Firefox Solutions:**
```javascript
// Check Firefox compatibility
browser.runtime.getManifest()

// Check storage
browser.storage.local.get(['collection'])

// Check permissions
browser.permissions.getAll()
```

## ⚡ Performance Issues

### Slow Extension Performance

**Symptoms:**
- Extension is slow to respond
- High memory usage
- Browser becomes sluggish

**Possible Causes:**
- Large collection size
- Complex content
- Browser memory issues
- Conflicting extensions

**Solutions:**

1. **Optimize Collection Size**
   - Keep collections under 50 pages
   - Remove unnecessary content
   - Clean up old collections

2. **Check Memory Usage**
   - Monitor browser memory usage
   - Close unnecessary tabs
   - Restart browser if needed

3. **Optimize Content**
   - Use appropriate capture modes
   - Remove unnecessary HTML
   - Compress images

4. **Check for Conflicts**
   - Disable other extensions
   - Test in incognito mode
   - Check for extension conflicts

### Slow PDF Generation

**Symptoms:**
- PDF generation takes too long
- Browser becomes unresponsive
- Generation fails with timeout

**Possible Causes:**
- Large collection size
- Complex content formatting
- Browser performance issues
- Paged.js loading problems

**Solutions:**

1. **Reduce Collection Size**
   - Split large collections
   - Remove unnecessary pages
   - Focus on essential content

2. **Optimize Content**
   - Clean up HTML formatting
   - Remove unnecessary styles
   - Optimize images

3. **Check Browser Performance**
   - Close unnecessary tabs
   - Check available memory
   - Restart browser if needed

4. **Test PDF Generation**
   - Try with smaller collections
   - Check for JavaScript errors
   - Verify Paged.js is working

## 📄 Content Capture Issues

### Smart Selection Not Working

**Symptoms:**
- Smart selection mode doesn't activate
- Elements don't highlight on hover
- Selection doesn't work properly

**Possible Causes:**
- CSS conflicts with website
- JavaScript errors
- Element selection issues
- Extension script problems

**Solutions:**

1. **Check for CSS Conflicts**
   - Look for CSS that might interfere
   - Check for z-index issues
   - Verify element visibility

2. **Test Element Selection**
   ```javascript
   // Test in browser console:
   document.querySelector('body').addEventListener('click', e => {
     console.log('Element clicked:', e.target);
   });
   ```

3. **Check JavaScript Errors**
   - Look for selection-related errors
   - Check for event listener issues
   - Verify extension scripts

4. **Test on Different Pages**
   - Try simple webpages
   - Test on documentation sites
   - Check for page-specific issues

### Content Extraction Problems

**Symptoms:**
- Content is incomplete
- Formatting is broken
- Code highlighting missing

**Possible Causes:**
- Content is dynamically loaded
- HTML structure issues
- CSS/JavaScript dependencies
- Extension extraction problems

**Solutions:**

1. **Check Content Loading**
   - Wait for page to fully load
   - Check for dynamic content
   - Ensure all content is visible

2. **Verify HTML Structure**
   - Check for proper HTML tags
   - Look for missing elements
   - Verify content hierarchy

3. **Test Content Extraction**
   ```javascript
   // Test content extraction:
   const content = document.body.innerHTML;
   console.log('Content length:', content.length);
   ```

4. **Check for Dependencies**
   - Look for missing CSS
   - Check for JavaScript dependencies
   - Verify external resources

## 🖨️ PDF Generation Issues

### PDF Generation Fails

**Symptoms:**
- PDF generation doesn't start
- Print dialog doesn't appear
- Generation fails with errors

**Possible Causes:**
- Collection is empty
- Browser print issues
- Paged.js loading problems
- Content formatting issues

**Solutions:**

1. **Check Collection Status**
   - Verify collection has content
   - Check for empty pages
   - Ensure content is captured

2. **Test Browser Print**
   - Try browser's print function
   - Check print settings
   - Verify PDF option is available

3. **Check Paged.js Loading**
   ```javascript
   // Check if Paged.js is loaded:
   console.log('Paged.js loaded:', typeof Paged !== 'undefined');
   ```

4. **Verify Content Formatting**
   - Check for HTML errors
   - Look for missing resources
   - Verify content structure

### PDF Quality Issues

**Symptoms:**
- PDF formatting is broken
- Images are missing or distorted
- Code highlighting is missing
- Layout is incorrect

**Possible Causes:**
- CSS not loading properly
- Image path issues
- Font loading problems
- Paged.js layout issues

**Solutions:**

1. **Check CSS Loading**
   - Verify CSS files are loaded
   - Check for CSS errors
   - Look for missing styles

2. **Verify Image Paths**
   - Check image URLs
   - Look for broken images
   - Verify image accessibility

3. **Test Font Loading**
   - Check font availability
   - Look for font loading errors
   - Verify font fallbacks

4. **Check Paged.js Layout**
   - Verify Paged.js is working
   - Check for layout errors
   - Look for JavaScript errors

## 🔧 Advanced Troubleshooting

### Debug Mode

**Enable Debug Logging:**

1. **Open Browser Console**
   - Press F12 or right-click → Inspect
   - Go to Console tab
   - Look for DocWeaver messages

2. **Check Extension Status**
   ```javascript
   // Check extension status:
   console.log('Extension loaded:', chrome.runtime.getManifest());
   ```

3. **Test Storage**
   ```javascript
   // Test storage:
   chrome.storage.local.get(['collection']).then(result => {
     console.log('Collection:', result.collection);
   });
   ```

4. **Check Permissions**
   ```javascript
   // Check permissions:
   chrome.permissions.getAll().then(permissions => {
     console.log('Permissions:', permissions);
   });
   ```

### Extension Reload

**Reload Extension:**

1. **Chrome/Edge:**
   - Go to `chrome://extensions/`
   - Find DocWeaver
   - Click "Reload" button

2. **Firefox:**
   - Go to `about:debugging`
   - Find DocWeaver
   - Click "Reload" button

3. **Test After Reload:**
   - Refresh the webpage
   - Check if FAB appears
   - Test basic functionality

### Clean Installation

**Complete Reinstall:**

1. **Remove Extension**
   - Uninstall from browser
   - Clear browser data
   - Restart browser

2. **Download Fresh Copy**
   - Get latest version from GitHub
   - Extract to new folder
   - Load extension

3. **Test Installation**
   - Check extension loads
   - Test basic functionality
   - Verify all features work

### System Requirements

**Check System Requirements:**

1. **Browser Version**
   - Chrome 88+ (recommended)
   - Edge 88+ (recommended)
   - Firefox 109+ (beta)

2. **System Resources**
   - Available memory
   - Disk space
   - CPU performance

3. **Network Connection**
   - Internet for initial setup
   - Offline functionality after setup

### Contact Support

**When to Contact Support:**

1. **Critical Issues**
   - Extension completely broken
   - Data loss
   - Security concerns

2. **Persistent Problems**
   - Issues that won't resolve
   - Browser-specific problems
   - Performance issues

3. **Feature Requests**
   - Missing functionality
   - Improvement suggestions
   - Bug reports

**How to Contact Support:**

1. **GitHub Issues**
   - Create detailed issue report
   - Include system information
   - Provide steps to reproduce

2. **Email Support**
   - support@docweaver.io
   - Include detailed description
   - Attach relevant files

3. **Community Help**
   - GitHub Discussions
   - Community forums
   - User groups

---

**Remember**: Most issues can be resolved with basic troubleshooting steps. If problems persist, contact support with detailed information about your system and the specific issue you're experiencing.
