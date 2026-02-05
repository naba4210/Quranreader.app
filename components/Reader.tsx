import React, { useRef, useEffect } from 'react';
import { Verse, Chapter, AppSettings } from '../types';

interface ReaderProps {
  verses: Verse[];
  chapter: Chapter | null;
  settings: AppSettings;
  activeVerseIndex: number;
  onVerseClick: (index: number) => void;
}

const Reader: React.FC<ReaderProps> = ({ verses, chapter, settings, activeVerseIndex, onVerseClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const verseRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll effect
  useEffect(() => {
    if (settings.autoScroll && activeVerseIndex >= 0 && verseRefs.current[activeVerseIndex]) {
      verseRefs.current[activeVerseIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeVerseIndex, settings.autoScroll]);

  if (!chapter) return null;

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto px-4 md:px-8 lg:px-20 py-8"
    >
      <div className="max-w-4xl mx-auto mb-12 text-center">
         <div className="mb-6 font-uthmani text-4xl text-emerald-900 dark:text-emerald-400 drop-shadow-sm">
           {chapter.name_arabic}
         </div>
         {chapter.bismillah_pre && (
           <div className="font-uthmani text-3xl mb-8 text-emerald-800/80 dark:text-emerald-300/80">
             بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
           </div>
         )}
      </div>

      <div className="space-y-6 max-w-4xl mx-auto pb-24">
        {verses.map((verse, index) => {
          const isActive = index === activeVerseIndex;
          
          // Determine which script to show
          // Fallback to Uthmani if IndoPak is requested but missing
          const isIndoPak = settings.script === 'indopak' && !!verse.text_indopak;
          const arabicText = isIndoPak ? verse.text_indopak : verse.text_uthmani;
          const fontClass = isIndoPak ? 'font-indoPak' : 'font-uthmani';

          return (
            <div 
              key={verse.id}
              ref={(el) => { verseRefs.current[index] = el; }}
              onClick={() => onVerseClick(index)}
              className={`
                group rounded-xl p-4 transition-all duration-300 cursor-pointer
                ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-200 dark:ring-emerald-800 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'}
              `}
            >
              <div className="flex flex-col gap-6">
                 {/* Top Bar: Verse Number & Actions */}
                 <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      {chapter.id}:{verse.verse_key.split(':')[1]}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Placeholder for future actions like bookmark/share */}
                      Play
                    </div>
                 </div>

                 {/* Arabic Text */}
                 <div 
                   dir="rtl"
                   className={`
                     text-right leading-[2.5] text-gray-800 dark:text-gray-100 ${fontClass}
                   `}
                   style={{ fontSize: `${settings.arabicFontSize}px` }}
                 >
                   {arabicText || <span className="text-gray-300 text-lg font-sans">Loading Arabic...</span>}
                 </div>

                 {/* Translation */}
                 {settings.showTranslation && (
                   <div 
                     className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans"
                     style={{ fontSize: `${settings.translationFontSize}px` }}
                   >
                     {verse.translations && verse.translations.length > 0 ? (
                       <div dangerouslySetInnerHTML={{ __html: verse.translations[0].text }} />
                     ) : (
                       <span className="text-gray-400 italic text-sm">Translation not available</span>
                     )}
                   </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reader;