import {readFile} from "node:fs/promises";

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    full: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
}

export interface PhotoWithAttribution {
  id: string;
  url: string;
  authorName: string;
  authorUsername: string;
  authorUrl: string;
  photoUrl: string;
}

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export async function getRandomPhotosByQuery(query: string, excludeIds: string[] = [], maxRetries: number = 5, fallbackPhotos: PhotoWithAttribution[]): Promise<PhotoWithAttribution> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (!UNSPLASH_ACCESS_KEY) {
        console.warn("UNSPLASH_ACCESS_KEY not set, using fallback image");
        return {
          id: `fallback-${Date.now()}-${Math.random()}`,
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
          authorName: "Unsplash",
          authorUsername: "unsplash",
          authorUrl: "https://unsplash.com/@unsplash",
          photoUrl: "https://unsplash.com/photos/mountain-range",
        };
      }

      const response = await fetch(
        `${UNSPLASH_API_URL}/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const photo: UnsplashPhoto = await response.json();
      
      // Check if this photo ID has already been used
      if (excludeIds.includes(photo.id)) {
        console.log(`Duplicate photo detected (${photo.id}), retrying... (attempt ${attempt + 1}/${maxRetries})`);
        continue; // Try again
      }
      
      return {
        id: photo.id,
        url: photo.urls.regular,
        authorName: photo.user.name,
        authorUsername: photo.user.username,
        authorUrl: photo.user.links.html,
        photoUrl: photo.links.html,
      };
    } catch (error) {
      console.error("Error fetching photo from Unsplash API:", error);
      if (attempt === maxRetries - 1) {
        const randomFallback = fallbackPhotos[Math.floor(Math.random() * fallbackPhotos.length)];
        return randomFallback;
      }
    }
  }
  
  // Fallback if all retries exhausted
  return {
    id: `fallback-${Date.now()}-${Math.random()}`,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    authorName: "Unsplash",
    authorUsername: "unsplash",
    authorUrl: "https://unsplash.com/@unsplash",
    photoUrl: "https://unsplash.com/photos/mountain-range",
  };
}

export async function getRandomPhotos(count: number, excludeIds: string[] = []): Promise<PhotoWithAttribution[]> {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn("UNSPLASH_ACCESS_KEY not set, using fallback images");
      const fallbackPhotos: PhotoWithAttribution[] = [
        {
          id: "fallback-1",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
          authorName: "Unsplash",
          authorUsername: "unsplash",
          authorUrl: "https://unsplash.com/@unsplash",
          photoUrl: "https://unsplash.com/photos/mountain-range",
        },
        {
          id: "fallback-2",
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
          authorName: "Unsplash",
          authorUsername: "unsplash",
          authorUrl: "https://unsplash.com/@unsplash",
          photoUrl: "https://unsplash.com/photos/forest",
        },
        {
          id: "fallback-3",
          url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop",
          authorName: "Unsplash",
          authorUsername: "unsplash",
          authorUrl: "https://unsplash.com/@unsplash",
          photoUrl: "https://unsplash.com/photos/nature",
        },
        {
          id: "fallback-4",
          url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop",
          authorName: "Unsplash",
          authorUsername: "unsplash",
          authorUrl: "https://unsplash.com/@unsplash",
          photoUrl: "https://unsplash.com/photos/landscape",
        },
        {
          id: "fallback-5",
          url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop",
          authorName: "Unsplash",
          authorUsername: "unsplash",
          authorUrl: "https://unsplash.com/@unsplash",
          photoUrl: "https://unsplash.com/photos/sunset",
        },
      ];
      return Array(count).fill(0).map((_, i) => fallbackPhotos[i % fallbackPhotos.length]);
    }

    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?count=${Math.min(count, 30)}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const photos: UnsplashPhoto[] = await response.json();
    
    // Filter out any duplicates based on excludeIds
    const uniquePhotos = photos.filter(photo => !excludeIds.includes(photo.id));
    
    return uniquePhotos.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      authorName: photo.user.name,
      authorUsername: photo.user.username,
      authorUrl: photo.user.links.html,
      photoUrl: photo.links.html,
    }));
  } catch (error) {
    console.error("Error fetching random photos from Unsplash API:", error);
    // Fallback to generic landscape photos
    const fallbackPhotos: PhotoWithAttribution[] = [
      {
        id: "fallback-1",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
        authorName: "Unsplash",
        authorUsername: "unsplash",
        authorUrl: "https://unsplash.com/@unsplash",
        photoUrl: "https://unsplash.com/photos/mountain-range",
      },
      {
        id: "fallback-2",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
        authorName: "Unsplash",
        authorUsername: "unsplash",
        authorUrl: "https://unsplash.com/@unsplash",
        photoUrl: "https://unsplash.com/photos/forest",
      },
      {
        id: "fallback-3",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop",
        authorName: "Unsplash",
        authorUsername: "unsplash",
        authorUrl: "https://unsplash.com/@unsplash",
        photoUrl: "https://unsplash.com/photos/nature",
      },
      {
        id: "fallback-4",
        url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop",
        authorName: "Unsplash",
        authorUsername: "unsplash",
        authorUrl: "https://unsplash.com/@unsplash",
        photoUrl: "https://unsplash.com/photos/landscape",
      },
      {
        id: "fallback-5",
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop",
        authorName: "Unsplash",
        authorUsername: "unsplash",
        authorUrl: "https://unsplash.com/@unsplash",
        photoUrl: "https://unsplash.com/photos/sunset",
      },
    ];
    return Array(count).fill(0).map((_, i) => fallbackPhotos[i % fallbackPhotos.length]);
  }
}
