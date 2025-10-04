# Frequently Asked Questions (FAQ)

Common questions and answers about DocWeaver browser extension.

## 📚 Table of Contents

- [General Questions](#general-questions)
- [Installation & Setup](#installation--setup)
- [Usage & Features](#usage--features)
- [Troubleshooting](#troubleshooting)
- [Technical Questions](#technical-questions)
- [Browser Compatibility](#browser-compatibility)
- [Performance & Optimization](#performance--optimization)

## ❓ General Questions

### What is DocWeaver?

DocWeaver is a browser extension that helps you collect, organize, and compile technical documentation from multiple sources into beautiful, professional PDFs. It's designed for developers, technical writers, and anyone who needs to create comprehensive documentation.

### Who is DocWeaver for?

DocWeaver is perfect for:
- **Developers** learning new technologies
- **Technical Writers** creating documentation
- **Students** compiling research materials
- **Consultants** building knowledge bases
- **Anyone** who needs to organize web content

### Is DocWeaver free?

Yes, DocWeaver is completely free and open-source. You can use it without any restrictions, and the source code is available on GitHub.

### How does DocWeaver work?

DocWeaver works by:
1. **Capturing content** from web pages using different modes
2. **Organizing content** in a collection sidebar
3. **Generating PDFs** with professional formatting
4. **Storing everything** locally in your browser

### What makes DocWeaver different?

- **Smart content extraction** with multiple capture modes
- **Beautiful PDF generation** with syntax highlighting
- **Local storage** - your data stays on your device
- **Cross-browser support** for Chrome, Edge, and Firefox
- **No registration required** - works immediately

## 🔧 Installation & Setup

### How do I install DocWeaver?

1. **Download** from [GitHub Releases](https://github.com/NoManNayeem/DocWeaver/releases)
2. **Extract** the ZIP file to a folder
3. **Load** the extension in your browser:
   - Chrome: `chrome://extensions/` → Load unpacked
   - Edge: `edge://extensions/` → Load unpacked
   - Firefox: `about:debugging` → Load temporary add-on

### Do I need to create an account?

No, DocWeaver doesn't require any account or registration. It works entirely locally in your browser.

### What permissions does DocWeaver need?

DocWeaver requests minimal permissions:
- **activeTab**: Access current webpage
- **scripting**: Inject content scripts
- **storage**: Save collections locally
- **tabs**: Manage browser tabs
- **contextMenus**: Add right-click options

### Is DocWeaver safe to use?

Yes, DocWeaver is completely safe:
- **Open source** - code is publicly available
- **Local storage** - no data leaves your browser
- **No external requests** - doesn't connect to external servers
- **Minimal permissions** - only what's necessary

### Can I use DocWeaver on mobile?

Currently, DocWeaver is designed for desktop browsers. Mobile support may be added in future versions.

## 🎯 Usage & Features

### How do I start using DocWeaver?

1. **Look for the FAB** (floating action button) in the bottom-right corner
2. **Click the FAB** to open the capture menu
3. **Choose a capture mode** based on your needs
4. **Capture content** and organize in the sidebar
5. **Generate PDFs** when ready

### What are the different capture modes?

- **Full Page**: Captures the entire webpage
- **Smart Selection**: Select specific content elements
- **Article Only**: Extracts main content without clutter
- **Code Only**: Captures code blocks with syntax highlighting

### How do I use Smart Selection?

1. **Click "Smart Selection"** in the FAB menu
2. **Click on content** you want to capture
3. **Auto-expansion** will include related content
4. **Click "Capture Selected"** when done

### How do I organize my collection?

- **Drag and drop** to reorder pages
- **Edit titles** by clicking the edit icon
- **Delete pages** you don't need
- **View pages** to preview content

### How do I generate a PDF?

1. **Open your collection** by clicking the eye icon
2. **Review and organize** your pages
3. **Click "Generate PDF"** in the sidebar
4. **Save the PDF** when prompted

### Can I edit captured content?

Yes, you can:
- **Edit page titles** in the collection
- **Add your own notes** to pages
- **Reorder pages** as needed
- **Delete unwanted pages**

## 🔧 Troubleshooting

### The FAB is not appearing on the page

**Possible causes:**
- Extension not loaded properly
- Page has JavaScript errors
- Browser compatibility issues

**Solutions:**
1. **Refresh the page** and try again
2. **Check browser console** for errors
3. **Reload the extension** in browser settings
4. **Try a different webpage**

### Content is not being captured properly

**Possible causes:**
- Page has dynamic content
- Content is behind authentication
- Capture mode not suitable

**Solutions:**
1. **Try different capture modes**
2. **Wait for page to fully load**
3. **Use Smart Selection** for specific content
4. **Check if content is visible**

### PDF generation is not working

**Possible causes:**
- Collection is empty
- Browser print settings
- Content formatting issues

**Solutions:**
1. **Check collection has content**
2. **Verify browser print settings**
3. **Try with smaller collection**
4. **Check for formatting errors**

### The extension is slow or crashes

**Possible causes:**
- Large collection size
- Browser memory issues
- Conflicting extensions

**Solutions:**
1. **Reduce collection size**
2. **Close unnecessary tabs**
3. **Restart browser**
4. **Disable conflicting extensions**

### I'm getting error messages

**Common errors:**
- "Extension not loaded" → Reload extension
- "Content not found" → Try different capture mode
- "PDF generation failed" → Check collection content

**Solutions:**
1. **Check browser console** for detailed errors
2. **Try different websites** to test
3. **Reload the extension** if needed
4. **Contact support** if issues persist

## 🔧 Technical Questions

### What browsers are supported?

- **Chrome** 88+ (recommended)
- **Edge** 88+ (recommended)
- **Firefox** 109+ (beta support)

### What file formats are supported?

- **Input**: HTML web pages
- **Output**: PDF documents
- **Storage**: Local browser storage

### How is data stored?

Data is stored locally in your browser using:
- **Chrome/Edge**: chrome.storage.local
- **Firefox**: browser.storage.local
- **No cloud storage** - everything stays local

### Can I export my collections?

Currently, collections are stored locally. Export functionality may be added in future versions.

### How much storage does DocWeaver use?

Storage usage depends on:
- **Number of pages** in collections
- **Content size** of each page
- **Images and media** included

Typical usage: 1-10MB per collection

### Can I use DocWeaver offline?

Yes, once content is captured, you can:
- **View collections** offline
- **Generate PDFs** offline
- **Access captured content** without internet

## 🌐 Browser Compatibility

### Chrome Support

**Requirements:**
- Chrome 88 or higher
- Manifest V3 support
- JavaScript enabled

**Features:**
- Full functionality
- Best performance
- All capture modes

### Edge Support

**Requirements:**
- Edge 88 or higher
- Chromium-based Edge
- JavaScript enabled

**Features:**
- Full functionality
- Chrome compatibility
- All capture modes

### Firefox Support

**Requirements:**
- Firefox 109 or higher
- Manifest V3 support
- JavaScript enabled

**Features:**
- Basic functionality
- Some limitations
- Core capture modes

### Safari Support

Currently not supported. Safari support may be added in future versions.

## ⚡ Performance & Optimization

### How can I improve performance?

1. **Limit collection size** (under 50 pages)
2. **Remove unnecessary content**
3. **Close unnecessary browser tabs**
4. **Clear browser cache regularly**

### What affects PDF generation speed?

- **Collection size** (number of pages)
- **Content complexity** (images, code)
- **Browser performance**
- **System resources**

### How can I optimize storage usage?

1. **Remove old collections**
2. **Delete unnecessary pages**
3. **Compress images** before capture
4. **Use efficient capture modes**

### Why is the extension slow?

Common causes:
- **Large collections** (100+ pages)
- **Complex content** (many images)
- **Browser memory issues**
- **Conflicting extensions**

### How can I speed up content capture?

1. **Use appropriate capture modes**
2. **Avoid capturing unnecessary content**
3. **Wait for pages to fully load**
4. **Use Smart Selection** for specific content

## 🎯 Advanced Usage

### Can I customize the extension?

Currently, customization is limited. Future versions may include:
- **Theme customization**
- **Layout options**
- **Custom settings**
- **Plugin support**

### Can I use DocWeaver for commercial purposes?

Yes, DocWeaver is open-source and can be used for any purpose, including commercial use.

### Can I contribute to DocWeaver?

Yes! We welcome contributions:
- **Code contributions** via GitHub
- **Bug reports** and feature requests
- **Documentation** improvements
- **Testing** and feedback

### How do I report bugs?

1. **Check existing issues** on GitHub
2. **Create a new issue** with details
3. **Include steps to reproduce**
4. **Provide browser and system info**

### How do I request features?

1. **Check existing feature requests**
2. **Create a new issue** with the feature request template
3. **Describe the feature** and its benefits
4. **Provide use cases** and examples

## 📞 Support & Community

### Where can I get help?

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community help
- **Documentation**: Comprehensive guides and tutorials
- **Email**: support@docweaver.io

### How can I stay updated?

- **GitHub Releases**: New versions and updates
- **GitHub Discussions**: Community announcements
- **Email Notifications**: Subscribe to updates
- **Social Media**: Follow project updates

### Can I join the community?

Yes! Join our community:
- **GitHub Discussions**: Ask questions and share ideas
- **Issue Tracker**: Report bugs and request features
- **Contributing**: Help improve the project
- **Documentation**: Help improve guides and tutorials

---

**Still have questions?** Check our [documentation](docs/README.md) or [contact support](mailto:support@docweaver.io) for help!
