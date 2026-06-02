/**
 * Extracts the YouTube video ID from any common YouTube URL format:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://www.youtube.com/watch?v=VIDEO_ID&list=...
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - Just a bare VIDEO_ID string (11-char alphanumeric)
 *
 * Returns null if no valid video ID can be found.
 */
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;

  // Already a bare video ID (11 alphanumeric chars)
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();

  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=...
    const vParam = parsed.searchParams.get('v');
    if (vParam) return vParam;

    // youtu.be/VIDEO_ID  or  youtube.com/embed/VIDEO_ID
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (
      (parsed.hostname === 'youtu.be' && pathParts.length > 0) ||
      (pathParts[0] === 'embed' && pathParts.length > 1)
    ) {
      return pathParts[pathParts.length - 1];
    }
  } catch {
    // not a valid URL — ignore
  }

  return null;
}

/**
 * Returns the YouTube thumbnail URL for a given video ID or URL.
 * Quality: 'hqdefault' (480×360) or 'maxresdefault' (1280×720, may not exist for all videos)
 */
export function getYouTubeThumbnail(
  urlOrId: string | null | undefined,
  quality: 'hqdefault' | 'maxresdefault' = 'hqdefault'
): string | null {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

/**
 * Returns the YouTube embed URL for use in an <iframe>.
 */
export function getYouTubeEmbedUrl(urlOrId: string | null | undefined): string | null {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
}

const FALLBACK_IMAGES = [
  '/images/watercolor.jpg',
  '/images/blue-flowers.jpg',
  '/images/snowy-lake.jpg',
  '/images/glass-flowers.jpg',
  '/images/seascape.jpg',
  '/images/blue-water.jpg'
];

/**
 * Returns a course cover image. If a valid YouTube ID is found, returns its thumbnail.
 * Otherwise, returns a deterministic beautiful fallback image based on the courseId.
 */
export function getCourseCoverImage(
  urlOrId: string | null | undefined, 
  courseId: number = 0,
  quality: 'hqdefault' | 'maxresdefault' = 'hqdefault'
): string {
  const ytThumb = getYouTubeThumbnail(urlOrId, quality);
  if (ytThumb) return ytThumb;
  
  const index = Math.abs(courseId) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
}
