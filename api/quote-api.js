// DocWeaver Quote API
// Provides random quotes for the about page

const quotes = [
  {
    text: "The best way to learn is to teach others.",
    author: "Nayeem Islam",
    category: "Learning"
  },
  {
    text: "Code is poetry written in logic.",
    author: "Nayeem Islam",
    category: "Programming"
  },
  {
    text: "Documentation is the bridge between ideas and understanding.",
    author: "Nayeem Islam",
    category: "Documentation"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: "Design"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivation"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "Innovation"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Dreams"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Success"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Action"
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "Life"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "Motivation"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Opportunity"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Timing"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "Limitations"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "Growth"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "Dreams"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
    category: "Success"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
    category: "Achievement"
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Unknown",
    category: "Ambition"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
    category: "Persistence"
  }
];

// Get random quote
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Get quote by category
function getQuoteByCategory(category) {
  const categoryQuotes = quotes.filter(quote => 
    quote.category.toLowerCase() === category.toLowerCase()
  );
  
  if (categoryQuotes.length === 0) {
    return getRandomQuote();
  }
  
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
}

// Get all categories
function getCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  return categories.sort();
}

// Get quotes by author
function getQuotesByAuthor(author) {
  return quotes.filter(quote => 
    quote.author.toLowerCase().includes(author.toLowerCase())
  );
}

// API endpoint for random quote
function handleQuoteRequest(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const author = url.searchParams.get('author');
  
  let quote;
  
  if (category) {
    quote = getQuoteByCategory(category);
  } else if (author) {
    const authorQuotes = getQuotesByAuthor(author);
    if (authorQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * authorQuotes.length);
      quote = authorQuotes[randomIndex];
    } else {
      quote = getRandomQuote();
    }
  } else {
    quote = getRandomQuote();
  }
  
  return new Response(JSON.stringify({
    success: true,
    data: quote,
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

// API endpoint for all quotes
function handleAllQuotesRequest() {
  return new Response(JSON.stringify({
    success: true,
    data: quotes,
    count: quotes.length,
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

// API endpoint for categories
function handleCategoriesRequest() {
  return new Response(JSON.stringify({
    success: true,
    data: getCategories(),
    count: getCategories().length,
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

// Main API handler
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
  
  switch (path) {
    case '/api/quote':
      return handleQuoteRequest(request);
    case '/api/quotes':
      return handleAllQuotesRequest();
    case '/api/categories':
      return handleCategoriesRequest();
    default:
      return new Response(JSON.stringify({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
          '/api/quote',
          '/api/quotes',
          '/api/categories'
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

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    getRandomQuote,
    getQuoteByCategory,
    getCategories,
    getQuotesByAuthor,
    handleRequest
  };
} else if (typeof window !== 'undefined') {
  // Browser environment
  window.QuoteAPI = {
    getRandomQuote,
    getQuoteByCategory,
    getCategories,
    getQuotesByAuthor
  };
}
