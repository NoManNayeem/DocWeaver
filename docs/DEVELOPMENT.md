# Development Guide

Complete guide for developing and contributing to DocWeaver.

## 📚 Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Architecture](#code-architecture)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building](#building)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🛠️ Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Git** for version control
- **Chrome/Edge/Firefox** for testing
- **Code Editor** (VS Code recommended)

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/NoManNayeem/DocWeaver.git
   cd DocWeaver
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Load Extension**
   - Chrome: `chrome://extensions/` → Load unpacked
   - Edge: `edge://extensions/` → Load unpacked
   - Firefox: `about:debugging` → Load temporary add-on

### Development Tools

**VS Code Extensions:**
- Web Extensions
- JavaScript (ES6) code snippets
- HTML CSS Support
- GitLens

**Browser Developer Tools:**
- Chrome DevTools
- Firefox Developer Tools
- Edge DevTools

## 🏗️ Project Structure

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
├── docs/                    # Documentation
│   ├── README.md
│   ├── TUTORIAL.md
│   ├── API.md
│   ├── CONTRIBUTING.md
│   ├── CHANGELOG.md
│   ├── LICENSE
│   ├── SECURITY.md
│   ├── BEST_PRACTICES.md
│   ├── FAQ.md
│   ├── TROUBLESHOOTING.md
│   └── DEVELOPMENT.md
├── .github/                  # GitHub workflows
│   └── workflows/
│       └── ci.yml
├── .gitignore               # Git ignore rules
└── README.md                # Project overview
```

## 🏛️ Code Architecture

### Manifest V3 Structure

**manifest.json:**
```json
{
  "manifest_version": 3,
  "name": "DocWeaver",
  "version": "1.0.0",
  "description": "Seamlessly weave technical documentation into beautiful PDFs",
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "permissions": ["activeTab", "scripting", "storage", "tabs", "contextMenus"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["lib/webextension-polyfill.js", "content/content-script.js"],
    "css": ["ui/fab.css", "ui/overlay.css"]
  }],
  "web_accessible_resources": [{
    "resources": ["lib/*", "ui/*", "sidebar/*", "print/*", "assets/*"],
    "matches": ["<all_urls>"]
  }]
}
```

### Component Architecture

**Content Script (content-script.js):**
- FAB (Floating Action Button)
- Capture mode selection
- Content extraction
- Toast notifications
- Sidebar injection

**Background Script (service-worker.js):**
- Message handling
- Storage management
- PDF generation orchestration
- Extension lifecycle

**Sidebar (sidebar/):**
- Collection management
- Page reordering
- PDF generation trigger
- Statistics display

**Print Page (print/):**
- PDF layout
- Paged.js integration
- Content rendering
- Print functionality

### Data Flow

```
User Action → Content Script → Background Script → Storage
     ↓              ↓              ↓
FAB Click → Capture Content → Save Collection → Update UI
     ↓              ↓              ↓
PDF Gen → Load Collection → Render PDF → Print Dialog
```

### Storage Schema

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

## 🔄 Development Workflow

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code
   - Test functionality
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

4. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Create pull request
   - Wait for review

### Code Style

**JavaScript:**
- ES6+ features
- Async/await over Promises
- Arrow functions for short functions
- Template literals for strings
- Destructuring for objects/arrays

**CSS:**
- BEM methodology for class naming
- CSS custom properties for theming
- Flexbox/Grid for layouts
- Mobile-first design

**HTML:**
- Semantic HTML elements
- ARIA labels for accessibility
- Minimal DOM manipulation
- Performance optimization

### Development Commands

```bash
# Lint code
npm run lint

# Test extension
npm run test

# Build package
npm run build

# Check manifest
npm run manifest

# Validate extension
npm run validate
```

## 🧪 Testing

### Manual Testing

**Test Checklist:**
- [ ] Extension loads in browser
- [ ] FAB appears on webpages
- [ ] All capture modes work
- [ ] Smart selection functions
- [ ] Collection management works
- [ ] PDF generation succeeds
- [ ] Cross-browser compatibility

**Test Websites:**
- Documentation sites (MDN, GitHub)
- Blog posts (Medium, Dev.to)
- Code repositories (GitHub, GitLab)
- News articles (BBC, CNN)

### Automated Testing

**Linting:**
```bash
# JavaScript linting
npx eslint . --ext .js

# CSS linting
npx stylelint "**/*.css"

# HTML linting
npx htmlhint "**/*.html"
```

**Extension Validation:**
```bash
# Web-ext lint
npx web-ext lint --source-dir .

# Manifest validation
node -e "console.log(JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')))"
```

**Browser Testing:**
```bash
# Chrome testing
npx web-ext run --target=chromium

# Firefox testing
npx web-ext run --target=firefox-desktop
```

### Test Cases

**Basic Functionality:**
1. Extension loading
2. FAB visibility
3. Capture modes
4. Content extraction
5. Collection management
6. PDF generation

**Advanced Features:**
1. Smart selection
2. Content sanitization
3. Cross-browser compatibility
4. Performance optimization
5. Error handling

**Edge Cases:**
1. Empty pages
2. Dynamic content
3. Large collections
4. Network issues
5. Browser limitations

## 🏗️ Building

### Development Build

```bash
# Create development build
npm run build:dev

