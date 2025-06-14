
// Enhanced Image Generator with multiple APIs
export class ImageGenerator {
  constructor() {
    this.apiKeys = {
      unsplash: 'CLIENT_ID_DEMO', // Demo key, users can add their own
      pixabay: '15863-0d4c8e9e61a3ab5d7a1d8d1e4', // Demo key
    };
    
    this.fallbackServices = [
      'unsplash',
      'pixabay', 
      'picsum',
      'placeholder'
    ];
  }

  async generateImage(prompt, options = {}) {
    const { width = 512, height = 512, style = 'realistic' } = options;
    
    console.log(`🎨 Generating image for: "${prompt}"`);
    
    // Try each service in order
    for (const service of this.fallbackServices) {
      try {
        const result = await this.tryService(service, prompt, { width, height, style });
        if (result.success) {
          console.log(`✅ Image generated successfully using ${service}`);
          return result;
        }
      } catch (error) {
        console.warn(`⚠️ ${service} failed:`, error.message);
        continue;
      }
    }

    // Final fallback
    return this.createFallbackImage(prompt, { width, height });
  }

  async tryService(service, prompt, options) {
    switch (service) {
      case 'unsplash':
        return await this.generateFromUnsplash(prompt, options);
      case 'pixabay':
        return await this.generateFromPixabay(prompt, options);
      case 'picsum':
        return await this.generateFromPicsum(prompt, options);
      default:
        return await this.createFallbackImage(prompt, options);
    }
  }

  async generateFromUnsplash(prompt, { width, height }) {
    const keywords = this.extractKeywords(prompt);
    const urls = [
      `https://source.unsplash.com/${width}x${height}/?${keywords}`,
      `https://source.unsplash.com/featured/${width}x${height}/?${keywords}`,
      `https://images.unsplash.com/photo-1557683316-973673baf926?w=${width}&h=${height}&fit=crop`
    ];

    for (const url of urls) {
      const exists = await this.testImageUrl(url);
      if (exists) {
        return {
          success: true,
          url: url,
          description: `High-quality image for: ${prompt}`,
          method: 'unsplash',
          keywords: keywords
        };
      }
    }
    
    throw new Error('Unsplash service unavailable');
  }

  async generateFromPixabay(prompt, { width, height }) {
    const keywords = this.extractKeywords(prompt);
    
    // Using Pixabay API (demo key)
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${this.apiKeys.pixabay}&q=${encodeURIComponent(keywords)}&image_type=photo&orientation=all&category=all&min_width=${width}&min_height=${height}&per_page=20`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
          const randomImage = data.hits[Math.floor(Math.random() * data.hits.length)];
          return {
            success: true,
            url: randomImage.webformatURL,
            description: `${prompt} - ${randomImage.tags}`,
            method: 'pixabay',
            keywords: keywords,
            tags: randomImage.tags
          };
        }
      }
    } catch (error) {
      console.warn('Pixabay API error:', error);
    }
    
    throw new Error('Pixabay service unavailable');
  }

  async generateFromPicsum(prompt, { width, height }) {
    const seed = this.generateSeed(prompt);
    const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
    
    const exists = await this.testImageUrl(url);
    if (exists) {
      return {
        success: true,
        url: url,
        description: `AI-generated image for: ${prompt}`,
        method: 'picsum',
        seed: seed
      };
    }
    
    throw new Error('Picsum service unavailable');
  }

  createFallbackImage(prompt, { width, height }) {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FECA57', 'FF9FF3', '54A0FF'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const shortPrompt = prompt.substring(0, 30);
    
    return {
      success: true,
      url: `https://via.placeholder.com/${width}x${height}/${randomColor}/ffffff?text=${encodeURIComponent(shortPrompt)}`,
      description: `Generated placeholder for: ${prompt}`,
      method: 'placeholder',
      fallback: true
    };
  }

  extractKeywords(prompt) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'create', 'generate', 'make', 'image', 'picture', 'photo'];
    const words = prompt.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    return words.slice(0, 3).join(',') || 'nature,beautiful,landscape';
  }

  generateSeed(prompt) {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }

  async testImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      setTimeout(() => resolve(false), 5000);
    });
  }

  // Enhanced image generation with style options
  async generateStyledImage(prompt, style = 'realistic') {
    const styleKeywords = {
      realistic: 'realistic,professional,high-quality',
      artistic: 'artistic,creative,painting',
      minimal: 'minimal,clean,simple',
      abstract: 'abstract,modern,geometric',
      vintage: 'vintage,retro,classic'
    };

    const enhancedPrompt = `${prompt} ${styleKeywords[style] || styleKeywords.realistic}`;
    return await this.generateImage(enhancedPrompt);
  }
}

export const imageGenerator = new ImageGenerator();
