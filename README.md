# DocWeaver - Technical Documentation PDF Generator

Seamlessly weave technical documentation into beautiful PDFs with this browser extension.

## Features

- **One-click capture** of technical documentation
- **Intelligent content extraction** with code syntax preservation  
- **Beautiful PDF generation** with source attribution
- **Zero configuration** required - works out of the box
- **Cross-browser support** for Chrome, Edge, and Firefox

## Installation

### Chrome/Edge
1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the DocWeaver directory

### Firefox
1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on" and select the `manifest.json` file

## Usage

1. **Start Collecting**: Click the floating action button (FAB) on any webpage
2. **Choose Capture Mode**:
   - **Full Page**: Capture entire page
   - **Smart Selection**: Select specific content
   - **Article Only**: Main content only
   - **Code Only**: Code blocks only
3. **Organize**: Use the sidebar to reorder pages
4. **Generate PDF**: Click "Generate PDF" to create a beautiful PDF

## Keyboard Shortcuts

- `Alt + A`: Add current page
- `Alt + S`: Start selection mode
- `Alt + V`: View collection
- `Alt + G`: Generate PDF
- `Alt + C`: Clear collection
- `Esc`: Exit current mode

## Development

### Project Structure
```
docweaver/
├── manifest.json          # Extension configuration
├── background/            # Background service worker
├── content/              # Content scripts
├── ui/                   # UI styles
├── sidebar/              # Collection manager
├── popup/                # Extension popup
├── print/                # PDF generation
├── lib/                  # Vendor libraries
├── assets/               # Icons and assets
└── test/                 # Test fixtures
```

### Testing
1. Load the extension in your browser
2. Open `test/fixtures/article.html` and `test/fixtures/code.html`
3. Test different capture modes
4. Verify PDF generation works correctly

## Browser Support

- Chrome 88+
- Edge 88+
- Firefox 109+

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

- Documentation: https://docs.docweaver.io
- Issues: https://github.com/docweaver/extension/issues
- Email: support@docweaver.io
