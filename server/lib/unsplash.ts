interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    full: string;
  };
  alt_description: string | null;
}

export async function getRandomPhoto(query: string): Promise<string> {
  try {
    // Using Unsplash Source API (no API key required for basic usage)
    // This returns a random photo URL based on the search term
    const url = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(query)}`;
    return url;
  } catch (error) {
    console.error("Error fetching photo:", error);
    // Fallback to a generic landscape photo
    return "https://source.unsplash.com/1920x1080/?nature";
  }
}

export async function getRandomPhotos(queries: string[], count: number): Promise<string[]> {
  const photos: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const query = queries[i % queries.length];
    const photo = await getRandomPhoto(query);
    photos.push(photo);
  }
  
  return photos;
}
