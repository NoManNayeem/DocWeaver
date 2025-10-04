// DocWeaver API Server
// Combines quote and photo APIs for the about page

const { handleRequest: handleQuoteRequest } = require('./quote-api');
const { handleRequest: handlePhotoRequest } = require('./photo-api');

// Combined API handler
function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  // Route to appropriate API
  if (path.startsWith('/api/quote')) {
    return handleQuoteRequest(request);
  } else if (path.startsWith('/api/photo')) {
    return handlePhotoRequest(request);
  } else if (path === '/api/random') {
    // Combined random quote and photo
    return handleRandomCombination(request);
  } else if (path === '/api/about') {
    // About page data
    return handleAboutData(request);
  } else {
    return new Response(JSON.stringify({
      success: false,
      error: 'Endpoint not found',
      availableEndpoints: [
        '/api/quote',
        '/api/quotes',
        '/api/photo',
        '/api/photos',
        '/api/random',
        '/api/about'
      ]
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle random combination of quote and photo
function handleRandomCombination(request) {
  const { getRandomQuote } = require('./quote-api');
  const { getRandomPhoto } = require('./photo-api');
  
  const quote = getRandomQuote();
  const photo = getRandomPhoto();
  
  return new Response(JSON.stringify({
    success: true,
    data: {
      quote,
      photo
    },
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Handle about page data
function handleAboutData(request) {
  const { getRandomQuote } = require('./quote-api');
  const { getRandomPhoto } = require('./photo-api');
  
  const quote = getRandomQuote();
  const photo = getRandomPhoto();
  
  const aboutData = {
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
        rating: "4.5+ stars",
        browsers: "Chrome, Edge, Firefox",
        license: "MIT"
      }
    },
    quote,
    photo
  };
  
  return new Response(JSON.stringify({
    success: true,
    data: aboutData,
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    handleRequest,
    handleRandomCombination,
    handleAboutData
  };
} else if (typeof window !== 'undefined') {
  // Browser environment
  window.DocWeaverAPI = {
    handleRequest,
    handleRandomCombination,
    handleAboutData
  };
}
