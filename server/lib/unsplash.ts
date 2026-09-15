import {readFile} from "node:fs/promises";

export interface UnsplashPhoto {
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

// Upper bounds for the query broadening in getRandomPhotosByQuery, so that a
// long search term cannot burn through the Unsplash rate limit.
const MAX_QUERY_WORDS = 5;
const MAX_QUERY_CANDIDATES = 8;

const PLACEHOLDER_PHOTO: PhotoWithAttribution = {
  id: "fallback-placeholder",
  url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  authorName: "Unsplash",
  authorUsername: "unsplash",
  authorUrl: "https://unsplash.com/@unsplash",
  photoUrl: "https://unsplash.com/photos/mountain-range",
};

export function toPhotoWithAttribution(photo: UnsplashPhoto): PhotoWithAttribution {
  const trackingParams = `?utm_source=${encodeURIComponent('PowerPoint Karaoke')}&utm_medium=referral`;
  return {
    id: photo.id,
    url: photo.urls.regular,
    authorName: photo.user.name,
    authorUsername: photo.user.username,
    authorUrl: photo.user.links.html + trackingParams,
    photoUrl: photo.links.html + trackingParams,
  };
}

/**
 * Fetches a single random photo, optionally restricted to a search query.
 * Returns null if Unsplash has no photo matching the query.
 */
async function fetchRandomPhoto(query: string | undefined): Promise<UnsplashPhoto | null> {
  const params = new URLSearchParams({ orientation: "landscape" });
  if (query) {
    params.set("query", query);
  }

  const response = await fetch(`${UNSPLASH_API_URL}/photos/random?${params}`, {
    headers: {
      'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });

  // Unsplash answers with 404 when no photo matches the query
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  return response.json();
}

function combinations<T>(items: T[], size: number): T[][] {
  if (size === 0) {
    return [[]];
  }
  if (items.length < size) {
    return [];
  }

  const [first, ...rest] = items;
  return [
    ...combinations(rest, size - 1).map((combination) => [first, ...combination]),
    ...combinations(rest, size),
  ];
}

/**
 * Builds the list of search queries to try for a search term: the full term
 * first, followed by subsets of its words, largest subsets first.
 */
export function buildQueryCandidates(query: string): string[] {
  const words = query.trim().split(/\s+/).filter(Boolean);
  const candidates = [words.join(" ")];

  const subsetWords = words.slice(0, MAX_QUERY_WORDS);
  for (let size = Math.min(words.length - 1, subsetWords.length); size > 0; size--) {
    for (const combination of combinations(subsetWords, size)) {
      candidates.push(combination.join(" "));
    }
  }

  return Array.from(new Set(candidates)).filter(Boolean).slice(0, MAX_QUERY_CANDIDATES);
}

function pickFallbackPhoto(fallbackPhotos: PhotoWithAttribution[], excludeIds: string[]): PhotoWithAttribution {
  const unusedPhotos = fallbackPhotos.filter((photo) => !excludeIds.includes(photo.id));
  const candidates = unusedPhotos.length > 0 ? unusedPhotos : fallbackPhotos;
  if (candidates.length === 0) {
    return PLACEHOLDER_PHOTO;
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export async function getRandomPhotosByQuery(query: string, excludeIds: string[] = [], maxRetries: number = 5, fallbackPhotos: PhotoWithAttribution[]): Promise<PhotoWithAttribution> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("UNSPLASH_ACCESS_KEY not set, using fallback image");
    return pickFallbackPhoto(fallbackPhotos, excludeIds);
  }

  // Specific search terms may not match any photo, so broaden the search step
  // by step: the full term, then subsets of its words, then no query at all.
  const queries: (string | undefined)[] = [...buildQueryCandidates(query), undefined];
  let failures = 0;

  for (const candidate of queries) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      let photo: UnsplashPhoto | null;
      try {
        photo = await fetchRandomPhoto(candidate);
      } catch (error) {
        console.error("Error fetching photo from Unsplash API:", error);
        if (++failures >= maxRetries) {
          return pickFallbackPhoto(fallbackPhotos, excludeIds);
        }
        continue;
      }

      if (!photo) {
        console.log(`No Unsplash photos found for "${candidate}", broadening search`);
        break;
      }

      // Check if this photo ID has already been used
      if (excludeIds.includes(photo.id)) {
        console.log(`Duplicate photo detected (${photo.id}), retrying... (attempt ${attempt + 1}/${maxRetries})`);
        continue;
      }

      return toPhotoWithAttribution(photo);
    }
  }

  return pickFallbackPhoto(fallbackPhotos, excludeIds);
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
    
    return uniquePhotos.map(toPhotoWithAttribution);
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
