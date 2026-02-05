import { Chapter, Verse, Reciter } from '../types';

const BASE_URL = 'https://api.quran.com/api/v4';

export const fetchChapters = async (): Promise<Chapter[]> => {
  try {
    const response = await fetch(`${BASE_URL}/chapters`);
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
};

export const fetchVerses = async (
  chapterId: number, 
  page: number = 1,
  limit: number = 286 // Max verses in Baqarah
): Promise<Verse[]> => {
  try {
    // Parallel Fetch Strategy:
    // 1. Fetch Arabic Texts (Uthmani & IndoPak) explicitly via 'fields'
    // 2. Fetch Translations explicitly via 'translations' param
    // This avoids API behavior where requesting 'fields' strips 'translations' or vice versa.

    const textParams = new URLSearchParams({
      fields: 'text_uthmani,text_indopak',
      per_page: limit.toString(),
      page: page.toString(),
      words: 'false'
    });

    const translationParams = new URLSearchParams({
      language: 'en',
      translations: '131', // Clear Quran resource ID
      per_page: limit.toString(),
      page: page.toString(),
      words: 'false' // Disable words to keep payload lighter
    });

    const [textResponse, translationResponse] = await Promise.all([
      fetch(`${BASE_URL}/verses/by_chapter/${chapterId}?${textParams.toString()}`),
      fetch(`${BASE_URL}/verses/by_chapter/${chapterId}?${translationParams.toString()}`)
    ]);

    const textData = await textResponse.json();
    const translationData = await translationResponse.json();

    const versesText = textData.verses || [];
    const versesTranslation = translationData.verses || [];

    // Merge the two arrays based on index (safe since page/limit/chapter are identical)
    return versesText.map((verse: Verse, index: number) => {
      // Try to find by ID, fallback to index
      const translationVerse = versesTranslation.find((v: Verse) => v.id === verse.id) || versesTranslation[index];
      
      return {
        ...verse,
        translations: translationVerse?.translations || []
      };
    });

  } catch (error) {
    console.error('Error fetching verses:', error);
    return [];
  }
};

export const fetchReciters = async (): Promise<Reciter[]> => {
  try {
    const response = await fetch(`${BASE_URL}/resources/recitations`);
    const data = await response.json();
    // Filter for a few popular ones for the demo
    const popularIds = [7, 3, 4, 10]; // Mishary, Sudais, etc.
    return data.recitations.filter((r: any) => popularIds.includes(r.id) || r.style === 'Murattal');
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return [];
  }
};

export const getAudioUrl = (reciterId: number, verseKey: string): string => {
  // Helper to construct audio URL directly if needed
  return `${BASE_URL}/recitations/${reciterId}/by_ayah/${verseKey}`;
};

export const fetchVerseAudio = async (reciterId: number, verseKey: string): Promise<string | null> => {
    try {
        const response = await fetch(`${BASE_URL}/recitations/${reciterId}/by_ayah/${verseKey}`);
        const data = await response.json();
        const url = data.audio_files[0]?.url;

        if (!url) return null;

        // Quran.com API often returns relative URLs or protocol-relative URLs
        if (url.startsWith('//')) {
            return `https:${url}`;
        }
        // If it's just a path (e.g. "audio/123/...") without http, prepend base
        if (!url.startsWith('http')) {
            return `https://verses.quran.com/${url}`;
        }
        return url;
    } catch (e) {
        console.error("Failed to load audio", e);
        return null;
    }
}