# Test development build
npm run test:dev
```

### Production Build

```bash
# Create production build
npm run build:prod

# Test production build
npm run test:prod
```

### Extension Package

```bash
# Create extension package
npm run package

# Test extension package
npm run test:package
```

### Build Configuration

**package.json:**
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "test": "jest",
    "lint": "eslint . --ext .js",
    "package": "zip -r dist/docweaver-extension.zip . -x '*.git*' 'node_modules/*' '*.md'"
  }
}
```

## 🚀 Deployment

### GitHub Releases

**Automatic Release:**
- CI/CD pipeline creates releases
- Extension package uploaded
- Release notes generated
- Version tags created

**Manual Release:**
1. Create release on GitHub
2. Upload extension package
3. Add release notes
4. Tag version

### Browser Stores

**Chrome Web Store:**
1. Create developer account
2. Upload extension package
3. Fill store listing
4. Submit for review

**Firefox Add-ons:**
1. Create developer account
2. Upload extension package
3. Fill store listing
4. Submit for review

**Edge Add-ons:**
1. Create developer account
2. Upload extension package
3. Fill store listing
4. Submit for review

### Distribution

**GitHub Releases:**
- Source code
- Extension packages
- Documentation
- Release notes

**Browser Stores:**
- Chrome Web Store
- Firefox Add-ons
- Edge Add-ons
- Microsoft Store

## 🤝 Contributing

### Contribution Process

1. **Fork Repository**
   - Fork on GitHub
   - Clone your fork
   - Add upstream remote

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

4. **Test Changes**
   - Run tests
   - Check linting
   - Test in browsers

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

6. **Push Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub
   - Create pull request
   - Wait for review

### Code Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Tests must pass
   - Linting must pass

2. **Code Review**
   - Maintainers review code
   - Feedback provided
   - Changes requested if needed

3. **Approval**
   - At least one approval required
   - All checks must pass
   - No conflicts

4. **Merge**
   - Squash and merge
   - Delete feature branch
   - Update documentation

### Contribution Guidelines

**Code Style:**
- Follow existing patterns
- Use consistent formatting
- Add comments for complex logic
- Test thoroughly

**Documentation:**
- Update relevant docs
- Add examples if needed
- Include API changes
- Update changelog

**Testing:**
- Add tests for new features
- Test on multiple browsers
- Check edge cases
- Verify performance

### Issue Reporting

**Bug Reports:**
- Use bug report template
- Include system information
- Provide steps to reproduce
- Attach relevant files

**Feature Requests:**
- Use feature request template
- Describe the feature
- Explain the use case
- Provide examples

**Security Issues:**
- Report privately
- Use security contact
- Don't disclose publicly
- Wait for fix

## 📊 Development Metrics

### Code Quality

**Metrics:**
- Code coverage
- Linting errors
- Performance benchmarks
- Security vulnerabilities

**Tools:**
- ESLint for JavaScript
- Stylelint for CSS
- HTMLhint for HTML
- Jest for testing

### Performance

**Metrics:**
- Extension load time
- Content capture speed
- PDF generation time
- Memory usage

**Optimization:**
- Code splitting
- Lazy loading
- Caching strategies
- Resource optimization

### Security

**Security Measures:**
- Content Security Policy
- Input validation
- Output sanitization
- Permission model

**Security Tools:**
- Dependency scanning
- Vulnerability assessment
- Security linting
- Penetration testing

## 🔧 Development Tools

### VS Code Configuration

**.vscode/settings.json:**
```json
{
  "eslint.workingDirectories": ["."],
  "eslint.validate": ["javascript"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Browser DevTools

**Chrome DevTools:**
- Extension debugging
- Performance profiling
- Memory analysis
- Network monitoring

**Firefox Developer Tools:**
- Extension debugging
- Performance profiling
- Memory analysis
- Network monitoring

### Testing Tools

**Jest:**
- Unit testing
- Integration testing
- Mocking
- Coverage reporting

**Playwright:**
- End-to-end testing
- Cross-browser testing
- Visual regression testing
- Performance testing

## 📈 Development Roadmap

### Short Term (3 months)

- **Bug Fixes**: Critical issues
- **Performance**: Optimization
- **Testing**: Automated testing
- **Documentation**: Complete docs

### Medium Term (6 months)

- **Features**: New functionality
- **UI/UX**: Interface improvements
- **Cross-browser**: Better compatibility
- **Security**: Enhanced security

### Long Term (12 months)

- **Architecture**: Major improvements
- **Features**: Advanced functionality
- **Performance**: Significant optimization
- **Ecosystem**: Plugin system

---

**Ready to contribute?** Check out our [Contributing Guide](CONTRIBUTING.md) and start building amazing features for DocWeaver! 🚀
