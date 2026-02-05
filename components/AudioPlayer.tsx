import React, { useEffect, useRef, useState } from 'react';
import { Verse } from '../types';
import { Icons } from '../constants';
import { fetchVerseAudio } from '../services/quranService';

interface AudioPlayerProps {
  verses: Verse[];
  activeVerseIndex: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  reciterId: number;
  onVerseChange: (index: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  verses, 
  activeVerseIndex, 
  isPlaying, 
  setIsPlaying, 
  reciterId,
  onVerseChange 
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Cache audio URLs to prevent re-fetching and enable instant playback
  const urlCache = useRef<Record<string, string>>({});

  // Clear cache if reciter changes
  useEffect(() => {
    urlCache.current = {};
  }, [reciterId]);

  // Initialize Audio Object
  useEffect(() => {
    audioRef.current = new Audio();
    // Enable preloading to help with buffering
    audioRef.current.preload = "auto";
    audioRef.current.onended = handleEnded;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  // Re-bind listener when dependencies change so handleEnded has fresh closure scope
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, verses.length, activeVerseIndex]); 

  // Handle Playback Logic
  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current || activeVerseIndex < 0 || activeVerseIndex >= verses.length) return;

      const verse = verses[activeVerseIndex];
      const verseKey = verse.verse_key;
      
      // 1. Check Cache First
      let url = urlCache.current[verseKey];
      
      if (!url) {
        setLoading(true);
        try {
          const fetchedUrl = await fetchVerseAudio(reciterId, verseKey);
          if (fetchedUrl) {
            url = fetchedUrl;
            urlCache.current[verseKey] = url;
          }
        } catch (e) {
          console.error("Error setting audio", e);
        } finally {
          setLoading(false);
        }
      }

      // 2. Play Audio
      if (url) {
        if (audioRef.current.src !== url) {
           audioRef.current.src = url;
        }
        
        if (isPlaying) {
           const playPromise = audioRef.current.play();
           if (playPromise !== undefined) {
             playPromise.catch(e => {
               console.error("Playback failed", e);
               setIsPlaying(false);
             });
           }
        } else {
          audioRef.current.pause();
        }

        // 3. Preload Next Verse (Lookahead)
        // This drastically reduces delay for the next track
        const nextIndex = activeVerseIndex + 1;
        if (nextIndex < verses.length) {
          const nextKey = verses[nextIndex].verse_key;
          if (!urlCache.current[nextKey]) {
            // Fetch URL silently
            fetchVerseAudio(reciterId, nextKey).then(nextUrl => {
              if (nextUrl) {
                urlCache.current[nextKey] = nextUrl;
                // Optional: Create a temporary audio object to buffer the content
                const preload = new Audio(nextUrl);
                preload.preload = 'auto';
              }
            }).catch(e => console.error("Preload failed", e));
          }
        }
      }
    };

    playAudio();
  }, [activeVerseIndex, isPlaying, reciterId, verses, setIsPlaying]);


  const handleEnded = () => {
    if (autoPlay && activeVerseIndex < verses.length - 1) {
      onVerseChange(activeVerseIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (activeVerseIndex === -1 && verses.length > 0) {
      onVerseChange(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (activeVerseIndex < verses.length - 1) onVerseChange(activeVerseIndex + 1);
  };

  const handlePrev = () => {
    if (activeVerseIndex > 0) onVerseChange(activeVerseIndex - 1);
  };

  return (
    <div className="h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 z-50 shadow-lg">
      <div className="flex flex-col w-1/3">
        {activeVerseIndex >= 0 && verses[activeVerseIndex] && (
           <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
             Verse {verses[activeVerseIndex].verse_key}
           </div>
        )}
        <div className="text-xs text-gray-500">Mishary Rashid Alafasy</div>
      </div>

      <div className="flex items-center gap-6 w-1/3 justify-center">
        <button onClick={handlePrev} className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <Icons.SkipBack className="h-5 w-5" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          disabled={loading && !urlCache.current[verses[activeVerseIndex]?.verse_key]}
        >
          {loading && !urlCache.current[verses[activeVerseIndex]?.verse_key] ? (
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isPlaying ? (
            <Icons.Pause className="h-6 w-6 fill-current" />
          ) : (
            <Icons.Play className="h-6 w-6 ml-1 fill-current" />
          )}
        </button>

        <button onClick={handleNext} className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <Icons.SkipForward className="h-5 w-5" />
        </button>
      </div>

      <div className="w-1/3 flex justify-end gap-4 items-center">
        <button 
          onClick={() => setAutoPlay(!autoPlay)}
          title="Toggle Auto Play"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            autoPlay 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Icons.Repeat className="h-4 w-4" />
          <span className="hidden sm:inline">Auto Play</span>
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;