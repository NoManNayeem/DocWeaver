// DocWeaver About Page JavaScript
// Handles API calls and dynamic content loading

class AboutPage {
    constructor() {
        this.apiBaseUrl = 'https://api.docweaver.io'; // Replace with your actual API URL
        this.fallbackData = this.getFallbackData();
        this.init();
    }

    init() {
        this.loadAboutData();
        this.setupEventListeners();
        this.loadRandomQuote();
        this.loadRandomPhoto();
    }

    setupEventListeners() {
        // Refresh quote button
        const refreshQuoteBtn = document.getElementById('refresh-quote');
        if (refreshQuoteBtn) {
            refreshQuoteBtn.addEventListener('click', () => {
                this.loadRandomQuote();
            });
        }

        // Refresh photo button (if added)
        const refreshPhotoBtn = document.getElementById('refresh-photo');
        if (refreshPhotoBtn) {
            refreshPhotoBtn.addEventListener('click', () => {
                this.loadRandomPhoto();
            });
        }
    }

    async loadAboutData() {
        try {
            const response = await this.fetchWithFallback('/api/about');
            const data = response.data;
            
            this.updateDeveloperInfo(data.developer);
            this.updateProjectInfo(data.project);
        } catch (error) {
            console.error('Error loading about data:', error);
            this.loadFallbackData();
        }
    }

    async loadRandomQuote() {
        try {
            const response = await this.fetchWithFallback('/api/quote');
            const quote = response.data;
            
            this.updateQuote(quote);
        } catch (error) {
            console.error('Error loading quote:', error);
            this.updateQuote(this.fallbackData.quote);
        }
    }

    async loadRandomPhoto() {
        try {
            const response = await this.fetchWithFallback('/api/photo');
            const photo = response.data;
            
            this.updatePhoto(photo);
        } catch (error) {
            console.error('Error loading photo:', error);
            this.updatePhoto(this.fallbackData.photo);
        }
    }

    async fetchWithFallback(url) {
        try {
            // Try to fetch from API
            const response = await fetch(this.apiBaseUrl + url);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('API request failed');
        } catch (error) {
            console.warn('API request failed, using fallback data:', error);
            // Return fallback data based on URL
            return this.getFallbackResponse(url);
        }
    }

    getFallbackResponse(url) {
        switch (url) {
            case '/api/about':
                return {
                    success: true,
                    data: {
                        developer: this.fallbackData.developer,
                        project: this.fallbackData.project,
                        quote: this.fallbackData.quote,
                        photo: this.fallbackData.photo
                    }
                };
            case '/api/quote':
                return {
                    success: true,
                    data: this.fallbackData.quote
                };
            case '/api/photo':
                return {
                    success: true,
                    data: this.fallbackData.photo
                };
            default:
                return {
                    success: false,
                    error: 'Unknown endpoint'
                };
        }
    }

    getFallbackData() {
        return {
            developer: {
                name: "Nayeem Islam",
                title: "Software Engineer & Creator of DocWeaver",
                bio: "Passionate software engineer with a vision to make documentation more accessible and organized for developers worldwide.",
                skills: ["JavaScript", "TypeScript", "React", "Node.js", "Browser Extensions", "Web APIs"],
                social: {
                    github: "https://github.com/NoManNayeem",
                    twitter: "https://twitter.com/nomanayeem",
                    linkedin: "https://linkedin.com/in/nomanayeem",
                    email: "nomanayeem@example.com"
                }
            },
            project: {
                name: "DocWeaver",
                description: "Browser extension that seamlessly weaves technical documentation into beautiful PDFs",
                features: [
                    "Multiple capture modes",
                    "Smart collection management",
                    "Beautiful PDF generation",
                    "Cross-browser support",
                    "Local storage privacy"
                ],
                stats: {
                    downloads: "1000+",
                    rating: "4.5+",
                    browsers: "3",
                    license: "MIT"
                }
            },
            quote: {
                text: "The best way to learn is to teach others.",
                author: "Nayeem Islam",
                category: "Learning"
            },
            photo: {
                id: 1,
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
                alt: "Professional developer working on code",
                title: "Code Development",
                description: "A developer focused on writing clean, efficient code",
                category: "development",
                tags: ["coding", "programming", "developer", "workspace"]
            }
        };
    }

    updateDeveloperInfo(developer) {
        const nameEl = document.getElementById('developer-name');
        const titleEl = document.getElementById('developer-title');
        const bioEl = document.getElementById('developer-bio');
        
        if (nameEl) nameEl.textContent = developer.name;
        if (titleEl) titleEl.textContent = developer.title;
        if (bioEl) bioEl.textContent = developer.bio;
    }

    updateProjectInfo(project) {
        const descriptionEl = document.querySelector('.project-description p');
        if (descriptionEl) {
            descriptionEl.textContent = project.description;
        }

        // Update stats
        const downloadCountEl = document.getElementById('download-count');
        const ratingEl = document.getElementById('rating');
        const browsersEl = document.getElementById('browsers');
        const licenseEl = document.getElementById('license');
        
        if (downloadCountEl) downloadCountEl.textContent = project.stats.downloads;
        if (ratingEl) ratingEl.textContent = project.stats.rating;
        if (browsersEl) browsersEl.textContent = project.stats.browsers;
        if (licenseEl) licenseEl.textContent = project.stats.license;
    }

    updateQuote(quote) {
        const quoteTextEl = document.getElementById('quote-text');
        const quoteAuthorEl = document.getElementById('quote-author');
        
        if (quoteTextEl) {
            quoteTextEl.textContent = quote.text;
            quoteTextEl.style.opacity = '0';
            setTimeout(() => {
                quoteTextEl.style.opacity = '1';
            }, 100);
        }
        
        if (quoteAuthorEl) {
            quoteAuthorEl.textContent = `- ${quote.author}`;
            quoteAuthorEl.style.opacity = '0';
            setTimeout(() => {
                quoteAuthorEl.style.opacity = '1';
            }, 200);
        }
    }

    updatePhoto(photo) {
        const photoEl = document.getElementById('developer-photo');
        if (photoEl) {
            photoEl.src = photo.url;
            photoEl.alt = photo.alt;
            photoEl.title = photo.title;
            
            // Add loading animation
            photoEl.style.opacity = '0';
            photoEl.onload = () => {
                photoEl.style.opacity = '1';
            };
        }
    }

    loadFallbackData() {
        this.updateDeveloperInfo(this.fallbackData.developer);
        this.updateProjectInfo(this.fallbackData.project);
        this.updateQuote(this.fallbackData.quote);
        this.updatePhoto(this.fallbackData.photo);
    }

    // Utility method to add loading states
    setLoading(elementId, isLoading) {
        const element = document.getElementById(elementId);
        if (element) {
            if (isLoading) {
                element.classList.add('loading');
            } else {
                element.classList.remove('loading');
            }
        }
    }

    // Method to refresh all content
    async refreshAll() {
        this.setLoading('quote-text', true);
        this.setLoading('developer-photo', true);
        
        await Promise.all([
            this.loadRandomQuote(),
            this.loadRandomPhoto()
        ]);
        
        this.setLoading('quote-text', false);
        this.setLoading('developer-photo', false);
    }
}

// Initialize the about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
} else if (typeof window !== 'undefined') {
    window.AboutPage = AboutPage;
}
