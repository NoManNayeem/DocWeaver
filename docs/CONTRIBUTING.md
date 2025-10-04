# Contributing to DocWeaver

Thank you for your interest in contributing to DocWeaver! This guide will help you get started with contributing to our browser extension.

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Git** for version control
- **Chrome/Edge/Firefox** for testing
- **Code Editor** (VS Code recommended)

### Fork and Clone

1. **Fork the Repository**
   - Go to [DocWeaver on GitHub](https://github.com/NoManNayeem/DocWeaver)
   - Click the "Fork" button in the top-right corner
   - This creates a copy in your GitHub account

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/DocWeaver.git
   cd DocWeaver
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/NoManNayeem/DocWeaver.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies (if any)
npm install

# Install development tools
npm install -g web-ext
npm install -g eslint
```

### 2. Load Extension in Browser

#### Chrome/Edge
1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the DocWeaver folder

#### Firefox
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json`

### 3. Development Workflow

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# Test the extension
# Commit your changes
git add .
git commit -m "Add: your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

## 📝 Code Style

### JavaScript Style

- **ES6+ Features**: Use modern JavaScript
- **Async/Await**: Prefer over Promises
- **Arrow Functions**: Use for short functions
- **Template Literals**: Use for string interpolation
- **Destructuring**: Use for object/array access

#### Good Example
```javascript
// Use async/await
async function capturePage(mode) {
  try {
    const content = await extractContent(mode);
    const response = await browser.runtime.sendMessage({
      action: 'capturePage',
      data: { content, mode }
    });
    return response;
  } catch (error) {
    console.error('Capture failed:', error);
    throw error;
  }
}

// Use destructuring
const { url, title, content } = pageData;

// Use template literals
const message = `Captured ${pageCount} pages from ${sourceUrl}`;
```

#### Bad Example
```javascript
// Don't use callbacks
function capturePage(mode, callback) {
  extractContent(mode, function(content) {
    browser.runtime.sendMessage({
      action: 'capturePage',
      data: { content: content, mode: mode }
    }, function(response) {
      callback(response);
    });
  });
}
```

### CSS Style

- **BEM Methodology**: Use for class naming
- **CSS Custom Properties**: Use for theming
- **Flexbox/Grid**: Use for layouts
- **Mobile First**: Design for mobile first

#### Good Example
```css
.docweaver-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2147483647;
}

.docweaver-fab__button {
  background: var(--primary-color);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
}

.docweaver-fab__button--active {
  transform: scale(1.1);
}
```

### HTML Style

- **Semantic HTML**: Use proper elements
- **Accessibility**: Include ARIA labels
- **Performance**: Minimize DOM manipulation

#### Good Example
```html
<button 
  class="docweaver-fab__button"
  aria-label="Open DocWeaver"
  role="button"
  tabindex="0"
>
  <span class="fab-icon" aria-hidden="true">+</span>
</button>
```

## 🧪 Testing

### Manual Testing

1. **Test on Multiple Browsers**
   - Chrome (latest)
   - Edge (latest)
   - Firefox (latest)

2. **Test Different Websites**
   - Documentation sites (MDN, GitHub)
   - Blog posts (Medium, Dev.to)
   - Code repositories (GitHub, GitLab)
   - News articles (BBC, CNN)

3. **Test All Features**
   - FAB visibility and interaction
   - All capture modes
   - Smart selection
   - Collection management
   - PDF generation

### Automated Testing

```bash
# Lint JavaScript files
npx eslint . --ext .js

# Check extension structure
npx web-ext lint --source-dir .

# Validate manifest
node -e "console.log(JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')))"
```

### Test Cases

#### Basic Functionality
- [ ] FAB appears on page load
- [ ] FAB responds to clicks
- [ ] Capture modes work correctly
- [ ] Content is extracted properly
- [ ] Collection is saved to storage

#### Advanced Features
- [ ] Smart selection works
- [ ] Content sanitization works
- [ ] PDF generation works
- [ ] Cross-browser compatibility
- [ ] Performance is acceptable

#### Edge Cases
- [ ] Empty pages
- [ ] Pages with no content
- [ ] Pages with errors
- [ ] Large pages
- [ ] Pages with special characters

## 🔄 Pull Request Process

### 1. Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Cross-browser tested

### 2. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Edge
- [ ] Tested on Firefox
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### 3. Review Process

1. **Automated Checks**: CI pipeline runs automatically
2. **Code Review**: Maintainers review the code
3. **Testing**: Manual testing by maintainers
4. **Approval**: At least one approval required
5. **Merge**: Squash and merge to main branch

## 🐛 Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- Browser: Chrome/Edge/Firefox
- Version: 1.0.0
- OS: Windows/Mac/Linux

## Screenshots
If applicable, add screenshots

## Additional Context
Any other context about the problem
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives
Any alternative solutions considered?

## Additional Context
Any other context about the feature
```

## 👥 Community Guidelines

### Code of Conduct

- **Be Respectful**: Treat everyone with respect
- **Be Inclusive**: Welcome newcomers
- **Be Constructive**: Provide helpful feedback
- **Be Patient**: Remember we're all learning

### Communication

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Pull Requests**: For code contributions
- **Email**: For security issues

### Getting Help

1. **Check Documentation**: Read the docs first
2. **Search Issues**: Look for similar issues
3. **Ask Questions**: Use GitHub Discussions
4. **Be Specific**: Provide clear descriptions

## 🎯 Contribution Areas

### High Priority

- **Bug Fixes**: Critical issues affecting users
- **Performance**: Speed and memory improvements
- **Accessibility**: Better screen reader support
- **Cross-browser**: Firefox and Edge compatibility

### Medium Priority

- **New Features**: User-requested functionality
- **UI/UX**: Interface improvements
- **Documentation**: Better guides and examples
- **Testing**: Automated test coverage

### Low Priority

- **Refactoring**: Code cleanup and organization
- **Optimization**: Minor performance improvements
- **Styling**: Visual enhancements
- **Examples**: More tutorial content

## 📋 Development Roadmap

### Phase 1: Core Stability
- Fix critical bugs
- Improve cross-browser compatibility
- Enhance error handling
- Add comprehensive testing

### Phase 2: Feature Enhancement
- Advanced capture modes
- Better content extraction
- Improved PDF generation
- Enhanced UI/UX

### Phase 3: Advanced Features
- Cloud sync
- Collaboration features
- Advanced customization
- Plugin system

## 🏆 Recognition

### Contributors

We recognize all contributors in our:
- **README.md**: List of contributors
- **Release Notes**: Feature acknowledgments
- **Documentation**: Code examples and guides

### Types of Contributions

- **Code**: Bug fixes, features, improvements
- **Documentation**: Guides, tutorials, API docs
- **Testing**: Bug reports, test cases
- **Design**: UI/UX improvements, mockups
- **Community**: Help, support, feedback

## 📞 Contact

- **GitHub**: [@NoManNayeem](https://github.com/NoManNayeem)
- **Email**: support@docweaver.io
- **Discussions**: [GitHub Discussions](https://github.com/NoManNayeem/DocWeaver/discussions)

---

Thank you for contributing to DocWeaver! Your contributions help make documentation more accessible and organized for developers worldwide. 🌟
