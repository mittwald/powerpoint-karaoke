import { observe, startObservation } from "@langfuse/tracing";

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
const UNSPLASH_API_URL = "https://api.unsplash.com";

async function fetchPhotos(query: string) {
  const uri = `${UNSPLASH_API_URL}/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`;
  const observation = startObservation("fetch", { metadata: { uri } });

  try {
    const response = await fetch(uri, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    observation.updateTrace({ metadata: { statusCode: response.status } });

    return response;
  } finally {
    observation.end();
  }
}

export async function getRandomPhotosByQuery(
  query: string,
  excludeIds: string[] = [],
  maxRetries: number = 5,
  fallbackPhotos: PhotoWithAttribution[],
): Promise<PhotoWithAttribution> {
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

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchPhotos(query);
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const photo: UnsplashPhoto = await response.json();

      // Check if this photo ID has already been used
      if (excludeIds.includes(photo.id)) {
        console.log(
          `Duplicate photo detected (${photo.id}), retrying... (attempt ${attempt + 1}/${maxRetries})`,
        );
        continue; // Try again
      }

      const trackingParams = `?utm_source=${encodeURIComponent("PowerPoint Karaoke")}&utm_medium=referral`;
      return {
        id: photo.id,
        url: photo.urls.regular,
        authorName: photo.user.name,
        authorUsername: photo.user.username,
        authorUrl: photo.user.links.html + trackingParams,
        photoUrl: photo.links.html + trackingParams,
      };
    } catch (error) {
      console.error("Error fetching photo from Unsplash API:", error);
      if (attempt === maxRetries - 1) {
        const randomFallback =
          fallbackPhotos[Math.floor(Math.random() * fallbackPhotos.length)];
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
