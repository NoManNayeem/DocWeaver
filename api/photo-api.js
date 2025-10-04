// DocWeaver Photo API
// Provides random photos for the about page

const photos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    alt: "Professional developer working on code",
    title: "Code Development",
    description: "A developer focused on writing clean, efficient code",
    category: "development",
    tags: ["coding", "programming", "developer", "workspace"]
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=face",
    alt: "Team collaboration and brainstorming",
    title: "Team Collaboration",
    description: "Developers working together on a project",
    category: "collaboration",
    tags: ["team", "collaboration", "meeting", "discussion"]
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=face",
    alt: "Learning and education",
    title: "Continuous Learning",
    description: "The importance of continuous learning in technology",
    category: "learning",
    tags: ["education", "learning", "books", "knowledge"]
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop&crop=face",
    alt: "Problem solving and innovation",
    title: "Innovation",
    description: "Creative problem solving and innovative thinking",
    category: "innovation",
    tags: ["innovation", "creativity", "problem-solving", "ideas"]
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face",
    alt: "Technology and future",
    title: "Future Technology",
    description: "Embracing the future of technology",
    category: "technology",
    tags: ["technology", "future", "innovation", "digital"]
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=face",
    alt: "Documentation and writing",
    title: "Technical Writing",
    description: "The art of technical documentation",
    category: "documentation",
    tags: ["writing", "documentation", "technical", "communication"]
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=400&fit=crop&crop=face",
    alt: "Open source and community",
    title: "Open Source",
    description: "Contributing to open source projects",
    category: "opensource",
    tags: ["opensource", "community", "contribution", "sharing"]
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop&crop=face",
    alt: "Team building and networking",
    title: "Community Building",
    description: "Building strong developer communities",
    category: "community",
    tags: ["community", "networking", "team", "connection"]
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop&crop=face",
    alt: "Work-life balance",
    title: "Work-Life Balance",
    description: "Maintaining a healthy work-life balance",
    category: "lifestyle",
    tags: ["balance", "lifestyle", "wellness", "health"]
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    alt: "Mentorship and teaching",
    title: "Mentorship",
    description: "Sharing knowledge and mentoring others",
    category: "mentorship",
    tags: ["mentorship", "teaching", "sharing", "guidance"]
  }
];

// Get random photo
function getRandomPhoto() {
  const randomIndex = Math.floor(Math.random() * photos.length);
  return photos[randomIndex];
}

// Get photo by category
function getPhotoByCategory(category) {
  const categoryPhotos = photos.filter(photo => 
    photo.category.toLowerCase() === category.toLowerCase()
  );
  
  if (categoryPhotos.length === 0) {
    return getRandomPhoto();
  }
  
  const randomIndex = Math.floor(Math.random() * categoryPhotos.length);
  return categoryPhotos[randomIndex];
}

// Get all categories
function getCategories() {
  const categories = [...new Set(photos.map(photo => photo.category))];
  return categories.sort();
}

// Get photos by tag
function getPhotosByTag(tag) {
  return photos.filter(photo => 
    photo.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

// Get photo by ID
function getPhotoById(id) {
  return photos.find(photo => photo.id === parseInt(id));
}

// API endpoint for random photo
function handlePhotoRequest(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const tag = url.searchParams.get('tag');
  const id = url.searchParams.get('id');
  
  let photo;
  
  if (id) {
    photo = getPhotoById(id);
    if (!photo) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Photo not found',
        timestamp: new Date().toISOString()
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } else if (category) {
    photo = getPhotoByCategory(category);
  } else if (tag) {
    const tagPhotos = getPhotosByTag(tag);
    if (tagPhotos.length > 0) {
      const randomIndex = Math.floor(Math.random() * tagPhotos.length);
      photo = tagPhotos[randomIndex];
    } else {
      photo = getRandomPhoto();
    }
  } else {
    photo = getRandomPhoto();
  }
  
  return new Response(JSON.stringify({
    success: true,
    data: photo,
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

// API endpoint for all photos
function handleAllPhotosRequest() {
  return new Response(JSON.stringify({
    success: true,
    data: photos,
    count: photos.length,
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
    case '/api/photo':
      return handlePhotoRequest(request);
    case '/api/photos':
      return handleAllPhotosRequest();
    case '/api/photo-categories':
      return handleCategoriesRequest();
    default:
      return new Response(JSON.stringify({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
          '/api/photo',
          '/api/photos',
          '/api/photo-categories'
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
    getRandomPhoto,
    getPhotoByCategory,
    getCategories,
    getPhotosByTag,
    getPhotoById,
    handleRequest
  };
} else if (typeof window !== 'undefined') {
  // Browser environment
  window.PhotoAPI = {
    getRandomPhoto,
    getPhotoByCategory,
    getCategories,
    getPhotosByTag,
    getPhotoById
  };
}
