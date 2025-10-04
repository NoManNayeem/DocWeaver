# DocWeaver Documentation

Welcome to DocWeaver - the browser extension that seamlessly weaves technical documentation into beautiful PDFs.

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [Installation Guide](#installation-guide)
- [User Guide](#user-guide)
- [Developer Guide](#developer-guide)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🚀 Getting Started

DocWeaver is a browser extension that helps developers and technical professionals collect, organize, and compile technical documentation from multiple sources into professionally formatted PDFs.

### Key Features

- **One-click capture** of technical documentation
- **Intelligent content extraction** with code syntax preservation
- **Beautiful PDF generation** with source attribution
- **Zero configuration** required - works out of the box
- **Cross-browser support** for Chrome, Edge, and Firefox

## 📥 Installation Guide

### Chrome/Edge Installation

1. **Download the Extension**
   - Go to the [Releases page](https://github.com/NoManNayeem/DocWeaver/releases)
   - Download the latest `docweaver-extension.zip`

2. **Load the Extension**
   - Extract the ZIP file to a folder
   - Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked" and select the extracted folder

3. **Verify Installation**
   - You should see the DocWeaver icon in your browser toolbar
   - Visit any webpage to see the floating action button (FAB)

### Firefox Installation

1. **Download the Extension**
   - Download the latest release from GitHub

2. **Load the Extension**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the extracted folder

## 👤 User Guide

### Basic Usage

#### 1. Starting a Collection

1. **Click the FAB** - Look for the floating action button in the bottom-right corner of any webpage
2. **Choose Capture Mode** - Select how you want to capture content:
   - **Full Page**: Capture the entire webpage
   - **Smart Selection**: Select specific content elements
   - **Article Only**: Extract main content without clutter
   - **Code Only**: Capture code blocks with syntax highlighting

#### 2. Smart Selection Mode

Smart Selection allows you to choose specific content:

1. **Activate Selection Mode**:
   - Click the FAB and select "Smart Selection"
   - Or use keyboard shortcut: `Alt + S`

2. **Select Content**:
   - Click on elements to select them
   - The extension will auto-expand to related content:
     - Code blocks expand to include the full block
     - List items expand to include the entire list
     - Headings expand to include the section

3. **Capture Selected Content**:
   - Click "Capture Selected" in the toolbar
   - Or use keyboard shortcut: `Alt + A`

#### 3. Managing Your Collection

1. **View Collection**:
   - Click the eye icon (👁️) in the FAB
   - Or use keyboard shortcut: `Alt + V`

2. **Collection Features**:
   - **Reorder Pages**: Drag and drop to reorder
   - **View Pages**: Click the eye icon on any page
   - **Edit Pages**: Click the edit icon to modify titles
   - **Delete Pages**: Click the trash icon to remove

3. **Generate PDF**:
   - Click "Generate PDF" in the collection sidebar
   - Or use keyboard shortcut: `Alt + G`

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + A` | Add current page to collection |
| `Alt + S` | Start smart selection mode |
| `Alt + V` | View collection sidebar |
| `Alt + G` | Generate PDF |
| `Alt + C` | Clear entire collection |
| `Esc` | Exit current mode |

### Capture Modes Explained

#### Full Page Mode
- Captures the entire webpage content
- Includes all text, images, and formatting
- Best for: Complete documentation pages

#### Smart Selection Mode
- Allows you to select specific content
- Auto-expands to related elements
- Best for: Partial content, specific sections

#### Article Only Mode
- Extracts main content, removes navigation and ads
- Uses intelligent content detection
- Best for: Blog posts, articles, documentation

#### Code Only Mode
- Captures only code blocks
- Preserves syntax highlighting
- Best for: Code documentation, tutorials

## 🛠️ Developer Guide

### Project Structure

```
docweaver/
├── manifest.json              # Extension configuration
├── background/                # Background service worker
│   └── service-worker.js
├── content/                   # Content scripts
│   ├── content-script.js      # Main FAB and interactions
│   ├── selector.js           # Smart selection logic
│   └── extractor.js          # Content extraction
├── ui/                       # UI styles
│   ├── fab.css              # FAB styling
│   ├── overlay.css          # Selection overlay
│   └── sidebar.css          # Sidebar styling
├── sidebar/                 # Collection manager
│   ├── sidebar.html
│   └── sidebar.js
├── popup/                   # Extension popup
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── print/                   # PDF generation
│   ├── print.html
│   ├── print.css
│   └── print.js
├── lib/                     # Vendor libraries
│   ├── webextension-polyfill.js
│   ├── highlight.min.js
│   ├── highlight.css
│   ├── paged.polyfill.js
│   ├── sortable.min.js
│   └── readability.min.js
├── assets/                  # Icons and assets
│   └── icons/
├── test/                    # Test fixtures
│   └── fixtures/
└── docs/                    # Documentation
```

### Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/NoManNayeem/DocWeaver.git
   cd DocWeaver
   ```

2. **Load in Browser**
   - Chrome: `chrome://extensions/` → Load unpacked
   - Firefox: `about:debugging` → Load temporary add-on
   - Edge: `edge://extensions/` → Load unpacked

3. **Development Workflow**
   - Make changes to the code
   - Reload the extension in the browser
   - Test functionality on different websites

### Building and Testing

1. **Lint Code**
   ```bash
   npx eslint . --ext .js
   ```

2. **Test Extension**
   ```bash
   npx web-ext lint --source-dir .
   ```

3. **Build Package**
   ```bash
   zip -r docweaver-extension.zip . -x "*.git*" "node_modules/*" "*.md"
   ```

### Architecture Overview

#### Content Script (`content/content-script.js`)
- Injects the FAB (Floating Action Button)
- Handles user interactions and capture modes
- Manages keyboard shortcuts
- Communicates with background script

#### Background Script (`background/service-worker.js`)
- Handles extension lifecycle
- Manages storage and messaging
- Orchestrates PDF generation
- Manages context menus

#### Sidebar (`sidebar/`)
- Collection management interface
- Drag-and-drop reordering
- Page preview and editing
- PDF generation trigger

#### Print Page (`print/`)
- PDF generation interface
- Paged.js integration for layout
- Syntax highlighting
- Print-to-PDF functionality

### API Reference

#### Storage Schema

```javascript
const collectionSchema = {
  id: 'uuid-v4',
  createdAt: 'timestamp',
  pages: [
    {
      id: 'page-uuid',
      url: 'https://example.com',
      title: 'Page Title',
      content: 'HTML content',
      capturedAt: 'timestamp',
      wordCount: 1234,
      readTime: '5 min',
      type: 'full|selection|article|code',
      metadata: {
        author: 'Author Name',
        publishDate: 'date',
        tags: ['react', 'hooks']
      }
    }
  ],
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
```

#### Message API

```javascript
// Capture page
browser.runtime.sendMessage({
  action: 'capturePage',
  data: {
    url: 'https://example.com',
    title: 'Page Title',
    content: 'HTML content',
    type: 'full',
    metadata: {}
  }
});

// Get collection
browser.runtime.sendMessage({
  action: 'getCollection'
});

// Generate PDF
browser.runtime.sendMessage({
  action: 'generatePDF',
  data: { collectionId: 'current' }
});
```

## 🔧 Troubleshooting

### Common Issues

#### Extension Not Loading
1. Check browser console for errors
2. Verify manifest.json syntax
3. Ensure all required files are present
4. Check browser permissions

#### FAB Not Appearing
1. Refresh the webpage
2. Check if content script is loaded
3. Verify no CSS conflicts
4. Check browser console for errors

#### Content Not Capturing
1. Check if page has content
2. Verify capture mode selection
3. Check browser console for errors
4. Try different capture modes

#### PDF Generation Issues
1. Check if collection has pages
2. Verify print page loads correctly
3. Check browser print settings
4. Ensure Paged.js is loaded

### Debug Mode

Enable debug logging:

1. Open browser developer tools
2. Go to Console tab
3. Look for DocWeaver debug messages
4. Check for any error messages

### Performance Issues

If the extension is slow:

1. Check collection size (too many pages)
2. Clear browser cache
3. Restart browser
4. Check for memory leaks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Test on multiple browsers

### Testing

- Test on Chrome, Edge, and Firefox
- Test different website types
- Test all capture modes
- Test PDF generation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Paged.js](https://pagedjs.org/) for PDF layout
- [Highlight.js](https://highlightjs.org/) for syntax highlighting
- [SortableJS](https://sortablejs.github.io/Sortable/) for drag-and-drop
- [Readability.js](https://github.com/mozilla/readability) for article extraction

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/NoManNayeem/DocWeaver/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NoManNayeem/DocWeaver/discussions)
- **Email**: support@docweaver.io

---

Made with ❤️ by the DocWeaver team
