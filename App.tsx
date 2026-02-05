import React, { useState, useEffect } from 'react';
import { Icons } from './constants';
import { Chapter, AppSettings, Verse } from './types';
import { fetchChapters, fetchVerses } from './services/quranService';
import Sidebar from './components/Sidebar';
import Reader from './components/Reader';
import AudioPlayer from './components/AudioPlayer';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  
  // App State
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    script: 'uthmani',
    arabicFontSize: 32,
    translationFontSize: 16,
    showTranslation: true,
    darkMode: false,
    reciterId: 7, // Mishary Rashid Alafasy
    autoScroll: true,
  });

  // Audio State
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Initialize
  useEffect(() => {
    const init = async () => {
      const data = await fetchChapters();
      setChapters(data);
      if (data.length > 0) {
        handleChapterSelect(data[0]);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Theme effect
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleChapterSelect = async (chapter: Chapter) => {
    setLoading(true);
    setCurrentChapter(chapter);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    
    // Reset reading state
    setActiveVerseIndex(-1);
    setIsPlaying(false);
    
    const chapterVerses = await fetchVerses(chapter.id);
    setVerses(chapterVerses);
    setLoading(false);
  };

  return (
    <div className={`h-screen flex flex-col ${settings.darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
          >
            <Icons.Menu />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-emerald-850 dark:text-emerald-400 leading-tight">Al-Bayan</h1>
            <span className="text-xs text-gray-500 dark:text-gray-400">The Ultimate Quran Experience</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentChapter && (
             <span className="hidden md:block font-uthmani text-xl mr-4 text-emerald-800 dark:text-emerald-200">
               {currentChapter.name_arabic}
             </span>
          )}
          <button 
            onClick={() => setSettings(s => ({...s, darkMode: !s.darkMode}))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
          >
            {settings.darkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
          >
            <Icons.Settings />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
           <div 
             className="md:hidden absolute inset-0 bg-black/50 z-20"
             onClick={() => setSidebarOpen(false)}
           />
        )}
        
        {/* Sidebar */}
        <div className={`
            absolute md:relative z-30 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
          `}>
           <Sidebar 
              chapters={chapters} 
              currentChapterId={currentChapter?.id} 
              onSelect={handleChapterSelect} 
           />
        </div>

        {/* Reader Area */}
        <main className="flex-1 overflow-hidden relative bg-gray-50 dark:bg-gray-950">
           {loading ? (
             <div className="h-full flex items-center justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
             </div>
           ) : (
             <Reader 
               verses={verses}
               chapter={currentChapter}
               settings={settings}
               activeVerseIndex={activeVerseIndex}
               onVerseClick={(index) => {
                 setActiveVerseIndex(index);
                 setIsPlaying(true);
               }}
             />
           )}
           
           {/* Settings Panel Modal */}
           {settingsOpen && (
             <div className="absolute top-4 right-4 z-40">
               <SettingsPanel 
                  settings={settings} 
                  onChange={setSettings} 
                  onClose={() => setSettingsOpen(false)}
               />
             </div>
           )}
        </main>
      </div>

      {/* Audio Player Footer */}
      {verses.length > 0 && (
        <AudioPlayer 
          verses={verses}
          activeVerseIndex={activeVerseIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          reciterId={settings.reciterId}
          onVerseChange={(index) => setActiveVerseIndex(index)}
        />
      )}
    </div>
  );
};

export default App;